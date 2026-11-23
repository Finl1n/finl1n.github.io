// Função serverless da Folen, a IA do portfólio (Netlify Functions, plano gratuito).
// Usa o plano gratuito da API do Google Gemini (sem cartão). A chave fica só na variável LLM_API_KEY do Netlify.
// Qualquer provedor compatível com a API da OpenAI funciona trocando LLM_BASE_URL e LLM_MODEL (ex.: Groq).
import type { Config, Context } from '@netlify/functions'
import { CONTACTS, WHATSAPP } from '../../src/data'
import { buildSystemPrompt } from '../../src/knowledge'

const BASE_URL = (process.env.LLM_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai').replace(/\/$/, '')
// Lista de modelos gratuitos, em ordem: se um estiver sobrecarregado ou sem cota, tenta o próximo.
const MODELS = (process.env.LLM_MODEL || 'gemini-3.5-flash,gemini-3.5-flash-lite,gemini-flash-lite-latest').split(',').map((m) => m.trim()).filter(Boolean)
const KEY = process.env.LLM_API_KEY
const MAX_TURNS = 20 // mensagens por conversa
const MAX_CHARS = 1500 // por mensagem do visitante
const PER_MINUTE = 8 // pedidos por IP por minuto (por instância da função)
const PER_DAY = 60 // pedidos por IP por dia (por instância da função)

const EMAIL = CONTACTS.find((c) => c.k === 'E-mail')?.v
// Resposta reserva: cota do plano gratuito acabou, chave ausente ou provedor fora do ar.
const FALLBACK = `A Folen está descansando agora (o limite gratuito de hoje pode ter acabado). Mas o Gustavo responde rapidinho: chame no WhatsApp ${WHATSAPP} ou mande um e-mail para ${EMAIL}.`

const DEFAULT_ORIGINS = ['https://finl1n.github.io', 'http://localhost:5173', 'http://localhost:4173']
const allowed = process.env.ALLOWED_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? DEFAULT_ORIGINS
const isAllowed = (origin: string | null) =>
  !!origin && (allowed.includes(origin) || /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/.test(origin))

const SYSTEM = buildSystemPrompt()
const hits = new Map<string, number[]>()

function limited(ip: string) {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 86_400_000)
  list.push(now)
  hits.set(ip, list)
  return list.filter((t) => now - t < 60_000).length > PER_MINUTE || list.length > PER_DAY
}

type Turn = { role: 'user' | 'assistant'; content: string }
function parse(body: unknown): Turn[] | null {
  const msgs = (body as { messages?: unknown })?.messages
  if (!Array.isArray(msgs) || msgs.length === 0 || msgs.length > MAX_TURNS) return null
  const out: Turn[] = []
  for (const m of msgs) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null
    const content = m.content.trim().slice(0, m.role === 'user' ? MAX_CHARS : 6000)
    if (!content) return null
    out.push({ role: m.role, content })
  }
  return out[0].role === 'user' && out[out.length - 1].role === 'user' ? out : null
}

const text = (body: string, headers: Record<string, string>, status = 200) =>
  new Response(body, { status, headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })

export default async (req: Request, context: Context) => {
  const origin = req.headers.get('origin')
  const cors: Record<string, string> = isAllowed(origin)
    ? { 'Access-Control-Allow-Origin': origin!, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
    : {}
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return text('Método não permitido', cors, 405)
  if (origin && !isAllowed(origin)) return text('Origem não permitida', {}, 403)
  if (limited(context.ip)) return text(`Muitas mensagens em pouco tempo. Se quiser, fale direto com o Gustavo: ${WHATSAPP}`, cors)

  const messages = parse(await req.json().catch(() => null))
  if (!messages) return text('Conversa inválida', cors, 400)
  if (!KEY) return text(FALLBACK, cors)

  let upstream: Response | null = null
  for (const model of MODELS) {
    // Espera até 9s pelo início da resposta; depois disso o streaming segue sem prazo.
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 9_000)
    try {
      const r = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ model, stream: true, max_tokens: 1500, temperature: 0.4, reasoning_effort: 'low', messages: [{ role: 'system', content: SYSTEM }, ...messages] }),
        signal: ctrl.signal,
      })
      clearTimeout(timer)
      if (r.ok && r.body) { upstream = r; break }
      // 429 = cota gratuita esgotada, 503 = modelo sobrecarregado, 404 = modelo aposentado.
      console.error(`Modelo ${model} falhou:`, r.status, (await r.text().catch(() => '')).slice(0, 200))
    } catch (err) {
      clearTimeout(timer)
      console.error(`Modelo ${model} inacessível:`, err)
    }
  }
  // Nenhum modelo respondeu: o visitante recebe os contatos em vez de uma tela quebrada.
  if (!upstream?.body) return text(FALLBACK, cors)

  // Converte o streaming (SSE no formato OpenAI) em texto puro para o navegador.
  const encoder = new TextEncoder(), decoder = new TextDecoder()
  const reader = upstream.body.getReader()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buf = '', sent = 0
      try {
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''
          for (const line of lines) {
            const data = line.trim().replace(/^data:\s*/, '')
            if (!data || data === '[DONE]' || !line.trim().startsWith('data:')) continue
            try {
              const delta: string | undefined = JSON.parse(data).choices?.[0]?.delta?.content
              if (delta) { controller.enqueue(encoder.encode(delta)); sent += delta.length }
            } catch { /* linha incompleta: ignora */ }
          }
        }
      } catch (err) { console.error('Streaming interrompido:', err) }
      if (!sent) controller.enqueue(encoder.encode(FALLBACK))
      controller.close()
    },
    cancel() { reader.cancel() },
  })
  return new Response(body, { headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}

export const config: Config = { path: '/api/chat' }

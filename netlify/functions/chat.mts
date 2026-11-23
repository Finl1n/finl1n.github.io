// Função serverless do assistente do portfólio (Netlify Functions).
// A chave da API fica só aqui, na variável de ambiente ANTHROPIC_API_KEY do Netlify: nunca vai para o navegador.
import Anthropic from '@anthropic-ai/sdk'
import type { Config, Context } from '@netlify/functions'
import { buildSystemPrompt } from '../../src/knowledge'

const MODEL = process.env.CHAT_MODEL || 'claude-opus-5-5'
const MAX_TURNS = 20 // mensagens por conversa
const MAX_CHARS = 1500 // por mensagem do visitante
const PER_MINUTE = 12 // pedidos por IP por minuto (por instância da função)

const DEFAULT_ORIGINS = ['https://finl1n.github.io', 'http://localhost:5173', 'http://localhost:4173']
const allowed = (process.env.ALLOWED_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean)) ?? DEFAULT_ORIGINS
const isAllowed = (origin: string | null) =>
  !!origin && (allowed.includes(origin) || /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/.test(origin))

const SYSTEM = buildSystemPrompt()
const client = new Anthropic()
const hits = new Map<string, number[]>()

function limited(ip: string) {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > PER_MINUTE
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

export default async (req: Request, context: Context) => {
  const origin = req.headers.get('origin')
  const cors: Record<string, string> = isAllowed(origin)
    ? { 'Access-Control-Allow-Origin': origin!, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
    : {}
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return new Response('Método não permitido', { status: 405, headers: cors })
  if (origin && !isAllowed(origin)) return new Response('Origem não permitida', { status: 403 })
  if (limited(context.ip)) return new Response('Muitas mensagens em pouco tempo. Espere um minuto.', { status: 429, headers: cors })

  const messages = parse(await req.json().catch(() => null))
  if (!messages) return new Response('Conversa inválida', { status: 400, headers: cors })

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    output_config: { effort: 'low' },
    // Se o modelo principal recusar a resposta, a própria API tenta um modelo alternativo.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages,
  })

  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      stream.on('text', (t) => controller.enqueue(encoder.encode(t)))
      try {
        const final = await stream.finalMessage()
        if (final.stop_reason === 'refusal') controller.enqueue(encoder.encode('Não consigo ajudar com isso, mas posso contar sobre os projetos e a experiência do Gustavo.'))
      } catch (err) {
        console.error('Erro na API da Claude:', err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err)
        controller.enqueue(encoder.encode('\n\n[erro] O assistente está indisponível agora. Fale direto com o Gustavo pelo WhatsApp: https://wa.me/5571983071000'))
      }
      controller.close()
    },
    cancel() { stream.abort() },
  })

  return new Response(body, { headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}

export const config: Config = { path: '/api/chat' }

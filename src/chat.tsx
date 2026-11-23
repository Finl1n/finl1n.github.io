import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import { WHATSAPP } from './data'
import { SUGGESTIONS } from './knowledge'

// Endereço da função do assistente. Sem ele (ex.: build do GitHub Pages sem a variável), o botão não aparece.
const API: string = import.meta.env.VITE_CHAT_API_URL ?? (import.meta.env.DEV ? '/api/chat' : '')
const KEY = 'chat-v1'
const WA_MSG = `${WHATSAPP}?text=${encodeURIComponent('Olá, Gustavo! Conversei com a Folen, a IA do seu portfólio e gostaria de falar sobre um projeto.')}`
const GREETING = 'Oi! Sou a Folen, a IA do portfólio do Gustavo. Pode me perguntar sobre os projetos, a stack ou a experiência dele.'

type Msg = { role: 'user' | 'assistant'; content: string }

// Transforma URLs da resposta em links clicáveis, sem interpretar HTML.
function Rich({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+[a-z]|\*\*[^*]+\*\*)/g)
  return <>{parts.map((p, i) => {
    if (/^https?:\/\//.test(p)) {
      const url = p.replace(/[.,;:!?]+$/, ''), tail = p.slice(url.length)
      const label = url.replace(/^https?:\/\//, '').replace(/\?.*$/, '').replace(/\/$/, '')
      return <Fragment key={i}><a href={url} target={url.includes('finl1n.github.io') ? undefined : '_blank'} rel="noreferrer" className="break-all underline decoration-white/30 underline-offset-2 hover:decoration-white">{label}</a>{tail}</Fragment>
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+[a-z]$/.test(p)) return <a key={i} href={`mailto:${p}`} className="break-all underline decoration-white/30 underline-offset-2 hover:decoration-white">{p}</a>
    if (/^\*\*.+\*\*$/.test(p)) return <strong key={i} className="font-medium text-white">{p.slice(2, -2)}</strong>
    return <Fragment key={i}>{p}</Fragment>
  })}</>
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>(() => { try { return JSON.parse(sessionStorage.getItem(KEY) ?? '[]') } catch { return [] } })
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(msgs)) } catch { /* sem storage: a conversa só não sobrevive ao recarregar */ } }, [msgs])
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight }) }, [msgs, open])
  useEffect(() => { if (open) setTimeout(() => field.current?.focus(), 250) }, [open])
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('keydown', esc); return () => removeEventListener('keydown', esc)
  }, [])

  if (!API) return null

  async function send(text: string) {
    const q = text.trim()
    if (!q || busy) return
    const history: Msg[] = [...msgs, { role: 'user', content: q }]
    setMsgs([...history, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)
    let answer = ''
    const show = (t: string) => setMsgs([...history, { role: 'assistant', content: t }])
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-19) }) })
      if (!res.ok || !res.body) throw new Error(res.status === 429 ? await res.text() : 'falha')
      const reader = res.body.getReader(), dec = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += dec.decode(value, { stream: true })
        show(answer)
      }
      if (!answer.trim()) throw new Error('vazio')
    } catch (e) {
      const msg = e instanceof Error && e.message.startsWith('Muitas') ? e.message : 'Não consegui responder agora.'
      show(`${answer ? answer + '\n\n' : ''}${msg} Se preferir, fale direto com o Gustavo pelo WhatsApp: ${WHATSAPP}`)
    } finally { setBusy(false) }
  }

  const submit = (e: FormEvent) => { e.preventDefault(); send(input) }
  const showCta = msgs.filter((m) => m.role === 'user').length >= 1

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button key="fab" type="button" onClick={() => setOpen(true)} aria-label="Abrir a Folen, assistente de IA"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="group fixed bottom-5 right-5 z-[45] flex items-center gap-3 border border-white/20 bg-black/80 py-3 pl-3.5 pr-4 text-white backdrop-blur-md transition hover:border-white md:bottom-8 md:right-8">
            <span className="relative grid h-7 w-7 place-items-center border border-white/25 transition group-hover:border-white">
              <Sparkles size={14} strokeWidth={1.25} />
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            </span>
            <span className="text-left leading-tight">
              <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-white/45">Folen · IA</span>
              <span className="block text-[13px] font-light">Pergunte sobre meu trabalho</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section key="panel" role="dialog" aria-label="Folen, assistente de IA do portfólio"
            initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 top-16 z-[60] flex flex-col border border-white/15 bg-black/95 text-white shadow-[0_0_60px_rgba(255,255,255,0.06)] backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:top-auto sm:h-[min(620px,calc(100dvh-3rem))] sm:w-[400px] md:bottom-8 md:right-8">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center border border-white/25"><Sparkles size={15} strokeWidth={1.25} /></span>
                <div className="leading-tight">
                  <p className="text-sm font-light tracking-wide">Folen</p>
                  <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Assistente do Gustavo · online</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="p-1 text-white/50 transition hover:text-white"><X size={20} strokeWidth={1.25} /></button>
            </header>

            <div ref={list} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5" aria-live="polite">
              <Bubble role="assistant" text={GREETING} />
              {msgs.length === 0 && (
                <div className="flex flex-col items-start gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => send(s)} className="border border-white/15 px-3 py-2 text-left text-xs font-light text-white/75 transition hover:border-white hover:text-white">{s}</button>
                  ))}
                </div>
              )}
              {msgs.map((m, i) => <Bubble key={i} role={m.role} text={m.content} typing={busy && i === msgs.length - 1 && !m.content} />)}
            </div>

            {showCta && (
              <a href={WA_MSG} target="_blank" rel="noreferrer" className="mx-5 mb-3 flex items-center justify-between gap-3 border border-emerald-400/30 bg-emerald-400/[0.06] px-4 py-2.5 text-xs transition hover:border-emerald-400/70">
                <span className="font-light text-white/80">Tem um projeto em mente?</span>
                <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300"><span className="hidden sm:inline">Chamar no </span>WhatsApp →</span>
              </a>
            )}

            <form onSubmit={submit} className="flex items-end gap-2 border-t border-white/10 p-3">
              <textarea ref={field} value={input} onChange={(e) => setInput(e.target.value)} rows={1} maxLength={1500}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
                placeholder="Escreva sua pergunta…" aria-label="Sua pergunta"
                className="max-h-32 min-h-[44px] flex-1 resize-none bg-white/[0.04] px-3.5 py-3 text-sm font-light text-white outline-none placeholder:text-white/30 focus:bg-white/[0.07]" />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar" className="grid h-11 w-11 shrink-0 place-items-center border border-white/25 transition enabled:hover:border-white enabled:hover:bg-white enabled:hover:text-black disabled:opacity-30">
                <ArrowUp size={17} strokeWidth={1.5} />
              </button>
            </form>
            <p className="pb-2.5 text-center font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/25">Respostas geradas por IA a partir do portfólio</p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}

function Bubble({ role, text, typing }: { role: Msg['role']; text: string; typing?: boolean }) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-[13.5px] font-light leading-relaxed ${mine ? 'bg-white text-black' : 'border border-white/10 bg-white/[0.03] text-white/85'}`}>
        {typing ? <span className="inline-flex gap-1 py-1">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" style={{ animationDelay: `${d * 0.15}s` }} />)}</span> : <Rich text={text} />}
      </div>
    </div>
  )
}

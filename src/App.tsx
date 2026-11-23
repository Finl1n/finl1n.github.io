import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { About, Aurora, Contact, EncryptedText, Rail, Stack, Timeline } from './ui'
import { ABOUT, ABOUT_LEAD, EMAIL, HISTORY, PROFILE, PROJECTS, STACK } from './data'
import { ChatWidget } from './chat'
import { ProjectPage } from './project'
import { LooseMenu, ScrollHero } from './hero'

const MENU: [string, string][] = [['Projetos', 'work'], ['Sobre', 'about'], ['Experiência', 'experience'], ['Contato', 'contact']]

/* Rolagem suave feita por código: o "scroll-behavior: smooth" do CSS é ignorado pelo navegador quando o sistema
   está com animações desligadas, e aí os links de navegação pulariam de uma vez. Qualquer toque ou roda do mouse cancela. */
function smoothTo(top: number) {
  const from = window.scrollY, dist = top - from
  if (Math.abs(dist) < 2) return
  const ms = Math.min(Math.max(600 + Math.abs(dist) / 4, 700), 1700)
  const t0 = performance.now()
  let stop = false
  const cancel = () => { stop = true }
  window.addEventListener('wheel', cancel, { once: true, passive: true })
  window.addEventListener('touchstart', cancel, { once: true, passive: true })
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const step = (now: number) => {
    if (stop) return
    const k = Math.min((now - t0) / ms, 1)
    window.scrollTo({ top: from + dist * ease(k), behavior: 'instant' })
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function App() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => { const f = () => setHash(location.hash); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  // Links internos (#sobre, #/projeto/1…) não saltam: atualizam o endereço e deixam a animação cuidar do resto.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || link.target === '_blank') return
      const href = link.getAttribute('href')!
      e.preventDefault()
      if (href === location.hash) return
      history.pushState(null, '', href)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  const m = hash.match(/^#\/projeto\/(\d+)$/)
  const routeKey = m ? `p${m[1]}` : 'home'
  const lastRoute = useRef(routeKey)
  useEffect(() => {
    // Ao trocar de tela, espera a saída da anterior terminar; dentro da mesma tela a rolagem é suave.
    const changed = lastRoute.current !== routeKey
    lastRoute.current = routeKey
    const run = () => {
      const behavior: ScrollBehavior = changed ? 'instant' : 'smooth'
      if (m) { window.scrollTo({ top: 0, behavior: 'instant' }); try { sessionStorage.setItem('work-index', m[1]) } catch { /* sem storage: volta ao primeiro projeto */ } return }
      const el = document.getElementById(hash.slice(1))
      if (!el) { if (changed) window.scrollTo({ top: 0, behavior: 'instant' }); return }
      if (hash === '#work') {
        // Volta para o projeto que a pessoa tinha aberto, e não para o primeiro do carrossel.
        let idx = 0
        try { idx = Number(sessionStorage.getItem('work-index') ?? 0) } catch { /* ignora */ }
        const n = PROJECTS.length
        // No hero, o projeto i fica no centro depois de (i + 1) telas de rolagem.
        const top = el.offsetTop + (Math.min(idx, n - 1) + 1) * window.innerHeight
        behavior === 'smooth' ? smoothTo(top) : window.scrollTo({ top, behavior: 'instant' })
      } else if (behavior === 'smooth') smoothTo(el.getBoundingClientRect().top + window.scrollY)
      else el.scrollIntoView({ behavior: 'instant' })
    }
    const t = setTimeout(run, changed ? 480 : 0)
    return () => clearTimeout(t)
  }, [hash]) // eslint-disable-line react-hooks/exhaustive-deps
  const [intro, setIntro] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIntro(false), 1500); return () => clearTimeout(t) }, [])
  const nextIdx = m ? (+m[1] + 1) % PROJECTS.length : 0
  return (
    <>
      <AnimatePresence>
        {intro && (
          <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="fixed inset-0 z-50 grid place-items-center bg-black">
            <EncryptedText text="GUSTAVO MARTINS" ms={900} className="font-mono text-base font-light tracking-[0.3em] md:text-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
      {!m && !intro && <Rail />}
      {!m && !intro && <LooseMenu links={MENU} />}
      {!intro && <ChatWidget />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={routeKey} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          {m ? <ProjectPage project={PROJECTS[+m[1]]} next={PROJECTS[nextIdx]} nextHref={`#/projeto/${nextIdx}`} email={EMAIL} /> : (
            <main>
        <ScrollHero projects={PROJECTS} />
        <Aurora>
          <About lead={ABOUT_LEAD} text={ABOUT} profile={PROFILE} />
          <Stack data={STACK} />
          <Timeline data={HISTORY} />
          <Contact />
        </Aurora>
            </main>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}




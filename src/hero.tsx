import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { Project } from './ui'

/* Hero comandado pela rolagem.
   Fundo: o vídeo do Veo quebrado em frames WebP e desenhado num <canvas>; a rolagem escolhe o frame, então ele avança e volta.
   Frente: as telas reais de cada projeto passam em 3D, uma por vez, e a página de cada uma rola dentro da própria tela. */

const FRAMES = 95
const frameSrc = (i: number) => `/hero/desktop/${String(i + 1).padStart(3, '0')}.webp`
const THIN = { fontFamily: '"Inter Tight", var(--font-sans)' }

function useFrames() {
  const imgs = useRef<HTMLImageElement[]>([])
  useEffect(() => {
    // O primeiro frame vem antes; os outros carregam em segundo plano.
    imgs.current = Array.from({ length: FRAMES }, (_, i) => { const im = new Image(); im.decoding = 'async'; if (i === 0) im.src = frameSrc(0); return im })
    const t = setTimeout(() => imgs.current.forEach((im, i) => { if (i) im.src = frameSrc(i) }), 200)
    return () => clearTimeout(t)
  }, [])
  return imgs
}

function VideoCanvas({ progress }: { progress: MotionValue<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const imgs = useFrames()
  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let cur = 0, drawn = -1, raf = 0
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      c.width = Math.round(c.clientWidth * dpr); c.height = Math.round(c.clientHeight * dpr); drawn = -1
    }
    const draw = (i: number) => {
      // Procura o frame carregado mais próximo, para nunca piscar em branco.
      let im: HTMLImageElement | undefined
      for (let d = 0; d < FRAMES && !im; d++) for (const k of [i - d, i + d]) { const x = imgs.current[k]; if (x?.complete && x.naturalWidth) { im = x; break } }
      if (!im) return
      const s = Math.max(c.width / im.naturalWidth, c.height / im.naturalHeight) // object-fit: cover
      const w = im.naturalWidth * s, h = im.naturalHeight * s
      ctx.drawImage(im, (c.width - w) / 2, (c.height - h) / 2, w, h)
      drawn = i
    }
    const tick = () => {
      const target = reduce ? 0 : progress.get() * (FRAMES - 1)
      cur += (target - cur) * 0.18 // leve suavização: a rolagem não fica dura
      const i = Math.round(cur)
      if (i !== drawn) draw(i)
      raf = requestAnimationFrame(tick)
    }
    resize(); addEventListener('resize', resize)
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize) }
  }, [progress, imgs])
  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
}

/* Uma tela de projeto. `local` vai de -1 (abaixo, entrando) a 0 (no centro) a 1 (acima, saindo). */
function Screen({ pr, i, local, portrait }: { pr: Project; i: number; local: MotionValue<number>; portrait: boolean }) {
  const y = useTransform(local, [-1, 0, 1], ['85vh', '0vh', '-85vh'])
  const rotateX = useTransform(local, [-1, 0, 1], [38, 0, -38])
  const scale = useTransform(local, [-1, 0, 1], [0.82, 1, 0.82])
  const opacity = useTransform(local, [-1, -0.6, 0.6, 1], [0, 1, 1, 0])
  // A página rola dentro da tela enquanto ela está passando pelo centro.
  const scrollPos = useTransform(local, [-0.55, 0.55], ['0%', '100%'])
  const objectPosition = useTransform(scrollPos, (v) => `50% ${v}`)
  const colY = useTransform(local, [-0.55, 0.55], ['0%', '-66.6%'])
  const textOpacity = useTransform(local, [-0.5, -0.2, 0.2, 0.5], [0, 1, 1, 0])
  const textX = useTransform(local, [-0.5, 0, 0.5], [-24, 0, 24])
  const phone = portrait && pr.mobile?.length

  return (
    <motion.a href={`#/projeto/${i}`} aria-label={`Abrir o projeto ${pr.title}`} style={{ y, rotateX, scale, opacity }}
      className="absolute inset-0 m-auto flex h-fit w-fit flex-col items-center gap-6 [transform-style:preserve-3d]">
      {phone ? (
        <div className="relative w-[min(64vw,300px,calc((100svh-210px)*0.514))] overflow-hidden rounded-[2.2rem] border border-white/15 bg-zinc-950 shadow-[0_40px_120px_-20px_rgba(90,110,255,.35)]">
          <div className="aspect-[9/17.5] overflow-hidden">
            <motion.div style={{ y: colY }}>{pr.mobile!.map((m) => <img key={m} src={m} alt="" className="block w-full" draggable={false} />)}</motion.div>
          </div>
        </div>
      ) : (
        <div className="relative w-[min(84vw,1040px,calc((100svh-230px)*1.6))] overflow-hidden rounded-xl border border-white/15 bg-zinc-950 shadow-[0_50px_160px_-30px_rgba(90,110,255,.35)]">
          <motion.img src={pr.full ?? pr.img} alt="" draggable={false} style={{ objectPosition }} className="block aspect-[16/10] w-full object-cover" />
        </div>
      )}
      <motion.div style={{ opacity: textOpacity, x: textX, ...THIN }} className="pointer-events-none flex flex-col items-center gap-2 text-center">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">{String(i + 1).padStart(2, '0')} · {pr.tag.toUpperCase()}</span>
        <span className="text-3xl font-extralight uppercase tracking-[0.18em] md:text-4xl">{pr.title}</span>
      </motion.div>
    </motion.a>
  )
}

function ScreenAt({ pr, i, p, portrait }: { pr: Project; i: number; p: MotionValue<number>; portrait: boolean }) {
  // p: 0 = só o nome; i+1 = projeto i no centro.
  const local = useTransform(p, (v) => Math.max(-1, Math.min(1, v - (i + 1))))
  return <Screen pr={pr} i={i} local={local} portrait={portrait} />
}

export function ScrollHero({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null)
  const n = projects.length
  const steps = n + 1.6 // nome + projetos + saída
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useTransform(scrollYProgress, (v) => v * steps)
  const [portrait, setPortrait] = useState(() => matchMedia('(orientation: portrait)').matches)
  useEffect(() => { const m = matchMedia('(orientation: portrait)'); const f = () => setPortrait(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f) }, [])
  const [hint, setHint] = useState(true)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setHint(v < 0.02))

  const nameOpacity = useTransform(p, [0, 0.55], [1, 0])
  const nameY = useTransform(p, [0, 0.55], [0, -60])
  const dim = useTransform(p, [0, 0.6, steps - 1, steps], [0.35, 0.6, 0.6, 1]) // escurece o vídeo quando as telas passam e no fim
  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={ref} id="inicio" style={{ height: `${steps * 100 + 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden [perspective:1400px]">
        <VideoCanvas progress={scrollYProgress} />
        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.85)_100%)]" aria-hidden />

        <motion.div style={{ opacity: nameOpacity, y: nameY, ...THIN }} className="absolute inset-0 grid place-items-center px-6 text-center">
          <div>
            <h1 className="text-[clamp(2.4rem,9vw,8rem)] font-thin uppercase leading-[0.95] tracking-[0.12em]">Gustavo<br />Martins</h1>
            <p className="mt-6 text-xs font-extralight uppercase tracking-[0.5em] text-white/60 md:text-sm">Desenvolvedor Full Stack</p>
          </div>
        </motion.div>

        {projects.map((pr, i) => <ScreenAt key={pr.title} pr={pr} i={i} p={p} portrait={portrait} />)}

        <span className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-extralight uppercase tracking-[0.4em] text-white/50 transition duration-700 ${hint ? 'opacity-100' : 'opacity-0'}`}>Role para ver</span>
        <motion.span style={{ width: progressW }} className="absolute bottom-0 left-0 h-px bg-white/40" aria-hidden />
      </div>
    </section>
  )
}

/* Menu solto no topo: só os links, sem barra nem fundo, em fonte fina. */
export function LooseMenu({ links }: { links: [string, string][] }) {
  return (
    <nav aria-label="Menu" className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 mix-blend-difference md:px-10" style={THIN}>
      <a href="#inicio" className="pointer-events-auto hidden text-sm sm:block font-extralight tracking-[0.35em] text-white">GUSTAVO</a>
      <ul className="pointer-events-auto flex w-full justify-between sm:w-auto sm:gap-10">
        {links.map(([name, id]) => (
          <li key={id}><a href={`#${id}`} className="group relative text-[10px] font-extralight uppercase tracking-[0.2em] text-white/70 sm:text-[11px] sm:tracking-[0.25em] transition hover:text-white md:text-xs">
            {name}<span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-white transition duration-300 group-hover:scale-x-100" />
          </a></li>
        ))}
      </ul>
    </nav>
  )
}

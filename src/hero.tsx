import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { Project } from './ui'

/* Hero comandado pela rolagem: as telas reais de cada projeto passam em 3D, uma por vez,
   e a página de cada uma rola dentro da própria tela. Fundo escuro liso. */

const THIN = { fontFamily: '"Inter Tight", var(--font-sans)' }

/* Uma tela de projeto. `local` vai de -1 (abaixo, entrando) a 0 (no centro) a 1 (acima, saindo). */
function Screen({ pr, i, local, portrait }: { pr: Project; i: number; local: MotionValue<number>; portrait: boolean }) {
  const y = useTransform(local, [-1, 0, 1], ['85vh', '0vh', '-85vh'])
  const rotateX = useTransform(local, [-1, 0, 1], [38, 0, -38])
  const scale = useTransform(local, [-1, 0, 1], [0.82, 1, 0.82])
  const opacity = useTransform(local, [-1, -0.6, 0.6, 1], [0, 1, 1, 0])
  // Só a tela que está no centro recebe o clique; as outras, mesmo transparentes, ficam de fora.
  const pointerEvents = useTransform(local, (v) => (Math.abs(v) < 0.5 ? 'auto' : 'none'))
  // A página rola dentro da tela enquanto ela está passando pelo centro.
  const scrollPos = useTransform(local, [-0.55, 0.55], ['0%', '100%'])
  const objectPosition = useTransform(scrollPos, (v) => `50% ${v}`)
  const colY = useTransform(local, [-0.55, 0.55], ['0%', '-66.6%'])
  const textOpacity = useTransform(local, [-0.5, -0.2, 0.2, 0.5], [0, 1, 1, 0])
  const textX = useTransform(local, [-0.5, 0, 0.5], [-24, 0, 24])
  const phone = portrait && pr.mobile?.length

  return (
    <motion.a href={`#/projeto/${i}`} aria-label={`Abrir o projeto ${pr.title}`} style={{ y, rotateX, scale, opacity, pointerEvents }}
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
  const steps = n + 1.2 // nome + projetos + saída
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useTransform(scrollYProgress, (v) => v * steps)
  const [portrait, setPortrait] = useState(() => matchMedia('(orientation: portrait)').matches)
  useEffect(() => { const m = matchMedia('(orientation: portrait)'); const f = () => setPortrait(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f) }, [])
  const [hint, setHint] = useState(true)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setHint(v < 0.02))

  const nameOpacity = useTransform(p, [0, 0.55], [1, 0])
  const nameY = useTransform(p, [0, 0.55], [0, -60])
  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={ref} id="work" style={{ height: `${steps * 100 + 100}vh` }} className="relative">
      <span id="inicio" className="absolute top-0" aria-hidden />
      <div className="sticky top-0 h-screen overflow-hidden [perspective:1400px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#0d0f1a_0%,#000_70%)]" aria-hidden />
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

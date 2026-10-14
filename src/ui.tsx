import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'

const SPRING = { stiffness: 100, damping: 30 }
const GLYPHS = '!<>-_\\/[]{}=+*^?#01'

export function EncryptedText({ text, ms = 1400, className }: { text: string; ms?: number; className?: string }) {
  const [out, setOut] = useState(() => text.replace(/\S/g, ' '))
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - t0) / ms, 1)
      setOut([...text].map((c, i) => (c === ' ' || i < p * text.length ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, ms])
  return <span className={className} aria-label={text}>{out}</span>
}

const BEAMS = ['#ffffff', '#a1a1aa', '#52525b']

export function Aurora({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-25" aria-hidden>
        {BEAMS.map((c, i) => (
          <div key={c} className="drift absolute h-[140vh] w-[40vw] md:w-[18vw] -skew-x-12 blur-[80px]"
            style={{ left: `${15 + i * 30}%`, top: '-20vh', background: `linear-gradient(${c}, transparent 70%)`, animationDelay: `${-i * 6}s` }} />
        ))}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

export type Project = {
  title: string; tag: string; desc: string; img?: string
  intro?: string; stack?: string; link?: string; steps?: string[]
  linkLabel?: string // texto do link para a versão ao vivo
  full?: string // print da página inteira, mostrado na página do projeto
  mobileNote?: string
  headline?: string // frase de abertura da página do projeto
  highlight?: { title: string; text: string } // o que foi mais marcante
  desktop?: string[]; mobile?: string[]
}

export function Reveal({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <motion.div id={id} className={className} initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const HERO_NAV = [['Projetos', 'work'], ['Sobre mim', 'about'], ['Experiência', 'experience'], ['Contato', 'contact']]
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

/* Cena fixa na tela: a rolagem comanda um progresso contínuo `p` (0 = primeiro projeto, n-1 = último).
   Imagens, textos e números se posicionam em função da distância `d = i - p` até o projeto ativo. */
export function Home({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null)
  const [p, setP] = useState(0)
  const n = projects.length
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setP(clamp(v, 0, 1) * (n - 1)))
  const label = 'text-[10px] font-extralight uppercase tracking-[0.2em] text-zinc-500'
  const active = Math.round(p)
  const cur = projects[active]
  return (
    <section ref={ref} id="work" style={{ height: `${n * 100}vh` }} className="relative">
      <div className="sticky top-0 grid h-screen grid-rows-[1fr_auto] gap-4 overflow-hidden landscape:max-lg:grid-cols-2 landscape:max-lg:grid-rows-1 landscape:max-lg:items-center landscape:max-lg:gap-8 landscape:max-lg:pb-10 landscape:max-lg:pt-16 px-6 pb-16 pt-24 lg:grid-cols-[3rem_minmax(180px,225px)_1fr_minmax(205px,265px)] lg:gap-6 xl:grid-cols-[3rem_minmax(220px,265px)_1fr_minmax(230px,300px)] xl:gap-8 lg:grid-rows-1 lg:items-center lg:gap-10 lg:px-10 lg:py-20">
        <div className="hidden h-full justify-between lg:flex xl:invisible">
          <span className="text-3xl font-extralight tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">GUSTAVO</span>
          <span className={`${label} [writing-mode:vertical-rl] rotate-180`}>© 2026 — Dev Fullstack</span>
        </div>

        <div className="hidden flex-col gap-12 lg:flex">
          <nav className="flex flex-col border-t border-white/10" aria-label="Seções">
            {HERO_NAV.map(([name, id], k) => (
              <a key={id} href={`#${id}`} className="group flex items-center gap-3 border-b border-white/10 py-2.5 transition-colors hover:border-white/60 focus-visible:border-white">
                <span className="w-5 font-mono text-[10px] text-white/30 transition group-hover:text-white/70">{String(k + 1).padStart(2, '0')}</span>
                <span className="text-lg font-extralight uppercase leading-tight tracking-[0.14em] text-white/80 transition duration-300 group-hover:translate-x-2 group-hover:text-white xl:text-xl">{name}</span>
                <ArrowUpRight size={18} strokeWidth={1.25} className="ml-auto -translate-x-2 text-white opacity-30 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
              </a>
            ))}
          </nav>
          <dl className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-4 text-xs font-extralight tracking-wide">
            <dt className={label}>Tipo</dt>
            <dd key={`t${active}`} className="info-in text-white/80">{cur.tag}</dd>
            <dt className={label}>Stack</dt>
            <dd key={`s${active}`} className="info-in text-white/80">{cur.stack}</dd>
          </dl>
        </div>

        {/* Imagens: o ativo no centro; os anteriores sobem e saem, os próximos esperam empilhados embaixo. */}
        <figure className="relative mx-auto aspect-[5/4] w-full max-w-[min(84%,calc((100vh-17rem)*1.25))] self-center landscape:max-lg:max-w-[min(100%,calc((100vh-9rem)*1.25))] [perspective:1400px] lg:min-w-[260px] lg:max-w-[min(46vw,780px,calc((100vh-12rem)*1.25))]">
          {projects.map((pr, i) => {
            const d = i - p
            const out = d < 0
            const opacity = out ? clamp(1 + d * 1.6, 0, 1) : clamp(1 - d * 0.42, 0, 1)
            const transform = out
              ? `translate3d(${d * 10}%, ${d * 135}%, 0) rotateZ(${Math.max(d, -1) * -3}deg) skewY(${Math.max(d, -1) * -3}deg)`
              : `translate3d(${d * 7}%, ${d * 15}%, ${-d * 60}px) rotateZ(${Math.min(d, 1) * 2}deg) skewY(${Math.min(d, 1) * 2}deg)`
            return (
              <a key={pr.title} href={`#/projeto/${i}`} aria-label={`${pr.title}: abrir projeto`} tabIndex={Math.abs(d) < 0.5 ? 0 : -1}
                style={{ zIndex: 30 - Math.round(Math.abs(d) * 4), opacity, transform, pointerEvents: Math.abs(d) < 0.5 ? 'auto' : 'none' }}
                className="group absolute inset-0 block shadow-[0_30px_60px_-30px_rgba(0,0,0,0.95)] will-change-transform">
                <span className="pointer-events-none absolute -inset-px bg-gradient-to-br from-white/60 via-white/10 to-white/50 opacity-80 transition group-hover:opacity-100" aria-hidden />
                <span className="relative block h-full w-full overflow-hidden bg-zinc-950">
                  {pr.img ? <img src={pr.img} alt={pr.title} className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.03]" draggable={false} /> : <span className="grid h-full w-full place-items-center bg-zinc-900 text-6xl font-extralight text-white/20">{String(i + 1).padStart(2, '0')}</span>}
                </span>
              </a>
            )
          })}
        </figure>

        {/* Textos: uma coluna que desliza na vertical; o ativo fica no meio e os vizinhos esmaecem. */}
        <div className="relative h-[190px] w-full overflow-hidden [--item:190px] landscape:max-lg:h-[250px] landscape:max-lg:[--item:250px] lg:h-full lg:[--item:230px] [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_94%,transparent)] lg:[mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_84%,transparent)]">
          {projects.map((pr, i) => {
            const d = i - p
            const near = Math.abs(d) < 0.5
            return (
              <div key={pr.title} style={{ transform: `translateY(calc(var(--item) * ${d}))`, opacity: clamp(1 - Math.abs(d) * 0.78, 0, 1) }}
                className="absolute inset-x-0 top-1/2 -mt-[90px] flex flex-col gap-2 lg:-mt-[100px] lg:items-center lg:text-center">
                <p className={label}>{pr.tag}</p>
                <h3 className="text-2xl font-extralight uppercase tracking-[0.2em] lg:text-[1.7rem]">{pr.title}</h3>
                <p className="max-w-[17rem] text-[13px] font-extralight leading-relaxed tracking-wide text-zinc-400">{pr.desc}</p>
                <a href={`#/projeto/${i}`} tabIndex={near ? 0 : -1} style={{ pointerEvents: near ? 'auto' : 'none', opacity: clamp(1 - Math.abs(d) * 2.4, 0, 1) }}
                  className="mt-1 inline-flex h-10 w-fit items-center bg-white px-8 text-[11px] uppercase tracking-[0.2em] text-black transition duration-300 hover:bg-zinc-300 hover:tracking-[0.28em] active:scale-95">Explorar</a>
              </div>
            )
          })}
        </div>

        <nav className="absolute inset-x-6 top-6 flex gap-5 overflow-x-auto whitespace-nowrap lg:hidden" aria-label="Seções">
          {HERO_NAV.map(([name, id]) => <a key={id} href={`#${id}`} className="border-b border-white/20 pb-1 text-[11px] uppercase tracking-[0.2em] text-white/70 transition hover:border-white hover:text-white active:scale-95">{name}</a>)}
        </nav>
        <span className={`absolute bottom-6 left-6 lg:bottom-8 lg:left-10 xl:invisible ${label}`}>Scroll</span>
        <a href="#contact" className={`absolute bottom-6 right-6 underline-offset-4 hover:text-white hover:underline lg:bottom-8 lg:right-10 ${label}`}>Contato →</a>
      </div>
    </section>
  )
}

/* Menu que acompanha a página inteira: aparece quando o menu grande da primeira tela sai de vista
   e marca em qual seção a pessoa está. */
export function StickyNav() {
  const [show, setShow] = useState(false)
  const [current, setCurrent] = useState('work')
  useEffect(() => {
    const onScroll = () => {
      const work = document.getElementById('work')
      if (!work) return
      setShow(window.scrollY > work.offsetTop + work.offsetHeight - window.innerHeight * 0.9)
      const probe = window.scrollY + window.innerHeight * 0.35
      let cur = 'work'
      for (const [, id] of HERO_NAV) { const el = document.getElementById(id); if (el && el.offsetTop <= probe) cur = id }
      setCurrent(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])
  return (
    <nav aria-label="Seções" aria-hidden={!show}
      className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-md transition duration-500 ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'}`}>
      <ul className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 overflow-x-auto px-6 md:px-12">
        <li className="hidden shrink-0 text-sm font-light tracking-[0.3em] text-white/90 sm:block">GUSTAVO</li>
        <li className="flex flex-1 items-center justify-end gap-5 sm:gap-8">
          {HERO_NAV.map(([name, id]) => (
            <a key={id} href={`#${id}`} tabIndex={show ? 0 : -1} aria-current={current === id ? 'true' : undefined}
              className={`group relative whitespace-nowrap py-2 text-[11px] uppercase tracking-[0.18em] transition duration-300 sm:text-xs ${current === id ? 'text-white' : 'text-white/50 hover:text-white'}`}>
              {name}
              <span className={`absolute inset-x-0 -bottom-px h-px origin-left bg-white transition duration-300 ${current === id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </a>
          ))}
        </li>
      </ul>
    </nav>
  )
}

/* Faixa lateral fixa: acompanha a rolagem da página inteira. Só em telas largas (xl), onde sobra margem ao lado do conteúdo. */
export function Rail() {
  const label = 'text-[10px] font-extralight uppercase tracking-[0.2em] text-zinc-500'
  return (
    <aside aria-hidden className="pointer-events-none fixed inset-0 z-30 hidden xl:block">
      <div className="absolute inset-y-20 left-10 flex w-12 justify-between">
        <span className="text-3xl font-extralight tracking-[0.2em] text-white [writing-mode:vertical-rl] rotate-180">GUSTAVO</span>
        <span className={`${label} [writing-mode:vertical-rl] rotate-180`}>© 2026 — Dev Fullstack</span>
      </div>
      <span className={`absolute bottom-8 left-10 ${label}`}>Scroll</span>
    </aside>
  )
}

function PhoneBooth({ className }: { className?: string }) {
  const panes = [0, 1, 2].flatMap((c) => [0, 1, 2, 3, 4, 5].map((r) => ({ c, r })))
  return (
    <svg viewBox="0 0 160 360" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M20 40 Q80 -6 140 40 Z" fill="#000" />
      <rect x="14" y="40" width="132" height="14" fill="#000" />
      <rect x="40" y="43" width="80" height="8" strokeWidth="1" />
      <path d="M30 20 Q80 -12 130 20" strokeWidth="1" opacity=".5" />
      <rect x="20" y="54" width="120" height="290" fill="#000" />
      <rect x="28" y="62" width="104" height="274" strokeWidth="1" opacity=".6" />
      {panes.map(({ c, r }) => <rect key={`${c}${r}`} x={32 + c * 34} y={68 + r * 44} width="30" height="40" fill="currentColor" fillOpacity=".06" strokeWidth="1" />)}
      <rect x="12" y="344" width="136" height="10" fill="#000" />
      <circle cx="80" cy="200" r="3" fill="currentColor" stroke="none" />
    </svg>
  )
}

const CONTACTS = [
  { k: 'E-mail', v: 'gustavomartinssantos04@hotmail.com', href: 'mailto:gustavomartinssantos04@hotmail.com', icon: <Mail size={16} strokeWidth={1.25} /> },
  { k: 'GitHub', v: 'github.com/Finl1n', href: 'https://github.com/Finl1n', icon: <span className="font-mono text-[11px]">GH</span> },
  { k: 'LinkedIn', v: 'in/gustavomartins25', href: 'https://www.linkedin.com/in/gustavomartins25/', icon: <span className="font-mono text-[11px]">in</span> },
  { k: 'WhatsApp / Telefone', v: '(71) 98307-1000', href: 'https://wa.me/5571983071000', icon: <Phone size={16} strokeWidth={1.25} /> },
]

export function Contact() {
  return (
    <Reveal id="contact" className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-40">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Contato</p>
      <h2 className="mb-14 text-2xl font-extralight uppercase leading-relaxed tracking-[0.3em] md:mb-20 md:text-4xl">Vamos<br />conversar?</h2>
      <div className="grid items-center gap-12 md:grid-cols-[1.1fr_auto] md:gap-14">
        <div className="flex flex-col gap-8">
          <ul className="flex flex-col gap-px bg-white/10">
            {CONTACTS.map((c) => (
              <li key={c.k}>
                <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex items-center gap-4 bg-black p-4 transition hover:bg-white/[0.04]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center border border-white/15 text-white/60 transition group-hover:border-white group-hover:text-white">{c.icon}</span>
                  <span className="min-w-0"><span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{c.k}</span><span className="block break-words text-sm text-white/90">{c.v}</span></span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex"><GlowButton href="https://wa.me/5571983071000?text=Ol%C3%A1%2C%20Gustavo!%20Vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar.">Chamar no WhatsApp</GlowButton></div>
        </div>
        <PhoneBooth className="mx-auto hidden h-72 text-white/70 drop-shadow-[0_0_18px_rgba(255,255,255,0.18)] md:block lg:h-80" />
      </div>
    </Reveal>
  )
}

export function Stack({ data }: { data: { title: string; items: string[] }[] }) {
  return (
    <Reveal id="stack" className="mx-auto max-w-5xl px-8 py-16 md:px-12 md:py-32">
      <h2 className="mb-12 text-2xl font-extralight uppercase leading-relaxed tracking-[0.3em] md:mb-20 md:text-4xl">Stack<br />técnica</h2>
      <div className="grid gap-px bg-white/10 md:grid-cols-3">
        {data.map((g) => (
          <div key={g.title} className="flex flex-col gap-6 bg-black p-6 md:p-8">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">{g.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((i) => <li key={i} className="border border-white/15 px-3 py-1.5 font-mono text-xs text-white/80 transition hover:border-white hover:text-white">{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  )
}

export function Timeline({ data }: { data: { title: string; text: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollYProgress = useSpring(useScroll({ target: ref, offset: ['start 10%', 'end 50%'] }).scrollYProgress, SPRING)
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <section id="experience" ref={ref} className="mx-auto max-w-5xl px-4 py-16 md:px-12 md:py-32">
      <h2 className="mb-12 text-2xl font-extralight uppercase leading-none tracking-[0.3em] md:mb-24 md:text-4xl">Experiência</h2>
      <div className="relative pl-12 md:pl-20">
        <div className="absolute left-4 top-0 h-full w-px bg-white/10">
          <motion.div style={{ height: h }} className="w-px bg-gradient-to-b from-transparent via-white to-zinc-300 shadow-[0_0_16px_2px_rgba(255,255,255,0.35)]" />
        </div>
        {data.map((d) => (
          <Reveal key={d.title} className="relative pb-16 md:pb-32">
            <span className="absolute -left-[2.35rem] top-2 h-3 w-3 border border-white/40 bg-black md:-left-[4.35rem]" />
            <h3 className="font-mono text-sm uppercase tracking-widest text-white">{d.title}</h3>
            <p className="mt-4 max-w-lg text-base text-white/70 md:text-xl">{d.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const BTN = 'relative inline-flex min-h-14 w-full sm:w-auto items-center justify-center overflow-hidden px-8 font-mono text-sm uppercase tracking-widest transition'

export function GlowButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${BTN} p-px`}>
      <span className="spin-slow absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_70%,#fff_90%,transparent)]" />
      <span className="relative flex h-full w-full items-center justify-center bg-black px-8 hover:bg-white/5">{children}</span>
    </a>
  )
}

export const GhostButton = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className={`${BTN} border border-white/20 hover:border-white hover:bg-white hover:text-black`}>{children}</a>
)

export type Profile = { name: string; role: string; photo: string; birth?: string; age?: number } // birth "AAAA-MM-DD" tem prioridade sobre age

const ageFrom = (birth?: string) => {
  if (!birth) return null
  const [y, m, d] = birth.split('-').map(Number), t = new Date()
  return t.getFullYear() - y - (t.getMonth() + 1 < m || (t.getMonth() + 1 === m && t.getDate() < d) ? 1 : 0)
}

function ProfileCard({ profile }: { profile: Profile }) {
  const age = ageFrom(profile.birth) ?? profile.age ?? null
  return (
    <figure className="group relative mx-auto w-full max-w-[340px] md:mx-0">
      <div className="pointer-events-none absolute -inset-px bg-gradient-to-br from-white/60 via-white/10 to-white/50 opacity-80 transition group-hover:opacity-100" aria-hidden />
      <div className="relative overflow-hidden bg-zinc-950">
        <img src={profile.photo} alt={`Retrato de ${profile.name}`} loading="lazy" className="aspect-[4/5] w-full object-cover object-[38%_18%] transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-35% to-transparent" aria-hidden />
        <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{profile.role}</p>
            <p className="mt-2 text-2xl font-light leading-tight tracking-wide">{profile.name}</p>
          </div>
          {age !== null && <dl className="border-t border-white/15 pt-4"><dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Idade</dt><dd className="mt-1 text-lg font-light">{age} anos</dd></dl>}
        </figcaption>
      </div>
    </figure>
  )
}

export function About({ lead, text, profile }: { lead: string; text: string[]; profile: Profile }) {
  return (
    <Reveal id="about" className="mx-auto max-w-5xl px-8 py-24 md:px-12 md:py-40">
      <h2 className="mb-12 text-2xl font-extralight uppercase leading-relaxed tracking-[0.3em] md:mb-20 md:text-4xl">Sobre<br />mim</h2>
      <div className="grid items-start gap-12 md:grid-cols-[340px_1fr] md:gap-20">
        <ProfileCard profile={profile} />
        <div className="flex flex-col gap-6 text-base font-light leading-relaxed tracking-wide text-white/65 md:text-lg">
          <p className="text-2xl font-light leading-snug tracking-normal text-white md:text-3xl">{lead}</p>
          {text.map((t) => <p key={t}>{t}</p>)}
        </div>
      </div>
    </Reveal>
  )
}



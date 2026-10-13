import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Reveal, type Project } from './ui'

const STEP_TITLES = ['Descoberta', 'Design', 'Código', 'Entrega']
const PHONES = ['Home', 'Menu', 'Detalhe']
const OUTLINE = { WebkitTextStroke: '1px rgba(255,255,255,.35)', color: 'transparent' }

function Screen({ label, img, top }: { label: string; img?: string; top?: boolean }) {
  return img
    ? <img src={img} alt={label} className={`h-full w-full object-cover ${top ? 'object-top' : ''}`} />
    : <div className="grid h-full w-full place-items-center bg-gradient-to-br from-zinc-800 to-zinc-950 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">{label}</div>
}

function Phone({ label, img }: { label: string; img?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[260px] rounded-[2.2rem] border-[6px] border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl">
      <div className="absolute left-1/2 top-0 z-10 h-4 w-16 -translate-x-1/2 rounded-b-xl bg-zinc-800" />
      <div className="overflow-hidden rounded-[1.6rem]"><div className="aspect-[9/19]"><Screen label={label} img={img} top /></div></div>
    </div>
  )
}

export function ProjectPage({ project, next, nextHref, email }: { project?: Project; next: Project; nextHref: string; email: string }) {
  if (!project) return <main className="grid min-h-screen place-items-center font-extralight uppercase tracking-[0.2em]">Projeto não encontrado</main>
  const meta = [['Função', 'Front-End / Full Stack'], ...(project.stack ? [['Stack', project.stack]] : [])]
  const steps = project.steps ?? []
  const pages = [project.full ?? project.img, ...(project.desktop ?? [])].filter((x): x is string => !!x)
  return (
    <main className="min-h-screen bg-black text-white">
      <a href="#work" aria-label="Voltar aos projetos" className="fixed right-6 top-6 z-50 text-white/60 transition hover:text-white"><ArrowLeft strokeWidth={1.25} size={32} /></a>
      <p className="fixed left-6 top-6 z-40 hidden max-w-[10rem] text-3xl font-black uppercase leading-[0.9] tracking-tight md:block" style={OUTLINE}>{project.title}</p>

      <div className="mx-auto max-w-[1400px] px-6 pb-32 pt-24 md:pl-56 md:pr-10 lg:pl-64">
        <h1 className="mb-10 text-4xl font-black uppercase leading-[0.9] md:hidden" style={OUTLINE}>{project.title}</h1>

        <Reveal className="grid gap-10 md:grid-cols-[1.1fr_1.1fr_0.7fr] md:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold leading-tight md:text-3xl">{project.headline ?? project.title}</h2>
            <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">{project.desc}</p>
          </div>
          <p className="text-sm leading-relaxed text-white/70 md:text-base">{project.intro}</p>
          <dl className="flex flex-col gap-4 text-xs md:text-sm">
            {meta.map(([k, v]) => <div key={k}><dt className="font-bold">{k}:</dt><dd className="text-white/70">{v}</dd></div>)}
            {project.link && <div><a href={project.link} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 border-b border-white/40 pb-1 font-bold transition hover:border-white">Testar o agente ao vivo<ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></div>}
          </dl>
        </Reveal>

        {/* A página inteira do projeto, em imagens coladas umas nas outras, sem moldura nem espaço: é só rolar. */}
        <div className="group relative mx-auto mt-16 max-w-[1100px] md:mt-28">
          <span className="pointer-events-none absolute -inset-px bg-gradient-to-br from-white/60 via-white/10 to-white/50 opacity-80 transition group-hover:opacity-100" aria-hidden />
          <div className="relative overflow-hidden bg-zinc-950">
          {pages.length > 0
            ? pages.map((src, i) => (
              <img key={src} src={src} alt={i === 0 ? `${project.title}: página inteira` : `${project.title}: tela ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} draggable={false} className="block w-full select-none" />
            ))
            : <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-900"><Screen label="Tela principal — desktop" /></div>}
          </div>
        </div>

        <section className="mt-24 md:mt-40">
          <p className="mb-10 text-[10px] uppercase tracking-[0.3em] text-white/40">Como foi construído</p>
          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {STEP_TITLES.map((t, i) => (
              <Reveal key={t} className="flex flex-col gap-4 bg-black p-6 md:p-8">
                <span className="font-mono text-[10px] text-white/40">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="text-sm leading-relaxed text-white/60">{steps[i] ?? ''}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="mt-24 grid items-center gap-12 md:mt-40 md:grid-cols-[1fr_1fr_1fr_0.8fr]">
          {PHONES.map((l, i) => <Phone key={l} label={l} img={project.mobile?.[i]} />)}
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-bold">Uma experiência mobile fluida.</h3>
            <p className="max-w-xs leading-relaxed text-white/70">{project.mobileNote}</p>
          </div>
        </Reveal>

        <Reveal className="mt-24 grid gap-10 md:mt-40 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4">
            {project.highlight && <><h3 className="text-xl font-bold leading-tight md:text-2xl">{project.highlight.title}</h3>
            <p className="text-sm leading-relaxed text-white/70 md:text-base">{project.highlight.text}</p></>}
          </div>
          <p className="text-sm leading-relaxed text-white/70 md:text-base">Gostou do projeto e quer conversar sobre o que posso fazer por você?<br /><a href={`mailto:${email}`} className="underline underline-offset-4 hover:text-white">Vamos conversar!</a></p>
        </Reveal>

        <div className="mt-32 flex flex-col-reverse items-start justify-between gap-12 md:mt-48 md:flex-row md:items-end">
          <a href="#work" className="group inline-flex items-center gap-3 text-lg font-black md:text-2xl">
            <ArrowLeft className="transition group-hover:-translate-x-1" size={28} strokeWidth={1.5} /> todos os projetos
          </a>
          <a href={nextHref} className="group flex flex-col items-end gap-4 text-right">
            <span className="text-lg font-black md:text-2xl">próximo projeto</span>
            <span className="break-words text-5xl font-black uppercase leading-[0.9] tracking-tight text-white/90 transition group-hover:text-white group-hover:tracking-normal sm:text-7xl md:text-8xl">{next.title}</span>
          </a>
        </div>
      </div>
    </main>
  )
}

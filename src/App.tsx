import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { About, Aurora, Contact, EncryptedText, Home, Rail, Stack, StickyNav, Timeline, type Project } from './ui'
import { ProjectPage } from './project'

const EMAIL = 'gustavomartinssantos045@gmail.com'
const PULSE: Project = {
  title: 'Pulse', tag: 'Dashboard', headline: 'Cada número do negócio, na tela certa.', highlight: { title: 'Transformar milhares de pedidos em decisões.', text: 'O mais interessante foi montar tudo sobre um único conjunto de dados: do funil de conversão ao mapa de calor de horários, passando por curva ABC de produtos e retenção de clientes por coorte. Os gráficos são SVG feitos à mão, e a API valida e guarda cada alteração no PostgreSQL.' }, desc: 'Painel de e-commerce com metas, funil, retenção de clientes, estoque e pedidos em tempo real.',
  intro: 'Painel que transforma milhares de pedidos em decisões: o que vendeu, quanto cresceu, quem volta a comprar e o que precisa ser reposto.',
  stack: 'React, TypeScript, Tailwind, Node.js, Express, PostgreSQL',
  full: '/projetos/pulse/full.png', img: '/projetos/pulse/full.png',
  desktop: ['/projetos/pulse/desktop-2.png', '/projetos/pulse/desktop-3.png'],
  mobile: ['/projetos/pulse/mobile-1.png', '/projetos/pulse/mobile-2.png', '/projetos/pulse/mobile-3.png'],
  mobileNote: 'Cartões em duas colunas, tabelas com rolagem lateral e a navegação vira uma faixa de atalhos no topo.',
  steps: [
    'Partir das perguntas de quem toca uma loja: quanto vendi, de onde vieram os clientes, o que está acabando e quem parou de comprar. Isso definiu as 5 telas.',
    'Interface escura com um único destaque, para os números ficarem em primeiro plano. Todos os gráficos (área com comparação, rosca, funil, mapa de calor) são SVG próprio, sem biblioteca.',
    'API em Node e Express sobre PostgreSQL: pedidos, produtos, estoque e meta mensal. O navegador calcula KPIs, curva ABC, segmentos de clientes e coortes de retenção sobre os 3.200 pedidos.',
    'Dá para criar pedido, mudar status em lote, repor estoque, editar a meta e exportar CSV. O botão "ao vivo" injeta pedidos reais pela API, e as regras de preço e frete são compartilhadas com o modo demo.',
  ],
}
const DENTISTA: Project = {
  title: 'Dr. Luiz Eduardo', tag: 'Landing', headline: 'Uma página que leva o paciente direto ao WhatsApp.', highlight: { title: 'Menos barreira entre o paciente e a consulta.', text: 'Cada botão abre o WhatsApp com a mensagem já escrita, e todo o conteúdo fica em um único arquivo para o cliente trocar textos sem mexer no layout. A ordem das seções responde primeiro ao medo e às dúvidas, e só depois apresenta o tratamento.' }, desc: 'Landing page de conversão para um consultório odontológico, com agendamento direto pelo WhatsApp.',
  intro: 'Página pensada para uma decisão: o paciente entende o tratamento, confia em quem vai atender e chama no WhatsApp sem sair da página.',
  stack: 'React, TypeScript, Tailwind',
  full: '/projetos/dr-luiz-eduardo/full.png', img: '/projetos/dr-luiz-eduardo/full.png',
  desktop: ['/projetos/dr-luiz-eduardo/desktop-2.png', '/projetos/dr-luiz-eduardo/desktop-3.png'],
  mobile: ['/projetos/dr-luiz-eduardo/mobile-1.png', '/projetos/dr-luiz-eduardo/mobile-2.png', '/projetos/dr-luiz-eduardo/mobile-3.png'],
  mobileNote: 'Botão flutuante do WhatsApp sempre visível e seções empilhadas em uma coluna.',
  steps: [
    'Entender o paciente: quem tem medo, quem está com dor e quem quer estética. Isso definiu a ordem das seções e o texto, que fala de clareza e de valores antes do tratamento.',
    'Referência de layout de clínicas de alto padrão, em tons de azul para passar calma e limpeza. Retrato do profissional em destaque, porque a confiança vem do rosto.',
    'React com TypeScript e todo o conteúdo em um único arquivo, para o cliente trocar textos e dados sem mexer no layout. Carrossel de tratamentos, FAQ e animações leves.',
    'Todos os botões levam ao WhatsApp com a mensagem já pronta. Responsivo do celular ao desktop, com botão flutuante sempre visível.',
  ],
}
const HORARIO: Project = {
  title: 'Clinio', tag: 'Web App', headline: 'A rotina inteira da clínica em um só lugar.', highlight: { title: 'Regras de negócio que a clínica sente no dia a dia.', text: 'O conflito de horário é checado por profissional e, quando acontece, o sistema já sugere os próximos horários livres. A mesma regra roda na API e no modo demonstração, e cada clínica enxerga apenas os próprios dados.' }, desc: 'Sistema de clínica com agenda por profissional, prontuário, financeiro e confirmação pelo WhatsApp.',
  intro: 'Uma clínica entra, cadastra pacientes e profissionais e marca consultas numa agenda visual. Conflito de horário? O sistema recusa e sugere os próximos horários livres.',
  stack: 'React, TypeScript, Tailwind, Node.js, Express, PostgreSQL, JWT',
  full: '/projetos/horario/full.png', img: '/projetos/horario/full.png',
  desktop: ['/projetos/horario/desktop-2.png', '/projetos/horario/desktop-3.png'],
  mobile: ['/projetos/horario/mobile-1.png', '/projetos/horario/mobile-2.png', '/projetos/horario/mobile-3.png'],
  mobileNote: 'Navegação inferior como em um app, agenda do dia em colunas por profissional e fichas que abrem em painel lateral.',
  steps: [
    'Partir da rotina de uma clínica: conflito de horário, falta sem aviso e dinheiro que fica sem receber. Isso definiu o painel inicial (confirmar amanhã, retornos, aniversários) e o financeiro.',
    'Modo escuro com uma cor por profissional. Agenda em dia, semana e mês, com consultas lado a lado quando se sobrepõem e uma linha vermelha marcando o horário atual.',
    'API em Node e Express sobre PostgreSQL. Login com JWT e senhas com scrypt, tudo filtrado pela clínica logada. A regra de conflito é um módulo único usado pela API e pelo modo demo.',
    'Testei a API de ponta a ponta: sem token (401), conflito por profissional (409), fora do horário de atendimento, CPF inválido, série semanal de consultas e isolamento entre contas.',
  ],
}
const VIGORA: Project = {
  title: 'Vigora', tag: 'E-commerce', headline: 'Uma loja pronta para ganhar a marca de um cliente.', highlight: { title: 'Uma estrutura que se adapta a qualquer marca.', text: 'Catálogo, marcas e categorias vivem em um único arquivo, e as embalagens são desenhadas em SVG com as cores da marca e do sabor. Trocar a identidade para um cliente real é questão de dados, não de reescrever telas. E o checkout valida CPF, CEP e cartão de verdade.' }, desc: 'Loja de suplementos completa: catálogo com filtros, carrinho, checkout com Pix, cartão e boleto, conta e guia de produtos.',
  intro: 'Uma estrutura de e-commerce de alto nível pronta para ser trocada pela identidade de um cliente real: do catálogo ao pedido confirmado.',
  stack: 'React, TypeScript, Tailwind, React Router',
  full: '/projetos/loja-vigora/full.png', img: '/projetos/loja-vigora/full.png',
  desktop: ['/projetos/loja-vigora/desktop-2.png', '/projetos/loja-vigora/desktop-3.png'],
  mobile: ['/projetos/loja-vigora/mobile-1.png', '/projetos/loja-vigora/mobile-2.png', '/projetos/loja-vigora/mobile-3.png'],
  mobileNote: 'Menu de categorias em gaveta, vitrine em duas colunas e botão de compra fixo na página do produto.',
  steps: [
    'Estudar o que uma loja de suplementos de referência faz bem: navegação por categoria, pacotes por quantidade, sabores, "combina com" e prova social. Tudo virou estrutura reutilizável.',
    'Catálogo, marcas e categorias vivem em um único arquivo de dados. As embalagens são desenhadas em SVG com as cores da marca e do sabor, então a vitrine funciona sem fotos.',
    'Carrinho, favoritos, cupom e pedidos persistem no navegador. Frete por CEP, desconto por quantidade e preço no Pix seguem regras de negócio testáveis, separadas da interface.',
    'Checkout com validação de verdade: CPF, CEP, cartão (algoritmo de Luhn) e validade. Depois do pedido há página de confirmação com Pix e acompanhamento.',
  ],
}
const ORBIT: Project = {
  title: 'Orbit', tag: 'Agente autônomo', headline: 'Um agente que mostra o que pensa antes de agir.',
  desc: 'Agente autônomo que planeja, usa ferramentas sobre os dados da loja, decide o próximo passo e propõe ações com aprovação humana.',
  intro: 'Em vez de só responder perguntas, o Orbit recebe um objetivo, monta um plano, consulta os dados, muda de rota conforme o que encontra e entrega um relatório com ações para você aprovar.',
  stack: 'React, TypeScript, Tailwind, agente baseado em ferramentas', link: '/orbit/',
  full: '/projetos/orbit/full.png', img: '/projetos/orbit/full.png',
  desktop: ['/projetos/orbit/desktop-2.png', '/projetos/orbit/desktop-3.png'],
  mobile: ['/projetos/orbit/mobile-1.png', '/projetos/orbit/mobile-2.png', '/projetos/orbit/mobile-3.png'],
  mobileNote: 'Missões, raciocínio e relatório empilham em uma coluna, e as ações continuam a um toque de distância.',
  highlight: { title: 'Autonomia com trava de segurança.', text: 'O mais interessante foi o equilíbrio entre deixar o agente agir sozinho e manter o controle: o nível de autonomia define o que ele executa sem pedir, e ações de risco alto sempre esperam aprovação. Em um dos testes, ele mesmo concluiu que as alavancas cobriam só 12% da diferença até a meta e recomendou ajustar a meta, em vez de prometer o que não entregaria.' },
  steps: [
    'Partir de uma pergunta: o que um agente precisa para ser confiável? A resposta virou três regras: mostrar o raciocínio, usar ferramentas que calculam de verdade e pedir aprovação quando há risco.',
    'Interface escura em três colunas: missões, linha do tempo do raciocínio e relatório com ações. Plano, ferramenta, observação e decisão têm cada um o seu visual, para dar para acompanhar o agente pensando.',
    'Nove ferramentas puras sobre os dados da loja (comparar períodos, decompor variação, risco de estoque, funil, previsão) e cinco missões que decidem o próximo passo a partir do que observam. O planejador é por regras e foi separado das ferramentas, para poder ser trocado por um modelo de linguagem.',
    'Três níveis de autonomia (manual, assistido e autônomo) e uma trava: ação de risco alto nunca roda sem aprovação humana. Tudo que é executado fica em um registro. O projeto roda inteiro no navegador, sem servidor.',
  ],
}
const PROJECTS: Project[] = [PULSE, VIGORA, ORBIT, HORARIO, DENTISTA]
// Se preencher birth: 'AAAA-MM-DD', a idade passa a ser calculada sozinha e atualiza a cada aniversário.
const PROFILE = { name: 'Gustavo Martins dos Santos', role: 'Full Stack Engineer', photo: '/gustavo-foco.jpg', birth: '2001-03-04' }
const HISTORY = [
  { title: 'Atual', text: 'Analista de Dados / Sistemas — Grupo Gotemburgo' },
  { title: '2025 — Ago/2025', text: 'Estágio Full Stack · Concluído — Startup de Tecnologia · Hub Salvador' },
  { title: '2024 — Concluído', text: 'Graduação ADS + LAES — UCsal · Liga Acadêmica de Eng. de Software' },
  { title: '2023 — presente', text: 'Full Stack Freelancer — React · Node.js · TypeScript · MySQL' },
  { title: '2022 — 2023', text: 'Certificação Full Stack — Rocketseat Explorer' },
  { title: 'SENAI', text: 'Profissionalizante em Informática — Pacote Office · Excel Avançado' },
]

const ABOUT_LEAD = 'Transformo ideias em produtos digitais que funcionam, escalam e geram resultado.'
const ABOUT = [
  'Sou Desenvolvedor Full Stack especialista em React.js e Node.js, construindo aplicações completas de ponta a ponta: APIs RESTful robustas, sistemas de autenticação seguros e interfaces responsivas que colocam o usuário no centro. Minha experiência em startup, na HubSalvador, me deu agilidade para entregar rápido sem abrir mão da qualidade.',
  'Meu diferencial está na união entre código, dados e inteligência artificial. Com certificações pela FIAP em Business Intelligence e Agentes Autônomos de IA, desenvolvo soluções que não apenas funcionam, mas tornam o negócio mais inteligente.',
  'Tecnólogo em Análise e Desenvolvimento de Sistemas pela UCSal e cursando Engenharia de Software, estou sempre evoluindo para entregar tecnologia que faz a diferença.',
]

const STACK = [
  { title: 'Back-end', items: ['Node.js', 'TypeScript', 'Java', 'APIs REST', 'Express', 'JWT Auth'] },
  { title: 'Front-end', items: ['React.js', 'Angular 17', 'JavaScript', 'TypeScript', 'HTML5', 'SCSS', 'RxJS', 'WordPress'] },
  { title: 'Banco de dados & DevOps', items: ['MySQL', 'PostgreSQL', 'Docker', 'Git / GitHub', 'Linux', 'SQL Avançado', 'Scrum / Kanban', 'Vercel', 'Heroku'] },
]


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
        const top = el.offsetTop + Math.min(idx, n - 1) * window.innerHeight
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
      {!m && !intro && <StickyNav />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={routeKey} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          {m ? <ProjectPage project={PROJECTS[+m[1]]} next={PROJECTS[nextIdx]} nextHref={`#/projeto/${nextIdx}`} email={EMAIL} /> : (
            <main>
        <Aurora>
          <Home projects={PROJECTS} />
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




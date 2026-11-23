// Conteúdo do portfólio. Fica separado das telas para o site e o assistente de IA lerem a mesma fonte.
export type Project = {
  title: string; tag: string; desc: string; img?: string
  intro?: string; stack?: string; link?: string; steps?: string[]
  full?: string // print da página inteira, mostrado na página do projeto
  mobileNote?: string
  headline?: string // frase de abertura da página do projeto
  highlight?: { title: string; text: string } // o que foi mais marcante
  desktop?: string[]; mobile?: string[]
}


export const EMAIL = 'gustavomartinssantos045@gmail.com'
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
const FLOWBOARD: Project = {
  title: 'Flowboard', tag: 'Tempo real', headline: 'Um quadro Kanban onde dá para ver o time trabalhando.',
  desc: 'Quadro Kanban colaborativo em tempo real, com cursores, presença, menções, permissões e feed de atividade ao vivo.',
  intro: 'Um quadro em que cada pessoa aparece com cursor e cor próprios, os cartões deslizam quando alguém os move e quem está editando um cartão o trava para os outros, tudo atualizado ao vivo.',
  stack: 'React, TypeScript, Node.js, Socket.IO, Redis, PostgreSQL', link: '/flowboard/',
  full: '/projetos/flowboard/full.png', img: '/projetos/flowboard/capa.png',
  desktop: ['/projetos/flowboard/desktop-2.png', '/projetos/flowboard/desktop-3.png'],
  mobile: ['/projetos/flowboard/mobile-1.png', '/projetos/flowboard/mobile-2.png', '/projetos/flowboard/mobile-3.png'],
  mobileNote: 'As colunas viram páginas com rolagem lateral, o detalhe do cartão ocupa a tela e a atividade abre em uma gaveta.',
  highlight: { title: 'Colaboração que dá para sentir.', text: 'O mais interessante foi simular o servidor no navegador: três colegas fictícios movem cartões, comentam e marcam checklists com cursores coloridos. Se você tentar arrastar o cartão que alguém está usando, o quadro avisa e não deixa, o mesmo comportamento da trava curta que a versão real faria no Redis.' },
  steps: [
    'Partir de uma pergunta: como mostrar que o quadro está vivo? Cursores, avatares online, etiquetas como "Ana movendo" e um feed de atividade responderam isso antes de qualquer tela de configuração.',
    'Mesmo visual escuro do Strata Analytics, com azul como cor ativa e coral para prazo e risco. Cada colaborador tem uma cor própria, que aparece no cartão em uso, no cursor e no feed.',
    'Arrastar e soltar com mouse, caneta e toque, colunas editáveis com limite de cartões, filtros por etiqueta, pessoa e prazo, e painel lateral com checklist e comentários com menção por @. Tudo em um único arquivo, sem instalar nada.',
    'A arquitetura da versão publicável está desenhada: React com dnd-kit, Node com Socket.IO, Redis para presença e travas, PostgreSQL com ordem fracionária dos cartões, versão por mudança para resolver conflitos e permissões validadas no handshake.',
  ],
}
export const PROJECTS: Project[] = [FLOWBOARD, PULSE, VIGORA, ORBIT, HORARIO, DENTISTA]
// Se preencher birth: 'AAAA-MM-DD', a idade passa a ser calculada sozinha e atualiza a cada aniversário.
export const PROFILE = { name: 'Gustavo Martins dos Santos', role: 'Full Stack Engineer', photo: '/gustavo-foco.jpg', birth: '2001-03-04' }
export const HISTORY = [
  { title: 'Atual', text: 'Analista de Dados / Sistemas — Grupo Gotemburgo' },
  { title: '2025 — Ago/2025', text: 'Estágio Full Stack · Concluído — Startup de Tecnologia · Hub Salvador' },
  { title: '2024 — Concluído', text: 'Graduação ADS + LAES — UCsal · Liga Acadêmica de Eng. de Software' },
  { title: '2023 — presente', text: 'Full Stack Freelancer — React · Node.js · TypeScript · MySQL' },
  { title: '2022 — 2023', text: 'Certificação Full Stack — Rocketseat Explorer' },
  { title: 'SENAI', text: 'Profissionalizante em Informática — Pacote Office · Excel Avançado' },
]

export const ABOUT_LEAD = 'Transformo ideias em produtos digitais que funcionam, escalam e geram resultado.'
export const ABOUT = [
  'Sou Desenvolvedor Full Stack especialista em React.js e Node.js, construindo aplicações completas de ponta a ponta: APIs RESTful robustas, sistemas de autenticação seguros e interfaces responsivas que colocam o usuário no centro. Minha experiência em startup, na HubSalvador, me deu agilidade para entregar rápido sem abrir mão da qualidade.',
  'Meu diferencial está na união entre código, dados e inteligência artificial. Com certificações pela FIAP em Business Intelligence e Agentes Autônomos de IA, desenvolvo soluções que não apenas funcionam, mas tornam o negócio mais inteligente.',
  'Tecnólogo em Análise e Desenvolvimento de Sistemas pela UCSal e cursando Engenharia de Software, estou sempre evoluindo para entregar tecnologia que faz a diferença.',
]

export const STACK = [
  { title: 'Back-end', items: ['Node.js', 'TypeScript', 'Java', 'APIs REST', 'Express', 'JWT Auth'] },
  { title: 'Front-end', items: ['React.js', 'Angular 17', 'JavaScript', 'TypeScript', 'HTML5', 'SCSS', 'RxJS', 'WordPress'] },
  { title: 'Banco de dados & DevOps', items: ['MySQL', 'PostgreSQL', 'Docker', 'Git / GitHub', 'Linux', 'SQL Avançado', 'Scrum / Kanban', 'Vercel', 'Heroku'] },
]

// Contatos usados na seção "Vamos conversar?" e pelo assistente de IA.
export const WHATSAPP = 'https://wa.me/5571983071000'
export const CONTACTS = [
  { k: 'E-mail', v: 'gustavomartinssantos04@hotmail.com', href: 'mailto:gustavomartinssantos04@hotmail.com' },
  { k: 'GitHub', v: 'github.com/Finl1n', href: 'https://github.com/Finl1n' },
  { k: 'LinkedIn', v: 'in/gustavomartins25', href: 'https://www.linkedin.com/in/gustavomartins25/' },
  { k: 'WhatsApp / Telefone', v: '(71) 98307-1000', href: WHATSAPP },
]

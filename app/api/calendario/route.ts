import { NextRequest, NextResponse } from 'next/server';

// ── Utilitários ───────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr: string[], index: number): string {
  return arr[index % arr.length];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Banco de títulos por segmento ─────────────────────────────────────────────

const TITULOS: Record<string, string[]> = {
  'Barbearia': [
    'Como escolher o corte ideal para o seu rosto',
    '3 sinais de que está na hora de renovar o visual',
    'O ritual completo de cuidado com a barba',
    'Por que o degradê continua em alta',
    'Antes e depois que vão te inspirar',
    'Os erros mais comuns na hora de cuidar da barba',
    'O que seu cabelo diz sobre você',
    'Tendências de corte que dominam essa temporada',
    'Como manter o visual impecável entre as visitas',
    'O segredo de uma barba sempre alinhada',
    'Produtos que todo homem deveria conhecer',
    'A transformação começa no detalhe certo',
    'Por que o ambiente importa tanto quanto o corte',
    'O que separa um bom corte de um corte excelente',
    'Cuidados pós-corte que fazem toda a diferença',
  ],
  'Saúde e Bem-estar': [
    '5 hábitos que transformam sua rotina em 30 dias',
    'O que ninguém te conta sobre constância',
    'Mitos e verdades que você precisa conhecer',
    'Por que pequenas mudanças geram grandes resultados',
    'O segredo de quem mantém a disciplina todos os dias',
    'Como começar do zero sem se perder no caminho',
    'Sinais de que seu corpo está pedindo atenção',
    '3 erros que sabotam seus resultados sem você perceber',
    'A rotina que mudou a vida de quem buscava equilíbrio',
    'O que a ciência diz sobre bem-estar real',
    'Como transformar cuidado em hábito e não em esforço',
    'Resultados que aparecem quando você é consistente',
    'Por que descanso também faz parte da evolução',
    'A diferença entre motivação e comprometimento',
    'Como dar o primeiro passo e não olhar para trás',
  ],
  'Alimentação': [
    'O segredo por trás do nosso prato mais pedido',
    'Bastidores da nossa cozinha — o que poucos veem',
    'Ingredientes que fazem toda a diferença no sabor',
    'Por que a qualidade da matéria-prima muda tudo',
    'A história por trás do nosso prato especial',
    'O que torna uma refeição verdadeiramente inesquecível',
    '3 combinações que precisam entrar no seu radar',
    'Como escolhemos cada ingrediente com cuidado',
    'O processo artesanal que garante o sabor único',
    'Antes do prato chegar na mesa — veja como é feito',
    'A receita que conquistou nossos clientes',
    'Novidade que você não pode deixar de experimentar',
    'Por que nossos clientes voltam sempre',
    'O cardápio que muda com as estações — conheça',
    'Da cozinha para a sua mesa com muito cuidado',
  ],
  'Moda e Beleza': [
    'Como montar looks incríveis com peças simples',
    'As tendências que chegaram para ficar essa temporada',
    'O poder de um acessório certo no look todo',
    'Antes e depois que vão mudar sua visão de estilo',
    'Os erros de combinação mais comuns — e como evitar',
    'Como descobrir o estilo que realmente é seu',
    'Peças curinga que toda coleção precisa ter',
    'A paleta de cores que favorece qualquer tom de pele',
    'Por que investir em qualidade vale mais a longo prazo',
    'O look perfeito para cada ocasião do seu dia',
    'Transformações que começam com as escolhas certas',
    'Inspirações de estilo para você se reinventar',
    'O que as tendências internacionais dizem sobre moda local',
    'Como cuidar das suas peças para durarem mais',
    '3 looks completos com menos do que você imagina',
  ],
  'Educação': [
    'O que nenhuma faculdade te ensina sobre sua área',
    'Como aprender mais em menos tempo — método comprovado',
    'A habilidade mais valorizada no mercado hoje',
    '3 erros que travam o crescimento profissional',
    'Por que estudar sem aplicar não gera resultado',
    'O que diferencia quem evolui de quem estagna',
    'Como transformar conhecimento em resultado prático',
    'A mentalidade que acelera o aprendizado',
    'Conteúdo que você precisa dominar agora',
    'Por que consistência vale mais que intensidade',
    'O caminho mais curto entre onde você está e onde quer chegar',
    'Dúvidas frequentes que merecem uma resposta honesta',
    'Como criar uma rotina de estudos que realmente funciona',
    'O que os melhores profissionais têm em comum',
    'Ferramentas que multiplicam sua produtividade',
  ],
  'Consultoria': [
    'O diagnóstico que todo negócio precisa fazer agora',
    '3 sinais de que sua empresa está deixando dinheiro na mesa',
    'Como estruturar processos que escalem com você',
    'O erro de gestão mais comum entre empreendedores',
    'Por que estratégia sem execução não gera resultado',
    'Como tomar decisões com dados e não com achismo',
    'O que separa empresas que crescem das que estacionam',
    'A pergunta que você precisa responder antes de crescer',
    'Resultados reais de quem aplicou a metodologia certa',
    'Como transformar desafios em oportunidades de melhoria',
    'O que mudaria no seu negócio com clareza estratégica',
    'Por que posicionamento é a base de tudo',
    'Como liderar equipes em momentos de pressão',
    'O plano que faltava para você sair do operacional',
    '5 indicadores que todo gestor precisa acompanhar',
  ],
  'Tecnologia': [
    'Como a tecnologia certa transforma a operação do negócio',
    '3 ferramentas que você provavelmente não conhece ainda',
    'Automatize o que consome seu tempo — veja como',
    'O que a transformação digital realmente significa',
    'Por que dados são o ativo mais valioso da sua empresa',
    'Como escolher a solução tecnológica ideal para o seu caso',
    'O erro mais comum ao implementar tecnologia nova',
    'Inteligência artificial: onde aplicar no seu negócio',
    'Como reduzir custos com as ferramentas certas',
    'O futuro que já chegou — e muitos ainda ignoram',
    'Segurança digital: o que toda empresa precisa saber',
    'Como medir o retorno de um investimento em tecnologia',
    'Cases reais de transformação com tecnologia acessível',
    'O roadmap que guia empresas na jornada digital',
    'Automatização que libera seu time para o que importa',
  ],
  'Varejo': [
    'Novidade que chegou e você vai querer conhecer',
    'Como escolher o produto certo para cada necessidade',
    'O que nossos clientes mais recomendam — e por quê',
    'Bastidores: como curamos cada produto da nossa loja',
    'As combinações mais pedidas pelos nossos clientes',
    '3 motivos para você conhecer nossa nova coleção',
    'O critério que usamos para selecionar cada fornecedor',
    'Lançamento que você estava esperando — chegou',
    'Como cuidar do seu produto para durar muito mais',
    'Por que nossos clientes voltam sempre',
    'O produto que virou queridinho da semana',
    'Comparativo que vai facilitar sua escolha',
    'Tudo que você precisa saber antes de comprar',
    'O atendimento que faz a diferença na sua experiência',
    'Estoque limitado — não deixe para depois',
  ],
  'Serviços': [
    'Como funciona nosso processo do início ao fim',
    'O que nos diferencia de qualquer outra opção do mercado',
    '3 dúvidas que todo cliente tem antes de contratar',
    'Por que nossos clientes indicam sem hesitar',
    'O resultado que você pode esperar ao nos contratar',
    'Bastidores: o cuidado que existe em cada entrega',
    'Como garantimos qualidade em todos os projetos',
    'Depoimento real de quem já passou por aqui',
    'O processo que elimina retrabalho e economiza seu tempo',
    'Por que agilidade e qualidade não precisam ser opostos',
    'O que acontece depois que você fecha com a gente',
    'Como medimos o sucesso de cada projeto',
    'A comunicação que mantemos durante todo o processo',
    '5 benefícios de trabalhar com quem entende do assunto',
    'Conheça quem está por trás das entregas',
  ],
  'Outro': [
    'O que nos move todos os dias',
    '3 razões para você nos conhecer melhor',
    'Como geramos valor real para quem confia em nós',
    'Por que fazemos o que fazemos — e como fazemos',
    'O diferencial que nossos clientes percebem de imediato',
    'Bastidores de quem trabalha com propósito',
    'O processo que garante resultados consistentes',
    'Quem somos além do serviço que entregamos',
    'Como a atenção ao detalhe muda tudo',
    'Por que nossos clientes ficam e indicam',
    'O que você ganha ao escolher quem tem experiência',
    'A história que está sendo construída aqui',
    'Nosso compromisso com cada cliente',
    'Como transformamos desafios em entregas de valor',
    '5 coisas que você talvez não saiba sobre nós',
  ],
};

// ── Banco de legendas por tom de voz ──────────────────────────────────────────

const LEGENDAS: Record<string, string[]> = {
  'Profissional e sério': [
    'Na {cliente}, cada detalhe é tratado com rigor e atenção.\n\nPorque resultado consistente exige método, não improviso.\n\n📩 Entre em contato e conheça nossa abordagem.',
    'Qualidade não é acidente — é o resultado de processos bem definidos.\n\nÉ assim que trabalhamos na {cliente} todos os dias.\n\n📲 Fale com a gente e saiba como podemos ajudar.',
    'Experiência e seriedade são os pilares que guiam cada entrega da {cliente}.\n\nConhecimento que gera confiança. Confiança que gera resultado.\n\n🔗 Link na bio para saber mais.',
    'Não entregamos apenas o combinado — entregamos o que realmente faz diferença.\n\nEsse é o padrão da {cliente}.\n\n📩 Solicite uma avaliação gratuita.',
    'Cada decisão aqui é baseada em dados e experiência.\n\nNa {cliente}, estratégia precede qualquer ação.\n\n📲 Agende uma conversa hoje.',
    'Profissionalismo não é postura — é entrega consistente.\n\nA {cliente} mantém esse padrão em cada projeto.\n\n🔗 Conheça nosso trabalho pelo link na bio.',
  ],
  'Descontraído e próximo': [
    'Ei, você sabia que na {cliente} a gente faz diferente? 👀\n\nNão é papo, é resultado real — pergunte pra quem já viveu.\n\n💬 Chama no direct e vem descobrir!',
    'Olha, a gente poderia ficar só falando bem de si mesmo...\n\nMas preferimos mostrar o que a {cliente} realmente entrega. 😄\n\n👆 Link na bio pra você ver com seus próprios olhos.',
    'Sem enrolação: na {cliente} o que a gente promete, a gente cumpre. ✅\n\nSimples assim. Vem conferir!\n\n💬 Manda mensagem e bora conversar.',
    'A {cliente} é daquelas que trata cada cliente como se fosse o único. 🤝\n\nE não é exagero — é o nosso jeito de ser.\n\n👆 Curte e compartilha se curtiu!',
    'Sabe quando você encontra um serviço e pensa "era exatamente isso"? 🎯\n\nA {cliente} foi criada pra ser exatamente esse serviço.\n\n💬 Chama no direct e conta o que você precisa!',
    'A gente trabalha com o que ama — e quem trabalha com amor, entrega diferente. ❤️\n\nBem-vindo à {cliente}.\n\n👆 Link na bio. Vem nos conhecer!',
  ],
  'Inspirador e motivacional': [
    'Cada conquista começa com uma decisão corajosa.\n\nA {cliente} existe para caminhar ao seu lado nessa jornada.\n\n✨ Dê o primeiro passo. O resto vem com consistência.',
    'Grandes resultados não acontecem por acaso — são construídos todos os dias.\n\nNa {cliente}, acreditamos no poder da evolução constante.\n\n🚀 Sua transformação começa agora.',
    'O melhor momento para começar foi ontem. O segundo melhor é hoje.\n\nA {cliente} está pronta para fazer isso com você.\n\n💡 Link na bio. Vamos juntos.',
    'Quem escolhe evoluir nunca fica parado no mesmo lugar.\n\nA {cliente} foi construída para quem pensa assim.\n\n🔥 Compartilha com alguém que precisa ouvir isso hoje.',
    'Sua versão ideal já existe. Ela só está esperando a escolha certa.\n\nA {cliente} pode ser esse caminho.\n\n✨ Clica no link e veja o que é possível.',
    'Transformação real exige intenção + ação.\n\nNa {cliente}, nós aceleramos esse processo.\n\n🚀 Começa hoje. Não espera o momento perfeito.',
  ],
  'Educativo e informativo': [
    'Você sabia que {gancho}?\n\nNa {cliente}, aplicamos esse conhecimento para gerar resultados reais.\n\n📚 Salva esse post e compartilha com quem precisa saber.',
    'Entender como as coisas funcionam é o primeiro passo para mudá-las.\n\nA {cliente} compartilha conhecimento porque acredita em clientes informados.\n\n💡 Dúvidas? Comenta aqui embaixo.',
    'Dado importante que poucos consideram:\n\nQuem tem informação, toma decisões melhores.\n\nA {cliente} existe para te dar essa vantagem.\n\n📲 Segue para mais conteúdo como este.',
    'Três pontos que você precisa entender sobre esse assunto:\n\nA {cliente} explica na prática o que a teoria nem sempre deixa claro.\n\n📚 Salva e aplica.',
    'Conhecimento sem aplicação é apenas curiosidade.\n\nA {cliente} une os dois para gerar resultado de verdade.\n\n💡 Link na bio para dar o próximo passo.',
    'Pergunta frequente que merece resposta honesta:\n\nNa {cliente}, transparência faz parte do serviço.\n\n📲 Manda sua dúvida no direct.',
  ],
  'Premium e sofisticado': [
    'Excelência não é um detalhe — é a base de tudo que a {cliente} entrega.\n\nPara quem não abre mão de qualidade.\n\n✦ Conheça nossa proposta pelo link na bio.',
    'Poucos compreendem o valor do verdadeiro cuidado com cada entrega.\n\nA {cliente} foi criada para esses poucos.\n\n✦ Experiências que superam expectativas.',
    'O que distingue o ordinário do extraordinário é a atenção ao que outros ignoram.\n\nEsse é o padrão da {cliente}.\n\n✦ Solicite uma consulta exclusiva.',
    'Sofisticação não é luxo — é a ausência do supérfluo.\n\nNa {cliente}, cada detalhe tem propósito.\n\n✦ Link na bio para saber mais.',
    'Para quem entende que qualidade é um investimento, não um custo.\n\nA {cliente} existe para você.\n\n✦ Entre em contato.',
    'Raridade e excelência não costumam andar separadas.\n\nConheça o que a {cliente} preparou para você.\n\n✦ Acesso pelo link na bio.',
  ],
  'Direto e objetivo': [
    'Resultado. Sem enrolação.\n\nA {cliente} entrega o que promete — no prazo e com qualidade.\n\n📲 Fale agora: link na bio.',
    'Simples assim: a {cliente} resolve.\n\nSem burocracia. Sem surpresa. Com resultado.\n\n👆 Clica no link e começa hoje.',
    'Você precisa de resultado. A {cliente} entrega.\n\nSem complicação — só o que funciona.\n\n📲 Chama no direct.',
    'Três coisas que definem a {cliente}: qualidade, prazo e honestidade.\n\nNão é promessa. É histórico.\n\n👆 Veja pelo link na bio.',
    'Direto ao ponto: a {cliente} é a escolha certa.\n\nQuem já trabalhou com a gente sabe.\n\n📲 Entre em contato agora.',
    'Sem enrolação: o que você precisa está aqui.\n\nA {cliente} tem a solução que você estava buscando.\n\n👆 Link na bio.',
  ],
};

// ── Banco de hashtags por segmento ────────────────────────────────────────────

const HASHTAGS: Record<string, string[]> = {
  'Barbearia': ['#barbearia', '#barber', '#barbershop', '#cortemasculino', '#barba', '#cabelo', '#barbeirosbrasil', '#degradê', '#cuidadosmasculinos', '#lookmasculino'],
  'Saúde e Bem-estar': ['#saude', '#bemestar', '#qualidadedevida', '#saúdementalimporta', '#vidasaudavel', '#autocuidado', '#habitos', '#rotinasaudavel', '#equilibrio', '#saudeequalidade'],
  'Alimentação': ['#gastronomia', '#foodie', '#comidaboa', '#sabor', '#culinaria', '#alimentacao', '#restaurante', '#foodphotography', '#instafood', '#comidasaudavel'],
  'Moda e Beleza': ['#moda', '#fashion', '#beleza', '#style', '#lookdodia', '#tendencia', '#ootd', '#modafeminina', '#estilo', '#beauty'],
  'Educação': ['#educacao', '#aprendizado', '#conhecimento', '#desenvolvimento', '#cursos', '#capacitacao', '#carreira', '#estudos', '#educacaoonline', '#crescimento'],
  'Consultoria': ['#consultoria', '#negocios', '#estrategia', '#gestao', '#empreendedorismo', '#resultados', '#lideranca', '#marketing', '#empresas', '#crescimentoempresarial'],
  'Tecnologia': ['#tecnologia', '#tech', '#inovacao', '#digital', '#software', '#transformacaodigital', '#ia', '#inteligenciaartificial', '#automacao', '#startup'],
  'Varejo': ['#varejo', '#loja', '#compras', '#novidade', '#produto', '#promocao', '#lancamento', '#qualidade', '#atendimento', '#vendas'],
  'Serviços': ['#servicos', '#qualidade', '#profissionalismo', '#atendimento', '#solucoes', '#resultado', '#confianca', '#expertise', '#parceria', '#excelencia'],
  'Outro': ['#negocios', '#empreendedorismo', '#qualidade', '#resultado', '#inovacao', '#servico', '#profissional', '#crescimento', '#brasil', '#empresa'],
};

// ── Dias da semana por frequência ─────────────────────────────────────────────

const DIAS_POR_FREQUENCIA: Record<number, string[]> = {
  2: ['Terça', 'Quinta'],
  3: ['Segunda', 'Quarta', 'Sexta'],
  4: ['Segunda', 'Terça', 'Quinta', 'Sexta'],
  5: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
};

// ── Geração local do calendário ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    nomeCliente = 'Cliente',
    segmento = 'Outro',
    mes = 'Janeiro 2026',
    tomVoz = 'Profissional e sério',
    frequencia = '3x por semana',
    formatos = ['Post estático'],
    temas = ['Dica rápida'],
  } = body;

  const postsSemanais = parseInt(frequencia.split('x')[0]) || 3;
  const totalPosts = postsSemanais * 4;

  // Resolver bancos
  const titulosBanco = shuffle(TITULOS[segmento] || TITULOS['Outro']);
  const legendasBanco = LEGENDAS[tomVoz] || LEGENDAS['Profissional e sério'];
  const hashtagsBanco = HASHTAGS[segmento] || HASHTAGS['Outro'];
  const dias = DIAS_POR_FREQUENCIA[postsSemanais] || DIAS_POR_FREQUENCIA[3];

  const formatosDisponiveis = formatos.length > 0 ? formatos : ['Post estático'];
  const temasDisponiveis = temas.length > 0 ? temas : ['Dica rápida'];

  // Montar semanas
  const semanas = [];
  let postGlobal = 0;
  let tituloIdx = 0;

  for (let semana = 1; semana <= 4; semana++) {
    const posts = [];
    let formatoAnterior = '';
    let temaAnterior = '';

    for (let diaIdx = 0; diaIdx < postsSemanais; diaIdx++) {
      postGlobal++;

      // Tema — rotação circular sem repetir consecutivo
      let tema = pick(temasDisponiveis, postGlobal);
      if (tema === temaAnterior && temasDisponiveis.length > 1) {
        tema = pick(temasDisponiveis, postGlobal + 1);
      }
      temaAnterior = tema;

      // Formato — rotação circular sem repetir consecutivo
      let formato = pick(formatosDisponiveis, postGlobal);
      if (formato === formatoAnterior && formatosDisponiveis.length > 1) {
        formato = pick(formatosDisponiveis, postGlobal + 1);
      }
      formatoAnterior = formato;

      // Título — consumir sequencialmente do array embaralhado, com fallback circular
      const titulo = titulosBanco[tituloIdx % titulosBanco.length];
      tituloIdx++;

      // Legenda — escolher aleatória do tom de voz e substituir placeholders
      const legendaTemplate = pickRandom(legendasBanco);
      const legenda = legendaTemplate
        .replace(/\{cliente\}/g, nomeCliente)
        .replace(/\{gancho\}/g, tema.toLowerCase());

      // Hashtags — 5 aleatórias do banco do segmento
      const hashtagsSelecionadas = shuffle(hashtagsBanco).slice(0, 5).join(' ');

      posts.push({
        numero: String(postGlobal).padStart(2, '0'),
        diaSemana: dias[diaIdx % dias.length],
        formato,
        tema,
        titulo,
        legenda,
        hashtags: hashtagsSelecionadas,
      });
    }

    semanas.push({
      numero: semana,
      titulo: `Semana ${semana} — ${mes}`,
      posts,
    });
  }

  return NextResponse.json({ semanas });
}

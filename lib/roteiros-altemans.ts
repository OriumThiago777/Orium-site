export type Roteiro = {
  id: string
  titulo: string
  pilar: string
  formato: string
  roteiro: string
}

export const ROTEIROS_ALTEMANS: Roteiro[] = [
  // PILAR 1 — TRANSFORMAÇÃO
  {
    id: 'R1',
    titulo: 'Transformação clássica (Old Money)',
    pilar: 'PILAR 1 — TRANSFORMAÇÃO',
    formato: 'Reels',
    roteiro: `GANCHO: Corte já mostra o resultado pronto, cabelo penteado, câmera em close. Texto na tela: "Isso aqui era bagunça há 40 minutos."

ROTEIRO:
1. (0-2s) Resultado final em close, ângulo de perfil, boa luz.
2. (2-5s) Corte seco para o "antes": cliente sentado, cabelo sem forma.
3. (5-15s) Sequência rápida do processo: máquina, tesoura, navalha no contorno, secador. Cortes de 1-2s cada, sem fala.
4. (15-18s) Resultado final de novo, agora em vídeo (cliente virando a cabeça).
5. (18-20s) Texto na tela: "Old Money. Marca seu horário."

ÁUDIO: Trilha instrumental com batida grave, sem letra, ritmo de corte seco acompanhando as transições.
CTA: "Marca o seu" no texto final, mais link na bio.`,
  },
  {
    id: 'R2',
    titulo: 'Transformação relâmpago (time-lapse)',
    pilar: 'PILAR 1 — TRANSFORMAÇÃO',
    formato: 'Reels',
    roteiro: `GANCHO: "30 minutos em 12 segundos." (texto na tela, sobre o cliente já sentado)

ROTEIRO:
1. Câmera fixa, time-lapse do início ao fim do corte (acelerado 8x a 10x).
2. Velocidade normal só no último corte de tesoura, para o público sentir a precisão.
3. Resultado final parado por 2s no fim.

ÁUDIO: Som ambiente real da máquina e da tesoura, sem música.
CTA: Comentário fixado: "Esse foi o Taper Fade. Quer um assim? Chama no direct."`,
  },
  {
    id: 'R3',
    titulo: '"Antes eu nem reconheci"',
    pilar: 'PILAR 1 — TRANSFORMAÇÃO',
    formato: 'Reels',
    roteiro: `GANCHO: Plano fechado no rosto do cliente já pronto. Ele fala: "Cara, eu cheguei aqui sem noção do que eu queria."

ROTEIRO:
1. (0-3s) Cliente fala a frase do gancho, resultado já pronto no fundo.
2. (3-8s) Corte para o "antes" gravado no início do atendimento.
3. (8-22s) Processo em cortes rápidos, intercalando com 2-3 frases curtas do cliente.
4. (22-28s) Resultado final, cliente se olhando no espelho.
5. (28-30s) Texto: "Conversa boa também é serviço."

ÁUDIO: Fala do próprio cliente como áudio principal, sem música.
CTA: "Marca pelo link da bio."`,
  },
  {
    id: 'R16',
    titulo: 'Transformação Mullet',
    pilar: 'PILAR 1 — TRANSFORMAÇÃO',
    formato: 'Reels',
    roteiro: `GANCHO: Resultado pronto, cabelo mais longo atrás com volume, em movimento. Texto: "Esse aqui pede atitude, não é pra qualquer um."

ROTEIRO:
1. Resultado final em movimento, mostrando o volume de trás.
2. Corte para o antes: cabelo sem definição, sem camada.
3. Processo: tesoura nas laterais, máquina no contorno, definição da nuca.
4. Resultado final de novo, cliente se olhando de perfil e de trás.
5. Texto final: "Mullet. Só leva quem tem confiança."

ÁUDIO: Trilha com guitarra leve, ritmo mais despojado.
CTA: "Topa usar? Marca o seu."`,
  },
  {
    id: 'R17',
    titulo: 'Buzz Cut rápido',
    pilar: 'PILAR 1 — TRANSFORMAÇÃO',
    formato: 'Reels',
    roteiro: `GANCHO: Máquina passando a primeira linha no cabelo. Texto: "Do cheio ao raspado em menos tempo que você esperava."

ROTEIRO:
1. Primeira passada de máquina (cabelo ainda cheio dos dois lados).
2. Sequência acelerada das passadas restantes.
3. Resultado final, cliente passando a mão na cabeça.

ÁUDIO: Som real da máquina, sem música.
CTA: "Simples assim. Marca o seu Buzz Cut."`,
  },
  // PILAR 2 — AUTORIDADE TÉCNICA
  {
    id: 'R4',
    titulo: 'Qual corte combina com seu formato de rosto',
    pilar: 'PILAR 2 — AUTORIDADE TÉCNICA',
    formato: 'Reels educativo',
    roteiro: `GANCHO: "Antes de pedir esse corte, olha seu rosto no espelho." (barbeiro falando direto pra câmera)

ROTEIRO:
1. (0-3s) Gancho.
2. (3-10s) Barbeiro explica em 1 frase cada formato: redondo, quadrado, oval, alongado.
3. (10-25s) Para cada formato, indicar um corte do cardápio. Intercalar com imagens reais.
4. (25-32s) "Tendência é referência, não regra. O que importa é o que funciona no seu rosto."
5. (32-35s) CTA.

ÁUDIO: Voz do barbeiro como áudio principal.
CTA: "Manda uma foto no direct que eu te digo o corte certo."`,
  },
  {
    id: 'R5',
    titulo: '3 erros que todo homem comete ao escolher o corte',
    pilar: 'PILAR 2 — AUTORIDADE TÉCNICA',
    formato: 'Reels lista',
    roteiro: `GANCHO: "Você está pedindo o corte errado pro seu cabelo. De novo." (texto grande, barbeiro de braços cruzados)

ROTEIRO:
1. Erro 1: copiar corte de jogador sem considerar o tipo de fio.
2. Erro 2: chegar e dizer "faz o que achar melhor" sem trazer referência.
3. Erro 3: não voltar na manutenção certa (fade precisa de manutenção a cada 2-3 semanas).
4. Fechamento: "Resolve isso e seu corte dura o dobro do tempo."

ÁUDIO: Trend de hook agressivo, instrumental leve por baixo da voz.
CTA: "Comenta SHAPE que te explico qual corte funciona pro seu formato."`,
  },
  {
    id: 'R6',
    titulo: 'Como manter o fade entre os cortes',
    pilar: 'PILAR 2 — AUTORIDADE TÉCNICA',
    formato: 'Carrossel ou Reels',
    roteiro: `GANCHO: "O fade não morre em casa se você fizer isso."

ROTEIRO:
1. Passo 1: produto certo para não desmanchar a linha.
2. Passo 2: frequência de manutenção realista.
3. Passo 3: o que evitar (ex.: cortar em casa achando que vai ajustar).

ÁUDIO: Instrumental leve, ritmo de tutorial.
CTA: "Salva esse post pra lembrar na hora certa."`,
  },
  {
    id: 'R18',
    titulo: 'Cardápio explicado em 30 segundos',
    pilar: 'PILAR 2 — AUTORIDADE TÉCNICA',
    formato: 'Reels educativo',
    roteiro: `GANCHO: Barbeiro aponta para o quadro de serviços: "Você sabe a diferença entre esses três cortes?"

ROTEIRO:
1. Old Money: topo mais comprido, lateral baixa, acabamento clássico.
2. Taper Fade: transição gradual nas laterais.
3. Low Fade: degradê que começa mais baixo, discreto.
4. Fechamento: "Agora você já sabe pedir o nome certo."

ÁUDIO: Instrumental leve, fala do barbeiro em destaque.
CTA: "Qual desses você nunca pediu? Comenta aqui."`,
  },
  {
    id: 'R19',
    titulo: 'Erros comuns no cuidado da barba',
    pilar: 'PILAR 2 — AUTORIDADE TÉCNICA',
    formato: 'Reels lista',
    roteiro: `GANCHO: "Sua barba não cresce torta. Você que está cuidando errado." (barbeiro olhando pra câmera, sério)

ROTEIRO:
1. Erro 1: não usar óleo nenhum no dia a dia.
2. Erro 2: aparar em casa sem guia de régua, perdendo o contorno.
3. Erro 3: deixar passar muito tempo entre as manutenções e perder o desenho.
4. Fechamento: "Resolve isso e a barba para de parecer descuidada."

ÁUDIO: Trend de hook agressivo, mesmo estilo do roteiro de erros de corte.
CTA: "Comenta BARBA que te mando o passo a passo completo."`,
  },
  // PILAR 3 — BASTIDORES
  {
    id: 'R7',
    titulo: 'Abertura da barbearia',
    pilar: 'PILAR 3 — BASTIDORES',
    formato: 'Reels',
    roteiro: `GANCHO: Ambiente vazio, luz entrando, texto: "Antes do primeiro cliente chegar."

ROTEIRO:
1. Cadeiras sendo organizadas, ferramentas sendo dispostas.
2. Café sendo preparado, se houver esse ritual.
3. Barbeiro vestindo o avental, primeiro cliente entrando na porta no corte final.

ÁUDIO: Instrumental calmo, baixo volume, clima de início de dia.
CTA: Sem CTA de venda. Objetivo é conexão, não conversão.`,
  },
  {
    id: 'R8',
    titulo: 'Bastidores do preparo das ferramentas',
    pilar: 'PILAR 3 — BASTIDORES',
    formato: 'Reels',
    roteiro: `GANCHO: Close na navalha sendo afiada. Texto: "Isso aqui é tão importante quanto a técnica."

ROTEIRO:
1. Sequência de preparo: esterilização, organização das máquinas, troca de lâmina.
2. Frase do barbeiro (voz em off ou texto): "Ferramenta errada estraga corte certo."

ÁUDIO: Som ambiente real, não precisa de música.
CTA: "Padrão também é isso que você não vê."`,
  },
  {
    id: 'R9',
    titulo: 'Um dia na vida do barbeiro',
    pilar: 'PILAR 3 — BASTIDORES',
    formato: 'Reels mini-vlog',
    roteiro: `GANCHO: Barbeiro caminhando até a barbearia, texto: "Sextou? Pra mim é só mais um dia de fila."

ROTEIRO:
1. Chegada na barbearia, abertura.
2. 2-3 cortes feitos durante o dia (clipes de 2-3s cada).
3. Intervalo rápido, conversa com outro barbeiro.
4. Fechamento da loja, últimas luzes apagando.

ÁUDIO: Trend de mini-vlog em alta, ritmo dinâmico.
CTA: "Se a agenda tá assim, imagina o sábado. Marca antes."`,
  },
  {
    id: 'R20',
    titulo: 'Preparação para evento especial',
    pilar: 'PILAR 3 — BASTIDORES',
    formato: 'Reels mini documentário',
    roteiro: `GANCHO: Cliente entra dizendo o motivo (casamento, formatura, entrevista). Texto: "Hoje o corte tem prazo que não pode errar."

ROTEIRO:
1. Cliente explica rapidamente a ocasião.
2. Processo com atenção redobrada (close em detalhes finos, acabamento na navalha).
3. Barba alinhada junto, se for o caso.
4. Resultado final, cliente se arrumando pro evento.

ÁUDIO: Instrumental mais solene, ritmo mais lento.
CTA: "Tem evento chegando? Marca com antecedência."`,
  },
  {
    id: 'R21',
    titulo: 'Treinamento e padrão da equipe',
    pilar: 'PILAR 3 — BASTIDORES',
    formato: 'Reels institucional',
    roteiro: `GANCHO: Plano dos barbeiros reunidos antes da abertura. Texto: "Antes de atender, a equipe se alinha."

ROTEIRO:
1. Momento de alinhamento entre os barbeiros.
2. Detalhe de um barbeiro mais experiente ensinando algo a outro.
3. Fechamento: "Padrão não é sorte. É treino todo dia."

ÁUDIO: Instrumental neutro, sem letra.
CTA: Sem CTA de venda. Roteiro institucional.`,
  },
  // PILAR 4 — PROVA SOCIAL
  {
    id: 'R10',
    titulo: 'Depoimento espontâneo na cadeira',
    pilar: 'PILAR 4 — PROVA SOCIAL',
    formato: 'Reels',
    roteiro: `GANCHO: Cliente ainda na cadeira, cabelo finalizado, barbeiro pergunta: "E aí, o que achou?"

ROTEIRO:
1. Resposta espontânea do cliente, sem roteiro, deixar natural.
2. Se ele mencionar algo específico, cortar pra esse trecho.
3. Fechamento com o cliente se levantando e se olhando no espelho.

ÁUDIO: Voz real do cliente, sem música.
CTA: "Quer sair assim também? Link na bio."`,
  },
  {
    id: 'R11',
    titulo: 'Cliente fiel há anos',
    pilar: 'PILAR 4 — PROVA SOCIAL',
    formato: 'Reels com entrevista',
    roteiro: `GANCHO: "Há quanto tempo você corta aqui?" Cliente responde com um número que impressiona (ex.: "4 anos, só com ele").

ROTEIRO:
1. Pergunta e resposta do gancho.
2. "Por que você não troca de barbearia?" Resposta real do cliente.
3. Imagens do cliente em atendimentos diferentes, se houver registro.

ÁUDIO: Voz real do cliente como áudio principal.
CTA: "Fidelidade se constrói corte por corte."`,
  },
  {
    id: 'R22',
    titulo: 'Cliente que vem de outra cidade',
    pilar: 'PILAR 4 — PROVA SOCIAL',
    formato: 'Reels com entrevista',
    roteiro: `GANCHO: "De onde você veio pra cortar aqui?" Cliente responde com a cidade ou a distância.

ROTEIRO:
1. Pergunta e resposta do gancho.
2. "Por que vale a viagem?" Resposta real do cliente.
3. Imagens do atendimento e do resultado final.

ÁUDIO: Voz real do cliente.
CTA: "Se vale a viagem, imagina o quanto vale aqui na sua cidade. Marca o seu."`,
  },
  // PILAR 5 — IDENTIFICAÇÃO LEVE
  {
    id: 'R12',
    titulo: 'Tipos de cliente que toda barbearia tem',
    pilar: 'PILAR 5 — IDENTIFICAÇÃO LEVE',
    formato: 'Reels',
    roteiro: `GANCHO: "Hoje é dia de te apresentar a fauna da barbearia." (barbeiro com cara de quem já viu de tudo)

ROTEIRO:
1. Tipo 1: o que chega com 15 fotos de referência diferentes.
2. Tipo 2: o que dorme na cadeira.
3. Tipo 3: o que pede "só uma aparadinha" e sai com o cabelo 4cm mais curto.
4. Fechamento: "E você, qual desses é?"

ÁUDIO: Trend de comédia leve, corte seco entre cada tipo.
CTA: "Comenta qual tipo você é."`,
  },
  {
    id: 'R13',
    titulo: 'Quando o cliente diz "só dá uma aparadinha"',
    pilar: 'PILAR 5 — IDENTIFICAÇÃO LEVE',
    formato: 'Reels curto',
    roteiro: `GANCHO: Cliente fala a frase, corte imediato para o resultado bem mais curto, expressão de surpresa controlada.

ROTEIRO:
1. Frase do cliente.
2. Corte seco pro resultado.
3. Texto final: "Aparadinha tem grau."

ÁUDIO: Efeito sonoro de plot twist.
CTA: Nenhum. Apenas para engajamento.`,
  },
  {
    id: 'R23',
    titulo: 'Pai e filho cortando juntos',
    pilar: 'PILAR 5 — IDENTIFICAÇÃO LEVE',
    formato: 'Reels emocional',
    roteiro: `GANCHO: Pai e filho sentados em cadeiras lado a lado. Texto: "Aqui também é tradição de família."

ROTEIRO:
1. Os dois sendo atendidos ao mesmo tempo, em cadeiras próximas.
2. Pequenos momentos de interação entre eles durante o corte.
3. Resultado final dos dois, lado a lado, no espelho.

ÁUDIO: Instrumental suave.
CTA: "Traz quem você quiser. Marca os dois horários juntos."`,
  },
  // PILAR 6 — POSICIONAMENTO PREMIUM
  {
    id: 'R14',
    titulo: 'Apresentação da experiência Alteman\'s',
    pilar: 'PILAR 6 — POSICIONAMENTO PREMIUM',
    formato: 'Reels institucional',
    roteiro: `GANCHO: Plano aberto do ambiente, boa luz, texto: "Isso não é só corte de cabelo."

ROTEIRO:
1. Ambiente: detalhes de decoração, cadeiras, organização.
2. Atendimento: cliente sendo recebido, oferecido algo (café, bebida, se houver).
3. Detalhe técnico: ferramentas, produtos usados.
4. Fechamento: barbeiro de braços cruzados, olhando pra câmera. "Padrão Alteman's."

ÁUDIO: Instrumental premium, sem letra, ritmo mais lento.
CTA: "Vem sentir a diferença. Link na bio."`,
  },
  {
    id: 'R15',
    titulo: 'CTA direto de agendamento',
    pilar: 'PILAR 6 — POSICIONAMENTO PREMIUM',
    formato: 'Reels',
    roteiro: `GANCHO: Agenda da semana aparecendo na tela, vários horários já ocupados.

ROTEIRO:
1. Mostrar a agenda preenchendo.
2. Texto: "Sexta e sábado já não têm mais horário de manhã."
3. Barbeiro: "Se for marcar, marca agora."

ÁUDIO: Trend curto, urgência sem ser apelativo.
CTA: "Marca pelo link da bio antes que feche."`,
  },
  {
    id: 'R24',
    titulo: 'Lançamento de novo serviço',
    pilar: 'PILAR 6 — POSICIONAMENTO PREMIUM',
    formato: 'Reels institucional',
    roteiro: `GANCHO: Detalhe do novo serviço sendo aplicado. Texto: "Coisa nova chegando na Alteman's."

ROTEIRO:
1. Apresentação rápida do que é o serviço novo.
2. Aplicação em um cliente real.
3. Reação do cliente ao resultado.

ÁUDIO: Instrumental com leve expectativa.
CTA: "Já pode marcar. Link na bio."`,
  },
  {
    id: 'R25',
    titulo: 'Final de ano e datas especiais',
    pilar: 'PILAR 6 — POSICIONAMENTO PREMIUM',
    formato: 'Reels',
    roteiro: `GANCHO: Calendário virando as páginas até a data especial. Texto: "Faltam poucos dias e a agenda já está enchendo."

ROTEIRO:
1. Calendário ou agenda mostrando proximidade da data.
2. Cortes finalizados de clientes recentes, em sequência rápida.
3. Texto final: "Garante seu horário antes que feche."

ÁUDIO: Trend de contagem regressiva.
CTA: "Marca agora pelo link da bio."`,
  },
  // PILAR 7 — LISTAS
  {
    id: 'L1',
    titulo: '5 sinais de que está na hora de cortar o cabelo',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel',
    roteiro: `ITENS:
1. O contorno já passou da linha da orelha.
2. O volume no topo não obedece mais nem com produto.
3. Você já adiou o corte duas vezes esse mês.
4. A barba começou a disputar espaço com o cabelo.
5. Você se pegou puxando o cabelo pra trás só pra aguentar mais uns dias.

LEGENDA: "Se bateu 3 desses, já sabe o que fazer."
CTA: Marca antes que vire emergência.`,
  },
  {
    id: 'L2',
    titulo: '7 motivos para escolher uma barbearia em vez de cortar em casa',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel',
    roteiro: `ITENS:
1. Ângulo que você não vê no espelho, o barbeiro vê.
2. Ferramenta certa pra cada tipo de fio.
3. Acabamento na navalha que máquina de casa não faz.
4. Visagismo: alguém que entende o que combina com seu rosto.
5. Manutenção do contorno sem desalinhar.
6. Tempo que você economiza sem refazer o corte errado.
7. Resultado que dura, não que resolve só por hoje.

LEGENDA: "Corte em casa resolve. Corte na barbearia dura."
CTA: Marca o seu horário.`,
  },
  {
    id: 'L3',
    titulo: '4 erros que estragam um degradê novo',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel ou Reels',
    roteiro: `ITENS:
1. Passar máquina sem guia em casa só pra ajustar.
2. Deixar crescer demais antes de voltar.
3. Usar produto errado, que engorda o fio e desfaz a linha.
4. Coçar ou esfregar a nuca com força no banho.

LEGENDA: "O degradê não desmancha sozinho. Geralmente é ajuda."
CTA: Salva esse post pra não esquecer.`,
  },
  {
    id: 'L4',
    titulo: '6 produtos que todo homem deveria ter em casa',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel',
    roteiro: `ITENS:
1. Pomada ou pasta modeladora compatível com o tipo de corte.
2. Óleo pra barba, mesmo quem tem barba curta.
3. Protetor solar pra couro cabeludo e rosto.
4. Shampoo específico, não o 2 em 1 genérico.
5. Pente ou escova certa pro tipo de fio.
6. Tesoura pequena só pra emergência, nunca pra ajustar contorno.

LEGENDA: "Produto certo facilita. Produto errado desfaz o trabalho do barbeiro."
CTA: Pergunta pro seu barbeiro qual desses faz sentido pra você.`,
  },
  {
    id: 'L5',
    titulo: '5 perguntas pra fazer antes de marcar com um barbeiro novo',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel ou Reels',
    roteiro: `ITENS:
1. Ele pede referência ou já corta sem perguntar nada?
2. As fotos do trabalho mostram ângulos diferentes, ou só de frente?
3. Ele explica o motivo da escolha, ou só executa?
4. O ambiente é limpo e organizado nas fotos e nos vídeos?
5. Outros clientes voltam, ou é sempre rosto novo?

LEGENDA: "Corte bom começa antes da cadeira."
CTA: Se quiser testar essas respostas, já sabe onde marcar.`,
  },
  {
    id: 'L6',
    titulo: '3 sinais de que seu barbeiro é realmente bom',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Reels ou Carrossel',
    roteiro: `ITENS:
1. Ele avisa quando o corte que você pediu não vai funcionar.
2. Ele explica o motivo de cada escolha, não só executa.
3. O resultado continua bom depois de uma semana, não só no dia.

LEGENDA: "Bom barbeiro pensa em como vai ficar depois, não só na hora."
CTA: Comenta se o seu barbeiro faz isso.`,
  },
  {
    id: 'L7',
    titulo: '8 cortes que nunca saem de moda',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel',
    roteiro: `ITENS:
1. Old Money
2. Taper Fade
3. Low Fade
4. Buzz Cut
5. Social
6. Risca lateral clássica
7. Undercut texturizado
8. Crew cut

LEGENDA: "Tendência muda. Clássico fica."
CTA: Qual desses você já usou? Comenta o número.`,
  },
  {
    id: 'L8',
    titulo: '5 coisas que fazem um corte durar mais',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel',
    roteiro: `ITENS:
1. Voltar na manutenção dentro do prazo certo, não quando já cresceu tudo.
2. Usar o produto que o barbeiro recomendou, não o que estava em casa.
3. Lavar o cabelo sem esfregar a linha do contorno com força.
4. Não dormir em cima do corte recém-feito com travesseiro áspero.
5. Não pedir pra cortar em casa só uma aparadinha no meio do prazo.

LEGENDA: "Corte bom dura. Corte mal cuidado não."
CTA: Salva esse post pra lembrar na próxima manutenção.`,
  },
  {
    id: 'L9',
    titulo: '4 tipos de barba e como cuidar de cada uma',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel',
    roteiro: `ITENS:
1. Barba rala: foco em produto que dá volume, não em deixar crescer mais.
2. Barba cheia: contorno bem definido é o que faz parecer cuidada.
3. Barba grisalha: hidratação maior, o fio grisalho costuma ser mais seco.
4. Barba enrolada: pente específico e óleo pra evitar volume desorganizado.

LEGENDA: "Barba não é só deixar crescer. É saber qual cuidado ela pede."
CTA: Qual desses é a sua? Comenta aqui.`,
  },
  {
    id: 'L10',
    titulo: '6 motivos para ter um barbeiro de confiança',
    pilar: 'PILAR 7 — LISTAS',
    formato: 'Carrossel ou Reels',
    roteiro: `ITENS:
1. Ele já sabe o que funciona pra você sem precisar explicar tudo de novo.
2. Corte errado vira exceção, não rotina.
3. Você confia o suficiente pra testar algo diferente quando ele sugere.
4. Ele lembra detalhe que você nem lembra que pediu da última vez.
5. Você sai sem precisar ajustar nada em casa depois.
6. Virou rotina, não decisão de última hora.

LEGENDA: "Não é sorte. É barbeiro de confiança."
CTA: Se ainda não tem um, esse é um bom motivo pra começar com a gente.`,
  },
]

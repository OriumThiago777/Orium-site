export type OpcaoPost = {
  id: "A" | "B" | "C";
  titulo: string;
  descricao: string;
};

export type PostVitrine = {
  titulo: string;
  opcoes: [OpcaoPost, OpcaoPost, OpcaoPost];
};

export type Vitrine = {
  id: "direta" | "credencial" | "narrativa";
  nome: string;
  arco: string;
  paraQuem: string;
  posts: [PostVitrine, PostVitrine, PostVitrine];
};

export const vitrines: Vitrine[] = [
  {
    id: "direta",
    nome: "Vitrine Direta™",
    arco: "Quem é você, o que você oferece, como contratar",
    paraQuem: "Negócio local com oferta clara, que só precisa comunicar bem o que já faz.",
    posts: [
      {
        titulo: "Quem é você",
        opcoes: [
          { id: "A", titulo: "Apresentação do negócio", descricao: "Nome, especialidade e tempo de mercado." },
          { id: "B", titulo: "O rosto por trás do negócio", descricao: "Quem atende, a credencial, o motivo de confiar." },
          { id: "C", titulo: "Diferencial em uma frase", descricao: "O que te separa da concorrência direta." },
        ],
      },
      {
        titulo: "O que você oferece",
        opcoes: [
          { id: "A", titulo: "Lista de serviços", descricao: "Os principais serviços ou produtos, organizados." },
          { id: "B", titulo: "Serviço carro-chefe", descricao: "O serviço principal, em destaque." },
          { id: "C", titulo: "Resultado ou antes/depois", descricao: "Um resultado real já entregue." },
        ],
      },
      {
        titulo: "Como contratar",
        opcoes: [
          { id: "A", titulo: "Chamada direta", descricao: "Agenda, WhatsApp ou botão de contato." },
          { id: "B", titulo: "Prova social e contato", descricao: "Uma prova social curta seguida do contato." },
          { id: "C", titulo: "Localização e horário", descricao: "Endereço, horário de funcionamento e contato." },
        ],
      },
    ],
  },
  {
    id: "credencial",
    nome: "Vitrine Credencial™",
    arco: "Prova, método, convite",
    paraQuem: "Marca pessoal ou especialista que precisa ser levado a sério antes de vender.",
    posts: [
      {
        titulo: "Prova",
        opcoes: [
          { id: "A", titulo: "Resultado de cliente", descricao: "Um case, número ou transformação real." },
          { id: "B", titulo: "Credencial formal", descricao: "Formação, tempo de atuação, especialização." },
          { id: "C", titulo: "Reconhecimento externo", descricao: "Mídia, convite ou parceria relevante." },
        ],
      },
      {
        titulo: "Método",
        opcoes: [
          { id: "A", titulo: "Como você trabalha", descricao: "O processo, em passos simples." },
          { id: "B", titulo: "O que te diferencia", descricao: "O que separa você de outros profissionais da área." },
          { id: "C", titulo: "O cuidado por trás da entrega", descricao: "O que normalmente não aparece pro cliente." },
        ],
      },
      {
        titulo: "Convite",
        opcoes: [
          { id: "A", titulo: "Convite direto", descricao: "Convite pro serviço ou produto principal." },
          { id: "B", titulo: "Prova social final", descricao: "Uma prova social seguida da chamada para contato." },
          { id: "C", titulo: "Pergunta que puxa DM", descricao: "Uma pergunta que gera conversa em vez de comentário." },
        ],
      },
    ],
  },
  {
    id: "narrativa",
    nome: "Vitrine Narrativa™",
    arco: "Dor nomeada, virada, prova e contato",
    paraQuem: "Marca que compete num mercado parecido e precisa se diferenciar diante de um público mais cético.",
    posts: [
      {
        titulo: "Dor nomeada",
        opcoes: [
          { id: "A", titulo: "O problema comum", descricao: "A dor do público, nomeada com precisão." },
          { id: "B", titulo: "O erro que passa despercebido", descricao: "O erro que a maioria comete sem perceber." },
          { id: "C", titulo: "O contraste", descricao: "Entre o que parece ser e o que realmente é." },
        ],
      },
      {
        titulo: "Virada",
        opcoes: [
          { id: "A", titulo: "Como você resolve", descricao: "A solução, de forma direta." },
          { id: "B", titulo: "O que muda", descricao: "O que muda pra quem passa a trabalhar com você." },
          { id: "C", titulo: "Bastidor do método", descricao: "O método sendo aplicado, na prática." },
        ],
      },
      {
        titulo: "Prova e contato",
        opcoes: [
          { id: "A", titulo: "Caso real e convite", descricao: "Um caso real seguido do convite." },
          { id: "B", titulo: "Depoimento e CTA", descricao: "Um depoimento seguido da chamada para contato." },
          { id: "C", titulo: "Resultado numérico e CTA", descricao: "Um número real seguido da chamada para contato." },
        ],
      },
    ],
  },
];

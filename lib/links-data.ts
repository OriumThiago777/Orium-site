export type TipoLink = 'interno' | 'cliente' | 'externo'

export interface LinkItem {
  label: string
  href: string
  descricao?: string
  tipo: TipoLink
  externo?: boolean // abre em nova aba se true
}

export interface GrupoLinks {
  id: string
  titulo: string
  cor?: string
  links: LinkItem[]
}

export const gruposDeLinks: GrupoLinks[] = [
  {
    id: 'ferramentas-internas',
    titulo: 'Ferramentas Internas ORIUM',
    links: [
      { label: 'Hub', href: '/hub', tipo: 'interno' },
      { label: 'Briefing', href: '/briefing', tipo: 'interno' },
      { label: 'Raio-X', href: '/raio-x', tipo: 'interno' },
      { label: 'Proposta', href: '/proposta', tipo: 'interno' },
      { label: 'Contrato', href: '/contrato', tipo: 'interno' },
      { label: 'Calendário', href: '/calendario', tipo: 'interno' },
      { label: 'Relatório', href: '/relatorio', tipo: 'interno' },
      { label: 'Checklist', href: '/checklist', tipo: 'interno' },
      { label: 'Clientes (CRM)', href: '/clientes', tipo: 'interno' },
      { label: 'Meus Documentos', href: '/meus-documentos', tipo: 'interno' },
      { label: 'Biblioteca', href: '/biblioteca', tipo: 'interno' },
      { label: 'Manual da Marca', href: '/manual', tipo: 'interno' },
    ],
  },
  {
    id: 'altemans',
    titulo: 'Altemans Barbearia',
    cor: '#FF6B00',
    links: [
      { label: 'Calendário Colaborativo', href: '/clientes/altemans', tipo: 'cliente' },
      { label: 'Pesquisa de Experiência (cliente final)', href: '/experiencia/altemans', tipo: 'cliente' },
      { label: 'Painel de Experiência (interno)', href: '/painel/experiencia/altemans', tipo: 'interno' },
      { label: 'Editor de Perguntas', href: '/painel/experiencia/altemans/perguntas', tipo: 'interno' },
    ],
  },
  {
    id: 'marcelo',
    titulo: 'Prof. Marcelo Félix',
    cor: '#2563EB',
    links: [
      { label: 'Calendário Colaborativo', href: '/clientes/marcelo', tipo: 'cliente' },
    ],
  },
  {
    id: 'cortex',
    titulo: 'Córtex Hub',
    cor: '#16A34A',
    links: [
      { label: 'Calendário Colaborativo', href: '/clientes/cortex', tipo: 'cliente' },
      { label: 'Briefing Córtex', href: '/briefing-cortex', tipo: 'cliente' },
    ],
  },
  {
    id: 'ekipar',
    titulo: 'Ekipar Acessórios',
    cor: '#9333EA',
    links: [
      { label: 'Calendário Colaborativo', href: '/clientes/ekipar', tipo: 'cliente' },
    ],
  },
  {
    id: 'externos',
    titulo: 'Recursos Externos',
    links: [
      { label: 'Repositório GitHub', href: 'https://github.com/OriumThiago777/Orium-site', tipo: 'externo', externo: true },
      { label: 'Site Público ORIUM', href: 'https://oriumagencia.com.br', tipo: 'externo', externo: true },
    ],
  },
]

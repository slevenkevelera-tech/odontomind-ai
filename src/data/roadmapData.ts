import { RoadmapStep } from '../types';

export const roadmapSteps: RoadmapStep[] = [
  {
    id: 'fase-1-site',
    phase: 1,
    phaseTitle: 'Fundação Digital',
    title: 'Site Clínico Seguro, Ultrarrápido e Viral',
    badge: 'Arquitetura Web',
    duration: 'Semanas 1-2',
    icon: 'ShieldCheck',
    description: 'Desenvolvimento do portal odontológico baseado nos melhores padrões globais (Mayo Clinic Dental, Swiss Smile e referências estéticas de Beverly Hills). Foco em velocidade instantânea (<1s), design limpo bioestético, sem barreiras de conversão.',
    engineeringDetails: [
      'Stack moderna: React 19 + TypeScript + Tailwind CSS com compressão WebP/AVIF e Core Web Vitals nota 98+',
      'Certificados SSL EV 256-bit e Headers de Segurança HTTP rigorosos (CSP, HSTS, X-Frame-Options)',
      'Arquitetura Mobile-First com agendamento direto em 1 clique conectado à API de triagem',
      'Galeria de Casos Clínicos com visualizador 3D interativo (antes e depois ético regulado pelo CFO)',
      'SEO Local avançado com Schema.org Dentist, geolocalização e integração Google Meu Negócio'
    ],
    deliverables: [
      'Página Inicial de Alta Conversão com tour virtual da clínica',
      'Páginas de Especialidades com explicação em vídeo curto integrado',
      'Calculadora de Previsibilidade de Tratamento (Alinhadores e Implantes)',
      'Área Segura do Paciente com autenticação sem senha (Magic Link/WhatsApp)'
    ],
    securityAndCompliance: [
      'Conformidade com a LGPD (Lei 13.709/2018) no tratamento de dados sensíveis de saúde',
      'Consentimento explícito de Cookies e Termos de Privacidade transparentes',
      'Anonimização de exames radiográficos e fotografias intraorais'
    ]
  },
  {
    id: 'fase-2-servicos',
    phase: 2,
    phaseTitle: 'Portfólio Clínico',
    title: 'Engenharia dos Serviços Odontológicos Essenciais',
    badge: 'Mix de Alto Valor',
    duration: 'Semanas 3-4',
    icon: 'Sparkles',
    description: 'Estruturação dos serviços indispensáveis para sustentabilidade, faturamento de alto ticket e retenção contínua (LTV) da clínica odontológica.',
    engineeringDetails: [
      'Fluxo Digital 100%: Scanner Intraoral 3D substituindo moldagens com alginato',
      'Planejamento Virtual Guiado em Implantodontia com cirurgia sem corte (flapless)',
      'Ortodontia Invisível: parcerias e protocolos de fabricação/entrega de alinhadores',
      'Protocolo de DSD (Digital Smile Design) e Mock-up estético em 1ª sessão',
      'Programa de Prevenção e Profilaxia Periódica Automatizada (Retorno Semestral)'
    ],
    deliverables: [
      'Matriz de Tratamentos de Alto Ticket (Implantes, Lentes Cerâmicas, Alinhadores)',
      'Protocolos Clínicos Padronizados (SOP - Standard Operating Procedures)',
      'Termos de Consentimento Livre e Esclarecido (TCLE) com assinatura digital'
    ],
    securityAndCompliance: [
      'Validação de prontuário eletrônico conforme Resolução CFO 091/2009',
      'Guarda segura de exames DICOM e arquivos STL por 20 anos em nuvem com redundância'
    ]
  },
  {
    id: 'fase-3-crm',
    phase: 3,
    phaseTitle: 'Motor de Vendas',
    title: 'CRM Odontológico & Funil de Vendas',
    badge: 'Gestão & LTV',
    duration: 'Semanas 5-6',
    icon: 'Kanban',
    description: 'Desenvolvimento do sistema central de relacionamento (CRM) focado na jornada do paciente: da primeira mensagem no Instagram/Google até o pós-tratamento de 5 anos.',
    engineeringDetails: [
      'Funil de vendas visual estilo Kanban com etapas clínicas específicas da odontologia',
      'Webhook bidirecional com WhatsApp Business API (Meta Cloud API)',
      'Algoritmo de cálculo de LTV (Lifetime Value) e probabilidade de fechamento de plano de tratamento',
      'Prontuário integrado com fotos clínicas antes/depois criptografadas em repouso (AES-256)',
      'Alerta inteligente de no-show com reatribuição automática de horários ociosos'
    ],
    deliverables: [
      'Painel Kanban dinâmico com movimentação instantânea de fases',
      'Módulo de Apresentação de Orçamentos Digitais interativos para o paciente',
      'Dashboard analítico de faturamento por cadeira, dentista e especialidade'
    ],
    securityAndCompliance: [
      'Controle de Acesso Baseado em Funções (RBAC): Dentistas, Recepcionistas e Administradores',
      'Auditoria de Logs (Audit Trail) para rastreabilidade de acessos a prontuários'
    ]
  },
  {
    id: 'fase-4-agentes-ia',
    phase: 4,
    phaseTitle: 'Automação Cognitiva',
    title: 'Exército de Agentes de IA Odontológica',
    badge: 'Inteligência Artificial',
    duration: 'Semanas 7-8',
    icon: 'Bot',
    description: 'Implementação de múltiplos agentes autônomos treinados com inteligência clínica, diretrizes de marketing viral e Código de Ética do CRO.',
    engineeringDetails: [
      'Agente 1: Auditor & Copywriter CRO/CFO (validação da Resolução CFO 196/2019 em tempo real)',
      'Agente 2: Diretor de Vídeos Virais (roteirização com ganchos de 3s e B-Rolls dinâmicos)',
      'Agente 3: Triagem Clínica Inteligente (anamnese prévia, grau de urgência e direcionamento)',
      'Agente 4: Gestor de Agenda & Anti-No-Show (técnica da dupla alternativa e lembretes 48h/24h)',
      'Agente 5: Follow-up Humanizado WhatsApp (pós-operatório de 24h e reativação de planos pendentes)',
      'Agente 6: Gerador de Conteúdo Multiformato (carrosséis, blog posts para SEO local e FAQs)'
    ],
    deliverables: [
      'Interface unificada de disparo e teste de cada agente com geração em segundos',
      'Simulador de conversa WhatsApp em tempo real conectado à IA',
      'Motor de validação jurídica de peças publicitárias antes da publicação'
    ],
    securityAndCompliance: [
      'Disclaimer explícito de IA: a triagem nunca substitui o exame clínico presencial',
      'Zero alucinação em prescrição de medicamentos controlados (regras de segurança rígidas)'
    ]
  },
  {
    id: 'fase-5-marketing-viral',
    phase: 5,
    phaseTitle: 'Tração & Escala',
    title: 'Marketing Viral Ético & Campanhas de Alto Impacto',
    badge: 'Marketing & CRO',
    duration: 'Semanas 9-10',
    icon: 'TrendingUp',
    description: 'Estratégia de aquisição viral em conformidade com as regras do CRO: criação de conteúdo educativo magnético, prova social respeitosa e captação qualificada.',
    engineeringDetails: [
      'Funil de Aquisição Multicanal: Google Ads (fundo de funil com alta intenção) + Meta Ads (desejo visual)',
      'Formato Viral "Desmistificando o Medo de Dentista" com micro-vídeos de bastidores tecnológicos',
      'Protocolo "Smile Reveal": momento emocionante da entrega de alinhadores/lentes gravado com consentimento',
      'Programa de Indicação VIP: paciente satisfeito indica amigos com benefício ético focado em saúde familiar',
      'Dashboard de ROI de Marketing com custo de aquisição de paciente (CAC) vs Ticket Médio'
    ],
    deliverables: [
      'Calendário Editorial Inteligente para 90 dias gerado por IA',
      'Scripts de gravação rápida para o cirurgião-dentista gravar 1 mês de conteúdo em 2 horas',
      'Guia de Gravação com iluminação médica e microfone lapela para autoridade'
    ],
    securityAndCompliance: [
      'Respeito irrestrito ao art. 44 do Código de Ética Odontológica (veda fotos sensacionalistas de sangue)',
      'Obrigatoriedade de assinatura do RT em todas as campanhas de tráfego pago'
    ]
  }
];

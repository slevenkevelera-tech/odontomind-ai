import { MetaCloudApiConfig, AgentBrainState, AgentLearnedHeuristic } from '../types';

export const initialMetaConfig: MetaCloudApiConfig = {
  phoneNumberId: '109845214789652',
  wabaId: '298714520938471',
  appId: '849201837492019',
  accessToken: 'EAAG9...meta_waba_system_token_verified',
  webhookVerifyToken: 'odontomind_secure_meta_token_2026',
  webhookUrl: 'https://ais-dev-6bagszsdvs7yxuwafwdlg2-709984037974.us-west2.run.app/api/meta/whatsapp-webhook',
  apiVersion: 'v21.0',
  syncMode: 'simulation',
  connectionStatus: 'connected',
  lastSyncTimestamp: new Date().toISOString(),
  displayPhoneNumber: '+55 11 98452-1102',
  qualityRating: 'GREEN (Alta Qualidade)',
  businessProfile: {
    name: 'Clínica OdontoMind AI & Estética Oral',
    description: 'Atendimento humanizado com triagem inteligente, scanner 3D e conformidade ética CRO-SP 89452.',
    address: 'Av. Paulista, 1842 - Torre Norte, 14º andar - Bela Vista, São Paulo - SP',
    email: 'contato@odontomind.com.br',
    website: 'https://odontomind.com.br'
  }
};

export const initialHeuristics: AgentLearnedHeuristic[] = [
  {
    id: 'heur-1',
    category: 'medo_fobia',
    categoryLabel: 'Fobia & Ansiedade Odontológica',
    title: 'Acolhimento com Anestesia Computadorizada sem Agulha',
    triggerPattern: 'Palavras: medo, pavor, dor, agulha, traumatizado, aflição',
    learnedStrategy: 'Nunca desvalidar o medo. Informar imediatamente a tecnologia de anestesia computadorizada sem dor e sedação inalatória leve. Convidar apenas para uma conversa e escaneamento visual 3D indolor.',
    confidenceScore: 98,
    timesApplied: 142,
    conversionBoost: '+68% agendamentos de pacientes com fobia',
    sourceIntegration: 'Meta API Chat Integration #12',
    createdAt: '2026-09-12'
  },
  {
    id: 'heur-2',
    category: 'compliance_cro',
    categoryLabel: 'Regulatório CRO/CFO',
    title: 'Blindagem Ética de Preços via Resolução CFO 196/2019',
    triggerPattern: 'Palavras: quanto custa, valor, preço fechado, tabela, promoção, desconto',
    learnedStrategy: 'Esclarecer gentilmente que a Odontologia é uma ciência biológica e o Conselho proíbe orçamentos sem diagnóstico prévio. Trocar a objeção pelo valor do "Check-up Digital com Câmera Intraoral", que avalia a estrutura sem custo surpresa.',
    confidenceScore: 100,
    timesApplied: 310,
    conversionBoost: '0 denúncias CRO e 82% aceitam avaliação diagnóstica',
    sourceIntegration: 'Meta API Inbound Webhook #45',
    createdAt: '2026-09-18'
  },
  {
    id: 'heur-3',
    category: 'objeção_preco',
    categoryLabel: 'Objeção Comercial Alinhadores',
    title: 'Simulação Virtual de Sorriso antes do Compromisso',
    triggerPattern: 'Palavras: achei caro, alinhador invisível valor, invisalign cabe no bolso',
    learnedStrategy: 'Destacar que o escaneamento 3D gera um vídeo do "Antes e Depois" em 5 minutos. O paciente vê como os dentes ficarão e o tempo exato antes de investir qualquer centavo.',
    confidenceScore: 95,
    timesApplied: 89,
    conversionBoost: '+54% conversão em alinhadores ortodônticos',
    sourceIntegration: 'Meta Cloud API Lead Ad Campaign #03',
    createdAt: '2026-10-02'
  },
  {
    id: 'heur-4',
    category: 'pos_operatorio',
    categoryLabel: 'Segurança Pós-Operatória',
    title: 'Escala de Desconforto e Alerta Clínico Imediato',
    triggerPattern: 'Palavras: ontem, siso, cirurgia, sangrando, latejando, ponto, inchaço',
    learnedStrategy: 'Acolher imediatamente, pedir nota de 0 a 10 de dor e presença de febre. Caso a dor seja > 6, notificar o WhatsApp particular do cirurgião responsável com o histórico do prontuário.',
    confidenceScore: 99,
    timesApplied: 74,
    conversionBoost: '100% de suporte em menos de 3 minutos',
    sourceIntegration: 'WhatsApp Post-Op Automated Care Sync',
    createdAt: '2026-10-08'
  },
  {
    id: 'heur-5',
    category: 'fechamento_agenda',
    categoryLabel: 'Agendamento em Tempo Real',
    title: 'Técnica de Dupla Alternativa com Cadeira e Horário',
    triggerPattern: 'Palavras: quero agendar, tem horário, quando posso ir, marcar consulta',
    learnedStrategy: 'Nunca perguntar "quando você pode vir?". Oferecer 2 opções objetivas no período preferido (ex: "Tenho terça às 14h com Dr. Lucas ou quinta às 16h com Dra. Camila"). Reduz o atrito de decisão em 75%.',
    confidenceScore: 96,
    timesApplied: 215,
    conversionBoost: '+72% confirmações no primeiro contato',
    sourceIntegration: 'Meta Graph API v21.0 Scheduler Hook',
    createdAt: '2026-10-14'
  }
];

export const initialAgentBrainState: AgentBrainState = {
  iqLevel: 9.4,
  totalConversations: 830,
  complianceAccuracy: 100,
  objectionsOvercome: 326,
  heuristics: initialHeuristics,
  recentLearnings: [
    {
      id: 'lrn-1',
      timestamp: 'Hoje às 11:24',
      summary: 'Detectou que pacientes que perguntam sobre dor de canal se acalmam ao saber da instrumentação rotatória silenciosa.',
      origin: 'Atendimento WhatsApp Meta API',
      impactScore: '+14% rapidez no agendamento'
    },
    {
      id: 'lrn-2',
      timestamp: 'Ontem às 16:40',
      summary: 'Pacientes de clareamento dental preferem agendar aos sábados pela manhã para evitar manchamento alimentar na rotina de trabalho.',
      origin: 'Meta Webhook Inbound #188',
      impactScore: '+22% preenchimento de agenda de sábado'
    },
    {
      id: 'lrn-3',
      timestamp: '16/10 às 09:15',
      summary: 'Respostas com áudio/texto curto (< 3 frases) convertem 3x mais que parágrafos longos em telas de smartphone.',
      origin: 'WhatsApp Business API Analytics',
      impactScore: '+45% taxa de resposta imediata'
    }
  ]
};

export const sampleMetaWebhooksPayloads = {
  textMessage: {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '298714520938471',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '+55 11 98452-1102',
                phone_number_id: '109845214789652'
              },
              contacts: [
                {
                  profile: { name: 'Juliana Mendes' },
                  wa_id: '5511998765432'
                }
              ],
              messages: [
                {
                  from: '5511998765432',
                  id: 'wamid.HBgLMjAyNjEwMTg=',
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  text: { body: 'Olá! Quanto custa fazer o escaneamento 3D e colocar o alinhador invisível?' },
                  type: 'text'
                }
              ]
            },
            field: 'messages'
          }
        ]
      }
    ]
  }
};

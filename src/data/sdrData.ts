import { SocialIntegrationConfig, SdrLead } from '../types';

export const initialSocialIntegrations: SocialIntegrationConfig[] = [
  {
    id: 'instagram',
    name: 'Meta Instagram Direct API (Graph v21.0)',
    icon: 'Instagram',
    status: 'connected',
    accountIdentifier: '@odontomind.clinic (Instagram Professional)',
    webhookUrl: 'https://odontomind-ai.onrender.com/api/sdr/lead-inbound',
    verifyToken: 'odontomind_secure_meta_token_2026',
    apiKeyOrToken: 'EAAG9...meta_instagram_messaging_token',
    apiDocsUrl: 'https://developers.facebook.com/docs/messenger-platform/instagram',
    activeAutomationsCount: 4
  },
  {
    id: 'whatsapp',
    name: 'Meta WhatsApp Cloud API (Graph v21.0)',
    icon: 'MessageCircle',
    status: 'connected',
    accountIdentifier: '+55 11 98452-1102 (WABA Oficial)',
    webhookUrl: 'https://odontomind-ai.onrender.com/api/meta/whatsapp-webhook',
    verifyToken: 'odontomind_secure_meta_token_2026',
    apiKeyOrToken: 'EAAG9...meta_waba_system_token',
    apiDocsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    activeAutomationsCount: 8
  },
  {
    id: 'facebook',
    name: 'Meta Facebook Lead Ads & Messenger',
    icon: 'Facebook',
    status: 'connected',
    accountIdentifier: 'Página OdontoMind AI São Paulo',
    webhookUrl: 'https://odontomind-ai.onrender.com/api/sdr/lead-inbound',
    verifyToken: 'odontomind_secure_meta_token_2026',
    apiKeyOrToken: 'EAAG9...meta_leadgen_pages_token',
    apiDocsUrl: 'https://developers.facebook.com/docs/marketing-api/guides/lead-ads',
    activeAutomationsCount: 3
  },
  {
    id: 'tiktok',
    name: 'TikTok Business Leads API',
    icon: 'Video',
    status: 'connected',
    accountIdentifier: '@odontomind.odonto (TikTok Ads Manager)',
    webhookUrl: 'https://odontomind-ai.onrender.com/api/sdr/lead-inbound',
    verifyToken: 'odontomind_tiktok_webhook_token_2026',
    apiKeyOrToken: 'act_tiktok_business_dev_token',
    apiDocsUrl: 'https://ads.tiktok.com/marketing_api/docs',
    activeAutomationsCount: 2
  },
  {
    id: 'google',
    name: 'Google Ads & Google Meu Negócio (Mensagens)',
    icon: 'Globe',
    status: 'connected',
    accountIdentifier: 'OdontoMind AI Clínica Paulista (Google Maps)',
    webhookUrl: 'https://odontomind-ai.onrender.com/api/sdr/lead-inbound',
    verifyToken: 'odontomind_google_lead_token',
    apiKeyOrToken: 'gads_oauth_lead_form_token',
    apiDocsUrl: 'https://developers.google.com/google-ads/api',
    activeAutomationsCount: 3
  }
];

export const sdrPlaybook = {
  sdrName: 'Lucas SDR IA',
  title: 'SDR de Alta Conversão em Saúde Bucal & Estética',
  responseSlaSeconds: 45,
  coreObjective: 'Qualificar interesse, coletar queixa principal, blindar contra precificação sem exame prévio (CRO) e agendar Check-up com Scanner 3D.',
  qualificationQuestions: [
    'Qual procedimento você deseja realizar ou qual incômodo gostaria de resolver?',
    'Você já realizou algum tratamento odontológico recente ou tem receio de dor?',
    'Qual o melhor período do dia para você vir fazer o escaneamento 3D aqui na Av. Paulista?'
  ],
  leadScoringCriteria: [
    { label: 'Interesse em Alinhador / Implante (Alto Ticket)', points: '+35 pts' },
    { label: 'Urgência ou dor relatada', points: '+25 pts' },
    { label: 'Telefone com DDD válido informado', points: '+15 pts' },
    { label: 'Período/horário preferido especificado', points: '+15 pts' },
    { label: 'Origem de Anúncio Pago (Meta Ads / TikTok)', points: '+10 pts' }
  ],
  croRules: [
    'Resolução CFO 196/2019: Proibido divulgar preços fechados ou descontos sem exame presencial.',
    'Sempre oferecer o "Check-up Digital com Scanner 3D" como a etapa diagnóstica obrigatória e transparente.',
    'Identificação profissional da RT: Dra. Camila Alencar (CRO-SP 89452).'
  ]
};

// Initial clean SDR Leads list (empty for operational real-use)
export const initialSdrLeads: SdrLead[] = [];

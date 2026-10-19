import { AgentConfig } from '../types';

export const aiAgentsList: AgentConfig[] = [
  {
    id: 'cro_compliance',
    name: 'Auditor & Copywriter Ético CRO/CFO',
    role: 'Conformidade Regulatória & Resolução CFO 196/2019',
    shortDesc: 'Audita e reescreve anúncios, legendas e textos de marketing para garantir 100% de conformidade com o Código de Ética Odontológica, eliminando riscos de sanções.',
    category: 'Marketing & CRO',
    icon: 'ShieldAlert',
    accentColor: 'indigo',
    sampleInput: {
      content: 'PROMOÇÃO IMPERDÍVEL DE CLAREAMENTO! Venha fazer sua avaliação grátis e transforme seu sorriso com até 40% de desconto nesta sexta-feira! Resultado garantido em 1 sessão. Poucas vagas!',
      dentistName: 'Dra. Gabriela Fontes',
      croNumber: 'CRO-SP 89452'
    }
  },
  {
    id: 'viral_video_script',
    name: 'Diretor de Vídeos Virais (Reels/TikTok)',
    role: 'Roteirista de Alta Retenção & Conversão Ética',
    shortDesc: 'Cria roteiros magnéticos de 30-45 segundos com ganchos visuais dos primeiros 3 segundos, quebra de mitos odontológicos, indicações de B-Roll e CTAs que convertem sem sensacionalismo.',
    category: 'Marketing & CRO',
    icon: 'Video',
    accentColor: 'rose',
    sampleInput: {
      topic: 'Alinhadores Invisíveis vs Aparelho de Metal com Borrachinha',
      targetAudience: 'Adultos profissionais de 24 a 45 anos que têm vergonha de sorrir com aparelho metálico',
      tone: 'Moderno, descontraído, autoridade clínica sofisticada',
      duration: '35 segundos'
    }
  },
  {
    id: 'smart_triage',
    name: 'Triagem Clínica & Pré-Anamnese IA',
    role: 'Classificação de Risco & Resumo Clínico',
    shortDesc: 'Recebe as queixas do paciente, classifica urgência (1 a 5), sugere especialidade odontológica indicada, tempo de cadeira e gera resumo para o prontuário eletrônico.',
    category: 'Clínico & Triagem',
    icon: 'Stethoscope',
    accentColor: 'blue',
    sampleInput: {
      patientName: 'Felipe Albuquerque',
      patientAge: '34 anos',
      symptoms: 'Sinto uma fisgada muito forte no dente de trás quando bebo água gelada há 4 dias. Ontem à noite a dor começou a latejar mesmo sem mastigar nada.',
      medicalHistory: 'Hipertenso controlado, sem alergias conhecidas a anestésicos.'
    }
  },
  {
    id: 'whatsapp_followup',
    name: 'Follow-up Humanizado WhatsApp',
    role: 'Pós-Operatório & Retenção de Pacientes',
    shortDesc: 'Dispara mensagens hiper-empáticas de 24h/48h após procedimentos (cirurgias, clareamento, implantes) e reativa orçamentos parados com delicadeza e acolhimento.',
    category: 'Relacionamento & WhatsApp',
    icon: 'MessageSquareShare',
    accentColor: 'emerald',
    sampleInput: {
      patientName: 'Mariana Duarte',
      followupType: 'Pós-operatório imediato de 24 horas',
      procedure: 'Instalação de 2 Implantes em Carga Imediata',
      dentistName: 'Dr. Lucas Sampaio',
      details: 'Paciente ficou nervosa na cadeira mas cirurgia foi um sucesso. Lembrar da compressa de gelo e analgésico de 8 em 8 horas.'
    }
  },
  {
    id: 'smart_scheduler',
    name: 'Gestor de Agenda & Anti-No-Show',
    role: 'Otimização de Cadeira & Redução de Faltas',
    shortDesc: 'Calcula intervalos cirúrgicos, implementa a técnica de dupla alternativa de agendamento e gera lembretes persuasivos com instrução de estacionamento e preparação.',
    category: 'Clínico & Triagem',
    icon: 'CalendarCheck2',
    accentColor: 'cyan',
    sampleInput: {
      treatment: 'Primeira Consulta com Scanner 3D e Simulação Virtual',
      availableSlots: 'Terça-feira às 14:00 ou Quarta-feira às 10:30',
      profile: 'Primeira vez na clínica, achou pelo Google Maps após procurar dentista especialista'
    }
  },
  {
    id: 'content_creator',
    name: 'Gerador de Carrossel Educativo & SEO',
    role: 'Educação em Saúde Bucal & Prova de Autoridade',
    shortDesc: 'Produz carrosséis de 5 a 7 lâminas com títulos anti-clichê, explicação biológica visual acessível e chamadas para ação em conformidade com o conselho.',
    category: 'Marketing & CRO',
    icon: 'Layers',
    accentColor: 'amber',
    sampleInput: {
      topic: 'Por que o dente escurece após canal e como clarear por dentro (Clareamento Interno)',
      targetAudience: 'Pessoas com um dente acinzentado ou escuro na frente',
      tone: 'Didático, científico e acolhedor'
    }
  }
];

import { PatientLead, PipelineStage, Appointment } from '../types';

export const initialPatients: PatientLead[] = [
  {
    id: 'pt-101',
    name: 'Carolina Bittencourt',
    cpf: '321.654.987-12',
    email: 'carolina.bittencourt@email.com',
    phone: '+55 11 98452-1102',
    birthDate: '1995-04-18',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    treatment: 'Alinhadores Invisíveis (Arcada Dupla)',
    category: 'Ortodontia',
    estimatedValue: 12500,
    stage: 'new_lead',
    urgency: 'media',
    dentistAssigned: 'Dra. Camila Alencar',
    lastContact: 'Há 18 minutos via Instagram Direct',
    notes: 'Interessada em alinhar dentes para casamento em 10 meses. Não quer aparelho de metal.',
    croConsentSigned: false,
    aiTriageSummary: 'Queixa de apinhamento anterior moderado. Sem dores. Desejo prioritário estético com prazo fixo.',
    communicationPrefs: {
      preferredChannel: 'whatsapp',
      preferredTime: 'afternoon',
      optInReminders: true,
      optInFollowup: true,
      optInPreventiveRecall: true,
      optInEducationalTips: true
    },
    treatmentHistory: [
      {
        id: 'tx-101-1',
        date: '2026-09-15',
        procedure: 'Profilaxia com Ultrassom & Jato de Bicarbonato',
        toothOrRegion: 'Geral',
        dentist: 'Dra. Camila Alencar',
        cost: 380,
        status: 'Concluído',
        clinicalNotes: 'Remoção de biofilme calcificado em dentes ântero-inferiores. Gengiva saudável.'
      }
    ],
    engagement: {
      messagesSent: 6,
      messagesOpened: 6,
      appointmentsAttended: 1,
      appointmentsMissed: 0,
      npsScore: 10,
      recallAdherencePercent: 100,
      lastInteractionDate: '2026-10-11'
    }
  },
  {
    id: 'pt-102',
    name: 'Dr. Roberto Silveira',
    cpf: '189.432.765-88',
    email: 'roberto.silveira.med@hospital.com',
    phone: '+55 11 97120-9944',
    birthDate: '1978-11-23',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    treatment: 'Implante Guiado Carga Imediata',
    category: 'Implantes',
    estimatedValue: 18000,
    stage: 'ai_triage',
    urgency: 'alta',
    dentistAssigned: 'Dr. Lucas Sampaio',
    lastContact: 'Há 45 minutos via WhatsApp',
    notes: 'Fratura de raiz no elemento 21 (incisivo central). Desconforto ao mastigar. Exige resolução rápida.',
    croConsentSigned: true,
    appointmentDate: '2026-10-12T14:30',
    aiTriageSummary: 'Urgência Nível 4. Dente anterior estético comprometido com mobilidade grau 2. Indicado cirurgia guiada com provisório imediato.',
    communicationPrefs: {
      preferredChannel: 'whatsapp',
      preferredTime: 'morning',
      optInReminders: true,
      optInFollowup: true,
      optInPreventiveRecall: true,
      optInEducationalTips: false
    },
    treatmentHistory: [
      {
        id: 'tx-102-1',
        date: '2026-10-09',
        procedure: 'Tomografia Computadorizada Cone Beam + Escaneamento 3D',
        toothOrRegion: 'Maxila Anterior (Elemento 21)',
        dentist: 'Dr. Lucas Sampaio',
        cost: 650,
        status: 'Concluído',
        clinicalNotes: 'Fratura oblíqua radicular identificada. Remanescente ósseo favorável para implante imediato com guia cirúrgico prototipado.'
      }
    ],
    engagement: {
      messagesSent: 12,
      messagesOpened: 12,
      appointmentsAttended: 2,
      appointmentsMissed: 0,
      npsScore: 9,
      recallAdherencePercent: 100,
      lastInteractionDate: '2026-10-11'
    }
  },
  {
    id: 'pt-103',
    name: 'Beatriz Vasconcelos',
    cpf: '456.789.123-04',
    email: 'beatriz.vasc@design.br',
    phone: '+55 11 99318-7750',
    birthDate: '1992-08-30',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    treatment: '6 Lentes Cerâmicas de Dissilicato',
    category: 'Estética',
    estimatedValue: 16800,
    stage: 'scheduled',
    urgency: 'baixa',
    dentistAssigned: 'Dra. Camila Alencar',
    lastContact: 'Hoje às 11:15',
    notes: 'Realizou escaneamento 3D na semana passada. Sessão de prova do Mock-up estético agendada.',
    croConsentSigned: true,
    appointmentDate: '2026-10-15T16:00',
    aiTriageSummary: 'Fechamento de diastema e correção de bordas incisais desgastadas por bruxismo noturno.',
    communicationPrefs: {
      preferredChannel: 'whatsapp',
      preferredTime: 'evening',
      optInReminders: true,
      optInFollowup: true,
      optInPreventiveRecall: true,
      optInEducationalTips: true
    },
    treatmentHistory: [
      {
        id: 'tx-103-1',
        date: '2026-09-28',
        procedure: 'Planejamento DSD (Digital Smile Design) & Escaneamento',
        toothOrRegion: 'Dentes 13 ao 23',
        dentist: 'Dra. Camila Alencar',
        cost: 1200,
        status: 'Concluído',
        clinicalNotes: 'Definição da proporção áurea dental respeitando linha labial alta e curvatura do sorriso.'
      },
      {
        id: 'tx-103-2',
        date: '2026-10-05',
        procedure: 'Clareamento Dental de Consultório a Laser',
        toothOrRegion: 'Arcadas Superior e Inferior',
        dentist: 'Dra. Camila Alencar',
        cost: 1500,
        status: 'Concluído',
        clinicalNotes: 'Substrato clareado em 3 tons (escala Vita de A3 para BL2) para receber as lâminas cerâmicas.'
      }
    ],
    engagement: {
      messagesSent: 15,
      messagesOpened: 14,
      appointmentsAttended: 3,
      appointmentsMissed: 0,
      npsScore: 10,
      recallAdherencePercent: 100,
      lastInteractionDate: '2026-10-11'
    }
  },
  {
    id: 'pt-104',
    name: 'Eduardo Guimarães',
    cpf: '234.567.890-55',
    email: 'eduardo.guimaraes@agronegocios.com.br',
    phone: '+55 11 98822-4301',
    birthDate: '1965-02-14',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    treatment: 'Reabilitação com 4 Implantes Protocolo',
    category: 'Implantes',
    estimatedValue: 26000,
    stage: 'proposal',
    urgency: 'media',
    dentistAssigned: 'Dr. Lucas Sampaio',
    lastContact: 'Ontem às 17:30',
    notes: 'Orçamento entregue em PDF interativo. Paciente comparando forma de pagamento em 12x.',
    croConsentSigned: true,
    aiTriageSummary: 'Edentulismo parcial inferior. Busca segurança mastigatória para alimentação sem restrições.',
    communicationPrefs: {
      preferredChannel: 'call',
      preferredTime: 'morning',
      optInReminders: true,
      optInFollowup: true,
      optInPreventiveRecall: true,
      optInEducationalTips: false
    },
    treatmentHistory: [
      {
        id: 'tx-104-1',
        date: '2026-08-10',
        procedure: 'Avaliação Inicial & Tomografia 3D',
        toothOrRegion: 'Mandíbula',
        dentist: 'Dr. Lucas Sampaio',
        cost: 500,
        status: 'Concluído',
        clinicalNotes: 'Reabsorção óssea moderada. Espessura adequada para 4 implantes All-on-4 com fixação rígida.'
      }
    ],
    engagement: {
      messagesSent: 8,
      messagesOpened: 7,
      appointmentsAttended: 2,
      appointmentsMissed: 1,
      npsScore: 8,
      recallAdherencePercent: 80,
      lastInteractionDate: '2026-10-10'
    }
  },
  {
    id: 'pt-105',
    name: 'Juliana Mendes Rocha',
    cpf: '876.543.210-99',
    email: 'juliana.mendes@consultoria.com',
    phone: '+55 11 97654-3210',
    birthDate: '1989-07-07',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    treatment: 'Alinhadores Invisíveis (Etapa 8/18)',
    category: 'Ortodontia',
    estimatedValue: 9800,
    stage: 'in_treatment',
    urgency: 'baixa',
    dentistAssigned: 'Dra. Camila Alencar',
    lastContact: 'Há 3 dias',
    notes: 'Evolução clínica excelente. Tracking dos dentes acompanhado por escaneamento de controle.',
    croConsentSigned: true,
    appointmentDate: '2026-10-22T10:00',
    aiTriageSummary: 'Adesão 100% às 22h de uso diário. Solicitou novos pares de alinhadores.',
    communicationPrefs: {
      preferredChannel: 'whatsapp',
      preferredTime: 'afternoon',
      optInReminders: true,
      optInFollowup: true,
      optInPreventiveRecall: true,
      optInEducationalTips: true
    },
    treatmentHistory: [
      {
        id: 'tx-105-1',
        date: '2026-05-12',
        procedure: 'Instalação de Attachments e Entrega Alinhadores 1-4',
        toothOrRegion: 'Arcadas Superior e Inferior',
        dentist: 'Dra. Camila Alencar',
        cost: 4900,
        status: 'Concluído',
        clinicalNotes: 'Attachments estéticos em resina fluida fotopolimerizada nos pré-molares. Encaixe perfeito.'
      },
      {
        id: 'tx-105-2',
        date: '2026-07-20',
        procedure: 'Controle de Tracking e Entrega Alinhadores 5-8',
        toothOrRegion: 'Arcadas Superior e Inferior',
        dentist: 'Dra. Camila Alencar',
        cost: 0,
        status: 'Concluído',
        clinicalNotes: 'Movimentação biológica condizente com simulação 3D inicial. IPR (desgaste interproximal leve) realizado.'
      }
    ],
    engagement: {
      messagesSent: 24,
      messagesOpened: 24,
      appointmentsAttended: 4,
      appointmentsMissed: 0,
      npsScore: 10,
      recallAdherencePercent: 100,
      lastInteractionDate: '2026-10-08'
    }
  },
  {
    id: 'pt-106',
    name: 'Marcos Vinícius Prado',
    cpf: '543.210.987-33',
    email: 'marcos.prado@techstart.io',
    phone: '+55 11 96541-8899',
    birthDate: '1998-12-03',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    treatment: 'Exodontia de Siso Incluso + Enxerto',
    category: 'Cirurgia',
    estimatedValue: 3400,
    stage: 'followup_retained',
    urgency: 'media',
    dentistAssigned: 'Dr. Lucas Sampaio',
    lastContact: 'Hoje às 09:00 via Follow-up IA WhatsApp',
    notes: 'Cirurgia realizada há 24h. Respondeu follow-up automático: nota 9 de recuperação sem dor.',
    croConsentSigned: true,
    aiTriageSummary: 'Pós-operatório de 24 horas estável. Repouso orientado e medicação em curso normal.',
    communicationPrefs: {
      preferredChannel: 'whatsapp',
      preferredTime: 'evening',
      optInReminders: true,
      optInFollowup: true,
      optInPreventiveRecall: true,
      optInEducationalTips: true
    },
    treatmentHistory: [
      {
        id: 'tx-106-1',
        date: '2026-10-10',
        procedure: 'Exodontia Cirúrgica Minimamente Invasiva dos Elementos 38 e 48',
        toothOrRegion: 'Sisos Inferiores Inclusos',
        dentist: 'Dr. Lucas Sampaio',
        cost: 3400,
        status: 'Concluído',
        clinicalNotes: 'Osteotomia e odontossecção com motor piezoelétrico. Preservação de tábua óssea e enxerto particulado.'
      }
    ],
    engagement: {
      messagesSent: 10,
      messagesOpened: 10,
      appointmentsAttended: 2,
      appointmentsMissed: 0,
      npsScore: 9,
      recallAdherencePercent: 100,
      lastInteractionDate: '2026-10-11'
    }
  }
];

export const pipelineStagesConfig: { id: PipelineStage; title: string; subtitle: string; color: string }[] = [
  { id: 'new_lead', title: '1. Lead Captado', subtitle: 'Instagram, Google & Site', color: 'border-amber-400' },
  { id: 'ai_triage', title: '2. Triagem IA', subtitle: 'Avaliação clínica prévia', color: 'border-blue-400' },
  { id: 'scheduled', title: '3. Consulta Agendada', subtitle: 'Com confirmação ativa', color: 'border-cyan-400' },
  { id: 'proposal', title: '4. Proposta / Plano', subtitle: 'Orçamento apresentado', color: 'border-purple-400' },
  { id: 'in_treatment', title: '5. Em Tratamento', subtitle: 'Execução clínica 3D', color: 'border-emerald-400' },
  { id: 'followup_retained', title: '6. Pós-Op & Retenção', subtitle: 'Follow-up WhatsApp ativo', color: 'border-teal-400' },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-01',
    patientId: 'pt-102',
    patientName: 'Dr. Roberto Silveira',
    patientPhone: '+55 11 97120-9944',
    date: '2026-10-12',
    time: '14:30',
    durationMinutes: 90,
    dentist: 'Dr. Lucas Sampaio',
    procedure: 'Cirurgia Guiada de Implante & Provisório Imediato (El. 21)',
    status: 'confirmed',
    reminderSent: true,
    channel: 'sms',
    smsStatus: 'respondido',
    smsSentAt: '2026-10-11 08:30:14',
    smsDeliveredAt: '2026-10-11 08:30:18',
    smsMessageContent: 'OdontoMind: Dr. Roberto, sua cirurgia com Dr. Lucas é amanhã às 14:30. Responda 1 p/ confirmar ou 2 p/ reagendar.',
    smsProviderId: 'SMS-ZNV-884920'
  },
  {
    id: 'apt-02',
    patientId: 'pt-103',
    patientName: 'Beatriz Vasconcelos',
    patientPhone: '+55 11 99318-7750',
    date: '2026-10-15',
    time: '16:00',
    durationMinutes: 60,
    dentist: 'Dra. Camila Alencar',
    procedure: 'Sessão de Prova de Mock-up e Cor das Lentes Cerâmicas',
    status: 'confirmed',
    reminderSent: true,
    channel: 'sms',
    smsStatus: 'entregue',
    smsSentAt: '2026-10-14 09:15:02',
    smsDeliveredAt: '2026-10-14 09:15:05',
    smsMessageContent: 'OdontoMind: Olá Beatriz! Sua consulta com Dra. Camila está confirmada p/ 15/10 às 16:00. Endereço: Av. Paulista, 1000 cj 120.',
    smsProviderId: 'SMS-TWL-992143'
  },
  {
    id: 'apt-03',
    patientId: 'pt-105',
    patientName: 'Juliana Mendes Rocha',
    patientPhone: '+55 11 97654-3210',
    date: '2026-10-22',
    time: '10:00',
    durationMinutes: 45,
    dentist: 'Dra. Camila Alencar',
    procedure: 'Escaneamento de Controle e Entrega de Novos Alinhadores',
    status: 'pending',
    reminderSent: false,
    channel: 'sms',
    smsStatus: 'pendente',
    smsMessageContent: 'OdontoMind: Juliana, lembrete de consulta ortodôntica em 22/10 às 10h. Traga seus alinhadores atuais.',
    smsProviderId: 'SMS-QUEUE-1049'
  },
  {
    id: 'apt-04',
    patientId: 'pt-101',
    patientName: 'Carolina Bittencourt',
    patientPhone: '+55 11 98452-1102',
    date: '2026-10-14',
    time: '11:00',
    durationMinutes: 50,
    dentist: 'Dra. Camila Alencar',
    procedure: 'Consulta Inicial de Avaliação Ortodôntica com Scanner 3D',
    status: 'pending',
    reminderSent: true,
    channel: 'sms',
    smsStatus: 'enviado',
    smsSentAt: '2026-10-13 14:00:10',
    smsMessageContent: 'OdontoMind: Carolina, sua avaliação 3D com Dra. Camila é amanhã às 11:00. Confirme respondendo SIM.',
    smsProviderId: 'SMS-ZNV-885102'
  },
  {
    id: 'apt-05',
    patientId: 'pt-106',
    patientName: 'Marcos Vinícius Prado',
    patientPhone: '+55 11 96541-8899',
    date: '2026-10-17',
    time: '09:30',
    durationMinutes: 30,
    dentist: 'Dr. Lucas Sampaio',
    procedure: 'Remoção de Pontos e Avaliação de Cicatrização Pós-Siso',
    status: 'confirmed',
    reminderSent: true,
    channel: 'sms',
    smsStatus: 'falha',
    smsSentAt: '2026-10-16 11:45:00',
    smsMessageContent: 'OdontoMind: Marcos, retorno pós-operatório agendado para 17/10 às 09:30 com Dr. Lucas.',
    smsProviderId: 'SMS-ERR-7721'
  }
];

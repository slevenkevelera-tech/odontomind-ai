import { AutomationSkill, AutomationExecutionLog } from '../types';

export const initialAutomationSkills: AutomationSkill[] = [
  {
    id: 'skill-no-show-24h-2h',
    name: 'Lembrete Anti-Falta 24h & 2h com Confirmação em 1-Clique',
    tagline: 'Reduz o no-show em até 45% com confirmação ativa via WhatsApp e SMS de contingência',
    category: 'Anti-Falta (No-Show)',
    description: 'Dispara lembrete amigável 24 horas antes da consulta com instruções de preparo (jejum, medicação, raio-x), link do Google Maps/Waze da clínica e botões de confirmação. Se não respondido em 4 horas, envia SMS de redundância.',
    icon: 'CalendarClock',
    accentColor: 'from-amber-500 to-orange-500',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    enabled: true,
    trigger: '24h_before_appointment',
    triggerLabel: '24 horas antes da consulta agendada',
    channels: ['whatsapp', 'sms'],
    executionCount: 342,
    successRate: 98.2,
    croSafe: true,
    croRuleRef: 'Resolução CFO 196/2019 - Art. 3º',
    croNote: 'Comunicação direta com paciente já cadastrado; informativa, sem promessas de resultado ou mercantilismo.',
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'trigger',
        title: 'Gatilho Temporal (Cron)',
        description: 'Detecta consultas nas próximas 24h com status "pending"',
        badge: 'Gatilho Automático'
      },
      {
        id: 'step-2',
        order: 2,
        type: 'ai_generation',
        title: 'Geração Personalizada com Gemini IA',
        description: 'Compõe a mensagem adaptando nome do paciente, dentista, procedimento e recomendações clínicas específicas',
        badge: 'IA Gemini'
      },
      {
        id: 'step-3',
        order: 3,
        type: 'action',
        title: 'Disparo via WhatsApp Webhook API',
        description: 'Envia mensagem com botões interativos: [1 - Confirmar] | [2 - Reagendar]',
        badge: 'WhatsApp'
      },
      {
        id: 'step-4',
        order: 4,
        type: 'condition',
        title: 'Filtro de Contingência (Fallback SMS)',
        description: 'Caso não haja confirmação em 4 horas, dispara SMS transacional automático',
        badge: 'SMS Gateway'
      }
    ],
    template: {
      systemPrompt: 'Gere um lembrete humanizado e acolhedor de consulta odontológica para envio 24h antes. Seja claro quanto ao horário, pontualidade e endereço, oferecendo confirmação simples.',
      samplePatient: 'Carolina Bittencourt',
      previewMessage: 'Olá Carolina! 👋 Amanhã às 14:30 você tem consulta de alinhadores com a Dra. Camila Alencar na OdontoMind AI. Endereço: Av. Paulista, 1000 - Cj. 1202. Podemos confirmar sua presença? Responda SIM ou NÃO.',
      actionButtons: ['Confirmar Presença (Sim)', 'Pedir Reagendamento', 'Abrir Mapa / Como Chegar']
    },
    metrics: {
      savedHours: 24,
      recoveredRevenue: 18400,
      impactLabel: 'Redução de No-Show',
      impactValue: '-43%'
    }
  },
  {
    id: 'skill-post-op-care',
    name: 'Monitoramento Pós-Operatório & Escala de Dor (24h e 72h)',
    tagline: 'Acompanhamento clínico humanizado pós-cirurgias, implantes e endodontia com alerta vermelho',
    category: 'Clínico & Pós-Op',
    description: 'Envia mensagem atenciosa nas primeiras 24h e 72h após procedimentos invasivos. Pergunta sobre nível de dor (0 a 10), sangramento e medicação. Se a dor for informada acima de 6, dispara alerta de prioridade máxima no painel do dentista.',
    icon: 'Activity',
    accentColor: 'from-emerald-500 to-teal-500',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    enabled: true,
    trigger: 'post_procedure_24h',
    triggerLabel: '24h após finalização de procedimento cirúrgico',
    channels: ['whatsapp', 'clinical_alert'],
    executionCount: 187,
    successRate: 99.4,
    croSafe: true,
    croRuleRef: 'Código de Ética Odontológica - Art. 11 (Cuidado Continuado)',
    croNote: 'O dever de vigilância pós-operatória é respaldado pelo CRO e valorizado como excelência clínica.',
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'trigger',
        title: 'Gatilho de Finalização Clínica',
        description: 'Dentista marca procedimento como "Concluído" no prontuário (Ex: Implante ou Extração)',
        badge: 'Prontuário'
      },
      {
        id: 'step-2',
        order: 2,
        type: 'delay',
        title: 'Janela de Repouso (24 horas)',
        description: 'Aguarda o dia seguinte às 09:30 da manhã para não incomodar no repouso noturno',
        badge: 'Temporizador'
      },
      {
        id: 'step-3',
        order: 3,
        type: 'ai_generation',
        title: 'Mensagem Empática com Instruções',
        description: 'Reforça cuidados com gelo, higiene e remédios receitados pelo Dr(a)',
        badge: 'IA Gemini'
      },
      {
        id: 'step-4',
        order: 4,
        type: 'condition',
        title: 'Análise de Sentimento & Escala de Dor',
        description: 'Se resposta indicar dor forte ou hemorragia, abre notificação urgente para o dentista',
        badge: 'Triagem Ativa'
      }
    ],
    template: {
      systemPrompt: 'Gere uma mensagem calorosa pós-operatória odontológica, perguntando gentilmente como o paciente dormiu, orientando sobre medicação prescrita e pedindo para avaliar o desconforto de 0 a 10.',
      samplePatient: 'Dr. Roberto Silveira',
      previewMessage: 'Olá Roberto! Aqui é da equipe do Dr. Marcelo na OdontoMind. Passando para saber como você passou a noite após o implante ontem? Como está o inchaço e a mastigação? Lembre-se do gelo local e dos horários da medicação. Qualquer desconforto, estamos aqui!',
      actionButtons: ['Estou sem dor / 100% bem', 'Desconforto leve suportável', 'Preciso de orientação do Dr.']
    },
    metrics: {
      savedHours: 19,
      recoveredRevenue: 9200,
      impactLabel: 'Satisfação Pós-Op',
      impactValue: '99.2%'
    }
  },
  {
    id: 'skill-recall-preventive-180d',
    name: 'Recall Preventivo & Checkup Semestral de Profilaxia',
    tagline: 'Resgate automático de pacientes inativos há mais de 180 dias com foco em saúde e longevidade do sorriso',
    category: 'Retenção & LTV',
    description: 'Varre o histórico de tratamentos. Quando completa 6 meses desde a última limpeza, profilaxia ou controle periodontal, dispara um contato carinhoso destacando a importância da prevenção para manter as garantias dos tratamentos.',
    icon: 'Sparkles',
    accentColor: 'from-cyan-500 to-blue-500',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    enabled: true,
    trigger: 'patient_inactive_180d',
    triggerLabel: '180 dias após última profilaxia / procedimento',
    channels: ['whatsapp', 'email'],
    executionCount: 512,
    successRate: 94.8,
    croSafe: true,
    croRuleRef: 'CFO Resolução 196/2019 - Odontologia Preventiva',
    croNote: 'Comunicação focada em prevenção e saúde bucal; proibida oferta de serviços gratuitos ou sorteios.',
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'trigger',
        title: 'Varredura Semestral de Inatividade',
        description: 'Localiza pacientes cuja última visita ocorreu há 180+ dias',
        badge: 'Varredura CRM'
      },
      {
        id: 'step-2',
        order: 2,
        type: 'condition',
        title: 'Verificação de Consentimento LGPD & CRO',
        description: 'Valida se o paciente aceitou receber lembretes preventivos em suas preferências',
        badge: 'Filtro LGPD'
      },
      {
        id: 'step-3',
        order: 3,
        type: 'ai_generation',
        title: 'Personalização com Base no Prontuário',
        description: 'Cita o tratamento anterior (ex: facetas, orto ou implantes) para reforçar a garantia e higiene',
        badge: 'IA Gemini'
      },
      {
        id: 'step-4',
        order: 4,
        type: 'action',
        title: 'Convite para Checkup com Scanner 3D',
        description: 'Envia agenda simplificada com opções de horários na grade da recepção',
        badge: 'Agendamento Ágil'
      }
    ],
    template: {
      systemPrompt: 'Gere um convite preventivo semestral elegante para um paciente de clínica odontológica moderna. Foque na conservação da saúde periodontal e longevidade dos procedimentos.',
      samplePatient: 'Juliana Mendes',
      previewMessage: 'Olá Juliana! Já se passaram 6 meses desde a sua última profilaxia e limpeza na OdontoMind AI. Para manter seu sorriso radiante e prevenir tártaro, nossa equipe reservou alguns horários nesta quinta e sexta para seu checkup semestral com scanner 3D. Gostaria de agendar?',
      actionButtons: ['Ver Horários Disponíveis', 'Já fiz em outro local', 'Lembrar no próximo mês']
    },
    metrics: {
      savedHours: 32,
      recoveredRevenue: 27800,
      impactLabel: 'Reativação de LTV',
      impactValue: '+34%'
    }
  },
  {
    id: 'skill-budget-recovery',
    name: 'Recuperação Ética de Orçamentos Pendentes (High-Ticket)',
    tagline: 'Reativação sutil e esclarecedora para planos de tratamento de Ortodontia e Implantes sem resposta há 7 dias',
    category: 'Captação & Vendas',
    description: 'Identifica pacientes que passaram pela consulta de avaliação, receberam plano de tratamento (Invisalign, Próteses, Harmonização) e não responderam em 7 dias. Envia material educativo sobre a tecnologia usada e convida para sanar dúvidas.',
    icon: 'CreditCard',
    accentColor: 'from-violet-500 to-purple-500',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    enabled: true,
    trigger: 'proposal_pending_7d',
    triggerLabel: '7 dias após emissão da proposta sem assinatura',
    channels: ['whatsapp'],
    executionCount: 164,
    successRate: 91.5,
    croSafe: true,
    croRuleRef: 'CFO Resolução 196/2019 - Proibição de Mercantilização Agressiva',
    croNote: 'Abordagem consultiva focada em esclarecer dúvidas clínicas e flexibilidade de pagamento, sem leilão de preços.',
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'trigger',
        title: 'Estágio do Funil de Vendas: Proposta Apresentada',
        description: 'Disparado quando paciente permanece mais de 7 dias na coluna de Proposta',
        badge: 'Funil de Vendas'
      },
      {
        id: 'step-2',
        order: 2,
        type: 'ai_generation',
        title: 'Elaboração de Resposta Personalizada',
        description: 'Destaca o benefício do tratamento escolhido (ex: alinhamento rápido, conforto estético)',
        badge: 'IA Gemini'
      },
      {
        id: 'step-3',
        order: 3,
        type: 'action',
        title: 'Envio de Vídeo/Guia Clínico Explicativo',
        description: 'Anexa link seguro do simulador 3D do sorriso para reencantar o paciente',
        badge: 'Mídia Educativa'
      }
    ],
    template: {
      systemPrompt: 'Gere uma mensagem de follow-up ético para paciente que recebeu orçamento odontológico há 1 semana. Não faça pressão comercial; mostre-se à disposição para explicar o plano de tratamento e condições facilitadas.',
      samplePatient: 'Mariana Siqueira',
      previewMessage: 'Olá Mariana! A Dra. Camila pediu para entrar em contato para saber se você ficou com alguma dúvida sobre o planejamento digital dos seus alinhadores. Sabemos que é uma decisão importante! Caso queira rever a simulação 3D ou entender o parcelamento em até 18x sem juros, estamos à sua disposição.',
      actionButtons: ['Tirar Dúvidas com a Dra.', 'Ver Opções de Pagamento', 'Agora não é o momento']
    },
    metrics: {
      savedHours: 15,
      recoveredRevenue: 43500,
      impactLabel: 'Conversão de Propostas',
      impactValue: '+28%'
    }
  },
  {
    id: 'skill-nps-google-review',
    name: 'Coleta de NPS & Avaliação 5 Estrelas no Google Meu Negócio',
    tagline: 'Disparo 2 horas após a consulta: captação de depoimentos orgânicos e triagem de satisfação',
    category: 'Retenção & LTV',
    description: 'Envia pesquisa rápida de 1 clique (escala 0 a 10). Se o paciente responde 9 ou 10, convida com link direto para deixar uma avaliação 5 estrelas no Google Maps da clínica. Se a nota for <= 6, notifica a gerência imediatamente para acolhimento.',
    icon: 'Star',
    accentColor: 'from-yellow-500 to-amber-500',
    badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    enabled: true,
    trigger: 'nps_feedback_received',
    triggerLabel: '2 horas após consulta concluída',
    channels: ['whatsapp', 'sms'],
    executionCount: 420,
    successRate: 96.7,
    croSafe: true,
    croRuleRef: 'Resolução CFO 196/2019 - Depoimentos Espontâneos de Pacientes',
    croNote: 'Permite avaliação voluntária em plataformas públicas como Google, sem promessa de recompensa ou brindes.',
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'trigger',
        title: 'Finalização do Atendimento',
        description: 'Dispara 2 horas após o paciente sair da clínica',
        badge: 'Temporizador'
      },
      {
        id: 'step-2',
        order: 2,
        type: 'action',
        title: 'Enquete de Satisfação em 1 Toque',
        description: 'Botões numéricos de 1 a 10 no WhatsApp para resposta sem atrito',
        badge: 'Pesquisa NPS'
      },
      {
        id: 'step-3',
        order: 3,
        type: 'condition',
        title: 'Bifurcação Inteligente (Promotor vs Detrator)',
        description: 'Se nota 9-10 ➔ Link Google Review. Se nota < 7 ➔ Alerta Gerente de Relacionamento',
        badge: 'Lógica Condicional'
      }
    ],
    template: {
      systemPrompt: 'Gere uma mensagem de agradecimento pelo atendimento e solicitação gentil de nota de 0 a 10 pelo cuidado recebido na clínica odontológica.',
      samplePatient: 'Fernando Gusmão',
      previewMessage: 'Olá Fernando! Foi um prazer recebê-lo hoje na OdontoMind AI. Para continuarmos aprimorando nosso cuidado, em uma escala de 0 a 10, como você avalia sua experiência com nossa equipe hoje?',
      actionButtons: ['Nota 10 - Excelente!', 'Nota 8 a 9 - Muito Bom', 'Nota abaixo de 7 - Precisa Melhorar']
    },
    metrics: {
      savedHours: 12,
      recoveredRevenue: 14200,
      impactLabel: 'Reviews 5 Estrelas',
      impactValue: '+142 reviews'
    }
  },
  {
    id: 'skill-smart-triage-intake',
    name: 'Triagem Clínica 24/7 & Anamnese Ativa por IA',
    tagline: 'Qualificação instantânea de sintomas de novos leads via WhatsApp com classificação de urgência',
    category: 'Captação & Vendas',
    description: 'Recebe novos contatos mesmo fora do horário comercial. Faz perguntas clínicas estruturadas (tipo de dor, histórico médico, alergias a anestésicos), calcula a urgência (baixa, média, alta, emergência) e pré-preenche a ficha clínica para o dentista.',
    icon: 'Stethoscope',
    accentColor: 'from-rose-500 to-pink-500',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    enabled: true,
    trigger: 'appointment_scheduled',
    triggerLabel: 'Imediatamente após novo lead ou mensagem no WhatsApp',
    channels: ['whatsapp', 'clinical_alert'],
    executionCount: 680,
    successRate: 97.9,
    croSafe: true,
    croRuleRef: 'Resolução CFO 226/2020 - Teleodontologia e Triagem Pré-Clínica',
    croNote: 'Válido exclusivamente para triagem administrativa e anamnese preliminar; o diagnóstico formal é presencial.',
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'trigger',
        title: 'Novo Contato Entrante',
        description: 'Lead chega por Instagram, Google Ads ou formulário do site',
        badge: 'Entrada Omnichannel'
      },
      {
        id: 'step-2',
        order: 2,
        type: 'ai_generation',
        title: 'Árvore de Decisão Clínica Gemini',
        description: 'Identifica queixa principal: dor aguda, estética, clareamento ou prótese quebrada',
        badge: 'IA Gemini'
      },
      {
        id: 'step-3',
        order: 3,
        type: 'condition',
        title: 'Classificação de Urgência de Manchester',
        description: 'Se houver trauma ou dor latejante ➔ Sinaliza Encaixe de Emergência no dia',
        badge: 'Protocolo de Urgência'
      },
      {
        id: 'step-4',
        order: 4,
        type: 'action',
        title: 'Registro no Prontuário & Notificação',
        description: 'Salva os dados no CRM e encaminha para a recepção agendar na cadeira adequada',
        badge: 'Integração CRM'
      }
    ],
    template: {
      systemPrompt: 'Você é a IA de triagem clínica prévia da OdontoMind AI. Acolha o paciente com respeito, pergunte o motivo da consulta e investigue dor ou desconforto de forma empática.',
      samplePatient: 'Aline Pires',
      previewMessage: 'Olá! Sou a assistente digital da OdontoMind AI. Bem-vinda! Para prepararmos seu atendimento com a máxima segurança, você está sentindo algum desconforto ou dor no momento, ou seu foco é uma consulta de estética/avaliação de rotina?',
      actionButtons: ['Estou com dor / Emergência', 'Quero Alinhar meus Dentes', 'Estética & Facetas', 'Limpeza / Prevenção']
    },
    metrics: {
      savedHours: 41,
      recoveredRevenue: 36000,
      impactLabel: 'Tempo de Resposta',
      impactValue: '< 15 segundos'
    }
  },
  {
    id: 'skill-birthday-wellness',
    name: 'Felicitações de Aniversário & Saúde da Família',
    tagline: 'Fortalecimento de vínculo afetivo com felicitações personalizadas e convite cortês para a família',
    category: 'Retenção & LTV',
    description: 'No dia do aniversário do paciente cadastrado, envia mensagem carinhosa de parabéns assinada pelo dentista titular. Sem mercantilismo, convida a celebrar a data com um sorriso radiante e estende carinho à saúde bucal da família.',
    icon: 'HeartHandshake',
    accentColor: 'from-teal-500 to-cyan-500',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    enabled: true,
    trigger: 'patient_birthday',
    triggerLabel: '09h00 no dia de aniversário do paciente',
    channels: ['whatsapp'],
    executionCount: 215,
    successRate: 100,
    croSafe: true,
    croRuleRef: 'CFO Resolução 196/2019 - Relação Dentista-Paciente',
    croNote: 'Felicitação cordial sem sorteios ou cupons comerciais de desconto, preservando o decoro profissional.',
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'trigger',
        title: 'Gatilho de Data de Nascimento',
        description: 'Verificação diária às 08h30 dos aniversariantes do dia',
        badge: 'Gatilho Calendário'
      },
      {
        id: 'step-2',
        order: 2,
        type: 'ai_generation',
        title: 'Mensagem Afetuosa Personalizada',
        description: 'Assinada pelo dentista que habitualmente cuida do paciente',
        badge: 'IA Gemini'
      },
      {
        id: 'step-3',
        order: 3,
        type: 'action',
        title: 'Disparo via WhatsApp',
        description: 'Envio no horário nobre da manhã com cartão digital de felicitações',
        badge: 'WhatsApp'
      }
    ],
    template: {
      systemPrompt: 'Gere uma mensagem de aniversário calorosa e sincera para um paciente de clínica odontológica de alta reputação, desejando saúde, realizações e muitos motivos para sorrir.',
      samplePatient: 'Carolina Bittencourt',
      previewMessage: 'Parabéns Carolina! 🎉 Toda a equipe da OdontoMind AI e a Dra. Camila Alencar desejam um aniversário repleto de alegrias, saúde e motivos para sorrir muito! É uma honra cuidar do seu sorriso.',
      actionButtons: ['Agradecer à Equipe', 'Agendar Checkup Anual']
    },
    metrics: {
      savedHours: 8,
      recoveredRevenue: 8500,
      impactLabel: 'Engajamento Afetivo',
      impactValue: '98% respostas'
    }
  },
  {
    id: 'skill-external-webhook-sync',
    name: 'Sincronização em Tempo Real via Webhook (n8n, Make, CRM & ERP)',
    tagline: 'Disparo bidirecional de eventos para automações no Zapier, n8n, ActiveCampaign, RD Station e ERPs',
    category: 'Integração & Webhooks',
    description: 'Envia dados criptografados em tempo real (JSON webhook) a cada nova consulta, troca de estágio de pipeline ou confirmação de paciente. Permite integrar com prontuários de terceiros (Simples Dental, Clinicorp) e plataformas de marketing.',
    icon: 'Webhook',
    accentColor: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    enabled: true,
    trigger: 'webhook_inbound',
    triggerLabel: 'A cada evento de criação/atualização no CRM',
    channels: ['webhook'],
    executionCount: 1240,
    successRate: 99.8,
    croSafe: true,
    croRuleRef: 'LGPD Lei 13.709/2018 - Segurança de Dados Clínicos',
    croNote: 'Transmissão com HMAC SHA-256 e anonimização de dados sensíveis médicos.',
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'trigger',
        title: 'Evento Clínico Disparador',
        description: 'Ex: "Paciente Moveu para Consulta Agendada"',
        badge: 'Evento Sistema'
      },
      {
        id: 'step-2',
        order: 2,
        type: 'condition',
        title: 'Assinatura Criptográfica HMAC',
        description: 'Gera cabeçalho x-odontomind-signature para validação de segurança',
        badge: 'Segurança'
      },
      {
        id: 'step-3',
        order: 3,
        type: 'action',
        title: 'POST HTTP Seguro para Endpoint Externo',
        description: 'Dispara payload para URLs configuradas (n8n / Make / Zapier)',
        badge: 'Webhook POST'
      }
    ],
    template: {
      systemPrompt: 'Gere um payload JSON de webhook clínico compatível com ferramentas modernas de automação.',
      samplePatient: 'Dr. Roberto Silveira',
      previewMessage: '{\n  "event": "appointment.confirmed",\n  "timestamp": "2026-10-18T14:30:00Z",\n  "patient": {\n    "id": "pt-102",\n    "name": "Dr. Roberto Silveira",\n    "phone": "+55 11 97120-9944",\n    "procedure": "Implante Guiado Carga Imediata",\n    "dentist": "Dr. Marcelo Ribeiro"\n  },\n  "status": "confirmed"\n}',
      actionButtons: ['Testar Envio HTTP', 'Copiar Payload JSON', 'Ver Logs de Resposta']
    },
    metrics: {
      savedHours: 48,
      recoveredRevenue: 52000,
      impactLabel: 'Eventos Processados',
      impactValue: '1.24k eventos'
    }
  }
];

export const sampleExecutionLogs: AutomationExecutionLog[] = [
  {
    id: 'log-101',
    skillId: 'skill-no-show-24h-2h',
    skillName: 'Lembrete Anti-Falta 24h & 2h',
    patientName: 'Carolina Bittencourt',
    patientPhone: '+55 11 98452-1102',
    timestamp: 'Hoje, às 09:14',
    channel: 'whatsapp',
    status: 'resposta_recebida',
    triggerReason: 'Consulta agendada para amanhã às 14:30',
    generatedContent: 'Olá Carolina! 👋 Amanhã às 14:30 você tem consulta de alinhadores com a Dra. Camila Alencar na OdontoMind AI. Podemos confirmar sua presença? Responda SIM ou NÃO.',
    response: 'Confirmadíssimo! Chegarei 10 minutinhos antes.',
    aiModelUsed: 'gemini-3.8-flash',
    executionTimeMs: 412
  },
  {
    id: 'log-102',
    skillId: 'skill-post-op-care',
    skillName: 'Monitoramento Pós-Operatório & Escala de Dor',
    patientName: 'Dr. Roberto Silveira',
    patientPhone: '+55 11 97120-9944',
    timestamp: 'Hoje, às 08:30',
    channel: 'whatsapp',
    status: 'resposta_recebida',
    triggerReason: '24h pós cirurgia de Implante Guiado Carga Imediata',
    generatedContent: 'Olá Roberto! Como passou a noite após o implante ontem? Como está o inchaço e a mastigação? Lembre-se do gelo local e da medicação. Qualquer desconforto, estamos à disposição!',
    response: 'Passei bem, quase sem inchaço. Nota de desconforto 2/10. Obrigado pelo carinho!',
    aiModelUsed: 'gemini-3.8-flash',
    executionTimeMs: 388
  },
  {
    id: 'log-103',
    skillId: 'skill-recall-preventive-180d',
    skillName: 'Recall Preventivo & Checkup Semestral',
    patientName: 'Juliana Mendes',
    patientPhone: '+55 11 99341-2287',
    timestamp: 'Ontem, às 16:45',
    channel: 'whatsapp',
    status: 'enviado',
    triggerReason: '182 dias desde a última profilaxia periodontal',
    generatedContent: 'Olá Juliana! Já se passaram 6 meses desde seu último checkup na OdontoMind AI. Que tal agendar sua profilaxia preventiva semestral com scanner 3D nesta semana?',
    response: 'Oi! Quero sim, vocês têm horário na sexta à tarde?',
    aiModelUsed: 'gemini-3.8-flash',
    executionTimeMs: 450
  },
  {
    id: 'log-104',
    skillId: 'skill-budget-recovery',
    skillName: 'Recuperação Ética de Orçamentos Pendentes',
    patientName: 'Mariana Siqueira',
    patientPhone: '+55 11 96512-8877',
    timestamp: 'Ontem, às 11:20',
    channel: 'whatsapp',
    status: 'aguardando_resposta',
    triggerReason: 'Orçamento de Facetas em Resina (R$ 9.800) sem retorno há 7 dias',
    generatedContent: 'Olá Mariana! A Dra. Camila pediu para saber se você ficou com alguma dúvida sobre o planejamento do seu novo sorriso. Caso queira conversar sobre opções facilitadas de parcelamento, estamos à disposição!',
    aiModelUsed: 'gemini-3.8-flash',
    executionTimeMs: 395
  },
  {
    id: 'log-105',
    skillId: 'skill-external-webhook-sync',
    skillName: 'Sincronização em Tempo Real via Webhook',
    patientName: 'Carolina Bittencourt',
    patientPhone: '+55 11 98452-1102',
    timestamp: 'Hoje, às 09:16',
    channel: 'webhook',
    status: 'executado',
    triggerReason: 'Disparo de evento appointment.confirmed para endpoint n8n',
    generatedContent: 'HTTP 200 OK - Webhook entregue com sucesso em https://webhook.site/clinic-n8n (latência 142ms)',
    aiModelUsed: 'webhook-engine',
    executionTimeMs: 142
  }
];

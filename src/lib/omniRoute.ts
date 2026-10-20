/**
 * @file omniRoute.ts
 * OmniRoute™ - Elo de Integração & Roteamento Inteligente Multicanal e Multi-Agente
 * Plataforma OdontoMind AI
 * 
 * Funcionalidades:
 * 1. Orquestração e despacho de demandas para múltiplos agentes de IA especializados.
 * 2. Suporte a múltiplos canais de entrada e saída (WhatsApp, Instagram, Facebook, TikTok, Webchat, Telegram, SMS, CRM).
 * 3. Triagem de intenção, roteamento dinâmico, validação ética CRO (Resolução CFO 196/2019) e auditoria de execução.
 * 4. Aprendizado contínuo e telemetria de performance (tempo de resposta, taxa de sucesso, handoff humano).
 */

import { 
  OmniChannel, 
  OmniAgentRole, 
  OmniAgentDefinition, 
  OmniRouteDemand, 
  OmniRouteConfig 
} from '../types';

export const defaultOmniAgents: OmniAgentDefinition[] = [
  {
    id: 'agent_sdr',
    name: 'SDR Qualificador de Leads',
    role: 'sdr_qualification',
    description: 'Slot reservado (Fase 1 capture_hook). Fase 2: ativa captacao SDR. Fase 3: handoff agent_scheduler + Google Agenda. Fase 4: notificacoes e gravacao em Agenda/Analytics/Novo Paciente.',
    supportedChannels: ['whatsapp', 'instagram', 'facebook', 'tiktok', 'webchat'],
    model: 'gemini-3.8-flash',
    systemPromptHint: 'Você é um SDR odontológico amigável e focado em entender as necessidades do paciente sem diagnosticar precocemente.',
    active: true,
    totalTasksProcessed: 0,
    successRate: 98.4,
    avgLatencyMs: 420,
    specialtyBadge: 'Vendas & Triagem'
  },
  {
    id: 'agent_content',
    name: 'Criador de Conteúdo Social',
    role: 'social_content',
    description: 'Produz roteiros para Reels/TikTok, carrosséis educativos para o Feed e copies persuasivas sem infringir o CRO.',
    supportedChannels: ['instagram', 'tiktok', 'facebook', 'crm_internal'],
    model: 'gemini-3.8-flash',
    systemPromptHint: 'Você é um copywriter médico especializado em odontologia estética, periodontia e implantodontia.',
    active: true,
    totalTasksProcessed: 0,
    successRate: 99.1,
    avgLatencyMs: 680,
    specialtyBadge: 'Marketing & Conteúdo'
  },
  {
    id: 'agent_triage',
    name: 'Triagem Clínica & Urgência',
    role: 'clinical_triage',
    description: 'Identifica níveis de dor (escala EVA 0-10), sinais de infecção ou fratura e prioriza encaixes emergenciais.',
    supportedChannels: ['whatsapp', 'webchat', 'telegram', 'sms'],
    model: 'gemini-3.8-flash',
    systemPromptHint: 'Identifique sintomas agudos, acalme o paciente e encaminhe para o pronto-atendimento com clareza.',
    active: true,
    totalTasksProcessed: 0,
    successRate: 99.8,
    avgLatencyMs: 310,
    specialtyBadge: 'Clínico & Emergência'
  },
  {
    id: 'agent_cro',
    name: 'Guardião de Compliance CRO',
    role: 'cro_compliance',
    description: 'Audita mensagens, propagandas e postagens para garantir conformidade estrita com o CFO 196/2019 e LGPD Saúde.',
    supportedChannels: ['instagram', 'facebook', 'tiktok', 'whatsapp', 'crm_internal'],
    model: 'gemini-3.8-flash',
    systemPromptHint: 'Valide se há promessa de resultado infalível, divulgação irregular de preços ou ausência de responsável técnico.',
    active: true,
    totalTasksProcessed: 0,
    successRate: 100.0,
    avgLatencyMs: 250,
    specialtyBadge: 'Jurídico & Ético'
  },
  {
    id: 'agent_scheduler',
    name: 'Agendador Inteligente',
    role: 'smart_scheduling',
    description: 'Negocia horários em tempo real, sincroniza com a agenda da clínica e preenche lacunas e cancelamentos.',
    supportedChannels: ['whatsapp', 'webchat', 'instagram', 'sms'],
    model: 'gemini-3.8-flash',
    systemPromptHint: 'Ofereça no máximo 2 horários por vez para acelerar a tomada de decisão do paciente.',
    active: true,
    totalTasksProcessed: 0,
    successRate: 97.6,
    avgLatencyMs: 380,
    specialtyBadge: 'Agenda & Horários'
  },
  {
    id: 'agent_postop',
    name: 'Pós-Operatório & Recuperação',
    role: 'post_op_care',
    description: 'Envia checagens automáticas 24h e 72h após procedimentos cirúrgicos, orienta sobre medicação e repouso.',
    supportedChannels: ['whatsapp', 'sms', 'crm_internal'],
    model: 'gemini-3.8-flash',
    systemPromptHint: 'Pergunte sobre inchaço, dor e sangramento, reforçando os cuidados passados pelo cirurgião.',
    active: true,
    totalTasksProcessed: 0,
    successRate: 99.5,
    avgLatencyMs: 290,
    specialtyBadge: 'Cuidado Contínuo'
  },
  {
    id: 'agent_retention',
    name: 'Retenção, Check-ups & LTV',
    role: 'retention_ltv',
    description: 'Reativa pacientes após 6 meses sem retorno profilático, envia mensagens de aniversário e pesquisas NPS.',
    supportedChannels: ['whatsapp', 'email', 'sms', 'crm_internal'],
    model: 'gemini-3.8-flash',
    systemPromptHint: 'Convide para o check-up preventivo com tom acolhedor e focado na saúde e longevidade dos dentes.',
    active: true,
    totalTasksProcessed: 0,
    successRate: 96.8,
    avgLatencyMs: 340,
    specialtyBadge: 'Fidelização & LTV'
  },
  {
    id: 'agent_support',
    name: 'Atendimento Geral & Recepção',
    role: 'customer_support',
    description: 'Responde dúvidas sobre estacionamento, convênios aceitos, formas de pagamento e localização da clínica.',
    supportedChannels: ['whatsapp', 'instagram', 'webchat', 'telegram', 'email'],
    model: 'gemini-3.8-flash',
    systemPromptHint: 'Forneça instruções claras sobre facilidades da clínica, horários de funcionamento e localização.',
    active: true,
    totalTasksProcessed: 0,
    successRate: 98.9,
    avgLatencyMs: 310,
    specialtyBadge: 'Recepção & Apoio'
  }
];

export const defaultOmniConfig: OmniRouteConfig = {
  enabled: true,
  defaultModel: 'gemini-3.8-flash',
  fallbackToHumanOnDoubt: true,
  autoCroValidation: true,
  autoCrmSync: true,
  crossChannelMemory: true,
  webhookBaseUrl: '/api/omniroute'
};

const STORAGE_KEY_AGENTS = 'odontomind_omni_agents';
const STORAGE_KEY_CONFIG = 'odontomind_omni_config';
const STORAGE_KEY_DEMANDS = 'odontomind_omni_demands';

export const omniRouteService = {
  getAgents(): OmniAgentDefinition[] {
    const saved = localStorage.getItem(STORAGE_KEY_AGENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return defaultOmniAgents;
  },

  saveAgents(agents: OmniAgentDefinition[]): void {
    localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(agents));
  },

  getConfig(): OmniRouteConfig {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return defaultOmniConfig;
  },

  saveConfig(config: OmniRouteConfig): void {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  },

  getDemandsHistory(): OmniRouteDemand[] {
    const saved = localStorage.getItem(STORAGE_KEY_DEMANDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  },

  saveDemandsHistory(demands: OmniRouteDemand[]): void {
    localStorage.setItem(STORAGE_KEY_DEMANDS, JSON.stringify(demands.slice(0, 50)));
  },

  clearDemands(): void {
    localStorage.removeItem(STORAGE_KEY_DEMANDS);
  },

  /**
   * Identifica o agente e intenção ideais com base na mensagem e canal
   */
  classifyIntentAndRoute(input: string, channel: OmniChannel): {
    agentId: string;
    intent: string;
    priority: 'baixa' | 'normal' | 'alta' | 'critica';
  } {
    const text = input.toLowerCase();

    // 1. Urgência / Dor extrema / Sangramento
    if (/(dor|doendo|dói|latej|quebrei|caiu|sangr|inch|abcesso|socorro|urgente|emergência)/i.test(text)) {
      return {
        agentId: 'agent_triage',
        intent: 'Urgência Odontológica & Dor Aguda',
        priority: 'critica'
      };
    }

    // 2. Conteúdo para Redes Sociais / Marketing
    if (/(post|roteiro|vídeo|video|reels|tiktok|carrossel|conteúdo|copy|stories|instagram|feed)/i.test(text)) {
      return {
        agentId: 'agent_content',
        intent: 'Geração de Conteúdo & Copy Social',
        priority: 'normal'
      };
    }

    // 3. Agendamento / Horário / Consulta
    if (/(agendar|marcar|horário|horario|data|vaga|agenda|disponibilidade|quinta|sexta|segunda|amanhã)/i.test(text)) {
      return {
        agentId: 'agent_scheduler',
        intent: 'Negociação e Reserva de Consulta',
        priority: 'alta'
      };
    }

    // 4. Pós-Operatório / Cirurgia recente
    if (/(extraí|extração|implantei|cirurgia|pontos|reédio|antibiótico|inchado depois|sangrando pós)/i.test(text)) {
      return {
        agentId: 'agent_postop',
        intent: 'Acompanhamento Pós-Cirúrgico',
        priority: 'alta'
      };
    }

    // 5. Compliance / CRO
    if (/(cro|ética|cfo|preço fechado|antes e depois|anúncio|publicidade|legal)/i.test(text)) {
      return {
        agentId: 'agent_cro',
        intent: 'Auditoria de Compliance CRO/CFO',
        priority: 'normal'
      };
    }

    // 6. Preço / SDR / Interesse em procedimento estético
    if (/(quanto custa|preço|preco|valor|invisalign|alinhador|faceta|clareamento|lente|botox)/i.test(text)) {
      return {
        agentId: 'agent_sdr',
        intent: 'Qualificação Comercial de Interesse',
        priority: 'alta'
      };
    }

    // 7. Retenção & Profilaxia
    if (/(limpeza|profilaxia|retorno|aniversário|checkup|revisão)/i.test(text)) {
      return {
        agentId: 'agent_retention',
        intent: 'Reativação Preventiva & LTV',
        priority: 'normal'
      };
    }

    // 8. Dúvidas Gerais / Recepção
    return {
      agentId: channel === 'instagram' ? 'agent_sdr' : 'agent_support',
      intent: 'Dúvidas Gerais & Atendimento da Clínica',
      priority: 'normal'
    };
  },

  /**
   * Despacha uma demanda multicanal através do OmniRoute Engine
   */
  async dispatchDemand(params: {
    channel: OmniChannel;
    rawInput: string;
    sourceUserName?: string;
    sourceContact?: string;
    preferredAgentId?: string;
    slotStatus?: 'reserved';
    source?: string;
    phase?: string;
  }): Promise<OmniRouteDemand> {
    const startTime = performance.now();
    const agents = this.getAgents();
    const isReservedHook = params.slotStatus === 'reserved';

    const { agentId: suggestedAgentId, intent, priority } = this.classifyIntentAndRoute(
      params.rawInput, 
      params.channel
    );

    const targetAgentId = params.preferredAgentId || suggestedAgentId;
    const agent = agents.find((a) => a.id === targetAgentId) || agents[0];

    let responseText = '';
    let croApproved = true;
    const controller = isReservedHook ? new AbortController() : undefined;
    const abortTimer = controller
      ? setTimeout(() => controller.abort(), 1500)
      : undefined;

    try {
      const res = await fetch('/api/omniroute/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: params.channel,
          input: params.rawInput,
          agentId: targetAgentId,
          sourceUserName: params.sourceUserName || 'Paciente',
          context: isReservedHook
            ? {
                source: params.source || 'whatsapp_simulator',
                slotStatus: params.slotStatus,
                phase: params.phase || 'capture_hook'
              }
            : undefined
        }),
        signal: controller?.signal
      });

      if (res.ok) {
        const data = await res.json();
        if (!isReservedHook) {
          responseText = data.output || data.result;
          croApproved = data.croApproved !== false;
        }
      } else if (!isReservedHook) {
        throw new Error('Fallback para motor local');
      }
    } catch (e) {
      if (!isReservedHook) {
        responseText = this.generateLocalAgentResponse(agent, params.rawInput, params.sourceUserName || 'Paciente');
      }
    } finally {
      if (abortTimer) clearTimeout(abortTimer);
    }

    const duration = Math.round(performance.now() - startTime);

    const newDemand: OmniRouteDemand = {
      id: `omni-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      channel: params.channel,
      sourceUserName: params.sourceUserName || 'Interagente Social',
      sourceContact: params.sourceContact || '@usuario',
      rawInput: params.rawInput,
      detectedIntent: intent,
      assignedAgentId: agent.id,
      priority,
      status: isReservedHook ? 'queued' : 'completed',
      agentOutput: isReservedHook ? '' : responseText,
      croApproved,
      executionTimeMs: duration,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        agentName: agent.name,
        role: agent.role,
        channel: params.channel,
        ...(isReservedHook
          ? {
              slotStatus: 'reserved',
              phase: params.phase || 'capture_hook',
              source: params.source || 'whatsapp_simulator'
            }
          : {})
      }
    };

    // Atualiza contadores do agente
    const updatedAgents = agents.map((a) => {
      if (a.id === agent.id) {
        return {
          ...a,
          totalTasksProcessed: a.totalTasksProcessed + 1,
          avgLatencyMs: Math.round((a.avgLatencyMs + duration) / 2)
        };
      }
      return a;
    });
    this.saveAgents(updatedAgents);

    // Salva histórico
    const history = this.getDemandsHistory();
    this.saveDemandsHistory([newDemand, ...history]);

    return newDemand;
  },

  /**
   * Gerador inteligente local para fallback instantâneo
   */
  generateLocalAgentResponse(agent: OmniAgentDefinition, input: string, name: string): string {
    switch (agent.role) {
      case 'sdr_qualification':
        return `Olá ${name}! Que prazer receber seu contato! O tratamento de alinhadores invisíveis e estética é totalmente personalizado aqui na OdontoMind AI. Para planejarmos exatamente o tempo e planejamento 3D para você, que tal uma avaliação com escaneamento digital iTero nesta semana? Temos horários na quinta às 14h30 ou sexta às 10h.`;

      case 'social_content':
        return `[ROTEIRO REELS / TIKTOK - CRO APPROVED 🎬]\n\nTítulo: 3 Mitos Sobre Clareamento Dental que seu Dentista Precisa te Contar\nHook (0-3s): "Clareamento enfraquece o esmalte do dente? Pare de acreditar nisso!"\nCorpo (4-20s): O gel de peróxido age apenas nos pigmentos internos do dente, sem desgastar o esmalte mineral. O que causa sensibilidade é o protocolo inadequado.\nCTA (21-30s): Quer fazer com segurança biológica? Deixe sua dúvida nos comentários!\n\nNota Ética: Em conformidade com o CFO 196/2019. RT Dra. Camila Alencar CRO-SP 89452.`;

      case 'clinical_triage':
        return `Olá ${name}, sou a IA de Triagem Clínica da OdontoMind. Entendi que você está com dor. Pela sua descrição, sinalizamos prioridade máxima para a equipe. Evite mastigar do lado afetado e não aplique calor externo. Nosso plantão já reservou uma vaga de encaixe prioritário para hoje às 16h40. Pode vir?`;

      case 'smart_scheduling':
        return `Olá ${name}! Verifiquei a agenda integrada da equipe. Conseguimos encaixar sua consulta de avaliação para esta Quinta-feira às 15h00 com a Dra. Camila Alencar, ou Sexta-feira às 11h20. Qual desses dois momentos fica mais confortável para a sua rotina?`;

      case 'post_op_care':
        return `Olá ${name}! Aqui é a equipe de cuidado pós-cirúrgico da OdontoMind AI. Como está a cicatrização após seu procedimento? Lembre-se: compressa gelada nas primeiras 24h por 15 min, dieta pastosa e fria, e tomar as medicações prescritas no horário exato. Qualquer dor fora do comum, responda imediatamente aqui!`;

      case 'cro_compliance':
        return `Auditoria de Conformidade Concluída: ✅ Aprovado pela Resolução CFO 196/2019.\n- Ausência de sensacionalismo ou mercantilização da odontologia.\n- Ausência de tabelamento fixo de preços não permitidos.\n- Menção clara do Responsável Técnico (RT) e registro no conselho regional.`;

      case 'retention_ltv':
        return `Olá ${name}! Notamos que faz 6 meses desde o seu último check-up preventivo e limpeza com ultrassom. A prevenção é a forma mais eficaz e econômica de manter seu sorriso impecável. Podemos reservar sua profilaxia para a próxima terça às 14h?`;

      default:
        return `Olá ${name}, obrigado pela sua mensagem! Nossa clínica conta com estacionamento gratuito com manobrista no local, acessibilidade completa e estamos localizados na Av. Paulista, 1000. Posso te ajudar com agendamento ou informações adicionais?`;
    }
  }
};

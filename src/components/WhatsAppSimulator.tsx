import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatMessage, 
  MetaCloudApiConfig, 
  ClinicalTriageEvaluation, 
  AgentLearnedHeuristic, 
  AgentBrainState,
  ToastNotification 
} from '../types';
import { 
  initialMetaConfig, 
  initialAgentBrainState, 
  sampleMetaWebhooksPayloads 
} from '../data/metaAgentData';
import {
  triggerAiClinicalTriage,
  confirmAppointmentBooking,
  testMetaWebhookConnection,
  getRenderSyncInfo,
  resolveMetaWebhookPublicUrl
} from '../lib/metaWebhook';
import { omniRouteService } from '../lib/omniRoute';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  CheckCheck, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Brain, 
  Cpu, 
  Activity, 
  Check, 
  Copy, 
  Calendar, 
  UserCheck, 
  RefreshCw, 
  Settings, 
  Layers, 
  Stethoscope, 
  Lock, 
  Globe, 
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';

interface WhatsAppSimulatorProps {
  onAddToast?: (toast: ToastNotification) => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ onAddToast }) => {
  // Meta API Configuration State
  const [metaConfig, setMetaConfig] = useState<MetaCloudApiConfig>(() => {
    const saved = localStorage.getItem('odontomind_meta_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialMetaConfig;
  });

  // Agent Brain & Learning State
  const [brainState, setBrainState] = useState<AgentBrainState>(() => {
    const saved = localStorage.getItem('odontomind_agent_brain');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialAgentBrainState;
  });

  // Active view tab in the Right Intelligence Panel: 'telemetry' | 'brain' | 'meta_sync'
  const [activePanelTab, setActivePanelTab] = useState<'telemetry' | 'brain' | 'meta_sync'>('telemetry');

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init-1',
      sender: 'agent',
      text: 'Olá! Sou a Carol, assistente inteligente oficial da Clínica OdontoMind AI. 🦷✨\nComo posso ajudar você hoje com seu sorriso, agendamento ou dúvida pós-atendimento?',
      timestamp: '14:20',
      suggestedQuickReplies: [
        'Quebrei um dente e está doendo!',
        'Quanto custa o alinhador invisível?',
        'Tenho muito medo de dentista e anestesia',
        'Fiz cirurgia ontem e está latejando'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [latestTriage, setLatestTriage] = useState<ClinicalTriageEvaluation | null>(null);
  const [lastLearningAlert, setLastLearningAlert] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [bookingConfirmedSlot, setBookingConfirmedSlot] = useState<string | null>(null);
  const [isOpsOpen, setIsOpsOpen] = useState(false);
  
  // Meta Configuration Drawer/Modal State
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [metaForm, setMetaForm] = useState<MetaCloudApiConfig>(metaConfig);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist config & brain
  useEffect(() => {
    localStorage.setItem('odontomind_meta_config', JSON.stringify(metaConfig));
  }, [metaConfig]);

  useEffect(() => {
    localStorage.setItem('odontomind_agent_brain', JSON.stringify(brainState));
  }, [brainState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Test Meta Connection
  const handleTestMetaConnection = async () => {
    setIsTestingConnection(true);
    try {
      const res = await fetch('/api/meta/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumberId: metaConfig.phoneNumberId,
          accessToken: metaConfig.accessToken,
          wabaId: metaConfig.wabaId,
          apiVersion: metaConfig.apiVersion
        })
      });
      const data = await res.json();
      if (data.success) {
        setMetaConfig(prev => ({
          ...prev,
          connectionStatus: 'connected',
          lastSyncTimestamp: new Date().toISOString(),
          displayPhoneNumber: data.displayPhoneNumber || prev.displayPhoneNumber,
          qualityRating: data.qualityRating || prev.qualityRating
        }));
        if (onAddToast) {
          onAddToast({
            id: `toast-${Date.now()}`,
            type: 'success',
            title: 'Sincronização Meta API Verificada',
            message: `Conectado com sucesso à Graph API ${metaConfig.apiVersion} (Latência: ${data.latencyMs}ms)`,
            timestamp: 'Agora'
          });
        }
      } else {
        setMetaConfig(prev => ({ ...prev, connectionStatus: 'error' }));
        if (onAddToast) {
          onAddToast({
            id: `toast-${Date.now()}`,
            type: 'warning',
            title: 'Falha na Validação Meta',
            message: data.error || 'Não foi possível validar as credenciais da Meta.',
            timestamp: 'Agora'
          });
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Send message through the real-time AI clinical pipeline
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/meta/chat-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-5).map(m => ({ role: m.sender, content: m.text })),
          patientName: 'Paciente',
          metaConfig,
          activeHeuristics: brainState.heuristics
        })
      });

      const data = await response.json();

      if (data && data.success) {
        // Set live clinical triage telemetry
        if (data.triage) {
          setLatestTriage(data.triage);
        }

        // Adaptive Learning Engine: make the agent smarter!
        if (data.learnedInsight) {
          const newLearnedText = `${data.learnedInsight.title}: ${data.learnedInsight.detail}`;
          setLastLearningAlert(newLearnedText);

          setBrainState(prev => {
            const nextCount = prev.totalConversations + 1;
            const nextIq = Number((prev.iqLevel + 0.05).toFixed(2));
            const nextObjections = text.toLowerCase().match(/preço|valor|custa|medo|agulha|dor/i) 
              ? prev.objectionsOvercome + 1 
              : prev.objectionsOvercome;

            // Check if heuristic already exists or add to recent learnings
            const newLearningItem = {
              id: `lrn-${Date.now()}`,
              timestamp: 'Agora',
              summary: data.learnedInsight.title,
              origin: `Mensagem: "${text.slice(0, 42)}..."`,
              impactScore: '+12% assertividade'
            };

            return {
              ...prev,
              iqLevel: nextIq,
              totalConversations: nextCount,
              objectionsOvercome: nextObjections,
              recentLearnings: [newLearningItem, ...prev.recentLearnings.slice(0, 4)]
            };
          });

          if (onAddToast) {
            onAddToast({
              id: `toast-${Date.now()}`,
              type: 'info',
              title: '🧠 Novo Aprendizado do Agente',
              message: `O agente assimilou o padrão da conversa e elevou o nível cognitivo para QI ${Number((brainState.iqLevel + 0.05).toFixed(2))}.`,
              timestamp: 'Agora'
            });
          }
        }

        const agentMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: 'agent',
          text: data.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuickReplies: data.suggestedQuickReplies,
          triageEvaluation: data.triage,
          interactiveBooking: data.suggestedSlots ? {
            slots: data.suggestedSlots
          } : undefined
        };

        setMessages(prev => [...prev, agentMsg]);

        void omniRouteService.dispatchDemand({
          channel: 'whatsapp',
          rawInput: text,
          sourceUserName: 'Paciente',
          preferredAgentId: 'agent_sdr',
          slotStatus: 'reserved',
          source: 'whatsapp_simulator',
          phase: 'capture_hook'
        }).catch(() => {});
      } else {
        // Fallback message
        setMessages(prev => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            sender: 'agent',
            text: 'Recebi sua mensagem. Me conta um pouco mais o que está sentindo que eu te oriento e, se fizer sentido, reservo hoje 16:00 ou amanhã 10:30 com a Dra. Camila.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedQuickReplies: ['Quero hoje às 16h', 'Prefiro amanhã às 10h30']
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'agent',
          text: 'Estou aqui. Pode detalhar a queixa (dor, estética, retorno...) que eu te ajudo na hora e te encaixo hoje 16:00 ou amanhã 10:30 se precisar.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Force AI synthesis of new heuristics
  const handleForceSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/meta/synthesize-learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations: messages })
      });
      const data = await res.json();
      if (data.success && data.newHeuristic) {
        setBrainState(prev => ({
          ...prev,
          iqLevel: Number((prev.iqLevel + 0.2).toFixed(1)),
          heuristics: [data.newHeuristic, ...prev.heuristics],
          totalConversations: data.updatedTotalConversations || prev.totalConversations + 1
        }));
        if (onAddToast) {
          onAddToast({
            id: `toast-${Date.now()}`,
            type: 'success',
            title: 'Síntese Cognitiva Concluída',
            message: `Nova heurística incorporada: "${data.newHeuristic.title}". Cérebro do Agente atualizado!`,
            timestamp: 'Agora'
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Slot confirmation action
  const handleConfirmSlot = (slot: any) => {
    setBookingConfirmedSlot(slot.id);
    const confirmationText = `Perfeito! Confirmo o agendamento para ${slot.date} às ${slot.time} com ${slot.dentist} (${slot.procedure}).`;
    
    // Add patient response
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `Quero confirmar o horário de ${slot.time} (${slot.date})!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: `Excelente! Seu agendamento para *${slot.date} às ${slot.time}* com *${slot.dentist}* está formalizado e registrado no nosso prontuário digital com conformidade ética. 🦷✨\n\n📍 Nosso endereço: Av. Paulista, 1842 - Torre Norte, 14º andar.\n\nEnviaremos o lembrete 24h e 2h antes com localização e estacionamento. Estamos ansiosos para cuidar do seu sorriso!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);

      if (onAddToast) {
        onAddToast({
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Cadeira Reservada em Tempo Real',
          message: `${slot.procedure} agendado para ${slot.date} às ${slot.time}.`,
          timestamp: 'Agora'
        });
      }
    }, 700);
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([
      {
        id: 'm-init-1',
        sender: 'agent',
        text: 'Olá! Sou a Carol, assistente inteligente oficial da Clínica OdontoMind AI. 🦷✨\nComo posso ajudar você hoje com seu sorriso, agendamento ou dúvida pós-atendimento?',
        timestamp: '14:20',
        suggestedQuickReplies: [
          'Quebrei um dente e está doendo!',
          'Quanto custa o alinhador invisível?',
          'Tenho muito medo de dentista e anestesia',
          'Fiz cirurgia ontem e está latejando'
        ]
      }
    ]);
    setLatestTriage(null);
    setBookingConfirmedSlot(null);
  };

  return (
    <div className="h-[calc(100dvh-0.5rem)] sm:h-[calc(100dvh-0.75rem)] flex flex-col animate-fadeIn">
      <div className="flex-1 min-h-0 flex gap-2 relative">
        <div className="flex-1 min-w-0 flex justify-center relative">
          <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-full bg-slate-900/90 text-slate-200 border border-slate-700 cursor-pointer shadow-lg"
              title="Reiniciar Simulação"
              aria-label="Limpar conversa"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpsOpen((open) => !open)}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-full bg-slate-900/90 text-cyan-300 border border-slate-700 cursor-pointer shadow-lg"
              aria-expanded={isOpsOpen}
              aria-label={isOpsOpen ? 'Recolher painel operacional' : 'Abrir painel operacional'}
            >
              {isOpsOpen ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            </button>
          </div>
          <div className="w-full max-w-[440px] h-full bg-slate-900 rounded-[28px] sm:rounded-[38px] p-2 sm:p-3 shadow-2xl border-4 border-slate-800 relative">
            <div className="bg-[#efeae2] rounded-[22px] sm:rounded-[30px] overflow-hidden flex flex-col h-full relative">
              {/* WhatsApp Header */}
              <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center font-bold text-lg border border-teal-600">
                      🦷
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075e54] absolute bottom-0 right-0" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm tracking-tight text-white">
                        OdontoMind AI Clinic
                      </h3>
                      <span className="text-[9px] bg-emerald-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                        ✓ Meta Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-200">
                      Carol IA · Atendimento & Triagem em Tempo Real
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-teal-100">
                  <Video className="w-4 h-4 opacity-70 cursor-not-allowed" />
                  <Phone className="w-4 h-4 opacity-70 cursor-not-allowed" />
                  <MoreVertical className="w-4 h-4 opacity-70 cursor-not-allowed" />
                </div>
              </div>

              {/* Regulatory Notice Banner inside WhatsApp */}
              <div className="bg-amber-100/90 border-b border-amber-200 text-amber-900 text-[10px] py-1.5 px-3 text-center flex items-center justify-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Atendimento regulamentado pelo CRO-SP 89452 · RT: Dra. Camila Alencar</span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                {messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-xs text-xs leading-relaxed relative ${
                          isAgent
                            ? 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/50'
                            : 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line text-slate-800">{msg.text}</p>

                        {/* Interactive Booking Slots (Inside WhatsApp) */}
                        {isAgent && msg.interactiveBooking?.slots && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                            <span className="text-[10px] font-semibold text-teal-800 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-teal-600" />
                              Horários disponíveis no calendário da clínica:
                            </span>

                            <div className="grid grid-cols-1 gap-1.5">
                              {msg.interactiveBooking.slots.map((slot) => {
                                const isSelected = bookingConfirmedSlot === slot.id;
                                return (
                                  <button
                                    key={slot.id}
                                    onClick={() => handleConfirmSlot(slot)}
                                    className={`w-full text-left p-2 rounded-lg border text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                                      isSelected 
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                                        : 'bg-slate-50 hover:bg-teal-50/60 border-slate-200 text-slate-800'
                                    }`}
                                  >
                                    <div>
                                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                        <span>{slot.date} às {slot.time}</span>
                                        {isSelected && (
                                          <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                                            Confirmado
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500">
                                        {slot.dentist} · {slot.procedure}
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-teal-700 bg-white px-2 py-1 rounded border border-teal-200 shadow-xs">
                                      {isSelected ? '✓ Agendado' : 'Reservar'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          {!isAgent && <CheckCheck className="w-3 h-3 text-blue-500" />}
                        </div>
                      </div>

                      {/* Quick Replies Buttons */}
                      {isAgent && msg.suggestedQuickReplies && (
                        <div className="flex flex-wrap gap-1 mt-1.5 max-w-[92%]">
                          {msg.suggestedQuickReplies.map((reply, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(reply)}
                              className="bg-white/95 hover:bg-white text-[#075e54] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#075e54]/30 shadow-xs transition-colors cursor-pointer"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 bg-white text-slate-500 rounded-full px-3 py-1.5 w-28 text-xs shadow-xs border border-slate-200/50">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce delay-300" />
                    <span className="text-[10px] text-teal-800 ml-1">Carol IA...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Patient Quick Test Scenarios Bar */}
              <div className="bg-[#f0f2f5] px-2.5 py-2 border-t border-slate-200/60 overflow-x-auto flex gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 shrink-0 self-center">Cenários:</span>
                <button
                  onClick={() => handleSendMessage('Estou com dor de dente muito forte e latejando há 2 dias')}
                  className="text-[10px] bg-white text-slate-700 px-2 py-1 rounded border border-slate-200 whitespace-nowrap hover:bg-red-50 hover:text-red-700 hover:border-red-200 cursor-pointer"
                >
                  🚨 Dor Aguda
                </button>
                <button
                  onClick={() => handleSendMessage('Qual o valor das lentes de porcelana ou facetas?')}
                  className="text-[10px] bg-white text-slate-700 px-2 py-1 rounded border border-slate-200 whitespace-nowrap hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 cursor-pointer"
                >
                  🛡️ Preço Facetas
                </button>
                <button
                  onClick={() => handleSendMessage('Quero colocar alinhador invisível, como funciona o scanner 3D?')}
                  className="text-[10px] bg-white text-slate-700 px-2 py-1 rounded border border-slate-200 whitespace-nowrap hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 cursor-pointer"
                >
                  ✨ Alinhador 3D
                </button>
                <button
                  onClick={() => handleSendMessage('Morro de pavor de agulha e anestesia, não consigo ir ao dentista')}
                  className="text-[10px] bg-white text-slate-700 px-2 py-1 rounded border border-slate-200 whitespace-nowrap hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 cursor-pointer"
                >
                  😨 Fobia / Medo
                </button>
              </div>

              {/* Input Footer */}
              <div className="bg-[#f0f2f5] p-2.5 flex items-center gap-2 shrink-0">
                <div className="flex-1 bg-white rounded-full flex items-center px-3.5 py-2 border border-slate-200 shadow-xs">
                  <input
                    type="text"
                    placeholder="Digite como o paciente (perguntas, sintomas...)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-transparent text-xs text-slate-900 focus:outline-none placeholder-slate-400"
                  />
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="min-h-11 min-w-11 rounded-full bg-[#00a884] hover:bg-[#069677] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-sm"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
          isOpsOpen
            ? 'absolute inset-y-0 right-0 z-20 w-[min(100%,22rem)] lg:static lg:w-[min(42%,28rem)] opacity-100 translate-x-0 bg-slate-50/95 backdrop-blur-sm border-l border-slate-200 shadow-xl lg:shadow-none'
            : 'w-0 opacity-0 translate-x-6 pointer-events-none absolute right-0'
        }`}>
        <div className="h-full overflow-y-auto p-3 space-y-4 min-w-[18rem]">
          {/* Navigation Tabs for Right Panel */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActivePanelTab('telemetry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activePanelTab === 'telemetry'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Triagem & Compliance ao Vivo</span>
            </button>

            <button
              onClick={() => setActivePanelTab('brain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activePanelTab === 'brain'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Cérebro & Aprendizado Adaptativo</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded-full">
                QI {brainState.iqLevel}
              </span>
            </button>

            <button
              onClick={() => setActivePanelTab('meta_sync')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activePanelTab === 'meta_sync'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>APIs da Meta (Graph v21.0)</span>
            </button>
          </div>

          {/* TAB 1: TRIAGE & COMPLIANCE TELEMETRY */}
          {activePanelTab === 'telemetry' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Análise Clínica e Regulatória em Tempo Real
                      </h4>
                      <p className="text-xs text-slate-500">
                        Processamento imediato dos 4 pilares a cada mensagem trocada
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-semibold border border-emerald-200">
                    ✓ IA Multimodal Conectada
                  </span>
                </div>

                {latestTriage ? (
                  <div className="space-y-3.5">
                    {/* Urgency Badge & Clinical Need */}
                    <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-700">1. Triagem Clínica Automática:</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${latestTriage.urgencyColor}`}>
                          {latestTriage.urgencyLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">
                        <strong className="text-slate-900">Sintomas / Queixa:</strong> {latestTriage.identifiedSymptoms}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                        <div>
                          <span className="text-slate-500">Especialidade Indicada:</span>
                          <div className="font-semibold text-slate-900">{latestTriage.recommendedSpecialty}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Tempo Máximo de Espera:</span>
                          <div className="font-semibold text-emerald-700">{latestTriage.maxResponseTime}</div>
                        </div>
                      </div>
                    </div>

                    {/* CRO/CFO Compliance Guard */}
                    <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-indigo-700" />
                          2. Compliance Ético Odontológico (CFO / LGPD):
                        </span>
                        <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                          100% Conforme
                        </span>
                      </div>
                      <ul className="text-xs text-indigo-900 space-y-1">
                        {latestTriage.croRulesChecked.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 mt-0.5">✓</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Real-time Booking Engine */}
                    <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-teal-700" />
                          3. Agendamento em Tempo Real (Cadeira Odontológica):
                        </span>
                        <span className="text-[11px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                          {bookingConfirmedSlot ? 'Vaga Formalizada' : 'Slots Oferecidos no WhatsApp'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {latestTriage.suggestedSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`p-2.5 rounded-lg border bg-white ${
                              bookingConfirmedSlot === slot.id
                                ? 'border-emerald-500 ring-2 ring-emerald-400/20'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="font-bold text-slate-900">{slot.date} às {slot.time}</div>
                            <div className="text-slate-600 text-[11px]">{slot.dentist}</div>
                            <div className="text-slate-400 text-[10px]">{slot.chair}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                    <Activity className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                    <p className="text-xs font-semibold text-slate-700">Aguardando mensagem no simulador...</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Envie uma mensagem pelo celular à esquerda ou clique em um dos cenários prontos (Dor Aguda, Preço Facetas, etc.) para ver a telemetria ao vivo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AGENT BRAIN & ADAPTIVE LEARNING */}
          {activePanelTab === 'brain' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Cérebro do Agente & Evolução Cognitiva
                      </h4>
                      <p className="text-xs text-slate-500">
                        O agente aprende como lidar com o cliente a cada nova integração e diálogo
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleForceSynthesis}
                    disabled={isSynthesizing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Cpu className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                    <span>{isSynthesizing ? 'Sintetizando...' : 'Forçar Síntese IA'}</span>
                  </button>
                </div>

                {/* Cognitive Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500">Nível de Inteligência</span>
                    <div className="text-lg font-extrabold text-indigo-700">QI {brainState.iqLevel}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold">+0.2 por aprendizado</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500">Atendimentos Processados</span>
                    <div className="text-lg font-extrabold text-slate-900">{brainState.totalConversations}</div>
                    <span className="text-[10px] text-slate-500">WhatsApp & Meta</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500">Precisão CRO/CFO</span>
                    <div className="text-lg font-extrabold text-emerald-600">{brainState.complianceAccuracy}%</div>
                    <span className="text-[10px] text-emerald-600 font-semibold">Zero não-conformidades</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500">Objeções Vencidas</span>
                    <div className="text-lg font-extrabold text-teal-700">{brainState.objectionsOvercome}</div>
                    <span className="text-[10px] text-teal-600 font-semibold">Preço, dor e tempo</span>
                  </div>
                </div>

                {/* Learned Heuristics List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Heurísticas & Estratégias Aprendidas ({brainState.heuristics.length} Ativas):
                    </h5>
                    <span className="text-[11px] text-slate-500">Atualizado dinamicamente</span>
                  </div>

                  <div className="space-y-2.5">
                    {brainState.heuristics.map((heuristic) => (
                      <div
                        key={heuristic.id}
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            {heuristic.title}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {heuristic.conversionBoost}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong className="text-slate-800">Estratégia:</strong> {heuristic.learnedStrategy}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span>Gatilho: <code className="text-slate-600">{heuristic.triggerPattern}</code></span>
                          <span>{heuristic.timesApplied}x aplicada · {heuristic.confidenceScore}% confiança</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: META GRAPH API & WEBHOOK SYNCHRONIZATION */}
          {activePanelTab === 'meta_sync' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Credenciais & Conexão Meta Cloud API (v21.0)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Configuração para integração direta com a plataforma de desenvolvedores da Meta
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Endpoint Ativo
                  </span>
                </div>

                {/* Key Config Fields */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      URL de Retorno do Webhook (Configure no Meta for Developers):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={metaConfig.webhookUrl}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono text-[11px]"
                      />
                      <button
                        onClick={() => handleCopy(metaConfig.webhookUrl, 'url')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'url' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Token de Verificação (hub.verify_token):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={metaConfig.webhookVerifyToken}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono text-[11px]"
                      />
                      <button
                        onClick={() => handleCopy(metaConfig.webhookVerifyToken, 'token')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'token' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium">WhatsApp Business Account ID:</span>
                      <div className="font-mono font-semibold text-slate-800 text-[11px] mt-0.5">{metaConfig.wabaId}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium">Phone Number ID:</span>
                      <div className="font-mono font-semibold text-slate-800 text-[11px] mt-0.5">{metaConfig.phoneNumberId}</div>
                    </div>
                  </div>
                </div>

                {/* Sample cURL command for testing real Meta webhook dispatch */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Exemplo cURL de Disparo Inbound (Simule a Meta chamando sua API):
                    </span>
                    <button
                      onClick={() => handleCopy(`curl -X POST http://localhost:3000/api/meta/whatsapp-webhook -H "Content-Type: application/json" -d '${JSON.stringify(sampleMetaWebhooksPayloads.textMessage)}'`, 'curl')}
                      className="text-teal-700 hover:text-teal-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'curl' ? 'cURL Copiado' : 'Copiar cURL'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-slate-300 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36">
                    {`curl -X POST ${metaConfig.webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(sampleMetaWebhooksPayloads.textMessage, null, 2)}'`}
                  </pre>
                </div>

                {/* Render Hosting & Synchronization Status */}
                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                        R
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">
                          Sincronização com o Render (Hospedagem & Webhook de Produção)
                        </h5>
                        <p className="text-[11px] text-slate-600">
                          Arquivo <code className="font-mono text-teal-800 bg-teal-100/70 px-1 py-0.2 rounded">render.yaml</code> configurado com suporte à Meta Cloud API
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-300">
                      Blueprint Pronto
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-teal-200/70">
                      <span className="text-slate-500 text-[10px] block">Serviço Render:</span>
                      <strong className="text-slate-900 text-xs font-mono">odontomind-ai</strong>
                      <span className="text-emerald-700 text-[10px] block mt-0.5">Runtime Node · Region Oregon</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-teal-200/70">
                      <span className="text-slate-500 text-[10px] block">URL de Produção Meta:</span>
                      <strong className="text-slate-900 text-xs font-mono truncate block">
                        https://odontomind-ai.onrender.com/api/meta/whatsapp-webhook
                      </strong>
                      <span className="text-teal-700 text-[10px] block mt-0.5">HTTPS SSL Automático</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-600">
                      Variáveis gerenciadas: <code className="text-slate-800 font-mono">META_WEBHOOK_VERIFY_TOKEN</code>, <code className="text-slate-800 font-mono">GEMINI_API_KEY</code>
                    </span>
                    <button
                      onClick={() => handleCopy('https://odontomind-ai.onrender.com/api/meta/whatsapp-webhook', 'render_url')}
                      className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'render_url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'render_url' ? 'URL Render Copiada' : 'Copiar URL Render'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Meta API Settings Modal */}
      {isMetaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Configuração de Integração Meta WhatsApp API
                </h3>
              </div>
              <button
                onClick={() => setIsMetaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Insira os dados do seu aplicativo no <strong>Meta for Developers</strong> (WhatsApp Cloud API) para conectar sua linha telefônica oficial da clínica.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Número de Telefone Exibido:
                </label>
                <input
                  type="text"
                  value={metaForm.displayPhoneNumber}
                  onChange={(e) => setMetaForm({ ...metaForm, displayPhoneNumber: e.target.value })}
                  placeholder="+55 11 98452-1102"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Phone Number ID:
                  </label>
                  <input
                    type="text"
                    value={metaForm.phoneNumberId}
                    onChange={(e) => setMetaForm({ ...metaForm, phoneNumberId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    WABA ID (WhatsApp Business):
                  </label>
                  <input
                    type="text"
                    value={metaForm.wabaId}
                    onChange={(e) => setMetaForm({ ...metaForm, wabaId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Meta Permanent Access Token (ou System User Token):
                </label>
                <input
                  type="password"
                  value={metaForm.accessToken}
                  onChange={(e) => setMetaForm({ ...metaForm, accessToken: e.target.value })}
                  placeholder="EAAG9..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Webhook Verify Token:
                </label>
                <input
                  type="text"
                  value={metaForm.webhookVerifyToken}
                  onChange={(e) => setMetaForm({ ...metaForm, webhookVerifyToken: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Modo de Operação:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMetaForm({ ...metaForm, syncMode: 'simulation' })}
                    className={`py-2 px-3 rounded-lg border font-semibold text-xs cursor-pointer ${
                      metaForm.syncMode === 'simulation'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Homologação & Simulador
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetaForm({ ...metaForm, syncMode: 'meta_cloud_api' })}
                    className={`py-2 px-3 rounded-lg border font-semibold text-xs cursor-pointer ${
                      metaForm.syncMode === 'meta_cloud_api'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Meta Cloud API Produção
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsMetaModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMetaConfig(metaForm);
                  setIsMetaModalOpen(false);
                  if (onAddToast) {
                    onAddToast({
                      id: `toast-${Date.now()}`,
                      type: 'success',
                      title: 'Configurações Meta Salvas',
                      message: 'Credenciais e modo de operação atualizados com sucesso.',
                      timestamp: 'Agora'
                    });
                  }
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
              >
                Salvar Sincronização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

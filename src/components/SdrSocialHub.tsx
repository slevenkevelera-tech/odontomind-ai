import React, { useState, useEffect } from 'react';
import { 
  SocialPlatform, 
  SdrLead, 
  SocialIntegrationConfig, 
  PatientLead, 
  Appointment, 
  ToastNotification 
} from '../types';
import { 
  initialSocialIntegrations, 
  sdrPlaybook, 
  initialSdrLeads 
} from '../data/sdrData';
import { 
  Bot, 
  Send, 
  Zap, 
  Check, 
  Copy, 
  Calendar, 
  UserCheck, 
  RotateCcw, 
  Settings, 
  ShieldCheck, 
  RefreshCw, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Smartphone, 
  Globe, 
  Activity, 
  Share2, 
  MessageSquare, 
  CheckCheck, 
  ChevronRight, 
  Play,
  ArrowRight,
  UserPlus,
  Plus
} from 'lucide-react';

interface SdrSocialHubProps {
  onAddPatient: (patient: PatientLead) => void;
  onAddAppointment: (appointment: Appointment) => void;
  onAddToast?: (toast: ToastNotification) => void;
  onNavigateToTab: (tab: any) => void;
}

export const SdrSocialHub: React.FC<SdrSocialHubProps> = ({
  onAddPatient,
  onAddAppointment,
  onAddToast,
  onNavigateToTab
}) => {
  // Integrations state
  const [integrations, setIntegrations] = useState<SocialIntegrationConfig[]>(() => {
    const saved = localStorage.getItem('odontomind_social_integrations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialSocialIntegrations;
  });

  // Leads state
  const [leads, setLeads] = useState<SdrLead[]>(() => {
    const saved = localStorage.getItem('odontomind_sdr_leads');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialSdrLeads;
  });

  // Active Hub Tab: 'simulator' | 'connectors' | 'playbook' | 'leads'
  const [activeTab, setActiveTab] = useState<'simulator' | 'connectors' | 'playbook' | 'leads'>('simulator');

  // Simulator State
  const [simChannel, setSimChannel] = useState<SocialPlatform>('instagram');
  const [simLeadName, setSimLeadName] = useState('Mariana Prado');
  const [simLeadPhone, setSimLeadPhone] = useState('+55 11 98452-1102');
  const [simSocialHandle, setSimSocialHandle] = useState('@mariana.prado');
  const [simInputMessage, setSimInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Active chat conversation in simulator
  const [chatLog, setChatLog] = useState<Array<{ sender: 'lead' | 'sdr'; text: string; time: string; channel: SocialPlatform }>>([
    {
      sender: 'sdr',
      text: 'Olá! Sou o Lucas, assistente de atendimento da Clínica OdontoMind AI. 🦷✨ Como posso ajudar você hoje com seu sorriso ou agendamento?',
      time: '14:30',
      channel: 'instagram'
    }
  ]);

  // Current active lead analysis
  const [currentLeadAnalysis, setCurrentLeadAnalysis] = useState<{
    score: number;
    procedure: string;
    urgency: string;
    status: string;
    notes: string;
  }>({
    score: 50,
    procedure: 'Check-up com Scanner 3D',
    urgency: 'media',
    status: 'qualificando',
    notes: 'Aguardando mensagem para qualificação automática.'
  });

  // Testing Webhook state
  const [testingChannel, setTestingChannel] = useState<string | null>(null);

  // Save state
  useEffect(() => {
    localStorage.setItem('odontomind_social_integrations', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem('odontomind_sdr_leads', JSON.stringify(leads));
  }, [leads]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Test Social Webhook Inbound
  const handleTestWebhook = async (channel: SocialPlatform) => {
    setTestingChannel(channel);
    try {
      const res = await fetch('/api/sdr/test-social-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel })
      });
      const data = await res.json();
      if (data.success && onAddToast) {
        onAddToast({
          id: `toast-wh-${Date.now()}`,
          type: 'success',
          title: `Webhook ${channel.toUpperCase()} Verificado`,
          message: `Endpoint de produção validado (HTTP 200 OK · Latência: ${data.latencyMs}ms)`,
          timestamp: 'Agora'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTestingChannel(null);
    }
  };

  // Send message in SDR simulator
  const handleSendSimulatorMessage = async (customText?: string) => {
    const text = (customText || simInputMessage).trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add Lead Message
    setChatLog(prev => [...prev, {
      sender: 'lead',
      text,
      time,
      channel: simChannel
    }]);
    setSimInputMessage('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/sdr/lead-inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: simChannel,
          leadName: simLeadName,
          leadPhone: simLeadPhone,
          socialHandle: simSocialHandle,
          messageText: text,
          campaignOrigin: `${simChannel.toUpperCase()} Direct Inbound`,
          conversationHistory: chatLog.map(m => ({ role: m.sender === 'lead' ? 'user' : 'model', content: m.text }))
        })
      });

      const data = await res.json();

      if (data && data.success) {
        setChatLog(prev => [...prev, {
          sender: 'sdr',
          text: data.sdrReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel: simChannel
        }]);

        setCurrentLeadAnalysis({
          score: data.leadScore,
          procedure: data.lead.interestProcedure,
          urgency: data.lead.urgency,
          status: data.qualificationStatus,
          notes: data.lead.sdrNotes
        });

        // Add to leads if not present
        const newLeadRecord: SdrLead = {
          id: data.lead.id,
          name: simLeadName,
          phone: simLeadPhone,
          socialHandle: simSocialHandle,
          channel: simChannel,
          interestProcedure: data.lead.interestProcedure,
          urgency: data.lead.urgency,
          leadScore: data.leadScore,
          qualificationStatus: data.qualificationStatus,
          capturedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lastMessage: text,
          sdrNotes: data.lead.sdrNotes
        };

        setLeads(prev => [newLeadRecord, ...prev.filter(l => l.phone !== simLeadPhone)]);

        if (onAddToast && data.leadScore >= 75) {
          onAddToast({
            id: `toast-qual-${Date.now()}`,
            type: 'success',
            title: '🔥 Lead Qualificado pelo SDR!',
            message: `${simLeadName} alcançou Score ${data.leadScore}/100 com interesse em ${data.lead.interestProcedure}.`,
            timestamp: 'Agora'
          });
        }
      }
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, {
        sender: 'sdr',
        text: 'Olá! Muito obrigado pelo contato. Pelo Código de Ética Odontológica, para planejar com total precisão seu caso, temos vagas para o Check-up com Scanner 3D hoje às 16h ou amanhã às 10h30. Qual horário prefere?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: simChannel
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert current Lead to Real Patient in CRM
  const handleConvertToPatient = () => {
    const newPatient: PatientLead = {
      id: `pt-sdr-${Date.now()}`,
      name: simLeadName,
      phone: simLeadPhone,
      email: `${simSocialHandle.replace('@', '')}@social.com`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      treatment: currentLeadAnalysis.procedure,
      category: currentLeadAnalysis.procedure.includes('Alinhador') ? 'Ortodontia' :
                currentLeadAnalysis.procedure.includes('Implante') ? 'Implantes' :
                currentLeadAnalysis.procedure.includes('Estética') ? 'Estética' : 'Clínica Geral',
      estimatedValue: currentLeadAnalysis.procedure.includes('Alinhador') ? 12500 :
                      currentLeadAnalysis.procedure.includes('Implante') ? 16000 :
                      currentLeadAnalysis.procedure.includes('Estética') ? 8500 : 800,
      stage: 'ai_triage',
      urgency: currentLeadAnalysis.urgency === 'imediata' ? 'imediata' :
               currentLeadAnalysis.urgency === 'alta' ? 'alta' : 'media',
      dentistAssigned: 'Dra. Camila Alencar',
      lastContact: `Lead qualificado via ${simChannel.toUpperCase()}`,
      notes: currentLeadAnalysis.notes,
      croConsentSigned: false,
      aiTriageSummary: `Lead captado no ${simChannel.toUpperCase()} pelo SDR com Score ${currentLeadAnalysis.score}/100. Interesse em ${currentLeadAnalysis.procedure}.`,
      communicationPrefs: {
        preferredChannel: 'whatsapp',
        preferredTime: 'afternoon',
        optInReminders: true,
        optInFollowup: true,
        optInPreventiveRecall: true,
        optInEducationalTips: true
      },
      treatmentHistory: [],
      engagement: {
        messagesSent: chatLog.length,
        messagesOpened: chatLog.length,
        appointmentsAttended: 0,
        appointmentsMissed: 0,
        npsScore: 10,
        recallAdherencePercent: 100,
        lastInteractionDate: new Date().toISOString().split('T')[0]
      }
    };

    onAddPatient(newPatient);

    if (onAddToast) {
      onAddToast({
        id: `toast-patient-${Date.now()}`,
        type: 'success',
        title: 'Paciente Inserido no CRM',
        message: `${simLeadName} foi transferido do SDR para o CRM de Pacientes com sucesso.`,
        timestamp: 'Agora',
        actionLabel: 'Ver no CRM',
        actionTab: 'crm'
      });
    }
  };

  // Convert to Real Appointment in Calendar
  const handleScheduleAppointment = () => {
    const today = new Date().toISOString().split('T')[0];
    const newApt: Appointment = {
      id: `apt-sdr-${Date.now()}`,
      patientId: `pt-${Date.now()}`,
      patientName: simLeadName,
      patientPhone: simLeadPhone,
      date: today,
      time: '16:00',
      durationMinutes: 45,
      dentist: 'Dra. Camila Alencar',
      procedure: `Check-up Scanner 3D (${currentLeadAnalysis.procedure})`,
      status: 'pending',
      reminderSent: true,
      channel: 'whatsapp'
    };

    onAddAppointment(newApt);

    if (onAddToast) {
      onAddToast({
        id: `toast-apt-${Date.now()}`,
        type: 'success',
        title: 'Consulta Agendada pelo SDR',
        message: `Avaliação de ${simLeadName} marcada para Hoje às 16:00 com Dra. Camila Alencar.`,
        timestamp: 'Agora',
        actionLabel: 'Ver Agenda',
        actionTab: 'scheduling'
      });
    }
  };

  // Quick Preset Scenarios for testing
  const presetScenarios = [
    {
      label: '💎 Alinhador Invisível (Instagram)',
      channel: 'instagram' as SocialPlatform,
      name: 'Camila Rocha',
      phone: '+55 11 98844-3322',
      handle: '@camilasrocha',
      text: 'Olá! Vi o anúncio no Instagram. Quanto custa colocar o alinhador invisível e como funciona o scanner 3D?'
    },
    {
      label: '🦷 Implante Dentário (Facebook Lead)',
      channel: 'facebook' as SocialPlatform,
      name: 'Rogério Andrade',
      phone: '+55 11 97233-1199',
      handle: 'Rogério Andrade (Facebook)',
      text: 'Gostaria de saber sobre implante dentário de carga rápida. Perdi um dente da frente e preciso resolver rápido.'
    },
    {
      label: '🚨 Dor Aguda (WhatsApp)',
      channel: 'whatsapp' as SocialPlatform,
      name: 'Felipe Duarte',
      phone: '+55 11 99122-8877',
      handle: 'Felipe WhatsApp',
      text: 'Quebrei um dente do fundo comendo e está doendo muito quando entra ar. Vocês atendem hoje?'
    },
    {
      label: '✨ Clareamento Laser (TikTok)',
      channel: 'tiktok' as SocialPlatform,
      name: 'Beatriz Lima',
      phone: '+55 11 96555-4411',
      handle: '@bialima.odonto',
      text: 'Amei o vídeo do clareamento dental a laser no TikTok! Quantas sessões precisa e posso agendar esta semana?'
    }
  ];

  const applyPreset = (preset: typeof presetScenarios[0]) => {
    setSimChannel(preset.channel);
    setSimLeadName(preset.name);
    setSimLeadPhone(preset.phone);
    setSimSocialHandle(preset.handle);
    handleSendSimulatorMessage(preset.text);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: SDR Multi-Channel Status */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                <Bot className="w-3.5 h-3.5" />
                SDR Inteligente de Alta Conversão (Meta & Redes Sociais)
              </span>

              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Meta Graph API v21.0 Ativa
              </span>

              <span className="text-xs text-slate-400">
                SLA: <strong className="text-slate-200">&lt; 45 segundos</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
              SDR Social & Pré-Vendas Odontológicas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Qualificação em tempo real de pacientes que chegam pelo <strong>Instagram Direct</strong>, <strong>WhatsApp Cloud</strong>, <strong>Facebook Leads</strong>, <strong>TikTok</strong> e <strong>Google Ads</strong>. O SDR atende com ética CRO (Resolução CFO 196/2019), calcula o Lead Score e transfere diretamente para o prontuário da clínica.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulador SDR ao Vivo</span>
            </button>

            <button
              onClick={() => setActiveTab('connectors')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'connectors'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Conectores ({integrations.length} Redes)</span>
            </button>

            <button
              onClick={() => setActiveTab('playbook')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'playbook'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Playbook & CRO</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE MULTI-CHANNEL SDR SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT CHAT: Phone/Direct Chat View (Col 1 to 7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[680px]">
            {/* Header with Channel Picker & Lead Info */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{sdrPlaybook.sdrName}</h4>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                      ✓ Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Atendendo {simLeadName} ({simSocialHandle})
                  </p>
                </div>
              </div>

              {/* Social Channel Selector */}
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setSimChannel('instagram')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    simChannel === 'instagram' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Meta Instagram Direct"
                >
                  Instagram
                </button>
                <button
                  onClick={() => setSimChannel('whatsapp')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    simChannel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Meta WhatsApp Cloud"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setSimChannel('facebook')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    simChannel === 'facebook' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Meta Facebook Lead Ads"
                >
                  Facebook
                </button>
                <button
                  onClick={() => setSimChannel('tiktok')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    simChannel === 'tiktok' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="TikTok Leads"
                >
                  TikTok
                </button>
              </div>
            </div>

            {/* Quick Test Presets Bar */}
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 overflow-x-auto flex gap-1.5 shrink-0 items-center">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">Simular Lead:</span>
              {presetScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(sc)}
                  className="text-[10px] bg-white text-slate-700 px-2 py-1 rounded border border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
              {chatLog.map((msg, i) => {
                const isSdr = msg.sender === 'sdr';
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isSdr ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                        isSdr
                          ? 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/80'
                          : 'bg-purple-600 text-white rounded-tr-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isSdr ? 'text-slate-400' : 'text-purple-200'
                      }`}>
                        <span>{msg.time}</span>
                        {!isSdr && <CheckCheck className="w-3 h-3 text-purple-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isProcessing && (
                <div className="flex items-center gap-1.5 bg-white text-slate-500 rounded-full px-3 py-1.5 w-32 text-xs shadow-xs border border-slate-200">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce delay-300" />
                  <span className="text-[10px] text-purple-800 ml-1">Lucas SDR...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Simular resposta do paciente no ${simChannel}...`}
                value={simInputMessage}
                onChange={(e) => setSimInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSimulatorMessage()}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleSendSimulatorMessage()}
                disabled={!simInputMessage.trim() || isProcessing}
                className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Real-time Lead Scoring & CRM Bridge (Col 8 to 12) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Lead Telemetry & Scoring Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 font-bold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Qualificação do Lead em Tempo Real
                    </h4>
                    <p className="text-xs text-slate-500">
                      Algoritmo de conversão e scoring preditivo
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                  currentLeadAnalysis.score >= 75
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {currentLeadAnalysis.status === 'qualificado' ? '🔥 Qualificado' : '⏳ Em Qualificação'}
                </span>
              </div>

              {/* Score Bar */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Lead Score:</span>
                  <strong className="text-purple-700 font-bold text-sm">{currentLeadAnalysis.score}/100 pts</strong>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${currentLeadAnalysis.score}%` }}
                  />
                </div>
              </div>

              {/* Lead Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Procedimento Detectado:</span>
                  <strong className="text-slate-900">{currentLeadAnalysis.procedure}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Canal de Origem:</span>
                  <strong className="text-purple-700 uppercase font-semibold">{simChannel}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Telefone / WhatsApp:</span>
                  <span className="font-mono text-slate-800">{simLeadPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Compliance Ético CRO:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> CFO 196/2019 Seguro
                  </span>
                </div>
              </div>

              {/* Action Buttons to bridge to CRM & Scheduling */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleConvertToPatient}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Transferir Lead para CRM de Pacientes</span>
                </button>

                <button
                  onClick={handleScheduleAppointment}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Horário no Calendário Clínico</span>
                </button>
              </div>
            </div>

            {/* Quick CRO Guide Note */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1.5 text-xs text-indigo-950">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>Diretriz de Conversão Ética CRO-SP 89452</span>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                O SDR atrai o paciente apresentando o valor do <strong>escaneamento intraoral 3D</strong> sem passar valores fechados antes da avaliação presencial, blindando a clínica contra infrações ao Código de Ética Odontológica.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOCIAL CONNECTORS (Meta Instagram, WhatsApp, Facebook, TikTok, Google) */}
      {activeTab === 'connectors' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-heading font-extrabold text-slate-900 text-lg">
                Conectores de Redes Sociais & APIs de Leads
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Endpoints HTTP e credenciais para receber leads das principais plataformas sociais diretamente no SDR inteligente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {integrations.map((conn) => (
                <div
                  key={conn.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{conn.name}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">{conn.accountIdentifier}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Conectado
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-0.5">Webhook URL:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={conn.webhookUrl}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono text-[11px]"
                        />
                        <button
                          onClick={() => handleCopy(conn.webhookUrl, `wh-${conn.id}`)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          {copiedKey === `wh-${conn.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Token de Verificação: <code className="text-slate-800 font-mono">{conn.verifyToken}</code></span>
                      <span>{conn.activeAutomationsCount} fluxos ativos</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <a
                      href={conn.apiDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 hover:text-purple-800 text-xs font-semibold"
                    >
                      Documentação Oficial da API →
                    </a>

                    <button
                      onClick={() => handleTestWebhook(conn.id)}
                      disabled={testingChannel === conn.id}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${testingChannel === conn.id ? 'animate-spin' : ''}`} />
                      <span>{testingChannel === conn.id ? 'Testando...' : 'Testar Webhook'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SDR PLAYBOOK & SCORING */}
      {activeTab === 'playbook' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-heading font-extrabold text-slate-900 text-lg">
                Playbook do SDR Odontológico & Matriz de Qualificação
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Diretrizes de atendimento, perguntas obrigatórias de qualificação e blindagem contra infrações éticas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Perguntas de Qualificação B2C
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {sdrPlaybook.qualificationQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Critérios de Lead Scoring (0 a 100)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {sdrPlaybook.leadScoringCriteria.map((c, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span>{c.label}</span>
                      <strong className="text-emerald-700 font-semibold">{c.points}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

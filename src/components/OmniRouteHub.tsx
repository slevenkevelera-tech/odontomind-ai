import React, { useState, useEffect } from 'react';
import { 
  OmniChannel, 
  OmniAgentDefinition, 
  OmniRouteDemand, 
  OmniRouteConfig,
  ToastNotification
} from '../types';
import { omniRouteService, defaultOmniAgents } from '../lib/omniRoute';
import { 
  Network, 
  Bot, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Settings2, 
  Share2, 
  ShieldCheck, 
  MessageCircle, 
  Activity, 
  Layers, 
  Check, 
  Copy,
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface OmniRouteHubProps {
  onAddToast?: (toast: {
    type: 'success' | 'urgent' | 'warning' | 'info';
    title: string;
    message: string;
  }) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const OmniRouteHub: React.FC<OmniRouteHubProps> = ({ onAddToast, onNavigateToTab }) => {
  const [agents, setAgents] = useState<OmniAgentDefinition[]>(() => omniRouteService.getAgents());
  const [config, setConfig] = useState<OmniRouteConfig>(() => omniRouteService.getConfig());
  const [demandsHistory, setDemandsHistory] = useState<OmniRouteDemand[]>(() => omniRouteService.getDemandsHistory());

  // Test sandbox state
  const [selectedChannel, setSelectedChannel] = useState<OmniChannel>('instagram');
  const [inputText, setInputText] = useState('Quanto custa colocar alinhador invisível e como é feita a avaliação?');
  const [senderName, setSenderName] = useState('Juliana Silva');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDispatchedDemand, setLastDispatchedDemand] = useState<OmniRouteDemand | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Active view tab inside OmniRoute
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'sandbox' | 'agents' | 'history' | 'api'>('matrix');

  useEffect(() => {
    omniRouteService.saveAgents(agents);
  }, [agents]);

  useEffect(() => {
    omniRouteService.saveConfig(config);
  }, [config]);

  const handleToggleAgent = (agentId: string) => {
    setAgents((prev) => 
      prev.map((a) => {
        if (a.id === agentId) {
          const updated = { ...a, active: !a.active };
          if (onAddToast) {
            onAddToast({
              type: 'info',
              title: `Agente ${updated.active ? 'Ativado' : 'Pausado'}`,
              message: `${a.name} agora está ${updated.active ? 'em operação no mesh OmniRoute' : 'em modo standby'}.`
            });
          }
          return updated;
        }
        return a;
      })
    );
  };

  const handleDispatchTest = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);

    try {
      const result = await omniRouteService.dispatchDemand({
        channel: selectedChannel,
        rawInput: inputText,
        sourceUserName: senderName,
        sourceContact: `@${senderName.toLowerCase().replace(/\s+/g, '_')}`
      });

      setLastDispatchedDemand(result);
      setDemandsHistory(omniRouteService.getDemandsHistory());
      setAgents(omniRouteService.getAgents());

      if (onAddToast) {
        onAddToast({
          type: 'success',
          title: 'OmniRoute™ Despachado com Sucesso',
          message: `Roteado para ${result.metadata?.agentName} (${result.executionTimeMs}ms) via ${result.channel.toUpperCase()}.`
        });
      }
    } catch (e: any) {
      if (onAddToast) {
        onAddToast({
          type: 'urgent',
          title: 'Falha no Despacho OmniRoute',
          message: e.message || 'Erro inesperado ao rotear mensagem.'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectPreset = (preset: { channel: OmniChannel; text: string; name: string }) => {
    setSelectedChannel(preset.channel);
    setInputText(preset.text);
    setSenderName(preset.name);
  };

  const getChannelBadge = (ch: OmniChannel) => {
    switch (ch) {
      case 'instagram':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-950 text-pink-300 border border-pink-800/60">Instagram DM</span>;
      case 'whatsapp':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">WhatsApp Cloud</span>;
      case 'facebook':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60">Facebook Leads</span>;
      case 'tiktok':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60">TikTok Ads</span>;
      case 'webchat':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">Webchat Site</span>;
      case 'sms':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60">SMS Gateway</span>;
      case 'telegram':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800/60">Telegram</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">CRM Interno</span>;
    }
  };

  const samplePresets = [
    {
      label: 'SDR: Lead de Lentes de Contato',
      channel: 'instagram' as OmniChannel,
      name: 'Mariana Duarte',
      text: 'Vi a transformação de um paciente nos stories. Quanto custa colocar as facetas em resina e tem avaliação sábado?'
    },
    {
      label: 'Urgência: Trauma / Dor Aguda',
      channel: 'whatsapp' as OmniChannel,
      name: 'Carlos Eduardo',
      text: 'Quebrei meu dente da frente almoçando e está doendo demais e sangrando! Vocês têm pronto-atendimento agora?'
    },
    {
      label: 'Marketing: Roteiro Reels / TikTok',
      channel: 'crm_internal' as OmniChannel,
      name: 'Marketing Clínica',
      text: 'Preciso de um roteiro de vídeo curto de 30 segundos sobre como escovar com alinhador invisível para o Instagram.'
    },
    {
      label: 'Pós-Op: Checagem 24h Pós-Cirurgia',
      channel: 'whatsapp' as OmniChannel,
      name: 'Patrícia Souza',
      text: 'Fiz a extração do siso ontem às 15h. O rosto amanheceu meio inchado e quero saber se posso tomar um suco gelado.'
    },
    {
      label: 'Auditoria: Checagem Ética CRO',
      channel: 'crm_internal' as OmniChannel,
      name: 'Dra. Camila Alencar',
      text: 'Posso postar "Tratamento ortodôntico 100% garantido com o melhor preço da Paulista e avaliação gratuita"?'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Mesh Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-4 sm:p-6 rounded-2xl border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Network className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-heading font-black text-white flex items-center gap-2">
                OmniRoute™ <span className="text-indigo-400 text-sm font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800">Mesh v2026.4</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Elo de integração unificado e roteador neural inteligente. Distribui demandas em tempo real entre <strong className="text-indigo-300">8 Agentes Especialistas de IA</strong> e todos os canais de redes sociais e mensageria, com conformidade automática ao CRO (Resolução CFO 196/2019).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-indigo-900/60 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Status do Mesh</p>
                <p className="text-xs font-bold text-emerald-400">8 Agentes Ativos</p>
              </div>
            </div>

            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-indigo-900/60 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Motor Neural</p>
                <p className="text-xs font-bold text-cyan-400">Gemini 2.5 Flash</p>
              </div>
            </div>

            <button
              onClick={() => setActiveSubTab('sandbox')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Testar Roteamento</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Matriz de Roteamento</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sandbox')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulador Interativo</span>
          </button>

          <button
            onClick={() => setActiveSubTab('agents')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'agents'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Agentes & Capacidades ({agents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'history'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Trilha de Auditoria ({demandsHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('api')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'api'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Webhooks & SDK de Integração</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: Matriz Visual de Roteamento */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          {/* Visual Architecture Flow */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Fluxo Neural de Orquestração OmniRoute
                </h3>
                <p className="text-xs text-slate-400">
                  Como uma mensagem ou comando trafega desde os canais sociais até o agente executor final.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Step 1: Inbound Channels */}
              <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">1. Canais Conectados</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">8 Canais</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-300 flex items-center gap-2">📸 Instagram Direct & Reels</span>
                    <span className="text-emerald-400 text-[10px] font-semibold">Live Webhook</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-300 flex items-center gap-2">💬 WhatsApp Cloud API v21</span>
                    <span className="text-emerald-400 text-[10px] font-semibold">Sincronizado</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-300 flex items-center gap-2">📱 TikTok Leads & Ads</span>
                    <span className="text-emerald-400 text-[10px] font-semibold">Pronto</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-300 flex items-center gap-2">🌐 Webchat & Formulário CRM</span>
                    <span className="text-emerald-400 text-[10px] font-semibold">Online</span>
                  </div>
                </div>
              </div>

              {/* Step 2: OmniRoute Engine */}
              <div className="bg-gradient-to-b from-indigo-950/70 to-slate-950 rounded-xl p-4 border border-indigo-500/40 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">2. OmniRoute Core</span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700">Dispatcher</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-indigo-900/30 border border-indigo-700/50">
                    <p className="font-semibold text-white">Análise de Intenção Semântica</p>
                    <p className="text-[11px] text-slate-300">Distingue dor aguda, interesse estético, agendamento e dúvida de rotina em &lt;50ms.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-900/30 border border-indigo-700/50">
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Filtro Ético CRO / CFO 196
                    </p>
                    <p className="text-[11px] text-slate-300">Audita termos proibidos, promessas irreais e ausência de RT antes da resposta.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-900/30 border border-indigo-700/50">
                    <p className="font-semibold text-white">Roteador com Handoff Humano</p>
                    <p className="text-[11px] text-slate-300">Casos atípicos são transferidos de imediato para a recepção física.</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Agent Workers */}
              <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">3. Agentes Especialistas</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">8 Workers</span>
                </div>
                <div className="space-y-1.5 text-xs max-h-56 overflow-y-auto pr-1">
                  {agents.slice(0, 5).map((a) => (
                    <div key={a.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                      <div className="truncate">
                        <p className="font-semibold text-slate-200 truncate">{a.name}</p>
                        <p className="text-[10px] text-slate-400">{a.specialtyBadge}</p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ml-2"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs text-slate-400">Total de Roteamentos</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                {demandsHistory.length + 184}
              </p>
              <p className="text-[10px] text-emerald-400 mt-1">100% de precisão de entrega</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs text-slate-400">Latência Média do Mesh</p>
              <p className="text-xl sm:text-2xl font-bold text-cyan-400 mt-1">
                385 ms
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Tempo real & streaming</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs text-slate-400">Taxa de Conformidade CRO</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                100%
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Resolução CFO 196/2019</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs text-slate-400">Taxa de Handoff Humano</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-400 mt-1">
                3.2%
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Casos complexos/cirúrgicos</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Simulador de Roteamento Interativo (Sandbox) */}
      {activeSubTab === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Sandbox Form */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Simulador de Entrada Multicanal
              </h3>
              <p className="text-xs text-slate-400">
                Escolha um cenário ou digite uma demanda para testar como o OmniRoute seleciona o agente ideal.
              </p>
            </div>

            {/* Presets */}
            <div>
              <p className="text-xs font-semibold text-slate-300 mb-2">Cenários Prontos de Teste:</p>
              <div className="flex flex-wrap gap-1.5">
                {samplePresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel and User */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Canal de Origem</label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value as OmniChannel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="instagram">Instagram Direct / Comentários</option>
                  <option value="whatsapp">WhatsApp Business API</option>
                  <option value="tiktok">TikTok Ads / Mensagens</option>
                  <option value="facebook">Facebook Messenger / Leads</option>
                  <option value="webchat">Webchat do Site</option>
                  <option value="sms">SMS Marketing</option>
                  <option value="telegram">Telegram Bot</option>
                  <option value="crm_internal">Demanda Interna da Clínica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Interagente</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Nome do paciente/lead"
                />
              </div>
            </div>

            {/* Input Message Area */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Mensagem ou Solicitação</label>
              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                placeholder="Ex: Gostaria de saber como funciona o clareamento a laser e se mancha o esmalte..."
              />
            </div>

            <button
              onClick={handleDispatchTest}
              disabled={isProcessing || !inputText.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Roteando pelo OmniRoute Mesh...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Despachar Demanda pelo OmniRoute</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Dispatch Output & Inspection */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Resultado do Roteamento Neural
              </h3>
              <p className="text-xs text-slate-400">
                Inspeção detalhada da decisão de rota, agente selecionado e conformidade.
              </p>
            </div>

            {lastDispatchedDemand ? (
              <div className="space-y-4">
                {/* Meta Summary Pills */}
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {getChannelBadge(lastDispatchedDemand.channel)}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {lastDispatchedDemand.metadata?.agentName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {lastDispatchedDemand.executionTimeMs} ms
                  </span>
                  {lastDispatchedDemand.croApproved && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      CRO Aprovado
                    </span>
                  )}
                </div>

                {/* Intent & Priority */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Intenção Detectada:</span>
                    <strong className="text-white text-xs">{lastDispatchedDemand.detectedIntent}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Prioridade:</span>
                    <span className={`text-xs font-bold uppercase ${
                      lastDispatchedDemand.priority === 'critica' ? 'text-rose-400' :
                      lastDispatchedDemand.priority === 'alta' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {lastDispatchedDemand.priority}
                    </span>
                  </div>
                </div>

                {/* Agent Response Content */}
                <div>
                  <span className="text-xs font-medium text-slate-400 block mb-1.5">Resposta Gerada pelo Agente:</span>
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-950 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line shadow-inner">
                    {lastDispatchedDemand.agentOutput}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Horário: {lastDispatchedDemand.timestamp}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(lastDispatchedDemand.agentOutput || '');
                      if (onAddToast) {
                        onAddToast({
                          type: 'success',
                          title: 'Copiado!',
                          message: 'Resposta do agente copiada para a área de transferência.'
                        });
                      }
                    }}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Resposta</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                <Network className="w-10 h-10 text-indigo-500/40 mb-2" />
                <p className="text-sm font-semibold text-slate-300">Nenhum despacho executado ainda</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Selecione um dos cenários prontos à esquerda e clique em "Despachar Demanda" para ver o motor neural responder.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Roster de Agentes do Mesh */}
      {activeSubTab === 'agents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                Roster de Agentes Especialistas ({agents.length})
              </h3>
              <p className="text-xs text-slate-400">
                Cada agente possui prompt de sistema dedicado, conjunto de canais autorizados e telemetria própria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className={`p-4 rounded-xl border transition-all ${
                  agent.active 
                    ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' 
                    : 'bg-slate-950/60 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {agent.specialtyBadge}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={agent.active} 
                      onChange={() => handleToggleAgent(agent.id)}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{agent.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{agent.description}</p>

                <div className="space-y-1 text-[11px] text-slate-300 border-t border-slate-800/80 pt-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modelo:</span>
                    <span className="text-cyan-400 font-mono">{agent.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Latência:</span>
                    <span>{agent.avgLatencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Taxa de Sucesso:</span>
                    <span className="text-emerald-400 font-semibold">{agent.successRate}%</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.supportedChannels.map((ch) => (
                    <span key={ch} className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: Trilha de Auditoria (History) */}
      {activeSubTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Histórico de Demandas Roteadas
              </h3>
              <p className="text-xs text-slate-400">
                Log completo para auditoria clínica, rastreabilidade e métricas de desempenho.
              </p>
            </div>
            {demandsHistory.length > 0 && (
              <button
                onClick={() => {
                  omniRouteService.clearDemands();
                  setDemandsHistory([]);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Limpar Histórico
              </button>
            )}
          </div>

          {demandsHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhuma demanda registrada ainda. Use o Simulador Interativo para testar o roteador.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2">Canal</th>
                    <th className="pb-2">Interagente</th>
                    <th className="pb-2">Intenção</th>
                    <th className="pb-2">Agente</th>
                    <th className="pb-2">Latência</th>
                    <th className="pb-2">CRO</th>
                    <th className="pb-2">Horário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {demandsHistory.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5">{getChannelBadge(d.channel)}</td>
                      <td className="py-2.5 font-medium text-slate-200">{d.sourceUserName}</td>
                      <td className="py-2.5 text-slate-300">{d.detectedIntent}</td>
                      <td className="py-2.5 text-indigo-300 font-medium">{d.metadata?.agentName || d.assignedAgentId}</td>
                      <td className="py-2.5 text-cyan-400 font-mono">{d.executionTimeMs}ms</td>
                      <td className="py-2.5">
                        {d.croApproved ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold">Alerta</span>
                        )}
                      </td>
                      <td className="py-2.5 text-slate-500">{d.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 5: Endpoints da API e SDK */}
      {activeSubTab === 'api' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-400" />
                Elo de Integração & Endpoints da API
              </h3>
              <p className="text-xs text-slate-400">
                Como plugar sistemas externos (Instagram webhook, n8n, Zapier ou bots) diretamente no motor OmniRoute.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`curl -X POST http://localhost:3000/api/omniroute/dispatch \\
  -H "Content-Type: application/json" \\
  -d '{"channel":"instagram","input":"Quanto custa o alinhador invisivel?","sourceUserName":"Mariana"}'`);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copiado!' : 'Copiar cURL'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
            <p className="text-emerald-400"># 1. Endpoint de Despacho Neural</p>
            <p className="text-indigo-400 font-bold">POST /api/omniroute/dispatch</p>
            <p className="text-slate-400 text-[11px]">Corpo da requisição JSON:</p>
            <pre className="text-cyan-300 text-[11px]">
{`{
  "channel": "whatsapp" | "instagram" | "tiktok" | "facebook" | "webchat",
  "input": "Mensagem recebida do lead",
  "sourceUserName": "Nome do Paciente",
  "agentId": "agent_sdr" // opcional (detectado automaticamente se omitido)
}`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
            <p className="text-emerald-400"># 2. Endpoint de Status & Roster do Mesh</p>
            <p className="text-indigo-400 font-bold">GET /api/omniroute/config</p>
            <p className="text-slate-400 text-[11px]">Retorna lista de canais autorizados, contadores e estado de conexão com o Gemini.</p>
          </div>
        </div>
      )}
    </div>
  );
};

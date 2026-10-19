import React, { useState } from 'react';
import { aiAgentsList } from '../data/agentsData';
import { AgentConfig, AgentType } from '../types';
import { 
  Bot, 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  ShieldAlert, 
  Video, 
  Stethoscope, 
  MessageSquareShare, 
  CalendarCheck2, 
  Layers, 
  Loader2,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';

export const AiAgentsHub: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentType>('cro_compliance');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [agentResult, setAgentResult] = useState<string | null>(null);
  const [generatedSource, setGeneratedSource] = useState<string>('');

  const currentAgent = aiAgentsList.find((a) => a.id === selectedAgentId) || aiAgentsList[0];

  // Dynamic input states based on agent
  const [formData, setFormData] = useState<any>({ ...currentAgent.sampleInput });

  const handleSelectAgent = (agent: AgentConfig) => {
    setSelectedAgentId(agent.id);
    setFormData({ ...agent.sampleInput });
    setAgentResult(null);
  };

  const handleResetToPreset = () => {
    setFormData({ ...currentAgent.sampleInput });
  };

  const handleRunAgent = async () => {
    setLoading(true);
    setAgentResult(null);
    try {
      const response = await fetch('/api/gemini/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: selectedAgentId,
          inputData: formData,
        }),
      });

      const data = await response.json();
      if (data && data.result) {
        setAgentResult(data.result);
        setGeneratedSource(data.generatedWith || 'gemini-3.8-flash');
      } else {
        setAgentResult('Ocorreu um erro ao processar. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Failed to run agent:', err);
      setAgentResult('Falha na conexão com o servidor de IA. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!agentResult) return;
    navigator.clipboard.writeText(agentResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAgentIcon = (id: AgentType) => {
    switch (id) {
      case 'cro_compliance':
        return <ShieldAlert className="w-5 h-5 text-indigo-500" />;
      case 'viral_video_script':
        return <Video className="w-5 h-5 text-rose-500" />;
      case 'smart_triage':
        return <Stethoscope className="w-5 h-5 text-blue-500" />;
      case 'whatsapp_followup':
        return <MessageSquareShare className="w-5 h-5 text-emerald-500" />;
      case 'smart_scheduler':
        return <CalendarCheck2 className="w-5 h-5 text-cyan-500" />;
      case 'content_creator':
        return <Layers className="w-5 h-5 text-amber-500" />;
      default:
        return <Bot className="w-5 h-5 text-cyan-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exército Autônomo de IA Odontológica</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Hub de Agentes Especializados em Marketing Ético & Operação Clínica
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
            Cada agente foi desenvolvido com diretrizes clínicas rigorosas, regras de publicidade do Conselho Regional de Odontologia (CRO / Resolução CFO 196/2019) e técnicas virais de retenção digital.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
            Motor: Gemini 3.8 Flash
          </span>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiAgentsList.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => handleSelectAgent(agent)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {getAgentIcon(agent.id)}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {agent.category}
                  </span>
                </div>

                <h3 className={`text-sm font-heading font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {agent.name}
                </h3>
                <p className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {agent.shortDesc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100/10 flex items-center justify-between text-xs">
                <span className={`text-[11px] font-medium ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {isSelected ? 'Agente Ativo no Painel' : 'Configurar e Executar'}
                </span>
                <Play className={`w-3 h-3 ${isSelected ? 'text-cyan-400 fill-cyan-400' : 'text-slate-400'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Agent Workspace: Inputs on Left, Real-Time Generated Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                {getAgentIcon(currentAgent.id)}
              </div>
              <div>
                <h3 className="text-sm font-heading font-bold text-slate-900">
                  {currentAgent.name}
                </h3>
                <p className="text-[11px] text-slate-500">{currentAgent.role}</p>
              </div>
            </div>

            <button
              onClick={handleResetToPreset}
              title="Restaurar Exemplo Clínico"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 p-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px]">Preset</span>
            </button>
          </div>

          {/* Form Fields Customized for Each Agent */}
          <div className="space-y-4">
            {currentAgent.id === 'cro_compliance' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Texto ou Copy da Propaganda / Post para Auditoria:
                  </label>
                  <textarea
                    rows={5}
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Cole aqui o texto do anúncio, legenda do Instagram ou script..."
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    O agente analisará regras de preços, antes e depois (Resolução 196/2019) e termos mercantilistas.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Cirurgião-Dentista / RT:
                    </label>
                    <input
                      type="text"
                      value={formData.dentistName || ''}
                      onChange={(e) => setFormData({ ...formData, dentistName: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Inscrição no CRO:
                    </label>
                    <input
                      type="text"
                      value={formData.croNumber || ''}
                      onChange={(e) => setFormData({ ...formData, croNumber: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            {currentAgent.id === 'viral_video_script' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tema do Vídeo Odontológico:
                  </label>
                  <input
                    type="text"
                    value={formData.topic || ''}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                    placeholder="Ex: Alinhadores Invisíveis vs Aparelho de Metal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Público-Alvo Desejado:
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience || ''}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Tom de Voz:
                    </label>
                    <input
                      type="text"
                      value={formData.tone || ''}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Duração Ideal:
                    </label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </>
            )}

            {currentAgent.id === 'smart_triage' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome do Paciente:
                    </label>
                    <input
                      type="text"
                      value={formData.patientName || ''}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Idade:
                    </label>
                    <input
                      type="text"
                      value={formData.patientAge || ''}
                      onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Queixa Principal e Sintomas Relatados:
                  </label>
                  <textarea
                    rows={4}
                    value={formData.symptoms || ''}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Descreva dor, sensibilidade, inchaço, trauma ou queixa estética..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Histórico Médico / Alergias:
                  </label>
                  <input
                    type="text"
                    value={formData.medicalHistory || ''}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {currentAgent.id === 'whatsapp_followup' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome do Paciente:
                    </label>
                    <input
                      type="text"
                      value={formData.patientName || ''}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Tipo de Follow-up:
                    </label>
                    <input
                      type="text"
                      value={formData.followupType || ''}
                      onChange={(e) => setFormData({ ...formData, followupType: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Procedimento Realizado:
                  </label>
                  <input
                    type="text"
                    value={formData.procedure || ''}
                    onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Dentista e Detalhes Clínicos do Pós:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.details || ''}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            {currentAgent.id === 'smart_scheduler' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tratamento / Procedimento:
                  </label>
                  <input
                    type="text"
                    value={formData.treatment || ''}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Horários Disponíveis na Agenda da Clínica:
                  </label>
                  <input
                    type="text"
                    value={formData.availableSlots || ''}
                    onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Perfil de Captação do Paciente:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.profile || ''}
                    onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </>
            )}

            {currentAgent.id === 'content_creator' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tema Educativo:
                  </label>
                  <input
                    type="text"
                    value={formData.topic || ''}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Público-Alvo:
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience || ''}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tom de Voz e Posicionamento:
                  </label>
                  <input
                    type="text"
                    value={formData.tone || ''}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunAgent}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-500 hover:to-teal-500 text-white font-heading font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando com IA Odontológica...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Executar {currentAgent.name}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Execution Output & Compliance Result (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 min-h-[500px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-heading font-bold text-slate-900">
                  Resultado Gerado pelo Agente
                </h3>
              </div>

              {agentResult && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
                    {generatedSource}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Output Content Area */}
            <div className="mt-4">
              {loading ? (
                <div className="h-80 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                    <Sparkles className="w-5 h-5 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-xs font-medium text-slate-600 animate-pulse">
                    O Agente está raciocinando sobre as normas clínicas e do CRO...
                  </p>
                </div>
              ) : agentResult ? (
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 text-xs text-slate-800 leading-relaxed font-sans overflow-x-auto whitespace-pre-wrap max-h-[550px] overflow-y-auto">
                  {agentResult}
                </div>
              ) : (
                <div className="h-80 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-sm font-bold text-slate-700">
                      Nenhum resultado gerado ainda
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure os parâmetros no painel ao lado ou use o botão 'Preset' e clique em <strong>Executar</strong> para gerar conteúdos com auditoria do CRO em tempo real.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Regulatory Safety Assurance */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantia de Não-Mercantilização & Segurança Jurídica</span>
            </div>
            <span>Resolução CFO 196/2019</span>
          </div>
        </div>
      </div>
    </div>
  );
};

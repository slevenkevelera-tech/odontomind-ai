import React, { useState } from 'react';
import { initialAutomationSkills, sampleExecutionLogs } from '../data/automationSkillsData';
import { AutomationSkill, AutomationExecutionLog, PatientLead, ToastNotification } from '../types';
import {
  Zap,
  Play,
  Check,
  Copy,
  Sparkles,
  Clock,
  ArrowRight,
  Search,
  ShieldCheck,
  CalendarClock,
  Activity,
  CreditCard,
  Star,
  Stethoscope,
  HeartHandshake,
  Webhook,
  Send,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  X,
  RefreshCw,
  SlidersHorizontal,
  FileCode,
  AlertTriangle,
  ChevronRight,
  CheckCheck
} from 'lucide-react';

interface AutomationSkillsHubProps {
  patients: PatientLead[];
  onTriggerToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const AutomationSkillsHub: React.FC<AutomationSkillsHubProps> = ({
  patients,
  onTriggerToast
}) => {
  const [skills, setSkills] = useState<AutomationSkill[]>(initialAutomationSkills);
  const [logs, setLogs] = useState<AutomationExecutionLog[]>(sampleExecutionLogs);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabSubView, setActiveTabSubView] = useState<'skills' | 'logs' | 'webhooks'>('skills');

  // Modal / Drawer state for testing a skill
  const [executingSkill, setExecutingSkill] = useState<AutomationSkill | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'sms' | 'webhook'>('whatsapp');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    content: string;
    model: string;
    timeMs: number;
    channel: string;
  } | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Webhook tester state
  const [webhookUrl, setWebhookUrl] = useState<string>('https://webhook.site/clinic-n8n-stream');
  const [webhookEvent, setWebhookEvent] = useState<string>('appointment.confirmed');
  const [webhookTesting, setWebhookTesting] = useState<boolean>(false);
  const [webhookResult, setWebhookResult] = useState<any>(null);

  // Batch sweep state
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [sweepResult, setSweepResult] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'Todas as Skills' },
    { id: 'Anti-Falta (No-Show)', label: 'Anti-Falta (No-Show)' },
    { id: 'Retenção & LTV', label: 'Retenção & LTV' },
    { id: 'Clínico & Pós-Op', label: 'Clínico & Pós-Op' },
    { id: 'Captação & Vendas', label: 'Captação & Vendas' },
    { id: 'Integração & Webhooks', label: 'Integrações & Webhooks' }
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCat = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesQuery =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.triggerLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const activeSkillsCount = skills.filter((s) => s.enabled).length;

  // Toggle skill on/off
  const handleToggleSkill = (skillId: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          const nextState = !s.enabled;
          onTriggerToast({
            type: nextState ? 'success' : 'warning',
            title: nextState ? 'Skill Ativada' : 'Skill Pausada',
            message: `${s.name} foi ${nextState ? 'ativada e monitorando em tempo real.' : 'pausada.'}`
          });
          return { ...s, enabled: nextState };
        }
        return s;
      })
    );
  };

  // Run single skill execution test
  const handleRunSkill = async () => {
    if (!executingSkill) return;
    setIsExecuting(true);
    setExecutionResult(null);

    const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

    try {
      const res = await fetch('/api/automations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId: executingSkill.id,
          patient: {
            name: patient.name,
            phone: patient.phone,
            treatment: patient.treatment,
            dentistAssigned: patient.dentistAssigned,
            appointmentDate: patient.appointmentDate || 'Amanhã às 14:30'
          },
          customNotes,
          channel: selectedChannel
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setExecutionResult({
          content: data.generatedContent,
          model: data.modelUsed,
          timeMs: data.executionTimeMs,
          channel: data.channel
        });

        // Add to audit trail log
        const newLog: AutomationExecutionLog = {
          id: `log-${Date.now()}`,
          skillId: executingSkill.id,
          skillName: executingSkill.name,
          patientName: patient.name,
          patientPhone: patient.phone,
          timestamp: 'Agora mesmo',
          channel: selectedChannel,
          status: 'executado',
          triggerReason: `Execução manual de teste para ${patient.name}`,
          generatedContent: data.generatedContent,
          aiModelUsed: data.modelUsed,
          executionTimeMs: data.executionTimeMs
        };

        setLogs((prev) => [newLog, ...prev]);

        // Increment skill execution count
        setSkills((prev) =>
          prev.map((s) => (s.id === executingSkill.id ? { ...s, executionCount: s.executionCount + 1 } : s))
        );

        onTriggerToast({
          type: 'success',
          title: 'Skill Executada com Sucesso',
          message: `Mensagem clínica gerada em ${data.executionTimeMs}ms com conformidade CRO.`
        });
      } else {
        throw new Error(data?.message || 'Falha ao processar automação');
      }
    } catch (err: any) {
      console.error('Error running skill:', err);
      onTriggerToast({
        type: 'urgent',
        title: 'Erro na Automação',
        message: err.message || 'Não foi possível disparar a automação.'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Run Batch Sweep
  const handleRunBatchSweep = async () => {
    setIsSweeping(true);
    try {
      const res = await fetch('/api/automations/batch-sweep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeSkillIds: skills.filter((s) => s.enabled).map((s) => s.id)
        })
      });
      const data = await res.json();
      if (data && data.success) {
        setSweepResult(data);
        onTriggerToast({
          type: 'success',
          title: 'Varredura Diária Concluída!',
          message: `${data.scannedPatientsCount} pacientes analisados. ${data.totalDispatched} automações executadas.`
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSweeping(false);
    }
  };

  // Test Webhook Dispatch
  const handleTestWebhook = async () => {
    setWebhookTesting(true);
    setWebhookResult(null);
    try {
      const res = await fetch('/api/automations/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl,
          event: webhookEvent
        })
      });
      const data = await res.json();
      setWebhookResult(data);
      if (data.success) {
        onTriggerToast({
          type: 'success',
          title: 'Webhook Disparado com Sucesso',
          message: `Endpoint respondeu HTTP ${data.statusCode} em ${data.latencyMs}ms.`
        });
      } else {
        onTriggerToast({
          type: 'warning',
          title: 'Retorno do Webhook',
          message: `Status: ${data.statusCode} (${data.statusText})`
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setWebhookTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'CalendarClock':
        return <CalendarClock className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5" />;
      case 'Star':
        return <Star className="w-5 h-5" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'Webhook':
        return <Webhook className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Motor de Automações Clínicas & CRO
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Auditado CFO 196/2019
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Skills de Automação & Workflows Inteligentes
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Automações ativas que blindam sua clínica contra no-shows, recuperam orçamentos de alto ticket, monitoram a dor pós-operatória de cirurgias e fidelizam pacientes com IA ética.
            </p>
          </div>

          {/* Quick Actions & Live Trigger Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunBatchSweep}
              disabled={isSweeping}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSweeping ? 'animate-spin' : ''}`} />
              {isSweeping ? 'Varrendo CRM...' : 'Simular Varredura Diária'}
            </button>

            <button
              onClick={() => setActiveTabSubView('webhooks')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm transition-all"
            >
              <Webhook className="w-4 h-4 text-cyan-400" />
              Webhooks & APIs
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/40 border border-slate-800/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Skills Ativas</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {activeSkillsCount} <span className="text-xs text-slate-500 font-normal">/ {skills.length}</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Monitoramento contínuo
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>No-Show Reduzido</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">-43%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Confirmação em 2 tempos</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Tempo Economizado</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">38h <span className="text-xs text-slate-400 font-normal">/mês</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">Equipe focada no atendimento</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Receita Recuperada</span>
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">R$ 48.900</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Resgate de propostas e recall</div>
          </div>
        </div>
      </div>

      {/* Sweep Result Drawer Alert (if ran) */}
      {sweepResult && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex items-start justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg mt-0.5">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-200">
                Varredura Executada: {sweepResult.scannedPatientsCount} pacientes escaneados
              </h4>
              <p className="text-xs text-emerald-300/80 mt-1">
                Disparos gerados: {sweepResult.totalDispatched} ações executadas automaticamente. Estimativa de {sweepResult.estimatedHoursSaved}h de recepção economizadas hoje.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {sweepResult.triggeredActions.map((act: any, idx: number) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                    {act.skill}: <strong>{act.count} disparos</strong> ({act.channel})
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSweepResult(null)}
            className="text-slate-400 hover:text-white p-1 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Secondary Navigation (Skills / Logs / Webhooks) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabSubView('skills')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTabSubView === 'skills'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Painel de Skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTabSubView('logs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTabSubView === 'logs'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Logs & Auditoria ({logs.length})
          </button>
          <button
            onClick={() => setActiveTabSubView('webhooks')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTabSubView === 'webhooks'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Webhooks & Hub
          </button>
        </div>

        {activeTabSubView === 'skills' && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar skill por nome ou gatilho..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Subview 1: SKILLS LIST & CARDS */}
      {activeTabSubView === 'skills' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-200 text-slate-900 font-bold shadow'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid of Automation Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className={`group relative rounded-2xl border transition-all duration-200 ${
                  skill.enabled
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-950/20'
                    : 'bg-slate-950/60 border-slate-800/50 opacity-75'
                }`}
              >
                {/* Header of the Card */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${skill.accentColor} flex items-center justify-center text-white shadow-md flex-shrink-0`}
                      >
                        {getSkillIcon(skill.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${skill.badgeColor}`}>
                            {skill.category}
                          </span>
                          {skill.croSafe && (
                            <span className="text-[10px] flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                              <ShieldCheck className="w-3 h-3" /> CRO Seguro
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                          {skill.name}
                        </h3>
                      </div>
                    </div>

                    {/* Enable/Disable Toggle */}
                    <button
                      onClick={() => handleToggleSkill(skill.id)}
                      title={skill.enabled ? 'Pausar automação' : 'Ativar automação'}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        skill.enabled ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                          skill.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {skill.tagline}
                  </p>

                  {/* Trigger & Channels Info */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-400">Gatilho:</span>
                      <strong className="text-white font-medium">{skill.triggerLabel}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {skill.channels.map((ch) => (
                        <span
                          key={ch}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700 flex items-center gap-1"
                        >
                          {ch === 'whatsapp' && <Smartphone className="w-3 h-3 text-emerald-400" />}
                          {ch === 'sms' && <MessageSquare className="w-3 h-3 text-cyan-400" />}
                          {ch === 'webhook' && <Webhook className="w-3 h-3 text-indigo-400" />}
                          {ch === 'clinical_alert' && <Activity className="w-3 h-3 text-rose-400" />}
                          {ch === 'email' && <Send className="w-3 h-3 text-amber-400" />}
                          {ch.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual Step Timeline */}
                  <div className="mt-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                      Fluxo de Execução em Cadeia:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {skill.steps.map((st) => (
                        <div key={st.id} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                          <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                            {st.order}
                          </span>
                          <div className="min-w-0">
                            <div className="text-slate-200 font-medium truncate text-[11px]">
                              {st.title}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">
                              {st.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CRO Rule Compliance Footer */}
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-800/30 p-2 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">
                      <strong>CRO:</strong> {skill.croRuleRef} — {skill.croNote}
                    </span>
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800/80 rounded-b-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div>
                      Execuções: <strong className="text-white">{skill.executionCount}</strong>
                    </div>
                    <div className="hidden sm:block">
                      Impacto: <strong className="text-emerald-400">{skill.metrics.impactValue}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setExecutingSkill(skill);
                      setExecutionResult(null);
                      setCustomNotes('');
                      setSelectedChannel(skill.channels[0] === 'sms' ? 'sms' : 'whatsapp');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    Testar / Executar Agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subview 2: AUDIT TRAIL & LOGS */}
      {activeTabSubView === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                Trilha de Auditoria & Logs de Automação
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Histórico em tempo real de disparos automáticos, confirmações de pacientes e integrações com o WhatsApp.
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
              {logs.length} registros auditados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Automação / Skill</th>
                  <th className="p-3.5">Paciente</th>
                  <th className="p-3.5">Canal</th>
                  <th className="p-3.5">Gatilho Disparador</th>
                  <th className="p-3.5">Conteúdo / Resposta</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Latência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-medium text-white">
                      <div className="font-bold">{log.skillName}</div>
                      <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{log.patientName}</div>
                      <div className="text-[10px] text-slate-400">{log.patientPhone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                        {log.channel}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-slate-400">
                      {log.triggerReason}
                    </td>
                    <td className="p-3.5 max-w-sm">
                      <p className="line-clamp-2 text-slate-300 text-[11px] bg-slate-950/40 p-1.5 rounded border border-slate-800/50">
                        {log.generatedContent}
                      </p>
                      {log.response && (
                        <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                          <CheckCheck className="w-3 h-3" /> Resposta: "{log.response}"
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'resposta_recebida'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : log.status === 'executado' || log.status === 'enviado'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {log.status === 'resposta_recebida' && <CheckCheck className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px]">
                      {log.executionTimeMs}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subview 3: WEBHOOKS & EXTERNAL HUBS */}
      {activeTabSubView === 'webhooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  <Webhook className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Testador de Webhook & Disparo HTTP em Tempo Real
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dispare eventos clínicos em tempo real para seu n8n, Make.com, ActiveCampaign, RD Station ou ERP odontológico.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL do Endpoint de Destino (Webhook URL):
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://webhook.site/seu-endpoint ou https://n8n.suaclinica.com/webhook/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Evento Clínico a Disparar:
                  </label>
                  <select
                    value={webhookEvent}
                    onChange={(e) => setWebhookEvent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="appointment.confirmed">appointment.confirmed (Consulta Confirmada pelo Paciente)</option>
                    <option value="patient.triage_completed">patient.triage_completed (Triagem Anamnese IA Concluída)</option>
                    <option value="patient.recall_triggered">patient.recall_triggered (Disparo de Checkup 180d)</option>
                    <option value="post_op.pain_alert">post_op.pain_alert (Alerta Vermelho de Dor Pós-Cirúrgica)</option>
                    <option value="crm.pipeline_stage_changed">crm.pipeline_stage_changed (Mudança de Coluna no Funil)</option>
                  </select>
                </div>

                <button
                  onClick={handleTestWebhook}
                  disabled={webhookTesting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                >
                  <Send className="w-4 h-4" />
                  {webhookTesting ? 'Enviando Disparo HTTP...' : 'Enviar Webhook de Teste Agora'}
                </button>
              </div>

              {/* Webhook Response Log Box */}
              {webhookResult && (
                <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      Status da Resposta:
                      <span
                        className={`font-mono px-2 py-0.5 rounded font-bold ${
                          webhookResult.success
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        HTTP {webhookResult.statusCode} ({webhookResult.statusText})
                      </span>
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Latência: {webhookResult.latencyMs}ms
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono bg-slate-900 p-3 rounded-lg overflow-x-auto max-h-48">
                    {JSON.stringify(webhookResult.responseBody || webhookResult.payloadSent, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Webhook Integration Docs & Safe Guidelines */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Segurança & Criptografia LGPD
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Todos os webhooks disparados pela <strong>OdontoMind AI</strong> incluem o cabeçalho seguro:
              </p>
              <div className="mt-2 p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 select-all">
                x-odontomind-signature: sha256=...
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Isso garante que somente a sua clínica tem acesso aos dados clínicos confidenciais.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Integrações Nativas Suportadas
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <strong>WhatsApp Web API:</strong> Z-API, Evolution API, Baileys
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <strong>Automação No-Code:</strong> n8n, Make.com, Zapier
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <strong>Marketing Odontológico:</strong> RD Station, ActiveCampaign
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <strong>Prontuários & ERP:</strong> Clinicorp, Simples Dental
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL / DRAWER: TEST AND EXECUTE AUTOMATION SKILL LIVE   */}
      {/* ======================================================== */}
      {executingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${executingSkill.accentColor} flex items-center justify-center text-white shadow-md`}
                >
                  {getSkillIcon(executingSkill.icon)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {executingSkill.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{executingSkill.category}</span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> CFO 196/2019
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setExecutingSkill(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Patient Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Selecione o Paciente do CRM para a Simulação:
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.treatment} ({p.dentistAssigned})
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Canal de Disparo:
                  </label>
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="whatsapp">WhatsApp (Conversa Interativa)</option>
                    <option value="sms">SMS Transacional (Contingência)</option>
                    <option value="webhook">Webhook JSON (Integração Externa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gatilho Selecionado:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={executingSkill.triggerLabel}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Custom Context or Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Instruções Clínicas / Notas Extras (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lembrar de jejum de 2h e levar exames de sangue..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Execution Action Button */}
              <button
                onClick={handleRunSkill}
                disabled={isExecuting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                {isExecuting ? 'Gerando Mensagem Ética com Gemini IA...' : 'Processar & Gerar Disparo Agora'}
              </button>

              {/* Execution Result Box (Simulated WhatsApp/SMS Message) */}
              {executionResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      Visualização do Disparo ({executionResult.channel.toUpperCase()}):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {executionResult.model} • {executionResult.timeMs}ms
                      </span>
                      <button
                        onClick={() => copyToClipboard(executionResult.content)}
                        className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60"
                      >
                        {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedText ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  {/* Simulated WhatsApp Bubble */}
                  <div className="bg-[#0b141a] p-4 rounded-xl border border-slate-800/80 max-w-lg mx-auto">
                    <div className="bg-[#202c33] text-slate-100 p-3.5 rounded-2xl rounded-tl-none shadow-md text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {executionResult.content}
                    </div>

                    {/* Simulated Interactive WhatsApp Quick Buttons */}
                    {executingSkill.template.actionButtons && (
                      <div className="mt-2 space-y-1.5">
                        {executingSkill.template.actionButtons.map((btn, bidx) => (
                          <div
                            key={bidx}
                            className="bg-[#202c33] hover:bg-[#2a3942] text-cyan-400 text-center py-2 px-3 rounded-xl text-xs font-medium border border-slate-700/40 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            {btn}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Resolução CFO 196/2019: Proibida mercantilização de preços e garantias de cura.
              </span>
              <button
                onClick={() => setExecutingSkill(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { roadmapSteps } from '../data/roadmapData';
import { TabType } from '../types';
import { 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Lock, 
  Workflow, 
  Layers, 
  Check, 
  Clock,
  Sparkles,
  ExternalLink,
  Bot,
  Kanban
} from 'lucide-react';

interface RoadmapMapProps {
  onNavigateTab: (tab: TabType) => void;
}

export const RoadmapMap: React.FC<RoadmapMapProps> = ({ onNavigateTab }) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(roadmapSteps[0].id);
  const activeStep = roadmapSteps.find((s) => s.id === selectedPhaseId) || roadmapSteps[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner with Executive Senior Engineer Brief */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
            <Cpu className="w-3.5 h-3.5" />
            <span>Engenharia de Software & IA Aplicada à Odontologia de Alta Performance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-white leading-tight">
            Mapa Arquitetural: Da Infraestrutura Web Segura ao Exército de Agentes IA
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Plano diretor completo desenhado para transformar a clínica em uma potência digital: portal web ultrarrápido bioestético, esteira de serviços de alto ticket, CRM integrado de pacientes com prontuário em nuvem, automações clínicas e marketing viral 100% blindado contra infrações do Conselho Regional de Odontologia (CRO/CFO).
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              LGPD & Criptografia Médica
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-4 h-4 text-cyan-400" />
              Resolução CFO 196/2019 Blindada
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Workflow className="w-4 h-4 text-teal-400" />
              5 Fases Integradas em Tempo Real
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Roadmap Map Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900">
              Jornada Arquitetural Interativa
            </h2>
            <p className="text-xs text-slate-500">
              Clique em cada estação do mapa para explorar a engenharia detalhada, entregáveis e normas de segurança.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
            Fase Atual: {activeStep.phase} de 5
          </span>
        </div>

        {/* The Node Highway Map */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {roadmapSteps.map((step, idx) => {
            const isSelected = selectedPhaseId === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedPhaseId(step.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg -translate-y-1'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Fase 0{step.phase}
                    </span>
                    <span className={`text-[11px] flex items-center gap-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Clock className="w-3 h-3" />
                      {step.duration}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold font-heading line-clamp-2 mb-1.5 ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}>
                    {step.title}
                  </h3>

                  <p className={`text-xs line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {step.badge}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100/10 flex items-center justify-between text-xs font-medium">
                  <span className={isSelected ? 'text-cyan-400' : 'text-slate-500'}>
                    Ver Detalhes
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection Panel for Selected Step */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 mb-1">
              <span>Fase 0{activeStep.phase}</span>
              <span aria-hidden="true">·</span>
              <span>{activeStep.phaseTitle}</span>
              <span aria-hidden="true">·</span>
              <span>Duração Estimada: {activeStep.duration}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
              {activeStep.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {activeStep.description}
            </p>
          </div>

          {/* Direct Navigation Links if applicable */}
          <div className="flex items-center gap-2 shrink-0">
            {activeStep.phase === 3 && (
              <button
                onClick={() => onNavigateTab('crm')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Kanban className="w-3.5 h-3.5 text-cyan-400" />
                <span>Abrir CRM Odontológico</span>
              </button>
            )}
            {activeStep.phase === 4 && (
              <button
                onClick={() => onNavigateTab('content_agents')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Acessar Estúdio de Conteúdo IA</span>
              </button>
            )}
            {activeStep.phase === 2 && (
              <button
                onClick={() => onNavigateTab('services')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver Serviços & Margem</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Columns: Engineering, Deliverables, Security & CRO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engineering Specifications */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Especificações Técnicas de Engenharia</span>
            </div>
            <ul className="space-y-2.5">
              {activeStep.engineeringDetails.map((item, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concrete Deliverables */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Entregáveis & Módulos Funcionais</span>
            </div>
            <ul className="space-y-2.5">
              {activeStep.deliverables.map((item, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security, LGPD & CRO Compliance */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Segurança de Dados, LGPD & Ética CRO</span>
            </div>
            <ul className="space-y-2.5">
              {activeStep.securityAndCompliance.map((item, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive KPI & Benchmark Comparison */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-6">
            <div>
              <span className="block text-[11px] text-slate-400">Benchmark Internacional</span>
              <strong className="text-slate-800 font-semibold">Suíça & Estados Unidos (Padrão ADA / ISO)</strong>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">Tempo de Resposta Médio</span>
              <strong className="text-emerald-600 font-semibold">&lt; 45 segundos (via IA)</strong>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">Taxa de Retenção de Paciente</span>
              <strong className="text-cyan-600 font-semibold">91.4% ao ano</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const currentIndex = roadmapSteps.findIndex((s) => s.id === activeStep.id);
                const nextStep = roadmapSteps[(currentIndex + 1) % roadmapSteps.length];
                setSelectedPhaseId(nextStep.id);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
            >
              Avançar para Próxima Fase →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

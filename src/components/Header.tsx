import React, { useState } from 'react';
import { TabType, ToastNotification } from '../types';
import { ToastNotificationCenter } from './ToastNotificationCenter';
import {
  Compass,
  Kanban,
  Bot,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Activity,
  PlusCircle,
  BarChart3,
  Calendar,
  Share2,
  MessagesSquare,
  Cloud,
  Github,
  Zap,
  Menu,
  X,
  ChevronRight,
  Network
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenNewPatientModal: () => void;
  onOpenRenderModal: () => void;
  onOpenGitHubModal: () => void;
  totalPipelineValue: number;
  notifications: ToastNotification[];
  onDismissToast: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onClearAllNotifications: () => void;
  onTriggerDemoToast: (type: 'confirmed' | 'followup' | 'urgent') => void;
  compact?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewPatientModal,
  onOpenRenderModal,
  onOpenGitHubModal,
  totalPipelineValue,
  notifications,
  onDismissToast,
  onMarkAllNotificationsAsRead,
  onClearAllNotifications,
  onTriggerDemoToast,
  compact = false
}) => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string; desc?: string }[] = [
    {
      id: 'crm',
      label: 'CRM de Pacientes',
      icon: <Kanban className="w-4 h-4" />,
      badge: 'Prontuários',
      desc: 'Funil Kanban, Prontuários Clínicos e Histórico Odontológico'
    },
    {
      id: 'sdr',
      label: 'SDR & Redes Sociais',
      icon: <Bot className="w-4 h-4" />,
      badge: 'Meta & Social',
      desc: 'Qualificação Comercial de Leads do Instagram, TikTok e Facebook'
    },
    {
      id: 'automations',
      label: 'Skills & Automações',
      icon: <Zap className="w-4 h-4" />,
      badge: '8 Skills',
      desc: 'Triggers automáticos de Anti-falta, Pós-op e Retenção'
    },
    {
      id: 'engagement_reports',
      label: 'Analytics & Gráficos',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: 'Recharts',
      desc: 'Métricas de conversão, LTV, faturamento e no-show'
    },
    {
      id: 'scheduling',
      label: 'Agenda Integrada',
      icon: <Calendar className="w-4 h-4" />,
      desc: 'Horários por cadeira, confirmações e preenchimento de lacunas'
    },
    {
      id: 'content_agents',
      label: 'Estúdio de Conteúdo IA',
      icon: <Share2 className="w-4 h-4" />,
      badge: 'Posts & Vídeos',
      desc: 'Geração de roteiros para Reels, TikTok e carrosséis com validação CRO'
    },
    {
      id: 'chatbot',
      label: 'Chatbot Gemini',
      icon: <MessagesSquare className="w-4 h-4" />,
      badge: 'Multi-turn',
      desc: 'Agente conversacional de apoio clínico e dúvidas da equipe'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp & Meta API',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: 'Meta Cloud API',
      desc: 'Simulador e sincronizador oficial Meta Graph API v21.0'
    },
    {
      id: 'omniroute',
      label: 'OmniRoute & Multi-Agentes',
      icon: <Network className="w-4 h-4" />,
      badge: 'Mesh IA',
      desc: 'Elo de integração e roteamento inteligente multicanal'
    },
    {
      id: 'roadmap',
      label: 'Mapa do Projeto',
      icon: <Compass className="w-4 h-4" />,
      desc: 'Engenharia de software, fases de entrega e arquitetura técnica'
    },
    {
      id: 'services',
      label: 'Serviços & LTV',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Tabela de procedimentos, tíquete médio e ciclo de vida'
    },
    {
      id: 'cro',
      label: 'Cartilha Ética CRO',
      icon: <ShieldCheck className="w-4 h-4" />,
      desc: 'Diretrizes da Resolução CFO 196/2019 e conformidade legal'
    }
  ];

  const currentItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsNavMenuOpen(false);
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-40 h-dvh bg-slate-950 border-r border-slate-800 text-white flex flex-col transition-[width] duration-300 ease-out motion-reduce:transition-none ${
          compact ? 'w-14 sm:w-16' : 'w-14 sm:w-16'
        }`}
        aria-label="Navegação principal"
      >
        <div className="h-14 sm:h-16 flex items-center justify-center border-b border-slate-800 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20">
            OM
          </div>
        </div>

        <button
          onClick={() => setIsNavMenuOpen(true)}
          className="mx-2 mt-3 min-h-11 flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 cursor-pointer transition-colors"
          aria-label="Abrir menu de módulos"
          aria-expanded={isNavMenuOpen}
        >
          <Menu className="w-4 h-4" />
          <span className="text-[9px] font-bold tracking-wide">Menu</span>
        </button>

        <nav className={`flex-1 overflow-y-auto py-3 px-1.5 space-y-1 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          compact ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'
        }`} aria-label="Atalhos de módulos">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full min-h-11 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                }`}
              >
                {item.icon}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-800 p-1.5 flex justify-center">
          <ToastNotificationCenter
            notifications={notifications}
            onDismiss={onDismissToast}
            onNavigateTab={setActiveTab}
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
            onClearAll={onClearAllNotifications}
            onTriggerDemoToast={onTriggerDemoToast}
          />
        </div>
      </aside>

      <header
        className={`sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white pl-14 sm:pl-16 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          compact ? '-translate-y-full pointer-events-none h-0 overflow-hidden border-0' : 'translate-y-0'
        }`}
      >
        <div className="px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm sm:text-lg tracking-tight text-white truncate">
                  OdontoMind <span className="text-cyan-400">AI</span>
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  Engenharia & CRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {currentItem.label}
                {currentItem.badge ? ` · ${currentItem.badge}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden xl:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pipeline:</span>
                <strong className="text-emerald-400 font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPipelineValue)}
                </strong>
              </div>

              <button
                onClick={onOpenGitHubModal}
                className="hidden sm:flex items-center gap-1.5 min-h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3 rounded-lg cursor-pointer"
                title="Subir código para repositório no GitHub"
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span className="hidden md:inline">GitHub</span>
              </button>

              <button
                onClick={onOpenRenderModal}
                className="hidden sm:flex items-center gap-1.5 min-h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3 rounded-lg cursor-pointer"
                title="Guia & Blueprint de Hospedagem no Render (render.com)"
              >
                <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Render</span>
              </button>

              <button
                onClick={onOpenNewPatientModal}
                className="flex items-center gap-1.5 min-h-11 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm px-3 rounded-lg cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Paciente</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isNavMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="w-[min(100%,20rem)] sm:w-80 h-dvh bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col animate-fadeIn"
            role="dialog"
            aria-label="Módulos da plataforma"
          >
            <div className="h-14 sm:h-16 px-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Módulos</p>
                <p className="text-[11px] text-slate-400">Menu recolhe ao selecionar</p>
              </div>
              <button
                onClick={() => setIsNavMenuOpen(false)}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full min-h-11 flex items-center justify-between p-3 rounded-xl text-left cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.desc && (
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>
          <button
            className="flex-1 bg-slate-950/55 backdrop-blur-sm cursor-pointer"
            aria-label="Fechar menu"
            onClick={() => setIsNavMenuOpen(false)}
          />
        </div>
      )}
    </>
  );
};

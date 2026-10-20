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
      desc: 'Funil Kanban, prontuários clínicos e histórico odontológico'
    },
    {
      id: 'sdr',
      label: 'SDR e Redes Sociais',
      icon: <Bot className="w-4 h-4" />,
      badge: 'Meta e Social',
      desc: 'Qualificação comercial de leads do Instagram, TikTok e Facebook'
    },
    {
      id: 'automations',
      label: 'Skills e Automações',
      icon: <Zap className="w-4 h-4" />,
      badge: '8 Skills',
      desc: 'Triggers automáticos de anti-falta, pós-op e retenção'
    },
    {
      id: 'engagement_reports',
      label: 'Analytics e Gráficos',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: 'Recharts',
      desc: 'Métricas de conversão, LTV, faturamento e no-show'
    },
    {
      id: 'scheduling',
      label: 'Agenda por Dentista',
      icon: <Calendar className="w-4 h-4" />,
      badge: 'Google',
      desc: 'Grade por profissional, consultas persistidas e Google Calendar'
    },
    {
      id: 'content_agents',
      label: 'Estúdio de Conteúdo IA',
      icon: <Share2 className="w-4 h-4" />,
      badge: 'Posts & Videos',
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
      badge: 'Carol',
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
      desc: 'Engenharia de software, fases de entrega e arquitetura tecnica'
    },
    {
      id: 'services',
      label: 'Servicos e LTV',
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

  const renderNavButtons = (showDescription: boolean) =>
    navItems.map((item) => {
      const isActive = activeTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => handleSelectTab(item.id)}
          title={item.label}
          aria-label={item.label}
          aria-current={isActive ? 'page' : undefined}
          className={`w-full min-h-11 flex items-center gap-3 px-3 rounded-xl text-left cursor-pointer transition-colors ${
            isActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent'
          }`}
        >
          <span className={`shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>{item.icon}</span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="font-semibold text-xs text-white truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </span>
            {showDescription && item.desc && (
              <span className="block text-[10px] text-slate-500 truncate mt-0.5">{item.desc}</span>
            )}
          </span>
        </button>
      );
    });

  return (
    <>
      <aside
        className="hidden md:flex fixed left-0 top-0 z-40 h-dvh w-60 lg:w-64 bg-slate-950 border-r border-slate-800 text-white flex-col"
        aria-label="Navegação principal"
      >
        <div className="h-14 sm:h-16 px-4 flex items-center gap-3 border-b border-slate-800 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20">
            OM
          </div>
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm tracking-tight truncate">
              OdontoMind <span className="text-cyan-400">AI</span>
            </p>
            <p className="text-[10px] text-slate-500 truncate">Menu completo</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1" aria-label="Módulos da plataforma">
          {renderNavButtons(false)}
        </nav>

        <div className="shrink-0 border-t border-slate-800 p-2 space-y-1.5">
          <button
            onClick={onOpenGitHubModal}
            className="w-full min-h-11 flex items-center gap-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer"
            title="Subir codigo para repositorio no GitHub"
          >
            <Github className="w-4 h-4" />
            <span className="text-xs font-semibold">GitHub</span>
          </button>
          <button
            onClick={onOpenRenderModal}
            className="w-full min-h-11 flex items-center gap-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer"
            title="Guia e Blueprint de Hospedagem no Render"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold">Render</span>
          </button>
          <button
            onClick={onOpenNewPatientModal}
            className="w-full min-h-11 flex items-center gap-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Novo Paciente</span>
          </button>
        </div>
      </aside>

      <div className="fixed top-3 right-3 z-50">
        <ToastNotificationCenter
          notifications={notifications}
          onDismiss={onDismissToast}
          onNavigateTab={setActiveTab}
          onMarkAllAsRead={onMarkAllNotificationsAsRead}
          onClearAll={onClearAllNotifications}
          onTriggerDemoToast={onTriggerDemoToast}
        />
      </div>

      <button
        onClick={() => setIsNavMenuOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 min-h-11 min-w-11 flex items-center justify-center rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 shadow-lg cursor-pointer"
        aria-label="Abrir menu de módulos"
        aria-expanded={isNavMenuOpen}
      >
        <Menu className="w-4 h-4" />
      </button>

      <header
        className={`sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white pl-3 md:pl-60 lg:pl-64 pr-16 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          compact ? '-translate-y-full pointer-events-none h-0 overflow-hidden border-0' : 'translate-y-0'
        }`}
      >
        <div className="px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="min-w-0 pl-12 md:pl-0">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm sm:text-lg tracking-tight text-white truncate">
                  OdontoMind <span className="text-cyan-400">AI</span>
                </span>
                <span className="hidden lg:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
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
            </div>
          </div>
        </div>
      </header>

      {isNavMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="w-[min(100%,20rem)] h-dvh bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Módulos da plataforma"
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Módulos</p>
                <p className="text-[11px] text-slate-400">Menu completo</p>
              </div>
              <button
                onClick={() => setIsNavMenuOpen(false)}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">{renderNavButtons(true)}</div>
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

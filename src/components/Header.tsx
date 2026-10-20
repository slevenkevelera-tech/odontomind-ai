import React, { useState } from 'react';
import { TabType, ToastNotification } from '../types';
import { ToastNotificationCenter } from './ToastNotificationCenter';
import { BrandLogo } from './BrandLogo';
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
  Network,
  FolderOpen
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
      id: 'sdr',
      label: 'SDR e Redes Sociais',
      icon: <Bot className="w-4 h-4" />,
      badge: 'Meta e Social',
      desc: 'Qualificação comercial de leads do Instagram, TikTok e Facebook'
    },
    {
      id: 'automations',
      label: 'Habilidades e Automações',
      icon: <Zap className="w-4 h-4" />,
      badge: '8 Habilidades',
      desc: 'Acionadores automáticos de anti-falta, pós-op e retenção'
    },
    {
      id: 'engagement_reports',
      label: 'Análises e Gráficos',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: 'Recharts',
      desc: 'Métricas de conversão, LTV, faturamento e no-show'
    },
    {
      id: 'scheduling',
      label: 'Agenda Integrada',
      icon: <Calendar className="w-4 h-4" />,
      badge: 'Cadeiras',
      desc: 'Horários por cadeira, confirmações e preenchimento de lacunas'
    },
    {
      id: 'content_agents',
      label: 'Estúdio de Conteúdo IA',
      icon: <Share2 className="w-4 h-4" />,
      badge: 'Posts e Vídeos',
      desc: 'Geração de roteiros para Reels, TikTok e carrosséis com validação CRO'
    },
    {
      id: 'chatbot',
      label: 'Chatbot Gemini',
      icon: <MessagesSquare className="w-4 h-4" />,
      badge: 'Multi-voltas',
      desc: 'Agente conversacional de apoio clínico e dúvidas da equipe'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp e API Meta',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: 'API Meta Cloud',
      desc: 'Simulador e sincronizador oficial Meta Graph API v21.0'
    },
    {
      id: 'omniroute',
      label: 'OmniRoute e Multiagentes',
      icon: <Network className="w-4 h-4" />,
      badge: 'Malha IA',
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
      label: 'Serviços e LTV',
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

  const currentItem =
    activeTab === 'crm'
      ? { id: 'crm' as TabType, label: 'CRM de Pacientes', badge: 'Prontuários' }
      : navItems.find((item) => item.id === activeTab) || navItems[0];
  const isCrmActive = activeTab === 'crm';

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsNavMenuOpen(false);
  };

  const renderNavButtons = () =>
    navItems.map((item) => {
      const isActive = activeTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => handleSelectTab(item.id)}
          title={`${item.label}${item.desc ? ` — ${item.desc}` : ''}`}
          aria-label={item.label}
          aria-current={isActive ? 'page' : undefined}
          className={`w-full min-h-14 flex items-start gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors duration-200 ease-out motion-reduce:transition-none ${
            isActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
          }`}
        >
          <span
            className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {item.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="font-semibold text-xs text-white leading-snug">{item.label}</span>
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
            {item.desc && (
              <span className="block text-[10px] text-slate-400 leading-relaxed mt-0.5">{item.desc}</span>
            )}
          </span>
        </button>
      );
    });

  return (
    <>
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-cyan-500 focus:text-slate-950 focus:px-3 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
      >
        Ir para o conteúdo
      </a>

      <aside
        className="hidden md:flex fixed left-0 top-0 z-40 h-dvh w-[18.5rem] lg:w-80 bg-slate-950 border-r border-slate-800 text-white flex-col"
        aria-label="Navegação principal"
      >
        <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-800 shrink-0">
          <BrandLogo size={40} />
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm tracking-tight truncate">
              OdontoMind <span className="text-cyan-400">AI</span>
            </p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Módulos</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1" aria-label="Módulos da plataforma">
          {renderNavButtons()}
        </nav>

        <div className="shrink-0 border-t border-slate-800 p-2.5 space-y-1.5">
          <button
            onClick={onOpenGitHubModal}
            className="w-full min-h-11 flex items-center gap-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer"
            title="Subir código para repositório no GitHub"
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

      <button
        onClick={() => setIsNavMenuOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 min-h-11 min-w-11 flex items-center justify-center rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 shadow-lg cursor-pointer"
        aria-label="Abrir menu de módulos"
        aria-expanded={isNavMenuOpen}
      >
        <Menu className="w-4 h-4" />
      </button>

      <header className="sticky top-0 z-40 overflow-visible bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white pl-3 md:pl-[18.5rem] lg:pl-80">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className={`flex items-center justify-between gap-3 ${compact ? 'h-14' : 'h-16'}`}>
            <div className="min-w-0 pl-12 md:pl-0 flex items-center gap-3">
              <BrandLogo size={compact ? 36 : 44} className="shrink-0 hidden sm:block" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm sm:text-lg tracking-tight text-white truncate">
                    OdontoMind <span className="text-cyan-400">AI</span>
                  </span>
                  <span className="hidden lg:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    Engenharia e CRO
                  </span>
                </div>
                {!compact && (
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentItem.label}
                    {currentItem.badge ? ` · ${currentItem.badge}` : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => handleSelectTab('crm')}
                aria-current={isCrmActive ? 'page' : undefined}
                aria-label="Abrir CRM de pacientes e prontuários"
                className={`min-h-11 flex items-center gap-2 px-3 rounded-xl cursor-pointer transition-colors duration-200 ease-out ${
                  isCrmActive
                    ? 'bg-cyan-500 text-slate-950 border border-cyan-300'
                    : 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Kanban className="w-4 h-4" />
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-xs font-bold">CRM de Pacientes</span>
                  <span className={`text-[10px] ${isCrmActive ? 'text-slate-800' : 'text-slate-400'}`}>
                    Prontuários
                  </span>
                </span>
                <FolderOpen className="w-3.5 h-3.5 sm:hidden" />
              </button>

              <ToastNotificationCenter
                notifications={notifications}
                onDismiss={onDismissToast}
                onNavigateTab={setActiveTab}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
                onClearAll={onClearAllNotifications}
                onTriggerDemoToast={onTriggerDemoToast}
              />

              <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 min-h-11">
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
            className="w-[min(100%,22rem)] h-dvh bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Módulos da plataforma"
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Módulos</p>
                <p className="text-[11px] text-slate-400">Menu completo à esquerda</p>
              </div>
              <button
                onClick={() => setIsNavMenuOpen(false)}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">{renderNavButtons()}</div>
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

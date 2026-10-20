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
  ChevronDown,
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
  onTriggerDemoToast
}) => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string; desc?: string }[] = [
    { 
      id: 'crm', 
      label: 'CRM de Pacientes', 
      icon: <Kanban className="w-4 h-4 text-cyan-400" />, 
      badge: 'Prontuários',
      desc: 'Funil Kanban, Prontuários Clínicos e Histórico Odontológico'
    },
    { 
      id: 'sdr', 
      label: 'SDR & Redes Sociais', 
      icon: <Bot className="w-4 h-4 text-purple-400" />, 
      badge: 'Meta & Social',
      desc: 'Qualificação Comercial de Leads do Instagram, TikTok e Facebook'
    },
    { 
      id: 'automations', 
      label: 'Skills & Automações', 
      icon: <Zap className="w-4 h-4 text-amber-400" />, 
      badge: '8 Skills',
      desc: 'Triggers automáticos de Anti-falta, Pós-op e Retenção'
    },
    { 
      id: 'engagement_reports', 
      label: 'Analytics & Gráficos', 
      icon: <BarChart3 className="w-4 h-4 text-cyan-400" />, 
      badge: 'Recharts',
      desc: 'Métricas de conversão, LTV, faturamento e no-show'
    },
    { 
      id: 'scheduling', 
      label: 'Agenda Integrada', 
      icon: <Calendar className="w-4 h-4 text-emerald-400" />,
      desc: 'Horários por cadeira, confirmações e preenchimento de lacunas'
    },
    { 
      id: 'content_agents', 
      label: 'Estúdio de Conteúdo IA', 
      icon: <Share2 className="w-4 h-4 text-rose-400" />, 
      badge: 'Posts & Vídeos',
      desc: 'Geração de roteiros para Reels, TikTok e carrosséis com validação CRO'
    },
    { 
      id: 'chatbot', 
      label: 'Chatbot Gemini', 
      icon: <MessagesSquare className="w-4 h-4 text-emerald-400" />, 
      badge: 'Multi-turn',
      desc: 'Agente conversacional de apoio clínico e dúvidas da equipe'
    },
    { 
      id: 'whatsapp', 
      label: 'WhatsApp & Meta API', 
      icon: <MessageCircle className="w-4 h-4 text-emerald-400" />, 
      badge: 'Meta Cloud API',
      desc: 'Simulador e sincronizador oficial Meta Graph API v21.0'
    },
    { 
      id: 'omniroute', 
      label: 'OmniRoute & Multi-Agentes', 
      icon: <Network className="w-4 h-4 text-indigo-400" />, 
      badge: 'Mesh IA',
      desc: 'Elo de integração e roteamento inteligente multicanal'
    },
    { 
      id: 'roadmap', 
      label: 'Mapa do Projeto', 
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      desc: 'Engenharia de software, fases de entrega e arquitetura técnica'
    },
    { 
      id: 'services', 
      label: 'Serviços & LTV', 
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      desc: 'Tabela de procedimentos, tíquete médio e ciclo de vida'
    },
    { 
      id: 'cro', 
      label: 'Cartilha Ética CRO', 
      icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
      desc: 'Diretrizes da Resolução CFO 196/2019 e conformidade legal'
    }
  ];

  const currentItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsNavMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Bar with brand & live metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-xl shrink-0">
              🦷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-white">
                  OdontoMind <span className="text-cyan-400">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  Engenharia & CRO
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden lg:block">
                Plataforma de Alta Performance para Clínicas Odontológicas
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Pipeline:</span>
              <strong className="text-emerald-400 font-semibold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPipelineValue)}
              </strong>
            </div>

            {/* Notification Toast Center Bell & Drawer */}
            <ToastNotificationCenter
              notifications={notifications}
              onDismiss={onDismissToast}
              onNavigateTab={setActiveTab}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
              onClearAll={onClearAllNotifications}
              onTriggerDemoToast={onTriggerDemoToast}
            />

            <button
              onClick={onOpenGitHubModal}
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 font-semibold text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all shadow-xs cursor-pointer"
              title="Subir código para repositório no GitHub"
            >
              <Github className="w-3.5 h-3.5 text-white" />
              <span className="hidden md:inline">GitHub</span>
            </button>

            <button
              onClick={onOpenRenderModal}
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500/50 font-semibold text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all shadow-xs cursor-pointer"
              title="Guia & Blueprint de Hospedagem no Render (render.com)"
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Render</span>
            </button>

            <button
              onClick={onOpenNewPatientModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Novo</span>
              <span className="hidden sm:inline">Paciente</span>
            </button>

            <button
              onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all cursor-pointer"
              aria-label="Abrir menu de navegação"
              aria-expanded={isNavMenuOpen}
            >
              {isNavMenuOpen ? (
                <X className="w-4 h-4 text-rose-400" />
              ) : (
                <Menu className="w-4 h-4 text-cyan-400" />
              )}
              <span className="font-bold text-[11px] sm:text-xs text-slate-200">Menu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 bg-slate-950/90 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer w-full justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="p-1 rounded bg-slate-800 border border-slate-700 shrink-0">
                {currentItem.icon}
              </span>
              <span className="truncate font-bold text-white text-xs">{currentItem.label}</span>
              {currentItem.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                  {currentItem.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-medium shrink-0 ml-2">
              <span>{isNavMenuOpen ? 'Fechar' : 'Menu'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isNavMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {isNavMenuOpen && (
        <div className="fixed inset-0 top-[105px] z-50 bg-slate-950/80 backdrop-blur-md flex flex-col animate-fadeIn">
          <div className="bg-slate-900 border-b border-slate-800 shadow-2xl max-h-[calc(100vh-110px)] overflow-y-auto p-4 space-y-4">
            <div className="max-w-7xl mx-auto w-full space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Módulos da Plataforma</p>
                  <p className="text-[11px] text-slate-400">Selecione para navegar (menu recolhe automaticamente)</p>
                </div>
                <button
                  onClick={() => setIsNavMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Fechar menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-300 border border-cyan-500/50 shadow-sm'
                          : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white">{item.label}</span>
                            {item.badge && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
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

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  CFO 196/2019
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsNavMenuOpen(false);
                      onOpenGitHubModal();
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer text-[11px]"
                  >
                    GitHub
                  </button>
                  <button
                    onClick={() => {
                      setIsNavMenuOpen(false);
                      onOpenRenderModal();
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 hover:text-white cursor-pointer text-[11px]"
                  >
                    Render
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex-1 bg-transparent cursor-pointer"
            onClick={() => setIsNavMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
};

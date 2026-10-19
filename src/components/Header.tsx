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
  Zap
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
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'crm', label: 'CRM de Pacientes', icon: <Kanban className="w-4 h-4 text-cyan-400" />, badge: 'Prontuários' },
    { id: 'sdr', label: 'SDR & Redes Sociais', icon: <Bot className="w-4 h-4 text-purple-400" />, badge: 'Meta & Social' },
    { id: 'automations', label: 'Skills & Automações', icon: <Zap className="w-4 h-4 text-amber-400" />, badge: '8 Skills' },
    { id: 'engagement_reports', label: 'Analytics & Gráficos', icon: <BarChart3 className="w-4 h-4 text-cyan-400" />, badge: 'Recharts' },
    { id: 'scheduling', label: 'Agenda Integrada', icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
    { id: 'content_agents', label: 'Estúdio de Conteúdo IA', icon: <Share2 className="w-4 h-4 text-rose-400" />, badge: 'Posts & Vídeos' },
    { id: 'chatbot', label: 'Chatbot Gemini', icon: <MessagesSquare className="w-4 h-4 text-emerald-400" />, badge: 'Multi-turn' },
    { id: 'whatsapp', label: 'WhatsApp & Meta API', icon: <MessageCircle className="w-4 h-4 text-emerald-400" />, badge: 'Meta Cloud API' },
    { id: 'roadmap', label: 'Mapa do Projeto', icon: <Compass className="w-4 h-4" /> },
    { id: 'services', label: 'Serviços & LTV', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'cro', label: 'Cartilha Ética CRO', icon: <ShieldCheck className="w-4 h-4 text-indigo-400" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Bar with brand & live metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-xl">
              🦷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg tracking-tight text-white">
                  OdontoMind <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  Engenharia & CRO
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Plataforma de Alta Performance para Clínicas Odontológicas
              </p>
            </div>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Pipeline Ativo:</span>
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
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 font-semibold text-xs px-3 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
              title="Subir código para repositório no GitHub"
            >
              <Github className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">GitHub</span>
            </button>

            <button
              onClick={onOpenRenderModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500/50 font-semibold text-xs px-3 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
              title="Guia & Blueprint de Hospedagem no Render (render.com)"
            >
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Hospedar no Render</span>
            </button>

            <button
              onClick={onOpenNewPatientModal}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Paciente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar - Aligned, Spacious and Visible without awkward cutting */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-sm min-h-[60px] py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2" aria-label="Tabs">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`h-9 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ml-0.5 tracking-tight ${
                      isActive ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

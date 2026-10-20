import React, { useState, useEffect } from 'react';
import { ToastNotification, ToastType, TabType } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  X, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  CheckCheck, 
  Trash2, 
  Sparkles,
  Send,
  CalendarCheck2,
  Clock
} from 'lucide-react';

interface ToastNotificationCenterProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
  onNavigateTab: (tab: TabType) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onTriggerDemoToast: (type: 'confirmed' | 'followup' | 'urgent') => void;
}

// Gentle Web Audio API chime generator for clinical notifications
const playChime = (type: ToastType, soundEnabled: boolean) => {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'urgent') {
      // Double urgent beep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.12); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Gentle harmonious chime (C6 -> G6)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08); // G5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {
    // Ignore audio errors if user hasn't interacted with page yet
  }
};

export const ToastNotificationCenter: React.FC<ToastNotificationCenterProps> = ({
  notifications,
  onDismiss,
  onNavigateTab,
  onMarkAllAsRead,
  onClearAll,
  onTriggerDemoToast
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeToasts, setActiveToasts] = useState<ToastNotification[]>([]);

  // Keep track of recent toasts to show in floating container (last 4)
  useEffect(() => {
    // When a new unread notification arrives, show floating toast and play sound
    const unread = notifications.filter((n) => !n.read).slice(0, 3);
    setActiveToasts(unread);

    if (notifications.length > 0) {
      const latest = notifications[0];
      if (!latest.read) {
        playChime(latest.type, soundEnabled);
      }
    }
  }, [notifications, soundEnabled]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getToastBadge = (type: ToastType) => {
    switch (type) {
      case 'urgent':
        return {
          icon: <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0 animate-pulse" />,
          border: 'border-rose-400/80 bg-rose-50/95 shadow-rose-500/10',
          titleColor: 'text-rose-950 font-extrabold',
          tag: 'Atenção Imediata',
          tagClass: 'bg-rose-100 text-rose-800 border-rose-300'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          border: 'border-emerald-400/80 bg-emerald-50/95 shadow-emerald-500/10',
          titleColor: 'text-emerald-950 font-bold',
          tag: 'Confirmado',
          tagClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          border: 'border-amber-400/80 bg-amber-50/95 shadow-amber-500/10',
          titleColor: 'text-amber-950 font-bold',
          tag: 'Follow-up Pendente',
          tagClass: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-cyan-500 shrink-0" />,
          border: 'border-cyan-400/80 bg-cyan-50/95 shadow-cyan-500/10',
          titleColor: 'text-cyan-950 font-bold',
          tag: 'Notificação Clínica',
          tagClass: 'bg-cyan-100 text-cyan-800 border-cyan-300'
        };
    }
  };

  return (
    <>
      {/* 1. Header Notification Bell Button & Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`relative min-h-11 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isDropdownOpen 
              ? 'bg-slate-800 text-cyan-400 ring-2 ring-cyan-500/40' 
              : 'text-slate-200 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Notificações clínicas e alertas de follow-up"
          aria-label="Abrir central de notificações"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline text-xs font-semibold">Alertas</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-md animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Notification Drawer */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-1.5rem))] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 text-slate-800 overflow-hidden animate-scaleIn">
            {/* Header of Drawer */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-bold text-sm">
                  Alertas Clínicos & Follow-ups
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                    {unreadCount} novo(s)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Silenciar alertas sonoros' : 'Ativar alertas sonoros'}
                  className="hover:text-white p-1 rounded cursor-pointer"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="hover:text-white p-1 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Demo Simulator Buttons */}
            <div className="bg-slate-100/90 p-3 border-b border-slate-200/80 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Simular Alertas em Tempo Real:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onTriggerDemoToast('confirmed')}
                  className="text-[10px] font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-1 px-1.5 rounded-lg border border-emerald-200 transition-colors text-center cursor-pointer truncate"
                  title="Simular consulta confirmada por paciente via WhatsApp"
                >
                  ✓ Consulta Confirmada
                </button>
                <button
                  onClick={() => onTriggerDemoToast('followup')}
                  className="text-[10px] font-semibold bg-rose-100 hover:bg-rose-200 text-rose-800 py-1 px-1.5 rounded-lg border border-rose-200 transition-colors text-center cursor-pointer truncate"
                  title="Simular resposta de paciente em pós-operatório precisando de atenção"
                >
                  🚨 Pós-Op Urgente
                </button>
                <button
                  onClick={() => onTriggerDemoToast('urgent')}
                  className="text-[10px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-800 py-1 px-1.5 rounded-lg border border-amber-200 transition-colors text-center cursor-pointer truncate"
                  title="Simular paciente com dor de dente aguda precisando de encaixe"
                >
                  ⚡ Dor Aguda Encaixe
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                  <CheckCheck className="w-8 h-8 mx-auto text-emerald-500 opacity-60" />
                  <p className="font-semibold text-slate-700">Tudo em dia!</p>
                  <p className="text-[11px] text-slate-400">
                    Nenhum alerta pendente de confirmação ou pós-operatório no momento.
                  </p>
                </div>
              ) : (
                notifications.map((item) => {
                  const style = getToastBadge(item.type);
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3 ${
                        !item.read ? 'bg-cyan-50/30' : ''
                      }`}
                    >
                      <div className="mt-0.5">{style.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${style.tagClass}`}>
                            {style.tag}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {item.timestamp}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>

                        {/* Action Link inside dropdown */}
                        {item.actionLabel && item.actionTab && (
                          <button
                            onClick={() => {
                              onNavigateTab(item.actionTab!);
                              setIsDropdownOpen(false);
                            }}
                            className="mt-2 text-[11px] text-cyan-700 hover:text-cyan-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <span>{item.actionLabel}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => onDismiss(item.id)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                        title="Remover alerta"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer of Drawer */}
            {notifications.length > 0 && (
              <div className="bg-slate-50 p-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <button
                  onClick={onMarkAllAsRead}
                  className="hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Marcar lidas</span>
                </button>
                <button
                  onClick={onClearAll}
                  className="hover:text-rose-600 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar todas</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Floating Toast Stack (Bottom-Right of the Screen) */}
      <div 
        className="fixed bottom-6 right-3 sm:right-6 z-[60] flex flex-col gap-3 max-w-sm w-[calc(100%-1.5rem)] sm:w-full pointer-events-none"
        aria-live="polite"
      >
        {activeToasts.map((toast) => {
          const style = getToastBadge(toast.type);

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${style.border} animate-slideUp`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{style.icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${style.tagClass}`}>
                      {style.tag}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {toast.timestamp}
                    </span>
                  </div>

                  <h4 className={`text-xs ${style.titleColor} leading-tight`}>
                    {toast.title}
                  </h4>

                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                    {toast.message}
                  </p>

                  {/* Immediate Action Button */}
                  {toast.actionLabel && toast.actionTab && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        onClick={() => {
                          onNavigateTab(toast.actionTab!);
                          onDismiss(toast.id);
                        }}
                        className={`text-xs font-bold py-1 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                          toast.type === 'urgent'
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>{toast.actionLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={() => onDismiss(toast.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        Dispensar
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onDismiss(toast.id)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer shrink-0"
                  title="Fechar notificação"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

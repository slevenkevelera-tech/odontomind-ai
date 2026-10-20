import React, { useState, useEffect } from 'react';
import { TabType, PatientLead, PipelineStage, Appointment, ToastNotification, ToastType, SmsDeliveryStatus } from './types';
import { initialPatients, initialAppointments } from './data/crmData';
import { dentistFromId, dentistIdFromName } from './data/dentists';
import { syncAppointmentToGoogle } from './lib/googleCalendar';
import { Header } from './components/Header';
import { RoadmapMap } from './components/RoadmapMap';
import { CrmPipeline } from './components/CrmPipeline';
import { CrmAnalytics } from './components/CrmAnalytics';
import { SchedulingModule } from './components/SchedulingModule';
import { SdrSocialHub } from './components/SdrSocialHub';
import { ContentCreationStudio } from './components/ContentCreationStudio';
import { GeminiChatbot } from './components/GeminiChatbot';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { ServicesGuide } from './components/ServicesGuide';
import { CroEthicsGuide } from './components/CroEthicsGuide';
import { AutomationSkillsHub } from './components/AutomationSkillsHub';
import { OmniRouteHub } from './components/OmniRouteHub';
import { NewPatientModal } from './components/NewPatientModal';
import { RenderDeployModal } from './components/RenderDeployModal';
import { GitHubPushModal } from './components/GitHubPushModal';
import { 
  ShieldCheck, 
  Lock, 
  Activity,
  Heart
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('whatsapp');

  // Pacientes e Prontuários Reais (iniciados limpos ou carregados do navegador)
  const [patients, setPatients] = useState<PatientLead[]>(() => {
    const saved = localStorage.getItem('odontomind_patients');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialPatients;
  });

  // Agendamentos Reais da Clínica
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('odontomind_appointments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialAppointments;
  });

  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Notificações Reais da Clínica
  const [notifications, setNotifications] = useState<ToastNotification[]>(() => {
    const saved = localStorage.getItem('odontomind_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Persistência automática no armazenamento local
  useEffect(() => {
    localStorage.setItem('odontomind_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('odontomind_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('odontomind_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Total active pipeline calculation
  const totalPipelineValue = patients.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  // Helper to add a new toast alert
  const addToast = (toast: {
    type: ToastType;
    title: string;
    message: string;
    patientId?: string;
    patientName?: string;
    actionLabel?: string;
    actionTab?: TabType;
  }) => {
    const newNotification: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: 'Agora',
      read: false,
      ...toast
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const handleDismissToast = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Demo Simulation trigger
  const handleTriggerDemoToast = (demoType: 'confirmed' | 'followup' | 'urgent') => {
    if (demoType === 'confirmed') {
      addToast({
        type: 'success',
        title: 'Agendamento Confirmado via WhatsApp',
        message: 'Beatriz Vasconcelos confirmou a sessão de Prova do Mock-up de Lentes Cerâmicas para 15/10 às 16:00.',
        patientName: 'Beatriz Vasconcelos',
        actionLabel: 'Ver na Agenda',
        actionTab: 'scheduling'
      });
    } else if (demoType === 'followup') {
      addToast({
        type: 'urgent',
        title: 'Alerta Imediato: Follow-up Pós-Operatório',
        message: 'Paciente Eduardo Guimarães (Enxerto e Implante) reportou desconforto atípico no pós-operatório de 48h. Necessita retorno do dentista.',
        patientName: 'Eduardo Guimarães',
        actionLabel: 'Ver Paciente',
        actionTab: 'crm'
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Triagem de Urgência: Dor Aguda',
        message: 'Novo relato via WhatsApp: Paciente com fratura de incisivo anterior e dor aguda. Sugerido encaixe prioritário às 11:30.',
        actionLabel: 'Abrir Triagem',
        actionTab: 'whatsapp'
      });
    }
  };

  // Update patient stage in CRM
  const handleUpdatePatientStage = (patientId: string, newStage: PipelineStage) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          if (newStage === 'followup_retained') {
            addToast({
              type: 'urgent',
              title: 'Follow-up Ativado no CRM',
              message: `Paciente ${p.name} avançou para etapa de Pós-Operatório & Retenção. Monitoramento ativo iniciado.`,
              patientName: p.name,
              patientId: p.id,
              actionLabel: 'Ver Detalhes',
              actionTab: 'crm'
            });
          }
          return { ...p, stage: newStage };
        }
        return p;
      })
    );
  };

  // Add new patient to CRM
  const handleAddPatient = (newPatient: PatientLead) => {
    setPatients((prev) => [newPatient, ...prev]);
    addToast({
      type: 'info',
      title: 'Novo Paciente Cadastrado',
      message: `${newPatient.name} entrou na esteira do CRM para ${newPatient.treatment}. Triagem IA prévia gerada.`,
      patientName: newPatient.name,
      patientId: newPatient.id,
      actionLabel: 'Ver no Pipeline',
      actionTab: 'crm'
    });
  };

  // Jump to WhatsApp simulator with patient context
  const handleTriggerWhatsAppFollowup = (patient: PatientLead) => {
    setActiveTab('whatsapp');
    addToast({
      type: 'info',
      title: 'Canal de WhatsApp Aberto',
      message: `Conversa e anamnese de ${patient.name} carregadas no simulador de atendimento clínico.`,
      patientName: patient.name,
      actionLabel: 'Ir para WhatsApp',
      actionTab: 'whatsapp'
    });
  };

  // Scheduling handlers
  const handleAddAppointment = (newApt: Appointment) => {
    const dentistId = newApt.dentistId || dentistIdFromName(newApt.dentist);
    const dentist = dentistFromId(dentistId);
    const withDentist: Appointment = {
      ...newApt,
      dentistId,
      dentist: dentist.name,
      googleCalendarId: dentist.calendarId,
      googleSyncStatus: newApt.googleSyncStatus || 'pending'
    };
    setAppointments((prev) => [withDentist, ...prev.filter((apt) => apt.id !== withDentist.id)]);

    const handledByPipeline = withDentist.patientId === 'whatsapp-simulator';
    if (!handledByPipeline) {
      addToast({
        type: 'success',
        title: 'Nova Consulta Agendada',
        message: `${withDentist.patientName} agendado(a) com ${withDentist.dentist} para ${withDentist.date} as ${withDentist.time}.`,
        actionLabel: 'Ver Agenda',
        actionTab: 'scheduling'
      });

      void syncAppointmentToGoogle(withDentist, dentist).then((result) => {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === withDentist.id
              ? {
                  ...apt,
                  googleEventId: result.googleEventId,
                  googleHtmlLink: result.googleHtmlLink,
                  googleSyncStatus: result.status
                }
              : apt
          )
        );
      });
    }
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          if (status === 'confirmed') {
            addToast({
              type: 'success',
              title: 'Agendamento Confirmado',
              message: `Consulta de ${a.patientName} (${a.procedure}) confirmada para ${a.date} às ${a.time}. Cadeira garantida.`,
              actionLabel: 'Ver na Agenda',
              actionTab: 'scheduling'
            });
          }
          return { ...a, status };
        }
        return a;
      })
    );
  };

  const handleSendReminder = (appointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointment.id ? { ...a, reminderSent: true } : a))
    );
    addToast({
      type: 'info',
      title: 'Lembrete Ativo Disparado',
      message: `Lembrete com endereço, recomendações e confirmação de 24h enviado para ${appointment.patientName} via ${appointment.channel.toUpperCase()}.`,
      actionLabel: 'Abrir Agenda',
      actionTab: 'scheduling'
    });
  };

  // Automated SMS Gateway Dispatch
  const handleSendSms = async (
    appointment: Appointment,
    customText?: string,
    templateType?: string
  ): Promise<void> => {
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
          patientName: appointment.patientName,
          patientPhone: appointment.patientPhone,
          type: templateType || 'confirmation',
          customMessage: customText,
          date: appointment.date,
          time: appointment.time,
          dentist: appointment.dentist,
          procedure: appointment.procedure,
        }),
      });

      const data = await response.json();
      const status: SmsDeliveryStatus = data.status === 'falha' ? 'falha' : 'entregue';
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id
            ? {
                ...a,
                smsStatus: status,
                smsSentAt: data.sentAt || now,
                smsDeliveredAt: data.deliveredAt || now,
                smsMessageContent: data.messageText || customText,
                smsProviderId: data.providerId,
                reminderSent: true,
              }
            : a
        )
      );

      if (status === 'entregue') {
        addToast({
          type: 'success',
          title: 'SMS Entregue na Operadora (DLR)',
          message: `SMS para ${appointment.patientName} (${appointment.patientPhone}) entregue com sucesso via gateway de telefonia.`,
          patientName: appointment.patientName,
          patientId: appointment.patientId,
          actionLabel: 'Ver na Agenda',
          actionTab: 'scheduling',
        });
      } else {
        addToast({
          type: 'warning',
          title: 'Falha no Envio de SMS',
          message: `Não foi possível entregar o SMS para ${appointment.patientPhone}. Verifique o número cadastrado.`,
          patientName: appointment.patientName,
          patientId: appointment.patientId,
          actionLabel: 'Verificar Contato',
          actionTab: 'scheduling',
        });
      }
    } catch (err: any) {
      console.error('Error sending SMS:', err);
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id
            ? {
                ...a,
                smsStatus: 'entregue',
                smsSentAt: now,
                smsDeliveredAt: now,
                smsMessageContent: customText || `Consulta agendada para ${appointment.date}`,
                reminderSent: true,
              }
            : a
        )
      );
      addToast({
        type: 'info',
        title: 'SMS Registrado',
        message: `Disparo de SMS registrado para ${appointment.patientName}.`,
        patientName: appointment.patientName,
        actionTab: 'scheduling',
      });
    }
  };

  // Simulate patient answering "1 - SIM" via SMS
  const handleSimulatePatientSmsReply = (appointmentId: string) => {
    const targetApt = appointments.find((a) => a.id === appointmentId);
    if (!targetApt) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              status: 'confirmed',
              smsStatus: 'respondido',
              smsDeliveredAt: now,
            }
          : a
      )
    );

    addToast({
      type: 'success',
      title: 'SMS Recebido: Consulta Confirmada!',
      message: `${targetApt.patientName} respondeu "1 - SIM" via SMS. Horário com ${targetApt.dentist} confirmado automaticamente no sistema.`,
      patientName: targetApt.patientName,
      patientId: targetApt.patientId,
      actionLabel: 'Abrir Agenda',
      actionTab: 'scheduling',
    });
  };

  const isWhatsAppFocus = activeTab === 'whatsapp';

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
        onOpenRenderModal={() => setIsRenderModalOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        totalPipelineValue={totalPipelineValue}
        notifications={notifications}
        onDismissToast={handleDismissToast}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onTriggerDemoToast={handleTriggerDemoToast}
        compact={isWhatsAppFocus}
      />

      <main
        id="conteudo-principal"
        className={`flex-1 w-full pl-3 md:pl-[18.5rem] lg:pl-80 ${
          isWhatsAppFocus
            ? 'pr-4 sm:pr-6 py-3 sm:py-4'
            : 'pr-4 sm:pr-6 lg:pr-10 py-6 sm:py-8'
        }`}
      >
        <div className={isWhatsAppFocus ? 'w-full max-w-6xl mx-auto' : 'w-full max-w-7xl mx-auto'}>
        {activeTab === 'crm' && (
          <CrmPipeline
            patients={patients}
            onUpdatePatientStage={handleUpdatePatientStage}
            onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
            onTriggerWhatsAppFollowup={handleTriggerWhatsAppFollowup}
          />
        )}

        {activeTab === 'sdr' && (
          <SdrSocialHub
            onAddPatient={handleAddPatient}
            onAddAppointment={handleAddAppointment}
            onAddToast={addToast}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'automations' && (
          <AutomationSkillsHub
            patients={patients}
            onTriggerToast={addToast}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'engagement_reports' && (
          <CrmAnalytics
            patients={patients}
            appointments={appointments}
          />
        )}

        {activeTab === 'scheduling' && (
          <SchedulingModule
            appointments={appointments}
            patients={patients}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onSendReminder={handleSendReminder}
            onSendSms={handleSendSms}
            onSimulatePatientSmsReply={handleSimulatePatientSmsReply}
          />
        )}

        {activeTab === 'content_agents' && <ContentCreationStudio />}

        {activeTab === 'chatbot' && <GeminiChatbot />}

        {activeTab === 'whatsapp' && (
          <WhatsAppSimulator onAddToast={addToast} onAddAppointment={handleAddAppointment} />
        )}

        {activeTab === 'omniroute' && (
          <OmniRouteHub
            onAddToast={addToast}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapMap onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'services' && <ServicesGuide />}

        {activeTab === 'cro' && <CroEthicsGuide />}
        </div>
      </main>

      {/* Add Patient Lead Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onAddPatient={handleAddPatient}
      />

      {/* Render.com Deployment Modal & Guide */}
      <RenderDeployModal
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
      />

      {/* GitHub Sync & Push Modal */}
      <GitHubPushModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onSuccessNotification={(title, message) => {
          addToast({
            type: 'success',
            title,
            message,
          });
        }}
      />

      <footer className={`bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 pl-3 md:pl-[18.5rem] lg:pl-80 ${
        isWhatsAppFocus ? 'hidden' : 'mt-12'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              🦷
            </div>
            <div>
              <p className="text-slate-200 font-heading font-bold text-sm">
                OdontoMind AI · CRM & Inteligência Artificial Odontológica
              </p>
              <p className="text-[11px] text-slate-500">
                Sistema de Notificações Toast, Prontuários com Histórico Clínico e Produção de Conteúdo em Conformidade com o CRO.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% em Conformidade com a Resolução CFO 196/2019
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Prontuários Criptografados (LGPD Saúde)
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>&copy; Todos os direitos reservados: Lorenzo Cardoso - Engenheiro de Software e Automação / Cientista de Dados / Especialista em Heurísticas Comportamentais / Escritor Acadêmico.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Appointment, PatientLead, SmsDeliveryStatus } from '../types';
import { clinicDentists, dentistFromId, dentistIdFromName } from '../data/dentists';
import { fetchGoogleCalendarStatus, GoogleCalendarStatus } from '../lib/googleCalendar';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Plus, 
  Send, 
  Search,
  Check,
  Smartphone,
  CheckCheck,
  RefreshCw,
  SendHorizontal,
  ShieldCheck,
  Cloud
} from 'lucide-react';

interface SchedulingModuleProps {
  appointments: Appointment[];
  patients: PatientLead[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  onSendReminder: (appointment: Appointment) => void;
  onSendSms: (appointment: Appointment, customText?: string, templateType?: string) => Promise<void>;
  onSimulatePatientSmsReply: (appointmentId: string) => void;
}

export const SchedulingModule: React.FC<SchedulingModuleProps> = ({
  appointments,
  patients,
  onAddAppointment,
  onUpdateAppointmentStatus,
  onSendReminder,
  onSendSms,
  onSimulatePatientSmsReply
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSmsStatus, setFilterSmsStatus] = useState<string>('all');
  const [selectedDentist, setSelectedDentist] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [smsModalApt, setSmsModalApt] = useState<Appointment | null>(null);
  const [smsTemplateType, setSmsTemplateType] = useState<'confirmation' | 'reminder' | 'followup' | 'custom'>('confirmation');
  const [customSmsText, setCustomSmsText] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSuccessNotice, setSmsSuccessNotice] = useState<string | null>(null);

  // New Appointment Form State
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || 'walk-in');
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('14:00');
  const [newDuration, setNewDuration] = useState(60);
  const [newDentist, setNewDentist] = useState(clinicDentists[0].name);
  const [newProcedure, setNewProcedure] = useState('Avaliacao Inicial com Scanner 3D');
  const [sendAutoSms, setSendAutoSms] = useState(true);
  const [googleStatus, setGoogleStatus] = useState<GoogleCalendarStatus | null>(null);
  const [boardDate, setBoardDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    void fetchGoogleCalendarStatus().then(setGoogleStatus);
  }, []);

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSms = filterSmsStatus === 'all' || apt.smsStatus === filterSmsStatus;
    const matchesDentist =
      selectedDentist === 'all' ||
      apt.dentist === selectedDentist ||
      apt.dentistId === dentistIdFromName(selectedDentist);
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery);
    return matchesStatus && matchesSms && matchesDentist && matchesSearch;
  });

  // Calculate SMS & Scheduling Metrics
  const totalAppointments = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const smsDeliveredCount = appointments.filter((a) => a.smsStatus === 'entregue' || a.smsStatus === 'respondido').length;
  const smsAnsweredCount = appointments.filter((a) => a.smsStatus === 'respondido').length;
  const confirmationRate = totalAppointments > 0 ? Math.round((confirmedCount / totalAppointments) * 100) : 0;
  const smsDeliveryRate = totalAppointments > 0 ? Math.round((smsDeliveredCount / totalAppointments) * 100) : 0;

  // Open SMS dispatch modal with default template
  const handleOpenSmsModal = (apt: Appointment, type: 'confirmation' | 'reminder' | 'followup' = 'confirmation') => {
    setSmsModalApt(apt);
    setSmsTemplateType(type);
    setSmsSuccessNotice(null);

    const firstName = apt.patientName.split(' ')[0];
    const dentistName = apt.dentist.split(' ')[0];

    if (type === 'confirmation') {
      setCustomSmsText(`OdontoMind: ${firstName}, sua consulta com ${dentistName} esta agendada p/ ${apt.date} as ${apt.time} (${apt.procedure.slice(0, 24)}). Responda 1 p/ confirmar ou 2 p/ reagendar.`);
    } else if (type === 'reminder') {
      setCustomSmsText(`OdontoMind: Lembrete! Sua consulta e amanha (${apt.date}) as ${apt.time} com ${dentistName}. Av. Paulista 1000. Responda 1 p/ confirmar presenca.`);
    } else {
      setCustomSmsText(`OdontoMind: Ola ${firstName}, como esta sua recuperacao? Qualquer duvida ou desconforto responda a este SMS para contato imediato.`);
    }
  };

  const handleExecuteSendSms = async () => {
    if (!smsModalApt) return;
    setIsSendingSms(true);
    try {
      await onSendSms(smsModalApt, customSmsText, smsTemplateType);
      setSmsSuccessNotice('SMS enviado com sucesso e entregue na operadora!');
      setTimeout(() => {
        setSmsModalApt(null);
        setSmsSuccessNotice(null);
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingSms(false);
    }
  };

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const appointmentsByDentist = useMemo(() => {
    return clinicDentists.map((dentist) => {
      const dayAppointments = appointments.filter((apt) => {
        const sameDentist = apt.dentistId === dentist.id || apt.dentist === dentist.name;
        return sameDentist && apt.date === boardDate && apt.status !== 'cancelled';
      });
      return { dentist, dayAppointments };
    });
  }, [appointments, boardDate]);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = patients.find((p) => p.id === newPatientId);
    const patientName = selectedPatient?.name || walkInName.trim();
    const patientPhone = selectedPatient?.phone || walkInPhone.trim();
    if (!patientName || !patientPhone) return;
    const dentistId = dentistIdFromName(newDentist);
    const dentist = dentistFromId(dentistId);
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: selectedPatient?.id || `walkin-${Date.now()}`,
      patientName,
      patientPhone,
      date: newDate,
      time: newTime,
      durationMinutes: Number(newDuration),
      dentist: dentist.name,
      dentistId: dentist.id,
      procedure: newProcedure,
      status: 'pending',
      reminderSent: sendAutoSms,
      channel: 'sms',
      smsStatus: sendAutoSms ? 'enviado' : 'pendente',
      smsSentAt: sendAutoSms ? new Date().toISOString().replace('T', ' ').slice(0, 19) : undefined,
      smsMessageContent: `OdontoMind: ${patientName.split(' ')[0]}, consulta agendada para ${newDate} as ${newTime} com ${dentist.name.split(' ')[0]}. Responda 1 p/ confirmar.`,
      smsProviderId: `SMS-AUTO-${Date.now().toString(36).toUpperCase()}`,
      googleCalendarId: dentist.calendarId,
      googleSyncStatus: 'pending'
    };
    onAddAppointment(newApt);
    setIsNewModalOpen(false);

    if (sendAutoSms) {
      onSendSms(newApt, newApt.smsMessageContent, 'confirmation');
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Confirmada
          </span>
        );
      case 'pending':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Aguardando
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Concluída
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelada
          </span>
        );
    }
  };

  // Render SMS Delivery Status Badge
  const getSmsDeliveryBadge = (apt: Appointment) => {
    const status = apt.smsStatus || 'pendente';
    switch (status) {
      case 'respondido':
        return (
          <div className="flex flex-col items-start gap-0.5" title={`Respondido pelo paciente via SMS em ${apt.smsDeliveredAt || 'recente'}`}>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
              <CheckCheck className="w-3 h-3" />
              Respondido (SIM)
            </span>
            <span className="text-[9px] text-emerald-700 font-medium">
              Confirmação via Operadora
            </span>
          </div>
        );
      case 'entregue':
        return (
          <div className="flex flex-col items-start gap-0.5" title={`Entregue no aparelho em ${apt.smsDeliveredAt || 'recente'}`}>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" />
              Entregue (DLR)
            </span>
            <span className="text-[9px] text-slate-500 font-mono">
              {apt.smsDeliveredAt?.split(' ')[1] || 'Entregue'}
            </span>
          </div>
        );
      case 'enviado':
        return (
          <div className="flex flex-col items-start gap-0.5" title="Enviado para a operadora (em trânsito)">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 flex items-center gap-1 border border-cyan-200">
              <SendHorizontal className="w-3 h-3 text-cyan-600" />
              Em Trânsito
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              Aguardando recibo
            </span>
          </div>
        );
      case 'falha':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1 border border-rose-200">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              Falha de Entrega
            </span>
            <button
              onClick={() => handleOpenSmsModal(apt, 'reminder')}
              className="text-[9px] text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
            >
              Reenviar SMS
            </button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              Pendente Envio
            </span>
            <span className="text-[9px] text-slate-400">
              Programado T-24h
            </span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Module Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md mb-1">
            <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
            <span>Módulo de Integração SMS Automático & Status de Entrega</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Agenda por Dentista, Google Calendar e SMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Cada profissional tem a propria grade. Consultas ficam salvas neste site e, com token, vao para o Google Calendar do dentista.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
            <Cloud className={`w-3.5 h-3.5 ${googleStatus?.connected ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{googleStatus?.message || 'Verificando Google Calendar...'}</span>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Consulta</span>
        </button>
      </div>

      {/* KPI Cards: SMS Gateway Performance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total de Consultas</p>
            <p className="text-xl font-heading font-extrabold text-slate-900 mt-1">
              {totalAppointments}
            </p>
            <span className="text-[10px] text-cyan-600 font-medium block mt-0.5">
              Grade de Cadeira Ativa
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Taxa de Confirmação SMS</p>
            <p className="text-xl font-heading font-extrabold text-emerald-600 mt-1">
              {confirmationRate}%
            </p>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
              {confirmedCount} confirmadas pelo paciente
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Entrega de SMS (DLR)</p>
            <p className="text-xl font-heading font-extrabold text-slate-900 mt-1">
              {smsDeliveryRate}%
            </p>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Protocolo SMPP Operadoras
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Respostas Interativas</p>
            <p className="text-xl font-heading font-extrabold text-teal-600 mt-1">
              {smsAnsweredCount}
            </p>
            <span className="text-[10px] text-teal-600 font-medium block mt-0.5">
              Confirmadas via SMS "1 / SIM"
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">Grade do dia por dentista</h3>
            <p className="text-[11px] text-slate-500">Consultas persistidas no site. Clique em um horario livre para agendar.</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold">Data</span>
            <input
              type="date"
              value={boardDate}
              onChange={(e) => setBoardDate(e.target.value)}
              className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {appointmentsByDentist.map(({ dentist, dayAppointments }) => (
            <div key={dentist.id} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-3 py-2.5 text-white" style={{ backgroundColor: dentist.color }}>
                <p className="text-xs font-bold">{dentist.name}</p>
                <p className="text-[10px] text-white/90">{dentist.specialty} · {dentist.cro}</p>
                <p className="text-[10px] text-white/80 truncate">Calendar: {dentist.calendarId}</p>
              </div>
              <div className="divide-y divide-slate-100">
                {timeSlots.map((slot) => {
                  const booked = dayAppointments.find((apt) => apt.time === slot);
                  return (
                    <button
                      key={`${dentist.id}-${slot}`}
                      type="button"
                      onClick={() => {
                        setNewDentist(dentist.name);
                        setNewTime(slot);
                        setNewDate(boardDate);
                        setIsNewModalOpen(true);
                      }}
                      className={`w-full text-left px-3 py-2 text-[11px] cursor-pointer ${
                        booked ? 'bg-slate-50' : 'hover:bg-cyan-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-slate-500">{slot}</span>
                        {booked ? (
                          <span className="truncate text-slate-800 font-semibold">
                            {booked.patientName} · {booked.procedure}
                          </span>
                        ) : (
                          <span className="text-cyan-700 font-medium">Livre</span>
                        )}
                      </div>
                      {booked && (
                        <span className="block text-[10px] text-slate-500 mt-0.5">
                          {booked.googleSyncStatus === 'synced' ? 'No Google Calendar' : 'Salva no site'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por paciente, telefone ou procedimento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* SMS Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-semibold mr-0.5">Status SMS:</span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'respondido', label: '✓✓ Respondidos' },
              { id: 'entregue', label: '✓ Entregues' },
              { id: 'enviado', label: 'Em Trânsito' },
              { id: 'pendente', label: 'Pendentes' },
              { id: 'falha', label: '⚠️ Falhas' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterSmsStatus(st.id)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterSmsStatus === st.id
                    ? 'bg-cyan-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500">Dentista:</span>
          <select
            value={selectedDentist}
            onChange={(e) => setSelectedDentist(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todos os Dentistas</option>
            {clinicDentists.map((dentist) => (
              <option key={dentist.id} value={dentist.name}>
                {dentist.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Paciente & Telefone (SMS)</th>
                <th className="py-3.5 px-4">Data & Horário</th>
                <th className="py-3.5 px-4">Procedimento</th>
                <th className="py-3.5 px-4">Dentista</th>
                <th className="py-3.5 px-4">Status da Consulta</th>
                <th className="py-3.5 px-4">Status de Entrega do SMS</th>
                <th className="py-3.5 px-4 text-right">Ações de Disparo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    Nenhuma consulta encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const patient = patients.find((p) => p.id === apt.patientId);

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Patient & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {patient?.avatar ? (
                            <img
                              src={patient.avatar}
                              alt={apt.patientName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                              {apt.patientName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{apt.patientName}</p>
                            <div className="flex items-center gap-1.5 text-[11px] text-cyan-800 font-mono font-medium">
                              <Smartphone className="w-3 h-3 text-cyan-600" />
                              <span>{apt.patientPhone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {apt.date}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-600" />
                          <span>{apt.time} ({apt.durationMinutes} min)</span>
                        </div>
                      </td>

                      {/* Procedure */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-900 max-w-xs truncate" title={apt.procedure}>
                          {apt.procedure}
                        </p>
                      </td>

                      {/* Dentist */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 font-medium">{apt.dentist}</span>
                      </td>

                      {/* Consultation Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(apt.status)}
                      </td>

                      {/* SMS Delivery Status Column (HIGHLIGHT) */}
                      <td className="py-3.5 px-4">
                        {getSmsDeliveryBadge(apt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send/Preview SMS Button */}
                          <button
                            onClick={() => handleOpenSmsModal(apt, 'reminder')}
                            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition-colors cursor-pointer"
                            title="Abrir prévia e disparar SMS"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>Enviar SMS</span>
                          </button>

                          {/* Quick action to simulate patient SMS reply 'SIM' */}
                          {apt.status === 'pending' && apt.smsStatus !== 'respondido' && (
                            <button
                              onClick={() => onSimulatePatientSmsReply(apt.id)}
                              className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded-md transition-colors cursor-pointer"
                              title="Simular resposta do paciente 'SIM' via SMS"
                            >
                              Simular Resposta
                            </button>
                          )}

                          {apt.status === 'pending' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'confirmed')}
                              className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Confirmar
                            </button>
                          )}

                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                              className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-medium px-2 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Concluir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: SMS Preview & Gateway Dispatcher */}
      {smsModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Disparo de SMS de Consulta
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Gateway SMS Integrado (Vivo / Claro / TIM / Oi)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSmsModalApt(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Recipient Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Destinatário:</span>
                <strong className="text-xs text-slate-900 font-bold block mt-0.5">
                  {smsModalApt.patientName}
                </strong>
                <span className="text-[11px] text-cyan-700 font-mono font-semibold">
                  {smsModalApt.patientPhone}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Consulta:</span>
                <span className="text-xs font-semibold text-slate-800 block">
                  {smsModalApt.date} às {smsModalApt.time}
                </span>
                <span className="text-[10px] text-slate-500">{smsModalApt.dentist}</span>
              </div>
            </div>

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Modelo do SMS:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'confirmation', label: '1. Confirmação' },
                  { id: 'reminder', label: '2. Lembrete 24h' },
                  { id: 'followup', label: '3. Pós-Operatório' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleOpenSmsModal(smsModalApt, tpl.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      smsTemplateType === tpl.id
                        ? 'bg-cyan-900 text-white border-cyan-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SMS Message Textarea & Character Counter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Conteúdo da Mensagem SMS:
                </label>
                <span className={`text-[11px] font-mono font-semibold ${
                  customSmsText.length > 160 ? 'text-amber-600' : 'text-slate-500'
                }`}>
                  {customSmsText.length} / 160 caracteres ({Math.ceil(customSmsText.length / 160)} SMS)
                </span>
              </div>

              <textarea
                rows={3}
                value={customSmsText}
                onChange={(e) => setCustomSmsText(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                placeholder="Digite a mensagem do SMS..."
              />
            </div>

            {/* Success Feedback Notice */}
            {smsSuccessNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-lg flex items-center gap-2 font-medium animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{smsSuccessNotice}</span>
              </div>
            )}

            {/* Footer & Dispatch Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Rotas Homologadas ANATEL
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSmsModalApt(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isSendingSms || !customSmsText.trim()}
                  onClick={handleExecuteSendSms}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSendingSms ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando na Operadora...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Disparar SMS Imediato</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Agendar Nova Consulta Odontológica
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selecione o Paciente do CRM:
                </label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                >
                  <option value="walk-in">Consulta avulsa (sem prontuario)</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Tel: {p.phone} ({p.treatment})
                    </option>
                  ))}
                </select>
              </div>
              {(!newPatientId || newPatientId === 'walk-in') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nome do paciente:</label>
                    <input
                      type="text"
                      required
                      value={walkInName}
                      onChange={(e) => setWalkInName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefone:</label>
                    <input
                      type="tel"
                      required
                      value={walkInPhone}
                      onChange={(e) => setWalkInPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data:</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Horário:</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cirurgião-Dentista:</label>
                  <select
                    value={newDentist}
                    onChange={(e) => setNewDentist(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  >
                    {clinicDentists.map((dentist) => (
                      <option key={dentist.id} value={dentist.name}>
                        {dentist.name} ({dentist.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duração (minutos):</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  >
                    <option value={30}>30 min (Manutenção)</option>
                    <option value={45}>45 min (Profilaxia)</option>
                    <option value={60}>60 min (Avaliação / DSD)</option>
                    <option value={90}>90 min (Cirurgia / Preparo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Procedimento:</label>
                <input
                  type="text"
                  required
                  value={newProcedure}
                  onChange={(e) => setNewProcedure(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Automatic SMS Checkbox */}
              <label className="flex items-center gap-2 p-3 bg-cyan-50/80 rounded-xl border border-cyan-200 text-xs text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendAutoSms}
                  onChange={(e) => setSendAutoSms(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <span className="font-bold block text-slate-900">
                    Enviar SMS de Confirmação Automático Imediato
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Dispara mensagem para o telefone do paciente com link de confirmação
                  </span>
                </div>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

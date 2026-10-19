import React, { useState } from 'react';
import { PatientLead, PipelineStage } from '../types';
import { pipelineStagesConfig } from '../data/crmData';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Calendar, 
  AlertCircle, 
  FileCheck2, 
  MessageSquare, 
  TrendingUp, 
  UserCheck, 
  Sparkles,
  DollarSign,
  Clock,
  Send,
  X,
  Smartphone,
  Copy,
  Check,
  Edit2
} from 'lucide-react';

interface CrmPipelineProps {
  patients: PatientLead[];
  onUpdatePatientStage: (patientId: string, newStage: PipelineStage) => void;
  onOpenNewPatientModal: () => void;
  onTriggerWhatsAppFollowup: (patient: PatientLead) => void;
  onUpdatePatientPhone?: (patientId: string, newPhone: string) => void;
  onTriggerSmsDirect?: (patient: PatientLead) => void;
}

export const CrmPipeline: React.FC<CrmPipelineProps> = ({
  patients,
  onUpdatePatientStage,
  onOpenNewPatientModal,
  onTriggerWhatsAppFollowup,
  onUpdatePatientPhone,
  onTriggerSmsDirect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPatientModal, setSelectedPatientModal] = useState<PatientLead | null>(null);
  const [phoneEditValue, setPhoneEditValue] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  // When patient is selected in modal, sync phone
  const handleOpenPatientModal = (patient: PatientLead) => {
    setSelectedPatientModal(patient);
    setPhoneEditValue(patient.phone);
    setIsEditingPhone(false);
    setPhoneCopied(false);
  };

  const handleSavePhone = () => {
    if (!selectedPatientModal || !onUpdatePatientPhone) return;
    onUpdatePatientPhone(selectedPatientModal.id, phoneEditValue);
    setSelectedPatientModal({ ...selectedPatientModal, phone: phoneEditValue });
    setIsEditingPhone(false);
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
  };

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || patient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Metrics
  const totalValue = patients.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  const avgTicket = Math.round(totalValue / (patients.length || 1));
  const inTreatmentCount = patients.filter((p) => p.stage === 'in_treatment').length;
  const scheduledCount = patients.filter((p) => p.stage === 'scheduled').length;

  const getUrgencyBadge = (urgency: PatientLead['urgency']) => {
    switch (urgency) {
      case 'imediata':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">Imediata</span>;
      case 'alta':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-700">Urgência Alta</span>;
      case 'media':
        return <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">Moderada</span>;
      default:
        return <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">Eletiva</span>;
    }
  };

  const getStageIndex = (stage: PipelineStage) => {
    return pipelineStagesConfig.findIndex((s) => s.id === stage);
  };

  const moveStage = (patient: PatientLead, direction: 'next' | 'prev') => {
    const currentIndex = getStageIndex(patient.stage);
    if (direction === 'next' && currentIndex < pipelineStagesConfig.length - 1) {
      onUpdatePatientStage(patient.id, pipelineStagesConfig[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      onUpdatePatientStage(patient.id, pipelineStagesConfig[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top CRM KPI Summary Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pipeline Total Ativo</p>
            <p className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalValue)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Ticket Médio por Plano</p>
            <p className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(avgTicket)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Em Tratamento Ativo</p>
            <p className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 mt-1">
              {inTreatmentCount} pacientes
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total de Prontuários</p>
            <p className="text-lg sm:text-xl font-heading font-extrabold text-teal-600 mt-1">
              {patients.length} {patients.length === 1 ? 'paciente' : 'pacientes'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Operational Empty State Banner when 0 patients */}
      {patients.length === 0 && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-800/50 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold px-2 py-0.5 rounded">
                Plataforma Operacional Ativa
              </span>
              <span className="text-xs text-slate-400">Banco de dados limpo para uso prático</span>
            </div>
            <h4 className="font-heading font-bold text-base text-white">
              Nenhum paciente cadastrado ainda
            </h4>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Os dados fictícios foram removidos. Agora, apenas os dados reais que você cadastrar ou que o SDR capturar pelas redes sociais aparecerão aqui no pipeline.
            </p>
          </div>
          <button
            onClick={onOpenNewPatientModal}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-105 cursor-pointer shrink-0 shadow-lg shadow-cyan-500/20"
          >
            + Cadastrar Primeiro Paciente
          </button>
        </div>
      )}

      {/* Control Bar: Search, Category Filters & Add Lead */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar paciente por nome, procedimento ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'Ortodontia', 'Implantes', 'Estética', 'Cirurgia'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todas Especialidades' : cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenNewPatientModal}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Paciente</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {pipelineStagesConfig.map((stageConfig) => {
          const stagePatients = filteredPatients.filter((p) => p.stage === stageConfig.id);
          const stageTotal = stagePatients.reduce((sum, p) => sum + p.estimatedValue, 0);

          return (
            <div
              key={stageConfig.id}
              className="bg-slate-100/80 rounded-xl p-3 border border-slate-200/80 flex flex-col min-h-[550px]"
            >
              {/* Column Header */}
              <div className={`border-t-4 ${stageConfig.color} pt-2 mb-3`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-xs text-slate-900">
                    {stageConfig.title}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {stagePatients.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  {stageConfig.subtitle}
                </p>
                <p className="text-[11px] font-semibold text-slate-700 mt-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stageTotal)}
                </p>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                {stagePatients.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[11px] text-slate-400 text-center p-2">
                    Nenhum paciente nesta etapa
                  </div>
                ) : (
                  stagePatients.map((patient) => {
                    const stageIdx = getStageIndex(patient.stage);
                    const canMovePrev = stageIdx > 0;
                    const canMoveNext = stageIdx < pipelineStagesConfig.length - 1;

                    return (
                      <div
                        key={patient.id}
                        className="bg-white rounded-lg p-3 border border-slate-200 shadow-xs hover:shadow-md transition-shadow cursor-pointer space-y-2 group"
                        onClick={() => setSelectedPatientModal(patient)}
                      >
                        {/* Header: Avatar, Name & Urgency */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={patient.avatar}
                              alt={patient.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {patient.name}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {patient.dentistAssigned}
                              </p>
                            </div>
                          </div>
                          {getUrgencyBadge(patient.urgency)}
                        </div>

                        {/* Treatment Name & Category */}
                        <div>
                          <p className="text-xs font-semibold text-cyan-900 line-clamp-1">
                            {patient.treatment}
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[10px] text-slate-500">
                              {patient.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-700 bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors">
                              <Phone className="w-2.5 h-2.5 text-cyan-600" />
                              {patient.phone}
                            </span>
                          </div>
                        </div>

                        {/* Value & Appointment info */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <span className="font-extrabold text-slate-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(patient.estimatedValue)}
                          </span>
                          {patient.appointmentDate ? (
                            <span className="text-[10px] text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {patient.appointmentDate}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              {patient.lastContact.split(' ')[0]}
                            </span>
                          )}
                        </div>

                        {/* Card Footer: Quick Actions */}
                        <div 
                          className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1">
                            {canMovePrev && (
                              <button
                                onClick={() => moveStage(patient, 'prev')}
                                title="Voltar etapa"
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canMoveNext && (
                              <button
                                onClick={() => moveStage(patient, 'next')}
                                title="Avançar etapa"
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-cyan-600 cursor-pointer"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => onTriggerWhatsAppFollowup(patient)}
                            className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            <Send className="w-2.5 h-2.5" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Deep Clinical Record Modal */}
      {selectedPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatientModal.avatar}
                  alt={selectedPatientModal.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-heading font-extrabold text-slate-900">
                      {selectedPatientModal.name}
                    </h3>
                    {getUrgencyBadge(selectedPatientModal.urgency)}
                  </div>
                  <p className="text-xs text-slate-500">
                    Telefone: {selectedPatientModal.phone} · Dentista: {selectedPatientModal.dentistAssigned}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Treatment & Financial Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Tratamento Principal</span>
                <strong className="text-sm text-slate-900 block mt-0.5 font-bold">
                  {selectedPatientModal.treatment}
                </strong>
                <span className="text-[10px] text-cyan-600 font-medium">
                  {selectedPatientModal.category}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Orçamento Estimado</span>
                <strong className="text-sm text-emerald-600 block mt-0.5 font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPatientModal.estimatedValue)}
                </strong>
                <span className="text-[10px] text-slate-500">
                  Condições: Até 12x sem juros
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Termo TCLE (Resolução CFO)</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <FileCheck2 className={`w-4 h-4 ${selectedPatientModal.croConsentSigned ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <span className="text-xs font-semibold text-slate-800">
                    {selectedPatientModal.croConsentSigned ? 'Assinado Digitalmente' : 'Pendente de Coleta'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
                  Validação via biometria facial
                </span>
              </div>
            </div>

            {/* AI Clinical Triage Summary */}
            <div className="bg-cyan-50/70 border border-cyan-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-900 font-heading font-bold text-xs">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Resumo da Triagem Inteligente de IA</span>
              </div>
              <p className="text-xs text-cyan-950 leading-relaxed">
                {selectedPatientModal.aiTriageSummary || 'Triagem preliminar indica necessidade de avaliação clínica e radiografia periapical.'}
              </p>
            </div>

            {/* Communication Preferences & Engagement Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferences */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
                    Preferências de Comunicação
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    Canal: {selectedPatientModal.communicationPrefs?.preferredChannel.toUpperCase() || 'WHATSAPP'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Melhor Horário:</span>
                    <strong className="text-slate-800">
                      {selectedPatientModal.communicationPrefs?.preferredTime === 'morning' ? 'Manhã (08h - 12h)' : selectedPatientModal.communicationPrefs?.preferredTime === 'afternoon' ? 'Tarde (13h - 18h)' : 'Noite (18h - 20h)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lembretes de Consulta:</span>
                    <strong className="text-emerald-600">Ativo (Confirmação IA)</strong>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                    Recall Semestral: {selectedPatientModal.communicationPrefs?.optInPreventiveRecall ? '✓ Autorizado' : '✕ Desativado'}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                    Follow-up Pós-Op: {selectedPatientModal.communicationPrefs?.optInFollowup ? '✓ Autorizado' : '✕ Desativado'}
                  </span>
                </div>
              </div>

              {/* Patient Engagement Report */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Métricas de Engajamento deste Paciente
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Mensagens</span>
                    <strong className="text-slate-900 font-bold">
                      {selectedPatientModal.engagement?.messagesOpened || 0}/{selectedPatientModal.engagement?.messagesSent || 0}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Presença</span>
                    <strong className="text-emerald-600 font-bold">
                      {selectedPatientModal.engagement?.appointmentsAttended || 0} cons.
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">NPS Score</span>
                    <strong className="text-purple-600 font-bold">
                      {selectedPatientModal.engagement?.npsScore || 10}/10
                    </strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  Última interação registrada: <strong>{selectedPatientModal.engagement?.lastInteractionDate || 'Hoje'}</strong>
                </p>
              </div>
            </div>

            {/* Treatment History (Prontuário Odontológico) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-cyan-600" />
                  Histórico de Tratamentos & Evolução Clínica
                </label>
                <span className="text-[10px] text-slate-400">
                  {selectedPatientModal.treatmentHistory?.length || 0} procedimento(s) registrado(s)
                </span>
              </div>

              {selectedPatientModal.treatmentHistory && selectedPatientModal.treatmentHistory.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedPatientModal.treatmentHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 font-bold">{tx.procedure}</strong>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.cost)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>Data: {tx.date}</span>
                        <span>·</span>
                        <span>Região: {tx.toothOrRegion || 'Arcada'}</span>
                        <span>·</span>
                        <span>Dentista: {tx.dentist}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                        "{tx.clinicalNotes}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400 border border-dashed border-slate-200">
                  Nenhum procedimento anterior registrado no histórico clínico.
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Última interação: {selectedPatientModal.lastContact}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onTriggerWhatsAppFollowup(selectedPatientModal);
                    setSelectedPatientModal(null);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Disparar WhatsApp</span>
                </button>

                <button
                  onClick={() => setSelectedPatientModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

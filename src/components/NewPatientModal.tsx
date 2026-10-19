import React, { useState } from 'react';
import { PatientLead } from '../types';
import { X, UserPlus, Sparkles } from 'lucide-react';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: PatientLead) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [treatment, setTreatment] = useState('Alinhadores Invisíveis');
  const [category, setCategory] = useState<PatientLead['category']>('Ortodontia');
  const [estimatedValue, setEstimatedValue] = useState<number>(11500);
  const [urgency, setUrgency] = useState<PatientLead['urgency']>('media');
  const [dentistAssigned, setDentistAssigned] = useState('Dra. Camila Alencar');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPatient: PatientLead = {
      id: `pt-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '+55 11 99999-0000',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      treatment,
      category,
      estimatedValue: Number(estimatedValue) || 5000,
      stage: 'new_lead',
      urgency,
      dentistAssigned,
      lastContact: 'Agora mesmo via Cadastro Rápido',
      notes: notes || 'Lead recém cadastrado na esteira de triagem IA.',
      croConsentSigned: false,
      aiTriageSummary: `Lead interessado em ${treatment}. Classificação de urgência: ${urgency}. Agendar contato via WhatsApp para oferta de horários com scanner 3D.`,
      communicationPrefs: {
        preferredChannel: 'whatsapp',
        preferredTime: 'afternoon',
        optInReminders: true,
        optInFollowup: true,
        optInPreventiveRecall: true,
        optInEducationalTips: true
      },
      treatmentHistory: [
        {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          procedure: `Avaliação Inicial: ${treatment}`,
          toothOrRegion: 'Geral',
          dentist: dentistAssigned,
          cost: Number(estimatedValue) || 1000,
          status: 'Planejado',
          clinicalNotes: notes || 'Plano de tratamento cadastrado para escaneamento 3D.'
        }
      ],
      engagement: {
        messagesSent: 1,
        messagesOpened: 1,
        appointmentsAttended: 0,
        appointmentsMissed: 0,
        npsScore: 10,
        recallAdherencePercent: 100,
        lastInteractionDate: new Date().toISOString().split('T')[0]
      }
    };

    onAddPatient(newPatient);
    onClose();
    setName('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Cadastrar Novo Paciente no CRM
              </h3>
              <p className="text-[11px] text-slate-500">
                Entrada automática na esteira de triagem inteligente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome do Paciente *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Gabriel Fontoura"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp / Celular
              </label>
              <input
                type="text"
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Especialidade
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as PatientLead['category'];
                  setCategory(cat);
                  if (cat === 'Ortodontia') {
                    setTreatment('Alinhadores Invisíveis');
                    setEstimatedValue(11500);
                  } else if (cat === 'Implantes') {
                    setTreatment('Implante Guiado Carga Imediata');
                    setEstimatedValue(18000);
                  } else if (cat === 'Estética') {
                    setTreatment('Lentes Cerâmicas de Dissilicato');
                    setEstimatedValue(14000);
                  } else {
                    setTreatment('Check-up Preventivo 3D');
                    setEstimatedValue(850);
                  }
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="Ortodontia">Ortodontia Digital</option>
                <option value="Implantes">Implantodontia</option>
                <option value="Estética">Estética & Lentes</option>
                <option value="Cirurgia">Cirurgia & DTM</option>
                <option value="Clínica Geral">Clínica Geral</option>
                <option value="Prevenção">Prevenção & Profilaxia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Valor Estimado (R$)
              </label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tratamento / Queixa Principal
            </label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grau de Urgência
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as PatientLead['urgency'])}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="baixa">Eletiva (Sem dor)</option>
                <option value="media">Moderada</option>
                <option value="alta">Alta (Desconforto)</option>
                <option value="imediata">Imediata (Dor Aguda / Trauma)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dentista Responsável
              </label>
              <select
                value={dentistAssigned}
                onChange={(e) => setDentistAssigned(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="Dra. Camila Alencar">Dra. Camila Alencar (Ortodontia)</option>
                <option value="Dr. Lucas Sampaio">Dr. Lucas Sampaio (Implantes & Cirurgia)</option>
                <option value="Dr. Marcelo Ribeiro">Dr. Marcelo Ribeiro (Reabilitação)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações / Canal de Origem
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Veio do Instagram após ver o vídeo sobre alinhadores..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Salvar e Iniciar Triagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

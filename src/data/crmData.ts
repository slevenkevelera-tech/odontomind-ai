import { PatientLead, PipelineStage, Appointment } from '../types';

/**
 * OdontoMind AI - Base de Dados Operacional
 * Configurado para uso prático: inicia limpo para que entrem apenas
 * os pacientes e agendamentos reais cadastrados pela clínica e pelo SDR.
 */

// Pacientes reais cadastrados pelos usuários
export const initialPatients: PatientLead[] = [];

// Configuração dos estágios do pipeline clínico
export const pipelineStagesConfig: { id: PipelineStage; title: string; subtitle: string; color: string }[] = [
  { id: 'new_lead', title: '1. Lead Captado', subtitle: 'Instagram, Google & Site', color: 'border-amber-400' },
  { id: 'ai_triage', title: '2. Triagem IA', subtitle: 'Avaliação clínica prévia', color: 'border-blue-400' },
  { id: 'scheduled', title: '3. Consulta Agendada', subtitle: 'Com confirmação ativa', color: 'border-cyan-400' },
  { id: 'proposal', title: '4. Proposta / Plano', subtitle: 'Orçamento apresentado', color: 'border-purple-400' },
  { id: 'in_treatment', title: '5. Em Tratamento', subtitle: 'Execução clínica 3D', color: 'border-emerald-400' },
  { id: 'followup_retained', title: '6. Pós-Op & Retenção', subtitle: 'Follow-up WhatsApp ativo', color: 'border-teal-400' },
];

// Agendamentos reais da clínica
export const initialAppointments: Appointment[] = [];

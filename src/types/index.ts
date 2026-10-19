export type TabType = 
  | 'crm' 
  | 'sdr'
  | 'automations'
  | 'engagement_reports' 
  | 'scheduling' 
  | 'content_agents' 
  | 'chatbot' 
  | 'whatsapp' 
  | 'roadmap' 
  | 'services' 
  | 'cro'
  | 'omniroute';

export type SocialPlatform = 'instagram' | 'whatsapp' | 'facebook' | 'tiktok' | 'google';

export interface SdrLead {
  id: string;
  name: string;
  phone: string;
  socialHandle?: string;
  channel: SocialPlatform;
  campaignOrigin?: string;
  interestProcedure: string;
  urgency: 'baixa' | 'media' | 'alta' | 'imediata';
  leadScore: number; // 0 - 100
  qualificationStatus: 'qualificando' | 'qualificado' | 'agendado' | 'desqualificado';
  capturedAt: string;
  lastMessage: string;
  sdrNotes: string;
  convertedToPatientId?: string;
}

export interface SocialIntegrationConfig {
  id: SocialPlatform;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'pending';
  accountIdentifier: string;
  webhookUrl: string;
  verifyToken: string;
  apiKeyOrToken?: string;
  apiDocsUrl: string;
  activeAutomationsCount: number;
}

export type AutomationTrigger = 
  | 'appointment_scheduled'
  | '24h_before_appointment'
  | '2h_before_appointment'
  | 'post_procedure_24h'
  | 'post_procedure_72h'
  | 'proposal_pending_7d'
  | 'patient_inactive_180d'
  | 'nps_feedback_received'
  | 'emergency_triage_alert'
  | 'patient_birthday'
  | 'webhook_inbound';

export type AutomationChannel = 'whatsapp' | 'sms' | 'email' | 'webhook' | 'clinical_alert';

export interface AutomationStep {
  id: string;
  order: number;
  type: 'trigger' | 'condition' | 'ai_generation' | 'delay' | 'action';
  title: string;
  description: string;
  details?: string;
  badge?: string;
}

export interface AutomationSkill {
  id: string;
  name: string;
  tagline: string;
  category: 'Anti-Falta (No-Show)' | 'Retenção & LTV' | 'Clínico & Pós-Op' | 'Captação & Vendas' | 'Integração & Webhooks';
  description: string;
  icon: string;
  accentColor: string;
  badgeColor: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  triggerLabel: string;
  channels: AutomationChannel[];
  executionCount: number;
  successRate: number;
  croSafe: boolean;
  croRuleRef: string;
  croNote: string;
  steps: AutomationStep[];
  template: {
    systemPrompt: string;
    samplePatient: string;
    previewMessage: string;
    actionButtons?: string[];
  };
  metrics: {
    savedHours: number;
    recoveredRevenue: number;
    impactLabel: string;
    impactValue: string;
  };
}

export interface AutomationExecutionLog {
  id: string;
  skillId: string;
  skillName: string;
  patientName: string;
  patientPhone: string;
  timestamp: string;
  channel: AutomationChannel;
  status: 'executado' | 'enviado' | 'aguardando_resposta' | 'resposta_recebida' | 'falha';
  triggerReason: string;
  generatedContent: string;
  response?: string;
  aiModelUsed: string;
  executionTimeMs: number;
}


export interface TreatmentRecord {
  id: string;
  date: string;
  procedure: string;
  toothOrRegion?: string;
  dentist: string;
  cost: number;
  status: 'Concluído' | 'Em Andamento' | 'Planejado';
  clinicalNotes: string;
}

export interface CommunicationPreferences {
  preferredChannel: 'whatsapp' | 'call' | 'email' | 'sms';
  preferredTime: 'morning' | 'afternoon' | 'evening';
  optInReminders: boolean;
  optInFollowup: boolean;
  optInPreventiveRecall: boolean;
  optInEducationalTips: boolean;
}

export interface PatientEngagement {
  messagesSent: number;
  messagesOpened: number;
  appointmentsAttended: number;
  appointmentsMissed: number;
  npsScore: number;
  recallAdherencePercent: number;
  lastInteractionDate: string;
}

export type PipelineStage = 
  | 'new_lead' 
  | 'ai_triage' 
  | 'scheduled' 
  | 'proposal' 
  | 'in_treatment' 
  | 'followup_retained';

export interface PatientLead {
  id: string;
  name: string;
  cpf?: string;
  email?: string;
  phone: string;
  birthDate?: string;
  avatar: string;
  treatment: string;
  category: 'Estética' | 'Ortodontia' | 'Implantes' | 'Clínica Geral' | 'Cirurgia' | 'Prevenção';
  estimatedValue: number;
  stage: PipelineStage;
  urgency: 'baixa' | 'media' | 'alta' | 'imediata';
  dentistAssigned: string;
  lastContact: string;
  notes: string;
  croConsentSigned: boolean;
  appointmentDate?: string;
  aiTriageSummary?: string;
  communicationPrefs: CommunicationPreferences;
  treatmentHistory: TreatmentRecord[];
  engagement: PatientEngagement;
}

export type SmsDeliveryStatus = 'entregue' | 'enviado' | 'pendente' | 'falha' | 'respondido';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  dentist: string;
  procedure: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reminderSent: boolean;
  channel: 'whatsapp' | 'sms' | 'email';
  smsStatus?: SmsDeliveryStatus;
  smsSentAt?: string;
  smsDeliveredAt?: string;
  smsMessageContent?: string;
  smsProviderId?: string;
}

export type AgentType = 
  | 'cro_compliance' 
  | 'viral_video_script' 
  | 'smart_triage' 
  | 'whatsapp_followup' 
  | 'smart_scheduler'
  | 'content_creator'
  | 'dedicated_content_agent';

export interface AgentConfig {
  id: AgentType;
  name: string;
  role: string;
  shortDesc: string;
  category: 'Marketing & CRO' | 'Clínico & Triagem' | 'Relacionamento & WhatsApp';
  icon: string;
  accentColor: string;
  sampleInput: any;
}

export interface MetaCloudApiConfig {
  phoneNumberId: string;
  wabaId: string;
  appId: string;
  accessToken: string;
  webhookVerifyToken: string;
  webhookUrl: string;
  apiVersion: string;
  syncMode: 'simulation' | 'meta_cloud_api';
  connectionStatus: 'connected' | 'disconnected' | 'testing' | 'error';
  lastSyncTimestamp?: string;
  businessProfile: {
    name: string;
    description: string;
    address: string;
    email: string;
    website: string;
  };
  displayPhoneNumber: string;
  qualityRating?: string;
}

export type ClinicalUrgency = 
  | 'emergencia_dor' 
  | 'urgencia_moderada' 
  | 'eletivo_estetica' 
  | 'pos_operatorio' 
  | 'duvida_geral';

export interface ClinicalTriageEvaluation {
  urgencyLevel: ClinicalUrgency;
  urgencyLabel: string;
  urgencyColor: string;
  identifiedSymptoms: string;
  recommendedSpecialty: string;
  maxResponseTime: string;
  croComplianceStatus: 'aprovado' | 'aviso_emitido';
  croRulesChecked: string[];
  patientSentiment: 'ansioso_dor' | 'interessado' | 'inseguro_preco' | 'tranquilo';
  suggestedSlots: Array<{
    id: string;
    date: string;
    time: string;
    period: string;
    dentist: string;
    procedure: string;
    chair: string;
  }>;
  schedulingReady: boolean;
  learningInsightExtracted?: string;
}

export interface AgentLearnedHeuristic {
  id: string;
  category: 'objeção_preco' | 'medo_fobia' | 'duvida_tempo' | 'compliance_cro' | 'pos_operatorio' | 'fechamento_agenda';
  categoryLabel: string;
  title: string;
  triggerPattern: string;
  learnedStrategy: string;
  confidenceScore: number;
  timesApplied: number;
  conversionBoost: string;
  sourceIntegration: string;
  createdAt: string;
}

export interface AgentBrainState {
  iqLevel: number;
  totalConversations: number;
  complianceAccuracy: number;
  objectionsOvercome: number;
  heuristics: AgentLearnedHeuristic[];
  recentLearnings: Array<{
    id: string;
    timestamp: string;
    summary: string;
    origin: string;
    impactScore: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  suggestedQuickReplies?: string[];
  triageEvaluation?: ClinicalTriageEvaluation;
  metaMessageId?: string;
  status?: 'sent' | 'delivered' | 'read';
  interactiveBooking?: {
    slots: Array<{
      id: string;
      date: string;
      time: string;
      dentist: string;
      procedure: string;
    }>;
    selectedSlot?: string;
  };
  learnedDelta?: string;
}

export interface MultiTurnMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  phase: number;
  phaseTitle: string;
  badge: string;
  duration: string;
  description: string;
  engineeringDetails: string[];
  deliverables: string[];
  securityAndCompliance: string[];
  icon: string;
}

export type ToastType = 'success' | 'urgent' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp: string;
  patientId?: string;
  patientName?: string;
  actionLabel?: string;
  actionTab?: TabType;
  read?: boolean;
}

// ==========================================
// OMNIROUTE & MULTI-AGENT ARCHITECTURE TYPES
// ==========================================

export type OmniChannel = 
  | 'whatsapp' 
  | 'instagram' 
  | 'facebook' 
  | 'tiktok' 
  | 'webchat' 
  | 'telegram' 
  | 'sms' 
  | 'email' 
  | 'crm_internal';

export type OmniAgentRole = 
  | 'sdr_qualification'
  | 'social_content'
  | 'clinical_triage'
  | 'cro_compliance'
  | 'smart_scheduling'
  | 'post_op_care'
  | 'retention_ltv'
  | 'customer_support';

export interface OmniAgentDefinition {
  id: string;
  name: string;
  role: OmniAgentRole;
  description: string;
  supportedChannels: OmniChannel[];
  model: string;
  systemPromptHint: string;
  active: boolean;
  totalTasksProcessed: number;
  successRate: number;
  avgLatencyMs: number;
  specialtyBadge: string;
}

export interface OmniRouteDemand {
  id: string;
  channel: OmniChannel;
  sourceUserName?: string;
  sourceContact?: string;
  rawInput: string;
  detectedIntent: string;
  assignedAgentId: string;
  priority: 'baixa' | 'normal' | 'alta' | 'critica';
  status: 'queued' | 'routing' | 'processing' | 'completed' | 'failed' | 'human_handoff';
  agentOutput?: string;
  croApproved?: boolean;
  executionTimeMs?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface OmniRouteConfig {
  enabled: boolean;
  defaultModel: string;
  fallbackToHumanOnDoubt: boolean;
  autoCroValidation: boolean;
  autoCrmSync: boolean;
  crossChannelMemory: boolean;
  webhookBaseUrl: string;
}


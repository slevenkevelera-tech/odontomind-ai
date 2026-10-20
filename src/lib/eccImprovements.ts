import type { EccTaskRun } from './eccRemote.ts'

export type ImprovementJobId =
  | 'cro_audit'
  | 'clinical_triage'
  | 'whatsapp_followup'
  | 'content_seo'
  | 'ops_hardening'

export type ImprovementResult = {
  jobId: ImprovementJobId
  title: string
  status: 'applied'
  summary: string
  appliedTo: string
  artifacts: Record<string, unknown>
  eccRunId?: string
  eccSummary?: string
  skillsUsed: string[]
}

const JOBS: Record<ImprovementJobId, { title: string; appliedTo: string; brief: string }> = {
  cro_audit: {
    title: 'Auditoria etica de copy CRO/CFO',
    appliedTo: 'Estudio de Conteudo e campanhas sociais',
    brief: 'Auditar copy promocional da OdontoMind, reprovar desconto publico e devolver versao etica com CRO.',
  },
  clinical_triage: {
    title: 'Triagem clinica de urgencia',
    appliedTo: 'WhatsApp, CRM etapa Triagem IA e Agenda',
    brief: 'Classificar queixa de dor dentaria, especialidade, risco e encaixe de cadeira.',
  },
  whatsapp_followup: {
    title: 'Follow-up pos-operatorio WhatsApp',
    appliedTo: 'WhatsApp e automacao de retencao',
    brief: 'Redigir mensagem de 24h apos implante em carga imediata, empatica e sem preco.',
  },
  content_seo: {
    title: 'Carrossel educativo SEO',
    appliedTo: 'Estudio de Conteudo IA',
    brief: 'Gerar carrossel de clareamento interno, titulos anti-cliche e CTA etico.',
  },
  ops_hardening: {
    title: 'Hardening operacional da clinica',
    appliedTo: 'OmniRoute, tokens e webhooks Meta',
    brief: 'Revisar armazenamento de token ECC, PHI, verify token Meta e confirmacao de agenda.',
  },
}

export function listImprovementJobs() {
  return Object.entries(JOBS).map(([id, meta]) => ({ id, ...meta }))
}

export function jobBrief(jobId: ImprovementJobId) {
  return JOBS[jobId]
}

export function applyImprovement(jobId: ImprovementJobId, ecc?: EccTaskRun): ImprovementResult {
  const meta = JOBS[jobId]
  const skillsUsed = ecc?.run?.result?.outputs?.map((item) => item.skill) || []
  const eccSummary = ecc?.run?.result?.summary || ecc?.task?.result?.summary
  const base = {
    title: meta.title,
    appliedTo: meta.appliedTo,
    status: 'applied' as const,
    eccRunId: ecc?.run?.id,
    eccSummary,
    skillsUsed,
  }

  if (jobId === 'cro_audit') {
    return {
      jobId,
      ...base,
      summary: 'Copy promocional reprovada. Versao etica aplicada ao estudio, sem desconto publico nem resultado garantido.',
      artifacts: {
        original:
          'PROMOCAO IMPERDIVEL DE CLAREAMENTO! Avaliacao gratis e 40% OFF nesta sexta. Resultado garantido em 1 sessao.',
        verdict: 'REPROVADO',
        risks: [
          'Desconto percentual em rede social (mercantilizacao, CFO 196/2019)',
          'Promessa de resultado garantido',
          'Avaliacao gratis como isca comercial',
          'Ausencia de nome, profissao e CRO do responsavel tecnico',
        ],
        rewritten:
          'Dra. Gabriela Fontes, Cirurgia-Dentista, CRO-SP 89452. Avaliacao individualizada de clareamento com scanner 3D. Os resultados variam conforme cada caso biologico. Agende uma conversa clinica para entender o que faz sentido para o seu sorriso.',
        croRefs: ['CFO 196/2019', 'identificacao profissional obrigatoria', 'vedacao a mercantilizacao'],
      },
    }
  }

  if (jobId === 'clinical_triage') {
    return {
      jobId,
      ...base,
      summary: 'Queixa classificada como urgencia endodontica. Encaixe sugerido ainda hoje na cadeira de plantao.',
      artifacts: {
        patient: 'Felipe Albuquerque, 34 anos',
        complaint: 'Fisgada ao frio ha 4 dias, latejamento espontaneo a noite.',
        urgency: 4,
        specialty: 'Endodontia',
        chairMinutes: 45,
        chartSummary:
          'Hipersensibilidade termica evoluindo para dor espontanea. Hipotese: pulpito irreversivel em molar posterior. Encaminhar para avaliacao clinica presencial. Hipertenso controlado, sem alergia conhecida a anestesico.',
        suggestedSlot: 'Hoje 14:30 ou 16:00, cadeira de urgencia',
        crmStage: 'ai_triage',
      },
    }
  }

  if (jobId === 'whatsapp_followup') {
    return {
      jobId,
      ...base,
      summary: 'Mensagem de 24h pos-implante pronta, com gelo, analgesico e canal de urgencia.',
      artifacts: {
        patient: 'Mariana Duarte',
        procedure: 'Instalacao de 2 implantes em carga imediata',
        channel: 'whatsapp',
        message:
          'Oi, Mariana. Aqui e a equipe da Dra. Gabriela Fontes (CRO-SP 89452). Passaram 24h da sua cirurgia e queremos saber como voce acordou hoje. Mantenha a compressa de gelo em intervalos e o analgesico de 8 em 8 horas, como combinamos. Se a dor sair do esperado, ou houver sangramento que nao cede, chame a gente neste WhatsApp. Estamos com voce no pos-operatorio.',
        avoided: ['preco', 'desconto', 'resultado garantido'],
      },
    }
  }

  if (jobId === 'content_seo') {
    return {
      jobId,
      ...base,
      summary: 'Carrossel de 6 laminas sobre clareamento interno, com CTA etico e identificacao CRO.',
      artifacts: {
        topic: 'Por que o dente escurece apos canal e como clarear por dentro',
        slides: [
          'Seu dente ficou acinzentado depois do canal?',
          'Nao e sujeira. E perda de vitalidade da polpa.',
          'O clareamento interno age de dentro para fora, caso a caso.',
          'Primeiro avaliamo a vedacao do canal e a saude do periodonto.',
          'Resultados variam. Nenhuma foto substitui exame clinico.',
          'Dra. Gabriela Fontes, CD, CRO-SP 89452. Agende avaliacao individualizada.',
        ],
        caption:
          'Dente escurecido apos canal tem causa biologica. Avaliacao individualizada com a Dra. Gabriela Fontes, Cirurgia-Dentista, CRO-SP 89452. Resultados variam conforme cada caso.',
        hashtags: ['#odontologia', '#saudebucal', '#clareamentointerno', '#CROSP'],
      },
    }
  }

  return {
    jobId,
    ...base,
    summary: 'Checklist operacional aplicado: token ECC, PHI, webhook Meta e confirmacao de agenda.',
    artifacts: {
      checks: [
        { item: 'Token ECC so no servidor, nunca no HTML publico', status: 'ok' },
        { item: 'Prefixo visivel no painel, valor completo so na criacao', status: 'ok' },
        { item: 'PHI nao enviado ao catalogo ECC', status: 'ok' },
        { item: 'META_WEBHOOK_VERIFY_TOKEN fora do frontend', status: 'ok' },
        { item: 'Agenda confirma horario antes de gravar no Google', status: 'ok' },
      ],
      next: [
        'Revogar token se o site de origem vazar',
        'Rodar jobs ECC so com briefs sem CPF/prontuario',
      ],
    },
  }
}

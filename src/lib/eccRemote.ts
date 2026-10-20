export type EccAgent = {
  id: string
  name: string
  role: string
  sourceId?: string
  skills?: string[]
  model?: string
  status?: string
  builtin?: boolean
}

export type EccTaskRun = {
  task: {
    id: string
    title: string
    brief: string
    agentId: string
    status: string
    result?: {
      summary?: string
      steps?: { title: string; detail: string }[]
      outputs?: { skill: string; note: string }[]
      nextActions?: string[]
    }
  }
  run: {
    id: string
    result?: {
      summary?: string
      steps?: { title: string; detail: string }[]
      outputs?: { skill: string; note: string }[]
    }
  }
}

export type EccCatalog = {
  skills: { id: string; name: string; description: string; category: string }[]
  agents: { id: string; name: string; description: string; category?: string }[]
  counts?: { skills: number; agents: number }
}

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, '')}${path}`
}

export async function eccRequest<T>(
  baseUrl: string,
  token: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(init.headers || {}),
  }
  const res = await fetch(joinUrl(baseUrl, path), { ...init, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error((data as { error?: string }).error || `ECC ${res.status}`)
    ;(error as Error & { status?: number }).status = res.status
    throw error
  }
  return data as T
}

export function pickAgentForJob(agents: EccAgent[], jobId: string) {
  const ranked: Record<string, string[]> = {
    cro_audit: ['security-reviewer', 'seo-specialist', 'code-reviewer'],
    clinical_triage: ['healthcare-reviewer', 'a11y-architect', 'planner'],
    whatsapp_followup: ['chief-of-staff', 'marketing-agent', 'seo-specialist'],
    content_seo: ['marketing-agent', 'seo-specialist', 'planner'],
    ops_hardening: ['security-reviewer', 'loop-operator', 'planner'],
  }
  const wanted = ranked[jobId] || ['planner']
  for (const sourceId of wanted) {
    const hit = agents.find((agent) => agent.sourceId === sourceId || agent.id.includes(sourceId) || agent.name.toLowerCase().includes(sourceId.replace(/-/g, ' ')))
    if (hit) return hit
  }
  return agents[0] || null
}

export const ODONTO_AGENT_SEEDS = [
  {
    jobId: 'cro_audit',
    name: 'Auditor CRO Odontomind',
    role: 'Auditar copy odontologica da OdontoMind contra CFO 196/2019 e devolver versao etica.',
    sourceId: 'security-reviewer',
    skills: ['security-review', 'seo', 'brand-voice', 'content-engine'],
  },
  {
    jobId: 'clinical_triage',
    name: 'Triagem Clinica Odontomind',
    role: 'Classificar urgencia odontologica, especialidade e tempo de cadeira para a clinica.',
    sourceId: 'healthcare-reviewer',
    skills: ['healthcare-cdss-patterns', 'healthcare-emr-patterns', 'healthcare-eval-harness'],
  },
  {
    jobId: 'whatsapp_followup',
    name: 'Follow-up WhatsApp Odontomind',
    role: 'Redigir mensagens de pos-operatorio e retencao no WhatsApp, sem preco publico.',
    sourceId: 'chief-of-staff',
    skills: ['messages-ops', 'brand-voice', 'email-ops'],
  },
  {
    jobId: 'content_seo',
    name: 'Conteudo SEO Odontomind',
    role: 'Gerar carrosseis educativos e legendas eticas para Instagram da clinica.',
    sourceId: 'marketing-agent',
    skills: ['content-engine', 'seo', 'marketing-campaign', 'article-writing'],
  },
  {
    jobId: 'ops_hardening',
    name: 'Seguranca Operacional Odontomind',
    role: 'Revisar riscos de token, PHI, webhook e agenda antes de publicar mudancas.',
    sourceId: 'security-reviewer',
    skills: ['security-review', 'security-scan', 'safety-guard', 'gateguard'],
  },
]

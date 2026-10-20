import React, { useEffect, useState } from 'react'
import {
  KeyRound,
  Plug,
  Unplug,
  Bot,
  Play,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  MessageCircle,
  Share2,
  Lock,
  RefreshCw,
  Sparkles,
} from 'lucide-react'

type RemoteAgent = {
  id: string
  name: string
  role: string
  sourceId?: string
  skills?: string[]
  model?: string
}

type Improvement = {
  id: string
  jobId: string
  title: string
  summary: string
  appliedTo: string
  artifacts: Record<string, unknown>
  eccRunId?: string
  eccSummary?: string
  skillsUsed: string[]
  createdAt: string
}

type Job = {
  id: string
  title: string
  appliedTo: string
  brief: string
}

const JOB_ICONS: Record<string, React.ReactNode> = {
  cro_audit: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  clinical_triage: <Stethoscope className="w-4 h-4 text-blue-500" />,
  whatsapp_followup: <MessageCircle className="w-4 h-4 text-emerald-500" />,
  content_seo: <Share2 className="w-4 h-4 text-amber-500" />,
  ops_hardening: <Lock className="w-4 h-4 text-cyan-500" />,
}

export const EccAgentBridge: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('https://ecc-loops-digital-web.onrender.com')
  const [token, setToken] = useState('')
  const [connected, setConnected] = useState(false)
  const [prefix, setPrefix] = useState('')
  const [agents, setAgents] = useState<RemoteAgent[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [busy, setBusy] = useState(false)
  const [runningJob, setRunningJob] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadStatus() {
    const res = await fetch('/api/ecc/status')
    const data = await res.json()
    setConnected(Boolean(data.connected))
    setPrefix(data.prefix || '')
    setAgents(data.agents || [])
    setImprovements(data.improvements || [])
    setJobs(data.jobs || [])
    if (data.baseUrl) setBaseUrl(data.baseUrl)
  }

  useEffect(() => {
    loadStatus().catch((err) => setError(err.message))
  }, [])

  async function connect(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const res = await fetch('/api/ecc/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, baseUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao conectar')
      setToken('')
      setNotice(`Conectado. ${data.agents?.length || 0} agentes importados da mesa ECC.`)
      await loadStatus()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function disconnect() {
    setBusy(true)
    setError('')
    try {
      await fetch('/api/ecc/disconnect', { method: 'POST' })
      setNotice('Token desconectado.')
      await loadStatus()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function syncAgents() {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/ecc/sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao sincronizar')
      setNotice(`${data.agents?.length || 0} agentes sincronizados.`)
      await loadStatus()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function runJob(jobId: string) {
    setRunningJob(jobId)
    setError('')
    setNotice('')
    try {
      const res = await fetch('/api/ecc/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha no job')
      setNotice(`${data.improvement?.title}: ${data.improvement?.summary}`)
      await loadStatus()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setRunningJob('')
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ponte com mesa de agentes ECC</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Token de outro site para aperfeicoar a OdontoMind
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
            Cole um token <code className="text-cyan-700">ecc_live_</code> gerado na mesa ECC.
            Os agentes de la entram na clinica e executam auditoria CRO, triagem, follow-up, conteudo e hardening.
          </p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${
          connected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          {connected ? `Conectado · ${prefix}...` : 'Desconectado'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form onSubmit={connect} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="font-heading font-bold text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-600" /> Entrada do token
          </h3>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="https://ecc-loops-digital-web.onrender.com"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="ecc_live_cole_o_token_aqui"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy || !token.trim()}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}
              Conectar mesa
            </button>
            {connected && (
              <>
                <button type="button" onClick={syncAgents} className="inline-flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl text-sm">
                  <RefreshCw className="w-4 h-4" /> Sincronizar
                </button>
                <button type="button" onClick={disconnect} className="inline-flex items-center gap-2 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl text-sm">
                  <Unplug className="w-4 h-4" /> Desconectar
                </button>
              </>
            )}
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {notice && <p className="text-sm text-emerald-700">{notice}</p>}
        </form>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <h3 className="font-heading font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-cyan-600" /> Agentes importados
          </h3>
          <div className="space-y-2 max-h-72 overflow-auto">
            {agents.map((agent) => (
              <div key={agent.id} className="border border-slate-100 rounded-xl p-3">
                <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                <p className="text-xs text-slate-500">{agent.role}</p>
                <p className="text-[10px] uppercase tracking-wide text-cyan-700 mt-1">
                  {agent.sourceId} · {(agent.skills || []).slice(0, 4).join(' · ')}
                </p>
              </div>
            ))}
            {!agents.length && <p className="text-sm text-slate-500">Conecte o token para puxar os agentes da outra mesa.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <h3 className="font-heading font-bold text-slate-900 mb-3">Jobs que aperfeicoam a clinica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {jobs.map((job) => (
            <div key={job.id} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {JOB_ICONS[job.id]}
                <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
              </div>
              <p className="text-xs text-slate-600 flex-1">{job.brief}</p>
              <p className="text-[11px] text-slate-400">Aplica em: {job.appliedTo}</p>
              <button
                type="button"
                disabled={!connected || Boolean(runningJob)}
                onClick={() => runJob(job.id)}
                className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white rounded-xl py-2 text-sm font-semibold disabled:opacity-50"
              >
                {runningJob === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Rodar com agente ECC
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <h3 className="font-heading font-bold text-slate-900 mb-3">Melhorias aplicadas</h3>
        <div className="space-y-3">
          {improvements.map((item) => (
            <article key={item.id} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{item.summary}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{item.appliedTo} · {item.eccRunId || 'sem run'}</p>
                </div>
              </div>
              {item.artifacts && (
                <pre className="mt-3 text-[11px] bg-slate-50 border border-slate-100 rounded-lg p-3 overflow-auto max-h-48">
                  {JSON.stringify(item.artifacts, null, 2)}
                </pre>
              )}
            </article>
          ))}
          {!improvements.length && <p className="text-sm text-slate-500">Nenhuma melhoria ainda. Conecte e rode um job.</p>}
        </div>
      </div>
    </div>
  )
}

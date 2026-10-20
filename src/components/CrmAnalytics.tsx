import React from 'react';
import { PatientLead, Appointment } from '../types';
import { pipelineStagesConfig } from '../data/crmData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  CalendarCheck, 
  Users, 
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface CrmAnalyticsProps {
  patients: PatientLead[];
  appointments: Appointment[];
}

export const CrmAnalytics: React.FC<CrmAnalyticsProps> = ({ patients, appointments }) => {
  // 1. Pipeline conversion funnel data
  const pipelineFunnelData = pipelineStagesConfig.map((stage) => {
    const stagePatients = patients.filter((p) => p.stage === stage.id);
    const count = stagePatients.length;
    const totalValue = stagePatients.reduce((sum, p) => sum + p.estimatedValue, 0);
    return {
      stageId: stage.id,
      name: stage.title.split('. ')[1] || stage.title,
      pacientes: count,
      receita: totalValue,
    };
  });

  // Calculate conversion rates
  const totalLeads = patients.length;
  const inTreatmentOrRetained = patients.filter(
    (p) => p.stage === 'in_treatment' || p.stage === 'followup_retained'
  ).length;
  const globalConversionRate = totalLeads > 0 ? Math.round((inTreatmentOrRetained / totalLeads) * 100) : 0;

  // 2. Revenue by specialty/category
  const categoryMap: { [key: string]: number } = {};
  patients.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + p.estimatedValue;
  });
  const categoryRevenueData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  const CATEGORY_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

  // 3. Monthly appointment history data (last 6 months)
  const monthlyHistoryData = [
    { mes: 'Mai/26', atendimentos: 48, faltasEvitadas: 18, novosPlanos: 14, receitaMil: 84 },
    { mes: 'Jun/26', atendimentos: 56, faltasEvitadas: 22, novosPlanos: 19, receitaMil: 102 },
    { mes: 'Jul/26', atendimentos: 63, faltasEvitadas: 26, novosPlanos: 22, receitaMil: 125 },
    { mes: 'Ago/26', atendimentos: 70, faltasEvitadas: 31, novosPlanos: 27, receitaMil: 148 },
    { mes: 'Set/26', atendimentos: 78, faltasEvitadas: 35, novosPlanos: 30, receitaMil: 165 },
    { mes: 'Out/26', atendimentos: 85, faltasEvitadas: 42, novosPlanos: 34, receitaMil: 188 },
  ];

  // 4. Patient Engagement metrics aggregation
  const totalMessagesSent = patients.reduce((sum, p) => sum + p.engagement.messagesSent, 0);
  const totalMessagesOpened = patients.reduce((sum, p) => sum + p.engagement.messagesOpened, 0);
  const openRate = totalMessagesSent > 0 ? Math.round((totalMessagesOpened / totalMessagesSent) * 100) : 98;

  const avgNps = (
    patients.reduce((sum, p) => sum + p.engagement.npsScore, 0) / (patients.length || 1)
  ).toFixed(1);

  const avgRecallAdherence = Math.round(
    patients.reduce((sum, p) => sum + p.engagement.recallAdherencePercent, 0) / (patients.length || 1)
  );

  const totalPipelineRevenue = patients.reduce((sum, p) => sum + p.estimatedValue, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inteligência Analítica & BI Odontológico</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Painel de Engajamento, Conversão e Receita do CRM
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
            Visualização de dados em tempo real com Recharts: funil de conversão de leads, receita por estágio da jornada, histórico semestral de atendimentos clínicos e adesão aos canais de comunicação.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-emerald-700 uppercase font-bold block">Taxa de Conversão Global</span>
            <strong className="text-base font-extrabold text-emerald-800 flex items-center justify-center gap-1">
              {globalConversionRate}%
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </strong>
          </div>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Funil de Vendas Ativo</p>
            <p className="text-xl font-heading font-extrabold text-slate-900 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalPipelineRevenue)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
              {patients.length > 0 ? `${patients.length} pacientes no funil de vendas` : 'Aguardando primeiros pacientes'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Taxa de Abertura WhatsApp</p>
            <p className="text-xl font-heading font-extrabold text-slate-900 mt-1">
              {openRate}%
            </p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {totalMessagesOpened} de {totalMessagesSent} mensagens
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">NPS de Satisfação</p>
            <p className="text-xl font-heading font-extrabold text-slate-900 mt-1">
              {patients.length > 0 ? `${avgNps} / 10` : '—'}
            </p>
            <span className="text-[10px] text-purple-600 font-medium mt-0.5 block">
              {patients.length > 0 ? 'Zona de Excelência' : 'Aguardando avaliações'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Adesão ao Recall Semestral</p>
            <p className="text-xl font-heading font-extrabold text-slate-900 mt-1">
              {patients.length > 0 ? `${avgRecallAdherence}%` : '—'}
            </p>
            <span className="text-[10px] text-teal-600 font-medium mt-0.5 block">
              {patients.length > 0 ? 'Retenção Ativa' : 'Sem histórico prévio'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Chart Row 1: Pipeline Conversion & Revenue by Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Lead Conversion Funnel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-heading font-bold text-slate-900">
                Funil de Conversão de Pacientes por Estágio
              </h3>
              <p className="text-xs text-slate-500">
                Distribuição de pacientes ao longo da jornada clínica no CRM
              </p>
            </div>
            <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">
              {patients.length} Pacientes
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-25} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} pacientes`, 'Volume']}
                />
                <Bar dataKey="pacientes" fill="#0891b2" radius={[6, 6, 0, 0]}>
                  {pipelineFunnelData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index >= 4 ? '#10b981' : '#0891b2'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Fase Inicial (Atração/Triagem)</span>
            <span className="font-semibold text-emerald-600">Fase Concluída / Retenção</span>
          </div>
        </div>

        {/* Chart B: Receita Estimada por Estágio do Pipeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-heading font-bold text-slate-900">
                Receita Estimada por Estágio do Funil de Vendas (R$)
              </h3>
              <p className="text-xs text-slate-500">
                Valor financeiro em cada etapa de negociação e execução
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalPipelineRevenue)}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineFunnelData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-25} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val),
                    'Receita Estimada'
                  ]}
                />
                <Bar dataKey="receita" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Ticket médio mais elevado: <strong>Implantodontia & Reabilitação</strong></span>
            <span className="text-cyan-600 font-semibold">Orçamentos Ativos</span>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Histórico de Atendimentos Mensais & Divisão por Especialidade */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Histórico Mensal (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-heading font-bold text-slate-900">
                Histórico Semestral de Atendimentos & Redução de No-Show
              </h3>
              <p className="text-xs text-slate-500">
                Evolução de consultas realizadas, faltas prevenidas por IA e faturamento
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                Atendimentos
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Faltas Evitadas
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAtendimentos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFaltas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="atendimentos" 
                  name="Consultas Realizadas" 
                  stroke="#0891b2" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorAtendimentos)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="faltasEvitadas" 
                  name="Faltas Evitadas (IA)" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorFaltas)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase">Crescimento Semestral</span>
              <strong className="text-slate-900 font-bold">+77% em Atendimentos</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase">No-Show Atual</span>
              <strong className="text-emerald-600 font-bold">5.8% (Benchmark: 18%)</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase">Faturamento Mensal</span>
              <strong className="text-cyan-700 font-bold">R$ 188.000 / mês</strong>
            </div>
          </div>
        </div>

        {/* Divisão por Especialidade (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-heading font-bold text-slate-900">
                Mix de Receita por Especialidade
              </h3>
              <p className="text-xs text-slate-500">
                Participação de cada área odontológica
              </p>
            </div>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryRevenueData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {categoryRevenueData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any) => [
                      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val),
                      'Receita'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {categoryRevenueData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }} 
                  />
                  <span className="text-slate-600 truncate max-w-[130px]">{item.name}</span>
                </div>
                <strong className="text-slate-900 font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(item.value)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Scale, 
  BookOpen, 
  Award, 
  Check
} from 'lucide-react';

export const CroEthicsGuide: React.FC = () => {
  const [checklistState, setChecklistState] = useState<{ [key: string]: boolean }>({
    hasDentistName: true,
    hasCroNumber: true,
    hasNoPrices: true,
    hasTcleConsent: true,
    hasBiologicalDisclaimer: true,
    hasNoSensationalism: true
  });

  const toggleChecklist = (key: string) => {
    setChecklistState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allPassed = Object.values(checklistState).every(Boolean);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Código de Ética Odontológica & Resolução CFO 196/2019</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Manual de Compliance & Publicidade Ética Odontológica
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
            Como criar campanhas com alto engajamento e captação de pacientes de alto ticket com segurança jurídica total, eliminando o risco de processos éticos no Conselho Regional de Odontologia.
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-xl text-center shrink-0">
          <span className="text-[10px] text-indigo-700 uppercase font-bold block">Status Regulatório</span>
          <strong className="text-sm font-extrabold text-indigo-900">Resolução CFO 196/2019</strong>
        </div>
      </div>

      {/* Comparison Grid: Strictly Prohibited vs Strongly Encouraged */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strictly Prohibited */}
        <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-900 font-heading font-extrabold text-base">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span>Terminantemente PROIBIDO pelo CRO / CFO</span>
          </div>
          <p className="text-xs text-rose-950">
            Práticas que caracterizam mercantilização da profissão, propaganda enganosa ou sensacionalismo puníveis com advertência ou cassação.
          </p>

          <ul className="space-y-3">
            {[
              {
                title: 'Divulgação Pública de Preços e Formas de Pagamento',
                desc: 'Anunciar "Clareamento por apenas R$ 499" ou "Parcelamos em 24x sem juros" em redes sociais, outdoors ou panfletos. Preço só pode ser informado após exame presencial.'
              },
              {
                title: 'Consultas Grátis com Fim de Captação',
                desc: 'Anunciar "Avaliação gratuita" ou "Limpeza grátis para quem agendar hoje". O código veda consultas gratuitas como isca mercantil.'
              },
              {
                title: 'Sorteios de Procedimentos e Concursos',
                desc: 'Realizar sorteios de procedimentos invasivos (harmonização, clareamento, lentes de contato) nas redes sociais.'
              },
              {
                title: 'Promessas de Resultado Garantido ou Cura',
                desc: 'Prometer "Sorriso perfeito garantido em 7 dias" ignorando que todo procedimento depende da resposta biológica individual de cada paciente.'
              },
              {
                title: 'Sensacionalismo, Sangue e Fotos Macabras',
                desc: 'Exibir tecidos dissecados, sangue cirúrgico abundante ou dentes extraídos com restos de osso, causando pavor na população.'
              }
            ].map((item, idx) => (
              <li key={idx} className="bg-white/80 p-3 rounded-xl border border-rose-100 space-y-1">
                <strong className="text-xs font-bold text-rose-900 block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {item.title}
                </strong>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Strongly Encouraged & Ethical */}
        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-900 font-heading font-extrabold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>TOTALMENTE PERMITIDO & Altamente Recomendado</span>
          </div>
          <p className="text-xs text-emerald-950">
            Formatos que constroem autoridade clínica de alto ticket, educam a sociedade e geram conversão espontânea com admiração.
          </p>

          <ul className="space-y-3">
            {[
              {
                title: 'Educação em Saúde Bucal & Bastidores Tecnológicos',
                desc: 'Demonstrar como funciona o escaneamento intraoral 3D, a cirurgia guiada por computador ou os cuidados com a saúde periodontal.'
              },
              {
                title: 'Fotos de Diagnóstico e Conclusão (Antes e Depois Ético)',
                desc: 'Permitido pela Resolução 196/2019, desde que com autorização expressa do paciente (TCLE assinado) e a legenda obrigatória sobre variação biológica individual.'
              },
              {
                title: 'Tour pela Infraestrutura & Biossegurança da Clínica',
                desc: 'Mostrar a autoclave de esterilização hospitalar, a sala de relaxamento, o conforto da cadeira e o café especial para os pacientes.'
              },
              {
                title: 'Quebra de Mitos e Esclarecimento de Dúvidas Reais',
                desc: 'Responder em vídeo se aparelho invisível dói, como prevenir retração de gengiva ou como funciona a anestesia sem agulha computadorizada.'
              },
              {
                title: 'Depoimentos Espontâneos de Experiência',
                desc: 'O paciente grava voluntariamente contando como se sentiu acolhido e seguro durante o atendimento na clínica.'
              }
            ].map((item, idx) => (
              <li key={idx} className="bg-white/80 p-3 rounded-xl border border-emerald-100 space-y-1">
                <strong className="text-xs font-bold text-emerald-900 block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item.title}
                </strong>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory Elements in Every Publication */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-heading font-extrabold text-white">
              Os 4 Elementos Obrigatórios em Toda Publicação Odontológica
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Exigência do artigo 52 do Código de Ética Odontológica. A ausência de qualquer um deles gera notificação do conselho.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Item 01</span>
            <strong className="text-sm font-bold text-white block">Nome do Profissional</strong>
            <p className="text-xs text-slate-400">Nome civil ou nome profissional completo do cirurgião-dentista.</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Item 02</span>
            <strong className="text-sm font-bold text-white block">Profissão Expressa</strong>
            <p className="text-xs text-slate-400">A designação clara: "Cirurgião-Dentista" ou a especialidade registrada no CFO.</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Item 03</span>
            <strong className="text-sm font-bold text-white block">Número e Sigla do CRO</strong>
            <p className="text-xs text-slate-400">Ex: "CRO-SP 89452". Sempre com a sigla do estado onde atua.</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Item 04</span>
            <strong className="text-sm font-bold text-white block">Responsável Técnico (PJ)</strong>
            <p className="text-xs text-slate-400">Se for postagem de clínica (PJ), nome e CRO do RT e número de EPAO.</p>
          </div>
        </div>

        {/* Live Example Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-300">
            <span className="text-slate-500 block text-[11px] mb-0.5">Exemplo de Rodapé Seguro Recomendado pela OdontoMind AI:</span>
            <code>Dra. Camila Alencar · Cirurgiã-Dentista · Especialista em Ortodontia · CRO-SP 89452 | EPAO 1234</code>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0 font-medium">
            100% Blindado
          </span>
        </div>
      </div>

      {/* Interactive 5-Second Checklist Before Posting */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-heading font-extrabold text-slate-900">
              Checklist Interativo de 5 Segundos Pré-Publicação
            </h3>
            <p className="text-xs text-slate-500">
              Marque os itens antes de subir qualquer Reels, Stories ou carrossel no perfil da clínica.
            </p>
          </div>

          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            allPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {allPassed ? '✅ Pronto para Publicação' : '⚠️ Pendências Encontradas'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'hasDentistName', label: 'Nome completo do Cirurgião-Dentista presente' },
            { key: 'hasCroNumber', label: 'Número e sigla do CRO inseridos (ex: CRO-SP 89452)' },
            { key: 'hasNoPrices', label: 'Nenhum preço, desconto ou consulta grátis anunciado' },
            { key: 'hasTcleConsent', label: 'Termo TCLE assinado pelo paciente se houver imagem clínica' },
            { key: 'hasBiologicalDisclaimer', label: 'Menção à variabilidade biológica individual em casos clínicos' },
            { key: 'hasNoSensationalism', label: 'Sem sangue excessivo, imagens de terror ou promessas irreais' }
          ].map((item) => (
            <label
              key={item.key}
              onClick={() => toggleChecklist(item.key)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                checklistState[item.key]
                  ? 'bg-cyan-50/60 border-cyan-200 text-cyan-950'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                checklistState[item.key] ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {checklistState[item.key] && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium select-none">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

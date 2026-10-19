import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Video, 
  Share2, 
  Globe, 
  ShieldCheck, 
  Check, 
  Copy, 
  Loader2, 
  BookOpen, 
  Layers, 
  FileText, 
  Search, 
  Compass,
  AlertTriangle
} from 'lucide-react';

export const ContentCreationStudio: React.FC = () => {
  const [format, setFormat] = useState<'social_post' | 'video_script' | 'website_article'>('social_post');
  const [topic, setTopic] = useState<'oral_health' | 'dental_innovations' | 'prevention_tips'>('dental_innovations');
  const [subtopic, setSubtopic] = useState('Escaneamento Intraoral 3D vs Moldagem com Massa Antiga');
  const [targetAudience, setTargetAudience] = useState('Adultos de 25 a 55 anos que buscam conforto e tratamentos estéticos');
  const [dentistName, setDentistName] = useState('Dra. Camila Alencar');
  const [croNumber, setCroNumber] = useState('CRO-SP 89452');
  const [useSearch, setUseSearch] = useState(true);

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generatedInfo, setGeneratedInfo] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Clinical & Educational presets
  const presets = [
    {
      label: 'Vídeo: Scanner 3D vs Massa Antiga (Novidades)',
      format: 'video_script' as const,
      topic: 'dental_innovations' as const,
      subtopic: 'O fim da massa na boca: como o scanner 3D gera previsibilidade sem ânsia de vômito'
    },
    {
      label: 'Carrossel: Como Evitar a Retração Gengival (Saúde Bucal)',
      format: 'social_post' as const,
      topic: 'oral_health' as const,
      subtopic: '5 causas da retração na gengiva e por que escovar com muita força desgasta o dente'
    },
    {
      label: 'Artigo: Guia de Prevenção e Profilaxia Semestral (Dicas)',
      format: 'website_article' as const,
      topic: 'prevention_tips' as const,
      subtopic: 'Por que o check-up preventivo semestral economiza tratamentos invasivos e dor'
    },
    {
      label: 'Vídeo: Alinhadores Invisíveis no Trabalho (Novidades)',
      format: 'video_script' as const,
      topic: 'dental_innovations' as const,
      subtopic: 'Como alinhar o sorriso de forma transparente sem ninguém notar na reunião'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setFormat(p.format);
    setTopic(p.topic);
    setSubtopic(p.subtopic);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/gemini/content-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          topic,
          subtopic,
          dentistName,
          croNumber,
          targetAudience,
          useSearch
        })
      });

      const data = await response.json();
      if (data && data.result) {
        setGeneratedContent(data.result);
        setGeneratedInfo(data.generatedWith || 'gemini-3.8-flash');
      } else {
        setGeneratedContent('Erro ao gerar o conteúdo. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      setGeneratedContent('Erro de conexão ao gerar o conteúdo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estúdio de IA para Marketing Odontológico Ético</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Gerador de Conteúdos Clínicos em Conformidade com o CRO
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
            Produza posts para redes sociais, roteiros de vídeos curtos e artigos para o site focados em <strong>saúde bucal, novidades na odontologia e dicas de prevenção</strong> — com auditoria ética da Resolução CFO 196/2019 aplicada automaticamente.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Resolução CFO 196/2019 Integrada</span>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" />
          Sugestões Rápidas:
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(p)}
            className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Studio Grid: Inputs on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {/* 1. Format Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              1. Formato de Conteúdo Desejado:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('social_post')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  format === 'social_post'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Share2 className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-bold">Post de Rede</span>
                <span className="text-[9px] opacity-75">Feed & Carrossel</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('video_script')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  format === 'video_script'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Video className="w-4 h-4 mb-1 text-rose-400" />
                <span className="text-[11px] font-bold">Vídeo Curto</span>
                <span className="text-[9px] opacity-75">Reels & TikTok</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('website_article')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  format === 'website_article'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-4 h-4 mb-1 text-cyan-400" />
                <span className="text-[11px] font-bold">Artigo de Site</span>
                <span className="text-[9px] opacity-75">SEO & Blog</span>
              </button>
            </div>
          </div>

          {/* 2. Theme Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              2. Eixo Temático Central:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTopic('oral_health')}
                className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors cursor-pointer ${
                  topic === 'oral_health'
                    ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                🦷 Saúde Bucal
              </button>

              <button
                type="button"
                onClick={() => setTopic('dental_innovations')}
                className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors cursor-pointer ${
                  topic === 'dental_innovations'
                    ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                🔬 Novidades na Área
              </button>

              <button
                type="button"
                onClick={() => setTopic('prevention_tips')}
                className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors cursor-pointer ${
                  topic === 'prevention_tips'
                    ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                🛡️ Prevenção
              </button>
            </div>
          </div>

          {/* 3. Subtopic / Angle */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              3. Tema Específico / Pergunta a Responder:
            </label>
            <textarea
              rows={3}
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Ex: Como o escaneamento 3D elimina a moldagem com massa..."
            />
          </div>

          {/* 4. Audience */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Público-Alvo:
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* 5. Dentist info for CRO Compliance */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cirurgião-Dentista (RT):
              </label>
              <input
                type="text"
                value={dentistName}
                onChange={(e) => setDentistName(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Número do CRO:
              </label>
              <input
                type="text"
                value={croNumber}
                onChange={(e) => setCroNumber(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Google Search Grounding Checkbox for Innovations */}
          {topic === 'dental_innovations' && (
            <label className="flex items-center gap-2 text-xs text-slate-700 bg-cyan-50/60 p-2.5 rounded-lg border border-cyan-200/60 cursor-pointer">
              <input
                type="checkbox"
                checked={useSearch}
                onChange={(e) => setUseSearch(e.target.checked)}
                className="rounded text-cyan-600"
              />
              <span className="font-medium">
                Pesquisar dados e inovações científicas recentes (Google Search Grounding)
              </span>
            </label>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-500 hover:to-teal-500 text-white font-heading font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redigindo com IA e Auditando CRO...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Gerar Conteúdo Odontológico Ético</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Area (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 min-h-[550px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-heading font-bold text-slate-900">
                  Conteúdo Produzido
                </h3>
              </div>

              {generatedContent && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    {generatedInfo}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Content Display Area */}
            <div className="mt-4">
              {loading ? (
                <div className="h-96 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                  <p className="text-xs font-medium text-slate-600 animate-pulse">
                    O Agente está redigindo o conteúdo e aplicando as salvaguardas éticas do CRO...
                  </p>
                </div>
              ) : generatedContent ? (
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 text-xs text-slate-800 leading-relaxed font-sans overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                  {generatedContent}
                </div>
              ) : (
                <div className="h-96 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-sm font-bold text-slate-700">
                      Nenhum conteúdo gerado ainda
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Escolha o formato (post, vídeo ou artigo), o tema (saúde bucal, novidades ou prevenção) e clique no botão <strong>Gerar Conteúdo Odontológico Ético</strong> para começar.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CRO Compliance Seal */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Conformidade com a Resolução CFO 196/2019
            </span>
            <span>Sem divulgação de preços · Com identificação de RT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

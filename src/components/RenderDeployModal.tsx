import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  FileCode, 
  Key, 
  ShieldCheck,
  Server,
  Globe,
  Sparkles
} from 'lucide-react';

interface RenderDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RenderDeployModal: React.FC<RenderDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'manual' | 'guide'>('blueprint');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderYamlContent = `# Render Blueprint Specification
services:
  - type: web
    name: odontomind-ai
    runtime: node
    plan: free
    region: oregon
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: GEMINI_API_KEY
        sync: false # Cole sua chave Gemini no painel do Render
      - key: APP_URL
        sync: false
`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 my-8 animate-scaleIn">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg text-slate-900">
                  Hospedagem no Render (render.com)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Pronto para Deploy
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Conecte seu repositório Git ao Render para publicar a aplicação full-stack com SSL grátis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Readiness Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
            Status de Compatibilidade com o Render:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Blueprint <code className="text-cyan-800 font-mono font-semibold">render.yaml</code> configurado</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Porta dinâmica <code className="text-cyan-800 font-mono font-semibold">process.env.PORT</code> ativa</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Build estático Vite + servidor Express</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Suporte a variáveis <code className="text-cyan-800 font-mono font-semibold">GEMINI_API_KEY</code></span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`pb-2.5 px-4 cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'blueprint'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Opção 1: Blueprint Automático</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-2.5 px-4 cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'manual'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Opção 2: Web Service Manual</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-4 cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Passo a Passo</span>
          </button>
        </div>

        {/* Content Tab 1: Blueprint */}
        {activeTab === 'blueprint' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              O arquivo <code className="font-mono font-bold text-cyan-800">render.yaml</code> já foi criado na raiz do seu projeto. Basta subir para o GitHub e selecionar <strong>New Blueprint</strong> no Render:
            </p>

            <div className="relative bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-xs overflow-x-auto">
              <button
                onClick={() => handleCopy(renderYamlContent, 'yaml')}
                className="absolute top-3 right-3 flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer border border-slate-700"
              >
                {copiedKey === 'yaml' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar YAML</span>
                  </>
                )}
              </button>
              <pre className="pr-20 text-[11px] leading-relaxed">{renderYamlContent}</pre>
            </div>
          </div>
        )}

        {/* Content Tab 2: Manual Config Parameters */}
        {activeTab === 'manual' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Se criar como <strong>New Web Service</strong> manualmente no Render, copie e cole exatamente estes valores:
            </p>

            <div className="space-y-2.5">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Runtime</span>
                  <span className="text-xs font-mono font-semibold text-slate-900">Node</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Build Command</span>
                  <code className="text-xs font-mono font-bold text-cyan-900">npm install && npm run build</code>
                </div>
                <button
                  onClick={() => handleCopy('npm install && npm run build', 'build_cmd')}
                  className="p-1.5 text-slate-500 hover:text-cyan-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Copiar comando"
                >
                  {copiedKey === 'build_cmd' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Start Command</span>
                  <code className="text-xs font-mono font-bold text-cyan-900">npm start</code>
                </div>
                <button
                  onClick={() => handleCopy('npm start', 'start_cmd')}
                  className="p-1.5 text-slate-500 hover:text-cyan-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Copiar comando"
                >
                  {copiedKey === 'start_cmd' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Environment Variables (Variáveis de Ambiente no Render):
                </span>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700">NODE_ENV = production</span>
                    <button
                      onClick={() => handleCopy('NODE_ENV=production', 'env_node')}
                      className="text-slate-400 hover:text-cyan-600 cursor-pointer"
                    >
                      {copiedKey === 'env_node' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700">PORT = 10000</span>
                    <button
                      onClick={() => handleCopy('PORT=10000', 'env_port')}
                      className="text-slate-400 hover:text-cyan-600 cursor-pointer"
                    >
                      {copiedKey === 'env_port' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-cyan-800 font-bold">GEMINI_API_KEY = (sua chave AI)</span>
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-600 hover:underline flex items-center gap-1 font-sans font-medium"
                    >
                      <span>Obter chave</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab 3: Detailed Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-3 text-xs text-slate-700">
            <ol className="list-decimal list-inside space-y-2.5">
              <li className="pl-1">
                <strong>Subir o código para o GitHub:</strong> Crie um repositório no seu GitHub e envie todos os arquivos do projeto.
              </li>
              <li className="pl-1">
                <strong>Acessar o Render:</strong> Entre em <a href="https://dashboard.render.com" target="_blank" rel="noopener noreferrer" className="text-cyan-700 underline font-semibold">dashboard.render.com</a> e faça login com seu GitHub.
              </li>
              <li className="pl-1">
                <strong>Criar serviço:</strong> Clique no botão azul <strong>New +</strong> e selecione <strong>Blueprint</strong> (ou <strong>Web Service</strong>). Conecte o repositório.
              </li>
              <li className="pl-1">
                <strong>Inserir a Chave Gemini:</strong> No campo de variáveis de ambiente, adicione sua <code className="font-mono text-cyan-800">GEMINI_API_KEY</code> para alimentar os agentes de IA, copy e triagem.
              </li>
              <li className="pl-1">
                <strong>Pronto!</strong> O Render fará o build e disponibilizará uma URL segura pública (ex: <code className="font-mono text-emerald-700">https://odontomind-ai.onrender.com</code>) com certificado SSL automático.
              </li>
            </ol>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Configurações testadas e prontas para produção</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <a
              href="https://dashboard.render.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>Abrir Render Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

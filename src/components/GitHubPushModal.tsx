import React, { useState, useEffect } from 'react';
import {
  X,
  GitBranch,
  Github,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  Terminal,
  UploadCloud,
  Download,
  AlertCircle,
  Loader2,
  Key,
  FolderGit2,
  Sparkles
} from 'lucide-react';

interface GitHubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotification?: (title: string, message: string) => void;
}

interface GitRepoStatus {
  branch: string;
  commitHash: string;
  lastCommit: string;
  filesCount: number;
  hasRemote: boolean;
  remoteUrl: string;
}

export function GitHubPushModal({ isOpen, onClose, onSuccessNotification }: GitHubPushModalProps) {
  const [activeTab, setActiveTab] = useState<'direct' | 'terminal' | 'download'>('direct');
  const [repoUrl, setRepoUrl] = useState('https://github.com/slevenkevelera-tech/odontomind-ai.git');
  const [token, setToken] = useState('');
  const [branch, setBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('feat: CRM Odontológico completo com Agentes IA CRO, Visualização de Dados e Deploy Render');
  
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState<string | null>(null);
  const [pushError, setPushError] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const [gitStatus, setGitStatus] = useState<GitRepoStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // Fetch local git repository status
  const fetchGitStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/github/status');
      const data = await res.json();
      if (data.success) {
        setGitStatus(data);
        if (data.remoteUrl && !repoUrl) {
          setRepoUrl(data.remoteUrl);
        }
      }
    } catch (err) {
      console.error('Failed to load git status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGitStatus();
      setPushSuccess(null);
      setPushError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handlePushToGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setPushError('Por favor informe a URL do seu repositório no GitHub.');
      return;
    }

    if (!token.trim()) {
      setPushError('O Personal Access Token (PAT) é obrigatório. O GitHub exige autenticação para envio de arquivos. Siga o passo a passo abaixo para gerar seu token gratuito em 30 segundos.');
      return;
    }

    setIsPushing(true);
    setPushError(null);
    setPushSuccess(null);

    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          token: token.trim() || undefined,
          branch: branch.trim() || 'main',
          commitMessage: commitMessage.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Falha ao sincronizar com o GitHub.');
      }

      setPushSuccess(data.repoUrl || repoUrl);
      if (onSuccessNotification) {
        onSuccessNotification(
          'Repositório Enviado com Sucesso! 🚀',
          `O projeto OdontoMind AI foi publicado na branch ${branch} do seu GitHub.`
        );
      }
      fetchGitStatus();
    } catch (err: any) {
      setPushError(err.message || 'Ocorreu um erro ao enviar o código para o GitHub.');
    } finally {
      setIsPushing(false);
    }
  };

  const terminalCommands = `# 1. Vincule seu repositório remoto
git remote add origin ${repoUrl.trim() || 'https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git'}

# 2. Defina a branch principal
git branch -M main

# 3. Envie todo o projeto para o GitHub
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl shadow-cyan-950/50 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white shadow-inner">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Publicar no GitHub
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Git Inicializado
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sincronize o código do OdontoMind AI diretamente com o seu repositório pessoal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'direct'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Subir Direto (1-Clique)
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'terminal'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Comandos Terminal (CLI)
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'download'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            Baixar Arquivo (.tar.gz)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-300 text-xs sm:text-sm">
          
          {/* Quick status bar */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">Branch ativa:</span>
              <span className="font-mono font-semibold text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                {gitStatus?.branch || 'main'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Arquivos versionados:</span>
              <span className="font-semibold text-slate-200">
                {gitStatus?.filesCount || 33} arquivos prontos
              </span>
            </div>
            {gitStatus?.commitHash && (
              <div className="flex items-center gap-2 text-slate-400">
                <span>Commit:</span>
                <span className="font-mono text-[11px] text-teal-400 bg-teal-950/40 px-1.5 py-0.5 rounded border border-teal-800/40">
                  {gitStatus.commitHash}
                </span>
              </div>
            )}
          </div>

          {/* TAB 1: DIRECT PUSH */}
          {activeTab === 'direct' && (
            <form onSubmit={handlePushToGithub} className="space-y-4">
              {pushSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-emerald-400 text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Repositório enviado com sucesso para o GitHub!
                  </div>
                  <p className="text-xs text-emerald-300">
                    Todos os 33 arquivos, componentes de CRM, IA Odontológica e arquivos de deploy foram enviados para a branch <span className="font-mono font-bold">{branch}</span>.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={pushSuccess}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold rounded-lg text-xs transition shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Abrir Repositório no GitHub
                    </a>
                    <button
                      type="button"
                      onClick={() => setPushSuccess(null)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                    >
                      Enviar Nova Atualização
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-cyan-950/20 border border-cyan-800/30 rounded-xl p-3 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-cyan-200 leading-relaxed">
                      Se você ainda não criou o repositório,{' '}
                      <a
                        href="https://github.com/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold hover:text-white"
                      >
                        crie um novo repositório vazio no GitHub
                      </a>{' '}
                      (sem marcar README, licença ou .gitignore) e cole a URL abaixo.
                    </p>
                  </div>

                  {pushError && (
                    <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start gap-2.5 text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold block text-rose-300">Falha no envio:</span>
                        {pushError}
                      </div>
                    </div>
                  )}

                  {/* URL input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      URL do Repositório GitHub <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="https://github.com/seu-usuario/odontomind-ai.git"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Exemplo: <code className="text-slate-400">https://github.com/slevenkevelera/odontomind-ai</code>
                    </span>
                  </div>

                  {/* Token input & Guide */}
                  <div className="space-y-2">
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Key className="w-4 h-4 text-amber-400" />
                          Autenticação Obrigatória do GitHub (PAT)
                        </span>
                        <a
                          href="https://github.com/settings/tokens/new?scopes=repo&description=OdontoMind%20Deploy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 px-2.5 py-1 rounded-md transition"
                        >
                          Gerar Token no GitHub <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[11px] text-amber-200/90 leading-relaxed">
                        O GitHub não permite envio de arquivos sem autenticação. Siga os 3 passos:
                      </p>
                      <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-0.5 pl-1">
                        <li>Clique no botão acima <strong className="text-amber-300">Gerar Token no GitHub</strong> (já abre com permissão <code className="text-amber-300">repo</code> selecionada).</li>
                        <li>Role até o final da página e clique no botão verde <strong className="text-white">"Generate token"</strong>.</li>
                        <li>Copie o código gerado (começa com <code className="text-cyan-300">ghp_...</code>) e cole no campo abaixo.</li>
                      </ol>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
                        <span>Personal Access Token (PAT) <span className="text-rose-400">*</span></span>
                        <span className="text-[10px] text-slate-500 font-normal">Ex: ghp_xxxxxxxxxxxxxxxxxxxx</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Cole aqui seu token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Branch and Message options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Branch
                      </label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Mensagem do Commit
                      </label>
                      <input
                        type="text"
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPushing}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition shadow-lg shadow-cyan-950/50 disabled:opacity-50"
                    >
                      {isPushing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando commits para o GitHub...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Sincronizar e Subir para o GitHub Agora 🚀</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* TAB 2: TERMINAL CLI */}
          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Se você tem o terminal ou Git Bash instalado no seu computador, basta rodar os comandos abaixo para conectar o repositório:
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">Sequência de Comandos Git:</span>
                  <button
                    onClick={() => handleCopy(terminalCommands, 'commands')}
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition"
                  >
                    {copiedSnippet === 'commands' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Comandos</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  {terminalCommands}
                </pre>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  Passo a Passo Rápido:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                  <li>Crie o repositório em <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">github.com/new</a> sem arquivo README inicial.</li>
                  <li>Copie a URL HTTPS ou SSH fornecida pelo GitHub.</li>
                  <li>Cole e execute os três comandos acima no terminal da pasta do projeto.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOAD */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-950/50 border border-cyan-800/40 rounded-xl text-cyan-400">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Download do Pacote Completo</h4>
                    <p className="text-xs text-slate-400">
                      Baixe o arquivo compactado contendo todo o código-fonte, componentes, backend Express e configurações.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/api/github/download-archive"
                    download="odontomind-ai-crm.tar.gz"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition border border-slate-700 hover:border-cyan-500/50"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    Baixar Código Fonte (odontomind-ai-crm.tar.gz)
                  </a>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p>💡 <strong className="text-slate-300">Como descompactar:</strong></p>
                <code className="block bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-cyan-300">
                  tar -xzvf odontomind-ai-crm.tar.gz
                </code>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Pronto para sincronização contínua com Render
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition font-medium"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}

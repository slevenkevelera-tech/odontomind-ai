import React, { useState, useRef, useEffect } from 'react';
import { MultiTurnMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Loader2, 
  User, 
  ShieldCheck, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export const GeminiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<MultiTurnMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: 'Olá, Doutor(a) e equipe clínica! Sou o Consultor Odontológico IA da OdontoMind. 🦷✨\n\nEstou aqui para auxiliar na criação de conteúdos éticos, planejamento de campanhas sobre saúde bucal, novidades em odontologia digital e estratégias de retenção no seu CRM de acordo com as normas do CRO. Como posso ajudar hoje?',
      timestamp: 'Agora'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: MultiTurnMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Send conversation history to server-side Gemini endpoint
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: text,
        })
      });

      const data = await response.json();
      const botReply = data.reply || 'Compreendo sua solicitação. Como posso auxiliar na sua rotina clínica ou em campanhas educativas?';

      const modelMsg: MultiTurnMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          content: 'Desculpe, tive um problema de comunicação momentâneo. Como posso auxiliá-lo com as diretrizes do CRO ou na gestão de pacientes?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Quais as regras do CRO para fotos de antes e depois?',
    'Ideia de post sobre como prevenir a retração gengival',
    'Mensagem acolhedora para lembrar o paciente do retorno de 6 meses',
    'Como explicar as vantagens do scanner 3D para um paciente idoso?'
  ];

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        content: 'Conversa reiniciada. Em que posso ajudar você hoje no consultório ou no marketing?',
        timestamp: 'Agora'
      }
    ]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chatbot Clínico & Marketing Odontológico Multi-turn</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Consultor de Inteligência Artificial da OdontoMind
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Converse em tempo real com a IA para tirar dúvidas sobre o Código de Ética do CRO, solicitar ideias de temas educativos, criar mensagens personalizadas para o CRM ou refinar roteiros de vídeos.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar Histórico</span>
        </button>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Chat Status Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              🦷
            </div>
            <div>
              <span className="font-bold text-white block">Dr. Gemini · Consultor OdontoMind</span>
              <span className="text-[10px] text-slate-400">Ativo · Modelo Gemini 3.8 Flash</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Conformidade CRO Ativa</span>
          </div>
        </div>

        {/* Scrollable Messages Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <Bot className="w-4 h-4 text-cyan-700" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-xs text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className={`block text-[10px] mt-1 text-right ${isUser ? 'text-slate-400' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 font-bold text-xs">
                <Bot className="w-4 h-4 text-cyan-700" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />
                <span>Raciocinando com base clínica e regulatória...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="bg-white px-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Sugestões:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Digite sua dúvida clínica, solicitação de copy ou tema para o marketing..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

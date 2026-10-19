import React, { useState } from 'react';
import { essentialServices, DentalService } from '../data/servicesData';
import { 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Clock, 
  CheckCircle, 
  ShieldAlert, 
  DollarSign, 
  Layers, 
  Eye,
  Sliders
} from 'lucide-react';

export const ServicesGuide: React.FC = () => {
  const [selectedService, setSelectedService] = useState<DentalService>(essentialServices[0]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engenharia de Portfólio Clínico</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Serviços Odontológicos Essenciais de Alto LTV & Margem
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            A tríade perfeita de uma clínica odontológica de alta performance: procedimentos de alto ticket que garantem margem, procedimentos recorrentes que constroem fidelização vitalícia e protocolos 100% digitais.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-right">
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Margem Média do Mix</span>
            <strong className="text-base font-extrabold text-emerald-600">66.5% Bruta</strong>
          </div>
        </div>
      </div>

      {/* Services Grid Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {essentialServices.map((service) => {
          const isSelected = selectedService.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`text-left p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg -translate-y-0.5'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-cyan-50 text-cyan-700'
                  }`}>
                    {service.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-500">
                    {service.margin} Margem
                  </span>
                </div>

                <h3 className={`text-sm font-heading font-bold mb-1.5 line-clamp-1 ${
                  isSelected ? 'text-white' : 'text-slate-900'
                }`}>
                  {service.name}
                </h3>

                <p className={`text-xs line-clamp-2 leading-relaxed ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {service.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/10 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isSelected ? 'text-cyan-400' : 'text-slate-700'}`}>
                  {service.ticketRange}
                </span>
                <span className={`text-[11px] ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                  {service.chairTime}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep Inspection of Selected Essential Service */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-cyan-600 block uppercase tracking-wider">
              {selectedService.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 mt-0.5">
              {selectedService.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {selectedService.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ticket Médio</span>
              <strong className="text-sm font-extrabold text-slate-900">{selectedService.ticketRange}</strong>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Margem Bruta</span>
              <strong className="text-sm font-extrabold text-emerald-700">{selectedService.margin}</strong>
            </div>
          </div>
        </div>

        {/* 3 Detail Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tech and Clinical Protocol */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-xs uppercase tracking-wide">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Tecnologia & Equipamentos Exigidos</span>
            </div>
            <ul className="space-y-2">
              {selectedService.techRequired.map((tech, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-slate-200/60 mt-3">
              <span className="text-[11px] font-bold text-slate-700 block mb-1">
                Protocolo Clínico Padronizado (SOP):
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedService.clinicalProtocol}
              </p>
            </div>
          </div>

          {/* Viral Marketing Strategy */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Ângulo de Marketing Viral Ético</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedService.viralMarketingAngle}
            </p>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 mt-3">
              <strong className="text-slate-900 block mb-1">Impacto no LTV do Paciente:</strong>
              {selectedService.ltvImpact}
            </div>
          </div>

          {/* CRO / CFO Legal Safety Rules */}
          <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-xs uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Regra de Ouro do CRO / CFO</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              {selectedService.croRuleNotice}
            </p>
            <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 mt-2">
              <strong>Checklist Obrigatório:</strong> Coleta prévia de TCLE (Termo de Consentimento), menção expressa à variabilidade biológica individual e identificação completa do Responsável Técnico.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { AIAssistantField } from '../AIAssistantField';

export function Step4IdeaGeneration() {
  const { formData, updateForm } = useWizard();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Geração de Ideias</h2>
      
      {formData.tipo_desafio === 'processos' ? (
        <>
          <AIAssistantField
            label="Soluções de Curto Prazo (≤3 meses) - Suas ideias"
            instruction="Proponha ideias rápidas de testar. Use a IA para gerar sugestões baseadas no problema e causas."
            value={formData.solucao_curto_prazo_processo}
            onChange={v => updateForm('solucao_curto_prazo_processo', v)}
            onAiSuggestion={v => updateForm('ai_solucao_curto_prazo_processo', v)}
            aiValue={formData.ai_solucao_curto_prazo_processo}
            prompt={`Contexto da empresa: ${formData.empresa_contexto}. 
            Problema: "${formData.descricao_problema_processo}". 
            Veredito sobre as causas: "${formData.conclusao_causas_processo}".
            Ideias iniciais de solução: "${formData.solucao_curto_prazo_processo}".
            
            Com base nisso, proponha 2 soluções de curto prazo (testáveis em ≤3 meses). Para cada solução, dê: (a) descrição curta; (b) 3 passos para validar a solução (prototipagem rápida); (c) recursos mínimos necessários; e (d) risco principal.`}
            rows={8}
          />
          {formData.ai_solucao_curto_prazo_processo && (
            <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Veredito da Equipe - Curto Prazo
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Qual solução de curto prazo vocês decidiram priorizar?
              </p>
              <textarea
                value={formData.conclusao_ideias_curto_processo}
                onChange={e => updateForm('conclusao_ideias_curto_processo', e.target.value)}
                placeholder="Nossa conclusão é..."
                rows={4}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
            </div>
          )}

          <AIAssistantField
            label="Soluções de Médio Prazo (3–12 meses) - Suas ideias"
            instruction="Proponha ideias mais estruturais."
            value={formData.solucao_medio_prazo_processo}
            onChange={v => updateForm('solucao_medio_prazo_processo', v)}
            onAiSuggestion={v => updateForm('ai_solucao_medio_prazo_processo', v)}
            aiValue={formData.ai_solucao_medio_prazo_processo}
            prompt={`Contexto da empresa: ${formData.empresa_contexto}. 
            Problema: "${formData.descricao_problema_processo}". 
            Veredito sobre as causas: "${formData.conclusao_causas_processo}".
            Ideias iniciais de solução: "${formData.solucao_medio_prazo_processo}".
            
            Com base nisso, proponha 2 soluções de médio prazo (3-12 meses). Para cada solução, dê: (a) descrição curta; (b) 3 passos para validar a solução; (c) recursos mínimos necessários; e (d) risco principal.`}
            rows={8}
          />
          {formData.ai_solucao_medio_prazo_processo && (
            <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Veredito da Equipe - Médio Prazo
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Qual solução de médio prazo vocês decidiram priorizar?
              </p>
              <textarea
                value={formData.conclusao_ideias_medio_processo}
                onChange={e => updateForm('conclusao_ideias_medio_processo', e.target.value)}
                placeholder="Nossa conclusão é..."
                rows={4}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <AIAssistantField
            label="Soluções de Curto Prazo (≤3 meses) - Suas ideias"
            instruction="Proponha ideias rápidas de testar no mercado. Use a IA para gerar sugestões."
            value={formData.solucao_curto_prazo_mercado}
            onChange={v => updateForm('solucao_curto_prazo_mercado', v)}
            onAiSuggestion={v => updateForm('ai_solucao_curto_prazo_mercado', v)}
            aiValue={formData.ai_solucao_curto_prazo_mercado}
            prompt={`Contexto da empresa: ${formData.empresa_contexto}. 
            Desafio: "${formData.descricao_desafio_mercado}". 
            Veredito sobre as causas: "${formData.conclusao_causas_mercado}".
            Ideias iniciais de solução: "${formData.solucao_curto_prazo_mercado}".
            
            Com base nisso, proponha 2 soluções de curto prazo (≤3 meses). Para cada solução, dê: (a) descrição curta, (b) 3 passos para validação, (c) recursos mínimos e (d) risco principal.`}
            rows={8}
          />
          {formData.ai_solucao_curto_prazo_mercado && (
            <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Veredito da Equipe - Curto Prazo
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Qual solução de curto prazo vocês decidiram priorizar?
              </p>
              <textarea
                value={formData.conclusao_ideias_curto_mercado}
                onChange={e => updateForm('conclusao_ideias_curto_mercado', e.target.value)}
                placeholder="Nossa conclusão é..."
                rows={4}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
            </div>
          )}

          <AIAssistantField
            label="Soluções de Médio Prazo (3–12 meses) - Suas ideias"
            instruction="Proponha inovações de produto/serviço mais estruturais."
            value={formData.solucao_medio_prazo_mercado}
            onChange={v => updateForm('solucao_medio_prazo_mercado', v)}
            onAiSuggestion={v => updateForm('ai_solucao_medio_prazo_mercado', v)}
            aiValue={formData.ai_solucao_medio_prazo_mercado}
            prompt={`Contexto da empresa: ${formData.empresa_contexto}. 
            Desafio: "${formData.descricao_desafio_mercado}". 
            Veredito sobre as causas: "${formData.conclusao_causas_mercado}".
            Ideias iniciais de solução: "${formData.solucao_medio_prazo_mercado}".
            
            Com base nisso, proponha 2 soluções de médio prazo (3-12 meses). Para cada solução, dê: (a) descrição curta, (b) 3 passos para validação, (c) recursos mínimos e (d) risco principal.`}
            rows={8}
          />
          {formData.ai_solucao_medio_prazo_mercado && (
            <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Veredito da Equipe - Médio Prazo
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Qual solução de médio prazo vocês decidiram priorizar?
              </p>
              <textarea
                value={formData.conclusao_ideias_medio_mercado}
                onChange={e => updateForm('conclusao_ideias_medio_mercado', e.target.value)}
                placeholder="Nossa conclusão é..."
                rows={4}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

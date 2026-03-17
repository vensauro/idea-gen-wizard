import React from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { AIAssistantField } from '../AIAssistantField';

export function Step3CauseAnalysis() {
  const { formData, updateForm } = useWizard();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Análise de Causas</h2>
      
      {formData.tipo_desafio === 'processos' ? (
        <>
          <AIAssistantField
            label="Qual é o X da questão? (Suas hipóteses)"
            instruction="Insira os insights da equipe e use a IA para ajudar a identificar causas-raiz."
            value={formData.causas_processo}
            onChange={v => updateForm('causas_processo', v)}
            onAiSuggestion={v => updateForm('ai_causas_processo', v)}
            aiValue={formData.ai_causas_processo}
            prompt={`Contexto da empresa: ${formData.empresa_contexto}. 
            Problema interno identificado: "${formData.descricao_problema_processo}". 
            Ideias iniciais da equipe sobre as causas: "${formData.causas_processo}".
            
            Você é especialista em operações e gestão de processos. Com base no contexto acima, analise se as hipóteses da equipe fazem sentido e liste 2 possíveis causas-raiz principais (podem ser as da equipe aprofundadas ou novas). Para cada causa, sugira 2 formas simples de validar rapidamente em campo se essas causas são reais: o que observar, como medir e que evidências coletar.`}
            placeholder="Liste as causas-raiz identificadas..."
            rows={10}
          />
          {formData.ai_causas_processo && (
            <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Veredito da Equipe
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Considerando a discussão e os insights da IA acima, quais causas raízes vocês decidiram atacar?
              </p>
              <textarea
                value={formData.conclusao_causas_processo}
                onChange={e => updateForm('conclusao_causas_processo', e.target.value)}
                placeholder="Nossa conclusão é que a causa principal é..."
                rows={4}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <AIAssistantField
            label="Qual é o X da questão? (Suas hipóteses)"
            instruction="Insira os insights da equipe e use a IA para ajudar a identificar causas-raiz no mercado."
            value={formData.causas_mercado}
            onChange={v => updateForm('causas_mercado', v)}
            onAiSuggestion={v => updateForm('ai_causas_mercado', v)}
            aiValue={formData.ai_causas_mercado}
            prompt={`Contexto da empresa: ${formData.empresa_contexto}. 
            Desafio de mercado/produto identificado: "${formData.descricao_desafio_mercado}". 
            Ideias iniciais da equipe sobre as causas: "${formData.causas_mercado}".
            
            Você é especialista em estratégia B2B e inovação. Com base no contexto acima, analise se as hipóteses da equipe fazem sentido e liste 2 possíveis causas-raiz principais. Sugira 2 formas simples para validar cada uma junto a clientes e equipe técnica.`}
            placeholder="Liste as causas-raiz identificadas..."
            rows={10}
          />
          {formData.ai_causas_mercado && (
            <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Veredito da Equipe
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Considerando a discussão e os insights da IA acima, quais causas raízes vocês decidiram atacar?
              </p>
              <textarea
                value={formData.conclusao_causas_mercado}
                onChange={e => updateForm('conclusao_causas_mercado', e.target.value)}
                placeholder="Nossa conclusão é que a causa principal é..."
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

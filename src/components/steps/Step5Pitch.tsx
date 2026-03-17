import React from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { AIAssistantField } from '../AIAssistantField';

export function Step5Pitch() {
  const { formData, updateForm } = useWizard();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">A Proposta (Pitch)</h2>
      <p className="text-slate-600 mb-6">Uma versão simples e direta para apresentar em 90 segundos.</p>
      
      {formData.tipo_desafio === 'processos' ? (
        <AIAssistantField
          label="Pitch de Processo"
          instruction="Preencha o template com a sua melhor ideia."
          value={formData.pitch_processo}
          onChange={v => updateForm('pitch_processo', v)}
          onAiSuggestion={v => updateForm('ai_pitch_processo', v)}
          aiValue={formData.ai_pitch_processo}
          prompt={`Contexto da empresa: ${formData.empresa_contexto}. 
          Problema: ${formData.descricao_problema_processo}. 
          Veredito Causas: ${formData.conclusao_causas_processo}.
          Solução Curto Prazo (Veredito): ${formData.conclusao_ideias_curto_processo}.
          Solução Médio Prazo (Veredito): ${formData.conclusao_ideias_medio_processo}.
          
          Escreva um pitch de 90 segundos seguindo este template: "Para solucionar [problema] propomos [ideia priorizada], cujo diferencial principal é [o borogodó]."`}
          rows={6}
        />
      ) : (
        <AIAssistantField
          label="Pitch de Mercado"
          instruction="Preencha o template com a sua melhor ideia."
          value={formData.pitch_mercado}
          onChange={v => updateForm('pitch_mercado', v)}
          onAiSuggestion={v => updateForm('ai_pitch_mercado', v)}
          aiValue={formData.ai_pitch_mercado}
          prompt={`Contexto da empresa: ${formData.empresa_contexto}. 
          Desafio: ${formData.descricao_desafio_mercado}. 
          Veredito Causas: ${formData.conclusao_causas_mercado}.
          Solução Curto Prazo (Veredito): ${formData.conclusao_ideias_curto_mercado}.
          Solução Médio Prazo (Veredito): ${formData.conclusao_ideias_medio_mercado}.
          
          Escreva um pitch de 90 segundos seguindo este template: "Para transformar [desafio] em resultado, propomos [ideia priorizada], cujo diferencial principal é [o borogodó]."`}
          rows={6}
        />
      )}
    </div>
  );
}

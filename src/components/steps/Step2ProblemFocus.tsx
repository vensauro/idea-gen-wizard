import React from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { AIAssistantField } from '../AIAssistantField';

export function Step2ProblemFocus() {
  const { formData, updateForm } = useWizard();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Foco no Problema</h2>
      
      {formData.tipo_desafio === 'processos' ? (
        <AIAssistantField
          label="Descreva UM problema instigante."
          instruction="Vamos à caça de processos que merecem ser otimizados ou substituídos. Olho nos desperdícios, ineficiências, retrabalho, riscos... O que acontece? Onde? Quem é impactado? Qual o impacto principal?"
          value={formData.descricao_problema_processo}
          onChange={v => updateForm('descricao_problema_processo', v)}
          placeholder="Descreva o problema detalhadamente..."
          rows={8}
        />
      ) : (
        <AIAssistantField
          label="Descreva UM desafio instigante e específico com alto potencial de gerar valor."
          instruction="Olhando para nosso portfólio, vamos à caça de oportunidades. Quais dores os clientes expressam? Onde geramos menos valor?"
          value={formData.descricao_desafio_mercado}
          onChange={v => updateForm('descricao_desafio_mercado', v)}
          placeholder="Descreva o desafio de mercado detalhadamente..."
          rows={8}
        />
      )}
    </div>
  );
}

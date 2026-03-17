import React from 'react';
import { Activity, Target, Users } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import { useMultiplayer } from '../../contexts/MultiplayerContext';

export function Step1Identification() {
  const { formData, updateForm } = useWizard();
  const { users, me } = useMultiplayer();
  const isGuest = me ? !me.isHost : false;

  const handleAutofillTeam = () => {
    if (!users || users.length === 0) return;
    
    const names = users.map(u => u.name);
    const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
    const formattedNames = formatter.format(names);
    
    updateForm('equipe_nomes', formattedNames);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Identificação e Direcionamento</h2>
      <p className="text-slate-600 mb-6">Onde a equipe se apresenta e escolhe o escopo do desafio.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">Contexto da Empresa</label>
          <p className="text-xs text-slate-500 mb-2">Descreva brevemente a empresa e sua área de atuação.</p>
          <textarea
            value={formData.empresa_contexto}
            onChange={e => updateForm('empresa_contexto', e.target.value)}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            rows={3}
            placeholder="Ex: Somos uma empresa que atua fornecendo soluções especiais para manutenção industrial..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-semibold text-slate-800">Integrantes da Equipe</label>
            {!isGuest && users.length > 0 && (
              <button
                type="button"
                onClick={handleAutofillTeam}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors"
                title="Preencher com os usuários conectados na sala"
              >
                <Users className="w-3.5 h-3.5" />
                Preencher com presentes
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-2">Insira o nome ou a matrícula dos integrantes da equipe.</p>
          <textarea
            value={formData.equipe_nomes}
            onChange={e => updateForm('equipe_nomes', e.target.value)}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            rows={3}
            placeholder="Ex: João Silva, Maria Souza..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">Áreas de Atuação</label>
          <p className="text-xs text-slate-500 mb-2">Áreas de atuação de cada integrante.</p>
          <textarea
            value={formData.equipe_areas}
            onChange={e => updateForm('equipe_areas', e.target.value)}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            rows={2}
            placeholder="Ex: Manutenção, Engenharia, Vendas..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-3">Qual desafio vocês vão tratar?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => updateForm('tipo_desafio', 'processos')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                formData.tipo_desafio === 'processos' 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${formData.tipo_desafio === 'processos' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                  <Activity className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-900">Processos</span>
              </div>
              <p className="text-sm text-slate-600">Otimizar ou substituir processos internos, reduzir desperdícios e ineficiências.</p>
            </button>

            <button
              onClick={() => updateForm('tipo_desafio', 'mercado')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                formData.tipo_desafio === 'mercado' 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${formData.tipo_desafio === 'mercado' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                  <Target className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-900">Produtos / Mercado</span>
              </div>
              <p className="text-sm text-slate-600">Resolver dores de clientes, criar novas soluções ou melhorar o portfólio atual.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

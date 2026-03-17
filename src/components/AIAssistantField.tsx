import React, { useState } from 'react';
import { Loader2, Sparkles, CheckCircle, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamInsights } from '../services/ai';

export const AIAssistantField = ({
  label,
  value,
  onChange,
  onAiSuggestion,
  aiValue,
  prompt,
  placeholder,
  rows = 6,
  instruction
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onAiSuggestion?: (val: string) => void;
  aiValue?: string;
  prompt?: string;
  placeholder?: string;
  rows?: number;
  instruction?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (extraPrompt?: string) => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    try {
      let finalPrompt = prompt;
      
      if (extraPrompt === 'REFINE') {
        finalPrompt = `Você é um redator especialista em clareza e impacto. 
        Melhore o seguinte texto mantendo seu significado original, 
        mas tornando-o mais profissional, conciso e impactante.
        
        Texto original: "${value}"
        
        Responda APENAS com o texto melhorado, sem introduções ou explicações.`;
      } else if (extraPrompt) {
        finalPrompt = `${prompt}\n\nSugestões anteriores geradas por você:\n${aiValue || ''}\n\nInstrução adicional: ${extraPrompt}`;
      }

      const isRefine = extraPrompt === 'REFINE';
      let accumulatedResponse = "";

      // Clear previous value if starting a new generation (non-extraPrompt insight)
      if (!isRefine && !extraPrompt && onAiSuggestion) {
        onAiSuggestion("");
      }

      const stream = streamInsights(finalPrompt);
      for await (const chunk of stream) {
        accumulatedResponse += chunk;
        
        if (isRefine) {
          onChange(accumulatedResponse);
        } else {
          const displayValue = extraPrompt && aiValue 
            ? `${aiValue}\n\n---\n\n${accumulatedResponse}` 
            : accumulatedResponse;
          
          if (onAiSuggestion) {
            onAiSuggestion(displayValue);
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
        <div>
          <label className="block text-sm font-semibold text-slate-800">{label}</label>
          {instruction && <p className="text-xs text-slate-500 mt-1">{instruction}</p>}
        </div>
        <div className="flex gap-2">
          {value.trim() && (
            <button
              type="button"
              onClick={() => handleGenerate('REFINE')}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              {loading ? 'Refinando...' : 'Refinar meu texto'}
            </button>
          )}
          {prompt && (
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {loading ? 'Gerando...' : 'Obter insight'}
            </button>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border font-sans"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      {aiValue && (
        <div className="mt-2 p-4 bg-indigo-50/80 border border-indigo-100 rounded-lg relative animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-800 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Insights da IA
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(aiValue)}
              className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-100 transition-colors"
              title="Copiar sugestão"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-sm text-slate-700 prose prose-sm prose-indigo max-w-none">
            <ReactMarkdown>{aiValue}</ReactMarkdown>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-100/50 flex gap-2">
            <button 
              type="button"
              onClick={() => handleGenerate("Gere mais alternativas diferentes das que você acabou de apresentar.")}
              disabled={loading}
              className="text-xs px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Gerando...' : 'Gerar mais alternativas'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

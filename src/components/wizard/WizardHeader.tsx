import React from 'react';
import { Lightbulb, CheckCircle } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';

export function WizardHeader() {
  const { currentStep, STEPS } = useWizard();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Lightbulb className="w-6 h-6" />
          <span className="font-bold text-lg tracking-tight text-slate-900">Assistente de Inovação com IA</span>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Passo {currentStep} de {STEPS.length}
        </div>
      </div>
    </header>
  );
}

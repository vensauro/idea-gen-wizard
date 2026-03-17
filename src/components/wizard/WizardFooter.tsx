import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';

export function WizardFooter() {
  const { currentStep, STEPS, prevStep, nextStep, isStepValid, getStepValidationMessage } = useWizard();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 sm:p-6 z-50 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
            currentStep === 1 
              ? 'text-slate-300 cursor-not-allowed opacity-50' 
              : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        
        {currentStep < STEPS.length ? (
          <div className="flex items-center gap-3">
            {!isStepValid() && (
              <span className="text-xs text-amber-600 font-medium animate-in fade-in hidden sm:block">
                {getStepValidationMessage()}
              </span>
            )}
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm ${
                !isStepValid()
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-[104px]"></div> /* Placeholder to keep "Voltar" aligned left when there's no "Próximo" */
        )}
      </div>
    </div>
  );
}

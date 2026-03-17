import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';

export function WizardSidebar() {
  const { currentStep, STEPS, setCurrentStep } = useWizard();

  return (
    <div className="hidden md:block w-64 shrink-0">
      <nav className="sticky top-24">
        <ul className="space-y-1">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isPast = step.id < currentStep;

            return (
              <li key={step.id}>
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : isPast
                        ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                        : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : isPast ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  {step.title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

import React from 'react';
import { WizardProvider, useWizard } from './contexts/WizardContext';
import { WizardHeader } from './components/wizard/WizardHeader';
import { WizardSidebar } from './components/wizard/WizardSidebar';
import { WizardFooter } from './components/wizard/WizardFooter';
import { MultiplayerProvider, useMultiplayer } from './contexts/MultiplayerContext';
import { LobbyScreen } from './components/lobby/LobbyScreen';

import { Step1Identification } from './components/steps/Step1Identification';
import { Step2ProblemFocus } from './components/steps/Step2ProblemFocus';
import { Step3CauseAnalysis } from './components/steps/Step3CauseAnalysis';
import { Step4IdeaGeneration } from './components/steps/Step4IdeaGeneration';
import { Step5Pitch } from './components/steps/Step5Pitch';
import { Step6FinalDocument } from './components/steps/Step6FinalDocument';

function MobileProgressBar() {
  const { currentStep, STEPS } = useWizard();
  return (
    <div className="md:hidden mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{STEPS[currentStep - 1].title}</span>
        <span className="text-sm text-slate-500">{Math.round((currentStep / STEPS.length) * 100)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

function WizardContent() {
  const { currentStep } = useWizard();
  const { me } = useMultiplayer();
  const isGuest = me ? !me.isHost : false;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1Identification />;
      case 2: return <Step2ProblemFocus />;
      case 3: return <Step3CauseAnalysis />;
      case 4: return <Step4IdeaGeneration />;
      case 5: return <Step5Pitch />;
      case 6: return <Step6FinalDocument />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <WizardHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8 pb-32">
        <WizardSidebar />

        <div className="flex-1 min-w-0">
          <MobileProgressBar />
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 md:p-10 relative">
            {isGuest && (
              <div className="absolute top-0 inset-x-0 bg-blue-50 text-blue-800 text-sm text-center py-2 rounded-t-2xl font-medium border-b border-blue-100">
                Lente de Visitante: Acompanhando as atualizações do Host.
              </div>
            )}
            <fieldset disabled={isGuest} className={`min-w-0 ${isGuest ? 'mt-8 opacity-90' : ''}`}>
              {renderStepContent()}
            </fieldset>
          </div>
        </div>
      </main>

      <fieldset disabled={isGuest}>
        <WizardFooter />
      </fieldset>
    </div>
  );
}

function AppContent() {
  const { me } = useMultiplayer();

  if (!me) {
    return <LobbyScreen />;
  }

  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}

export default function App() {
  return (
    <MultiplayerProvider>
      <AppContent />
    </MultiplayerProvider>
  );
}

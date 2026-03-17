import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FormState, initialState, Track } from '../types';
import { useMultiplayer } from './MultiplayerContext';
import { Users, Target, Activity, Rocket, Presentation, FileText } from 'lucide-react';

export const STEPS = [
  { id: 1, title: 'Identificação', icon: Users },
  { id: 2, title: 'Foco no Problema', icon: Target },
  { id: 3, title: 'Análise de Causas', icon: Activity },
  { id: 4, title: 'Geração de Ideias', icon: Rocket },
  { id: 5, title: 'A Proposta', icon: Presentation },
  { id: 6, title: 'Documento Final', icon: FileText },
];

interface WizardContextType {
  currentStep: number;
  formData: FormState;
  STEPS: typeof STEPS;
  updateForm: (field: keyof FormState, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: number) => void;
  isStepValid: () => boolean;
  getStepValidationMessage: () => string | null;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [initialized, setInitialized] = useState(false);
  
  const { me, room, updateRoomData } = useMultiplayer();
  const isHost = me?.isHost;
  const isGuest = me && !me.isHost;

  useEffect(() => {
    if (room && !initialized) {
      if (room.formData) {
        try { 
          const parsed = JSON.parse(room.formData);
          setFormData({ ...initialState, ...parsed }); 
        } catch(e) {}
      }
      setInitialized(true);
    } else if (room?.formData && isGuest) {
      try { 
        const parsed = JSON.parse(room.formData);
        setFormData({ ...initialState, ...parsed }); 
      } catch(e) {}
    }
  }, [room, initialized, isGuest]);

  const currentStep = formData.currentStep || 1;

  const updateForm = (field: keyof FormState, value: any) => {
    if (isGuest) return;
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      updateRoomData(next);
      return next;
    });
  };

  const setCurrentStep = (step: number) => {
    if (isGuest) return;
    updateForm('currentStep', step);
  };

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, STEPS.length));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const getStepValidationMessage = () => {
    switch (currentStep) {
      case 1:
        if (!formData.empresa_contexto.trim() || !formData.equipe_nomes.trim() || !formData.tipo_desafio) {
          return "Preencha todos os campos e selecione o tipo de desafio.";
        }
        break;
      case 2:
        if (formData.tipo_desafio === 'processos' && !formData.descricao_problema_processo.trim()) {
          return "Descreva o problema atual.";
        }
        if (formData.tipo_desafio === 'mercado' && !formData.descricao_desafio_mercado.trim()) {
          return "Descreva o desafio de mercado.";
        }
        break;
      case 3:
        if (formData.tipo_desafio === 'processos') {
          if (!formData.causas_processo.trim()) return "Preencha suas hipóteses iniciais.";
          if (!formData.ai_causas_processo) return "Gere os insights da IA para continuar.";
          if (!formData.conclusao_causas_processo.trim()) return "Preencha o veredito da equipe.";
        } else {
          if (!formData.causas_mercado.trim()) return "Preencha suas hipóteses iniciais.";
          if (!formData.ai_causas_mercado) return "Gere os insights da IA para continuar.";
          if (!formData.conclusao_causas_mercado.trim()) return "Preencha o veredito da equipe.";
        }
        break;
      case 4:
        if (formData.tipo_desafio === 'processos') {
          if (!formData.solucao_curto_prazo_processo.trim() || !formData.solucao_medio_prazo_processo.trim()) return "Preencha suas ideias de curto e médio prazo.";
          if (!formData.ai_solucao_curto_prazo_processo || !formData.ai_solucao_medio_prazo_processo) return "Gere os insights da IA para curto e médio prazo.";
          if (!formData.conclusao_ideias_curto_processo.trim() || !formData.conclusao_ideias_medio_processo.trim()) return "Preencha os vereditos da equipe para curto e médio prazo.";
        } else {
          if (!formData.solucao_curto_prazo_mercado.trim() || !formData.solucao_medio_prazo_mercado.trim()) return "Preencha suas ideias de curto e médio prazo.";
          if (!formData.ai_solucao_curto_prazo_mercado || !formData.ai_solucao_medio_prazo_mercado) return "Gere os insights da IA para curto e médio prazo.";
          if (!formData.conclusao_ideias_curto_mercado.trim() || !formData.conclusao_ideias_medio_mercado.trim()) return "Preencha os vereditos da equipe para curto e médio prazo.";
        }
        break;
      case 5:
        if (formData.tipo_desafio === 'processos') {
          if (!formData.pitch_processo.trim()) return "Preencha o pitch.";
          if (!formData.ai_pitch_processo) return "Gere os insights da IA para o pitch.";
        } else {
          if (!formData.pitch_mercado.trim()) return "Preencha o pitch.";
          if (!formData.ai_pitch_mercado) return "Gere os insights da IA para o pitch.";
        }
        break;
    }
    return null;
  };

  const isStepValid = () => getStepValidationMessage() === null;

  return (
    <WizardContext.Provider value={{
      currentStep,
      formData,
      STEPS,
      updateForm,
      nextStep,
      prevStep,
      setCurrentStep,
      isStepValid,
      getStepValidationMessage,
    }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

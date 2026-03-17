import React, { useState } from 'react';
import { FormState, Track, initialState } from './types';
import { generateInsights } from './services/ai';
import { Loader2, Sparkles, ArrowRight, ArrowLeft, CheckCircle, FileText, Copy, Lightbulb, Users, Target, Activity, Rocket, Presentation, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

const STEPS = [
  { id: 1, title: 'Identificação', icon: Users },
  { id: 2, title: 'Foco no Problema', icon: Target },
  { id: 3, title: 'Análise de Causas', icon: Activity },
  { id: 4, title: 'Geração de Ideias', icon: Rocket },
  { id: 5, title: 'A Proposta', icon: Presentation },
  { id: 6, title: 'Documento Final', icon: FileText },
];

const AIAssistantField = ({
  label,
  value,
  onChange,
  onAiSuggestion,
  prompt,
  placeholder,
  rows = 6,
  instruction
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onAiSuggestion?: (val: string) => void;
  prompt?: string;
  placeholder?: string;
  rows?: number;
  instruction?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    try {
      const result = await generateInsights(prompt);
      setAiSuggestion(result);
      if (onAiSuggestion) {
        onAiSuggestion(result);
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
        {prompt && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loading ? 'Gerando...' : 'Gerar com IA'}
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border font-sans"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      {aiSuggestion && (
        <div className="mt-2 p-4 bg-indigo-50/80 border border-indigo-100 rounded-lg relative animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-800 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Insights da IA
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(aiSuggestion)}
              className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-100 transition-colors"
              title="Copiar sugestão"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-sm text-slate-700 prose prose-sm prose-indigo max-w-none">
            <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(initialState);

  const updateForm = (field: keyof FormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleDownloadPdf = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    try {
      // Save original styles to revert later
      const originalStyle = element.getAttribute('style');
      
      // Force desktop width for consistent PDF rendering (prevents huge fonts on mobile)
      element.style.width = '800px';
      element.style.maxWidth = 'none';
      element.classList.add('bg-white', 'p-12');
      
      // Force synchronous reflow so html-to-image gets the correct new height
      void element.offsetHeight;
      
      const imgData = await htmlToImage.toPng(element, { 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      // Revert styles
      if (originalStyle) {
        element.setAttribute('style', originalStyle);
      } else {
        element.removeAttribute('style');
      }
      element.classList.remove('bg-white', 'p-12');

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save('documento-ideacao.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente.');
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.empresa_contexto.trim() !== '' && formData.equipe_nomes.trim() !== '' && formData.tipo_desafio !== '';
    }
    return true; // Add more validation if needed
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
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
                <label className="block text-sm font-semibold text-slate-800 mb-1">Integrantes da Equipe</label>
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

      case 2:
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

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Análise de Causas</h2>
            
            {formData.tipo_desafio === 'processos' ? (
              <AIAssistantField
                label="Qual é o X da questão?"
                instruction="Insira os insights da equipe e use a IA para ajudar a identificar causas-raiz."
                value={formData.causas_processo}
                onChange={v => updateForm('causas_processo', v)}
                onAiSuggestion={v => updateForm('ai_causas_processo', v)}
                prompt={`Contexto da empresa: ${formData.empresa_contexto}. Identificamos o seguinte problema interno: "${formData.descricao_problema_processo}". Você é especialista em operações e gestão de processos. Liste 2 possíveis causas-raiz desse problema. Para cada causa, sugira 2 formas simples de validar rapidamente em campo se essas causas são reais: o que observar, como medir e que evidências coletar.`}
                placeholder="Liste as causas-raiz identificadas..."
                rows={10}
              />
            ) : (
              <AIAssistantField
                label="Qual é o X da questão?"
                instruction="Insira os insights da equipe e use a IA para ajudar a identificar causas-raiz no mercado."
                value={formData.causas_mercado}
                onChange={v => updateForm('causas_mercado', v)}
                onAiSuggestion={v => updateForm('ai_causas_mercado', v)}
                prompt={`Contexto da empresa: ${formData.empresa_contexto}. Identificamos o seguinte desafio de mercado/produto: "${formData.descricao_desafio_mercado}". Você é especialista em estratégia B2B e inovação. Liste 2 possíveis causas-raiz desse desafio e sugira 2 formas simples para validar cada uma junto a clientes e equipe técnica.`}
                placeholder="Liste as causas-raiz identificadas..."
                rows={10}
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Geração de Ideias</h2>
            
            {formData.tipo_desafio === 'processos' ? (
              <>
                <AIAssistantField
                  label="Soluções de Curto Prazo (≤3 meses)"
                  instruction="Proponha ideias rápidas de testar. Use a IA para gerar sugestões baseadas no problema e causas."
                  value={formData.solucao_curto_prazo_processo}
                  onChange={v => updateForm('solucao_curto_prazo_processo', v)}
                  onAiSuggestion={v => updateForm('ai_solucao_curto_prazo_processo', v)}
                  prompt={`Contexto da empresa: ${formData.empresa_contexto}. Com base no problema: "${formData.descricao_problema_processo}" e nas causas: "${formData.causas_processo}", proponha 2 soluções de curto prazo (testáveis em ≤3 meses). Para cada solução, dê: (a) descrição curta; (b) 3 passos para validar a solução (prototipagem rápida); (c) recursos mínimos necessários; e (d) risco principal.`}
                  rows={8}
                />
                <AIAssistantField
                  label="Soluções de Médio Prazo (3–12 meses)"
                  instruction="Proponha ideias mais estruturais."
                  value={formData.solucao_medio_prazo_processo}
                  onChange={v => updateForm('solucao_medio_prazo_processo', v)}
                  onAiSuggestion={v => updateForm('ai_solucao_medio_prazo_processo', v)}
                  prompt={`Contexto da empresa: ${formData.empresa_contexto}. Com base no problema: "${formData.descricao_problema_processo}" e nas causas: "${formData.causas_processo}", proponha 2 soluções de médio prazo (3-12 meses). Para cada solução, dê: (a) descrição curta; (b) 3 passos para validar a solução; (c) recursos mínimos necessários; e (d) risco principal.`}
                  rows={8}
                />
              </>
            ) : (
              <>
                <AIAssistantField
                  label="Soluções de Curto Prazo (≤3 meses)"
                  instruction="Proponha ideias rápidas de testar no mercado. Use a IA para gerar sugestões."
                  value={formData.solucao_curto_prazo_mercado}
                  onChange={v => updateForm('solucao_curto_prazo_mercado', v)}
                  onAiSuggestion={v => updateForm('ai_solucao_curto_prazo_mercado', v)}
                  prompt={`Contexto da empresa: ${formData.empresa_contexto}. Com base no desafio: "${formData.descricao_desafio_mercado}" e nas causas: "${formData.causas_mercado}", proponha 2 soluções de curto prazo (≤3 meses). Para cada solução, dê: (a) descrição curta, (b) 3 passos para validação, (c) recursos mínimos e (d) risco principal.`}
                  rows={8}
                />
                <AIAssistantField
                  label="Soluções de Médio Prazo (3–12 meses)"
                  instruction="Proponha inovações de produto/serviço mais estruturais."
                  value={formData.solucao_medio_prazo_mercado}
                  onChange={v => updateForm('solucao_medio_prazo_mercado', v)}
                  onAiSuggestion={v => updateForm('ai_solucao_medio_prazo_mercado', v)}
                  prompt={`Contexto da empresa: ${formData.empresa_contexto}. Com base no desafio: "${formData.descricao_desafio_mercado}" e nas causas: "${formData.causas_mercado}", proponha 2 soluções de médio prazo (3-12 meses). Para cada solução, dê: (a) descrição curta, (b) 3 passos para validação, (c) recursos mínimos e (d) risco principal.`}
                  rows={8}
                />
              </>
            )}
          </div>
        );

      case 5:
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
                prompt={`Contexto da empresa: ${formData.empresa_contexto}. Com base em tudo que foi discutido (Problema: ${formData.descricao_problema_processo}, Soluções: ${formData.solucao_curto_prazo_processo}), escreva um pitch de 90 segundos seguindo este template: "Para solucionar [problema] propomos [ideia priorizada], cujo diferencial principal é [o borogodó]."`}
                rows={6}
              />
            ) : (
              <AIAssistantField
                label="Pitch de Mercado"
                instruction="Preencha o template com a sua melhor ideia."
                value={formData.pitch_mercado}
                onChange={v => updateForm('pitch_mercado', v)}
                onAiSuggestion={v => updateForm('ai_pitch_mercado', v)}
                prompt={`Contexto da empresa: ${formData.empresa_contexto}. Com base em tudo que foi discutido (Desafio: ${formData.descricao_desafio_mercado}, Soluções: ${formData.solucao_curto_prazo_mercado}), escreva um pitch de 90 segundos seguindo este template: "Para transformar [desafio] em resultado, propomos [ideia priorizada], cujo diferencial principal é [o borogodó]."`}
                rows={6}
              />
            )}
          </div>
        );

      case 6:
        const isProcess = formData.tipo_desafio === 'processos';
        const docContent = `
# Documento de Ideação: ${isProcess ? 'Inovação em Processos' : 'Inovação em Produtos/Mercado'}

**Contexto da Empresa:** ${formData.empresa_contexto}
**Equipe:** ${formData.equipe_nomes}
**Áreas:** ${formData.equipe_areas}

---

## 1. Foco no Problema
${isProcess ? formData.descricao_problema_processo : formData.descricao_desafio_mercado}

## 2. Análise de Causas
${isProcess ? formData.causas_processo : formData.causas_mercado}
${isProcess && formData.ai_causas_processo ? `\n> **Insights da IA:**\n> ${formData.ai_causas_processo.replace(/\n/g, '\n> ')}` : ''}
${!isProcess && formData.ai_causas_mercado ? `\n> **Insights da IA:**\n> ${formData.ai_causas_mercado.replace(/\n/g, '\n> ')}` : ''}

## 3. Soluções Propostas
### Curto Prazo
${isProcess ? formData.solucao_curto_prazo_processo : formData.solucao_curto_prazo_mercado}
${isProcess && formData.ai_solucao_curto_prazo_processo ? `\n> **Insights da IA:**\n> ${formData.ai_solucao_curto_prazo_processo.replace(/\n/g, '\n> ')}` : ''}
${!isProcess && formData.ai_solucao_curto_prazo_mercado ? `\n> **Insights da IA:**\n> ${formData.ai_solucao_curto_prazo_mercado.replace(/\n/g, '\n> ')}` : ''}

### Médio Prazo
${isProcess ? formData.solucao_medio_prazo_processo : formData.solucao_medio_prazo_mercado}
${isProcess && formData.ai_solucao_medio_prazo_processo ? `\n> **Insights da IA:**\n> ${formData.ai_solucao_medio_prazo_processo.replace(/\n/g, '\n> ')}` : ''}
${!isProcess && formData.ai_solucao_medio_prazo_mercado ? `\n> **Insights da IA:**\n> ${formData.ai_solucao_medio_prazo_mercado.replace(/\n/g, '\n> ')}` : ''}

## 4. O Pitch (A Proposta)
> ${isProcess ? formData.pitch_processo : formData.pitch_mercado}
${isProcess && formData.ai_pitch_processo ? `\n> **Insights da IA:**\n> ${formData.ai_pitch_processo.replace(/\n/g, '\n> ')}` : ''}
${!isProcess && formData.ai_pitch_mercado ? `\n> **Insights da IA:**\n> ${formData.ai_pitch_mercado.replace(/\n/g, '\n> ')}` : ''}
        `;

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Documento Final</h2>
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </button>
            </div>
            
            <div id="pdf-content" className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm prose prose-slate max-w-none">
              <div className="markdown-body">
                <ReactMarkdown>{docContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Lightbulb className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight text-slate-900">Idea Generator Wizard</span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Passo {currentStep} de {STEPS.length}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8 pb-32">
        
        {/* Sidebar Progress */}
        <div className="hidden md:block w-64 shrink-0">
          <nav className="sticky top-24">
            <ul className="space-y-1">
              {STEPS.map((step, index) => {
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

        {/* Mobile Progress Bar */}
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

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 md:p-10">
            {renderStepContent()}
          </div>
        </div>

      </main>

      {/* Fixed Bottom Navigation */}
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
          ) : (
            <div className="w-[104px]"></div> /* Placeholder to keep "Voltar" aligned left when there's no "Próximo" */
          )}
        </div>
      </div>
    </div>
  );
}

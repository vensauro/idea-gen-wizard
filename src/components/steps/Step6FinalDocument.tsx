import React from 'react';
import { Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import { useWizard } from '../../contexts/WizardContext';

export function Step6FinalDocument() {
  const { formData } = useWizard();

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

  const isProcess = formData.tipo_desafio === 'processos';
  
  const aiCausas = isProcess ? formData.ai_causas_processo : formData.ai_causas_mercado;
  const aiCurto = isProcess ? formData.ai_solucao_curto_prazo_processo : formData.ai_solucao_curto_prazo_mercado;
  const aiMedio = isProcess ? formData.ai_solucao_medio_prazo_processo : formData.ai_solucao_medio_prazo_mercado;
  const aiPitch = isProcess ? formData.ai_pitch_processo : formData.ai_pitch_mercado;
  
  const hasAnyAi = aiCausas || aiCurto || aiMedio || aiPitch;

  const docContent = `
# Documento de Ideação: ${isProcess ? 'Inovação em Processos' : 'Inovação em Produtos/Mercado'}

**Contexto da Empresa:** ${formData.empresa_contexto}
**Equipe:** ${formData.equipe_nomes}
**Áreas:** ${formData.equipe_areas}

---

## 1. Foco no Problema
${isProcess ? formData.descricao_problema_processo : formData.descricao_desafio_mercado}

## 2. Análise de Causas
**Hipóteses Iniciais:**
${isProcess ? formData.causas_processo : formData.causas_mercado}
${aiCausas ? `\n*[Ver Insights da IA no Apêndice](#anexo-1-insights-causas)*` : ''}

**🎯 Conclusão da Equipe:**
${isProcess ? formData.conclusao_causas_processo : formData.conclusao_causas_mercado}

## 3. Soluções Propostas
### Curto Prazo
**Ideias Iniciais:**
${isProcess ? formData.solucao_curto_prazo_processo : formData.solucao_curto_prazo_mercado}
${aiCurto ? `\n*[Ver Insights da IA no Apêndice](#anexo-2-insights-curto-prazo)*` : ''}

**🎯 Veredito da Equipe (Curto Prazo):**
${isProcess ? formData.conclusao_ideias_curto_processo : formData.conclusao_ideias_curto_mercado}

### Médio Prazo
**Ideias Iniciais:**
${isProcess ? formData.solucao_medio_prazo_processo : formData.solucao_medio_prazo_mercado}
${aiMedio ? `\n*[Ver Insights da IA no Apêndice](#anexo-3-insights-medio-prazo)*` : ''}

**🎯 Veredito da Equipe (Médio Prazo):**
${isProcess ? formData.conclusao_ideias_medio_processo : formData.conclusao_ideias_medio_mercado}

## 4. O Pitch (A Proposta)
> ${isProcess ? formData.pitch_processo : formData.pitch_mercado}
${aiPitch ? `\n*[Ver Insights da IA no Apêndice](#anexo-4-insights-pitch)*` : ''}

${hasAnyAi ? `
---

## Apêndice: Insights da IA

${aiCausas ? `### Anexo 1: Insights Causas\n${aiCausas}\n` : ''}
${aiCurto ? `### Anexo 2: Insights Curto Prazo\n${aiCurto}\n` : ''}
${aiMedio ? `### Anexo 3: Insights Medio Prazo\n${aiMedio}\n` : ''}
${aiPitch ? `### Anexo 4: Insights Pitch\n${aiPitch}\n` : ''}
` : ''}
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
          <ReactMarkdown rehypePlugins={[rehypeSlug]}>{docContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

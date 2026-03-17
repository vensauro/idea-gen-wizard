export type Track = 'processos' | 'mercado' | '';

export interface FormState {
  empresa_contexto: string;
  equipe_nomes: string;
  equipe_areas: string;
  tipo_desafio: Track;

  // Processos
  descricao_problema_processo: string;
  ai_descricao_problema_processo?: string;
  causas_processo: string;
  ai_causas_processo?: string;
  conclusao_causas_processo: string;
  solucao_curto_prazo_processo: string;
  ai_solucao_curto_prazo_processo?: string;
  conclusao_ideias_curto_processo: string;
  solucao_medio_prazo_processo: string;
  ai_solucao_medio_prazo_processo?: string;
  conclusao_ideias_medio_processo: string;
  pitch_processo: string;
  ai_pitch_processo?: string;

  // Mercado
  descricao_desafio_mercado: string;
  ai_descricao_desafio_mercado?: string;
  causas_mercado: string;
  ai_causas_mercado?: string;
  conclusao_causas_mercado: string;
  solucao_curto_prazo_mercado: string;
  ai_solucao_curto_prazo_mercado?: string;
  conclusao_ideias_curto_mercado: string;
  solucao_medio_prazo_mercado: string;
  ai_solucao_medio_prazo_mercado?: string;
  conclusao_ideias_medio_mercado: string;
  pitch_mercado: string;
  ai_pitch_mercado?: string;
}

export const initialState: FormState = {
  empresa_contexto: '',
  equipe_nomes: '',
  equipe_areas: '',
  tipo_desafio: '',

  descricao_problema_processo: '',
  causas_processo: '',
  conclusao_causas_processo: '',
  solucao_curto_prazo_processo: '',
  conclusao_ideias_curto_processo: '',
  solucao_medio_prazo_processo: '',
  conclusao_ideias_medio_processo: '',
  pitch_processo: 'Para solucionar [problema] propomos [ideia priorizada], cujo diferencial principal é [o borogodó].',

  descricao_desafio_mercado: '',
  causas_mercado: '',
  conclusao_causas_mercado: '',
  solucao_curto_prazo_mercado: '',
  conclusao_ideias_curto_mercado: '',
  solucao_medio_prazo_mercado: '',
  conclusao_ideias_medio_mercado: '',
  pitch_mercado: 'Para transformar [desafio] em resultado, propomos [ideia priorizada], cujo diferencial principal é [o borogodó].',
};

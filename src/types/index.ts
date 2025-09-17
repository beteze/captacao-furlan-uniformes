export interface UniformDetail {
  quantity: number;
  malhaType?: string;
  malhaDescription?: string;
  cutType?: string[];
}

export interface QuizData {
  colaboradores: number;
  segmento: string;
  segmentoOutro?: string;
  companyName?: string;
  distribution: { [key: string]: UniformDetail };
  customUniformTypes: string[];
  personalizacao: string;
  prazoEntrega?: string;
  elementoPersonalizado?: string;
  elementoPersonalizadoHelp?: boolean;
}
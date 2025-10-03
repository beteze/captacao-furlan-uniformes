import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';
import { UniformDetail } from '../types';

interface DistributionStepProps {
  totalUniforms: string;
  initialDistribution: { [key: string]: UniformDetail };
  initialCustomUniformTypes: string[];
  onDistributionChange: (distribution: { [key: string]: UniformDetail }) => void;
  onCustomUniformTypesChange: (customTypes: string[]) => void;
}

interface UniformProduct {
  id: string;
  name: string;
  bullets: string[];
  fabrics: string[];
}

const uniformProducts: UniformProduct[] = [
  {
    id: 'camisa-gola-redonda',
    name: 'Camisa Gola Redonda',
    bullets: [
      'Conforto e praticidade para o dia a dia',
      'Corte moderno e versátil',
      'Ideal para uniformes corporativos',
      'Disponível em diversas cores'
    ],
    fabrics: ['PV Premium', 'PV', 'Dry Fit Esportivo', 'PP', 'Dry Fit Poliamida']
  },
  {
    id: 'camisa-gola-v',
    name: 'Camisa Gola V',
    bullets: [
      'Design elegante com decote em V',
      'Valoriza o visual profissional',
      'Tecidos de alta qualidade',
      'Corte feminino e masculino'
    ],
    fabrics: ['PV Premium', 'PV', 'Dry Fit Esportivo', 'PP', 'Dry Fit Poliamida']
  },
  {
    id: 'camisa-gola-v-raglan',
    name: 'Camisa Gola V Manga Raglan',
    bullets: [
      'Manga raglan para maior mobilidade',
      'Conforto superior nos movimentos',
      'Design esportivo e moderno',
      'Ideal para atividades dinâmicas'
    ],
    fabrics: ['PV Premium', 'PV', 'Dry Fit Esportivo', 'PP']
  },
  {
    id: 'camisa-polo',
    name: 'Camisa Polo',
    bullets: [
      'Clássica e elegante',
      'Gola e punhos em ribana',
      'Versatilidade para diversos ambientes',
      'Qualidade premium garantida'
    ],
    fabrics: ['Piquet Supremo', 'PV Premium', 'PV', 'Dry Fit Supremo', 'PP']
  },
  {
    id: 'camisa-social-masculina',
    name: 'Camisa Social Masculina',
    bullets: [
      'Elegância para ambientes corporativos',
      'Corte social tradicional',
      'Tecidos nobres e duráveis',
      'Acabamento profissional'
    ],
    fabrics: ['Tricoline Ibiza', 'Tricoline Cannes', 'Tricoline Profit', 'Tricoline London', 'Tricoline Micro Vichy', 'Tricoline Confort Plus', 'Tricoline London Confort', 'Tricoline Importada']
  },
  {
    id: 'camisa-social-feminina',
    name: 'Camisa Social Feminina',
    bullets: [
      'Corte feminino valorizado',
      'Elegância e sofisticação',
      'Tecidos de alta qualidade',
      'Modelagem exclusiva'
    ],
    fabrics: ['Tricoline Ibiza', 'Tricoline Cannes', 'Tricoline Profit', 'Tricoline London', 'Tricoline Micro Vichy', 'Tricoline Confort Plus', 'Tricoline London Confort', 'Tricoline Importada']
  },
  {
    id: 'calca-social-feminina',
    name: 'Calça Social Feminina',
    bullets: [
      'Modelagem feminina exclusiva',
      'Tecido nobre e resistente',
      'Caimento perfeito',
      'Elegância profissional'
    ],
    fabrics: ['Prada']
  },
  {
    id: 'calca-social-masculina',
    name: 'Calça Social Masculina (Sport Fino)',
    bullets: [
      'Corte social masculino',
      'Resistência e durabilidade',
      'Tecidos de qualidade superior',
      'Acabamento refinado'
    ],
    fabrics: ['Prada', 'Brim Pesado']
  },
  {
    id: 'calca-elastico-cordao',
    name: 'Calça Elástico com Cordão',
    bullets: [
      'Máximo conforto e praticidade',
      'Ajuste perfeito com elástico',
      'Ideal para atividades operacionais',
      'Resistente ao uso intenso'
    ],
    fabrics: ['Brim pesado', 'Brim leve', 'Jeans', 'Jeans com elastano']
  },
  {
    id: 'jaleco-consultorio',
    name: 'Jaleco de Consultório',
    bullets: [
      'Elegância para área da saúde',
      'Tecidos antibacterianos',
      'Corte profissional',
      'Fácil manutenção'
    ],
    fabrics: ['Gabardine', 'Oxfordine', 'Oxford', 'Prada']
  },
  {
    id: 'jaleco-operacional-botao',
    name: 'Jaleco Operacional (Botão)',
    bullets: [
      'Resistência para área industrial',
      'Fechamento com botões',
      'Tecidos reforçados',
      'Proteção e durabilidade'
    ],
    fabrics: ['Brim pesado', 'Brim leve']
  },
  {
    id: 'jaleco-operacional-polo',
    name: 'Jaleco Operacional (Modelo Polo)',
    bullets: [
      'Design moderno tipo polo',
      'Conforto operacional',
      'Tecidos resistentes',
      'Praticidade no uso'
    ],
    fabrics: ['Brim leve', 'Brim pesado']
  },
  {
    id: 'blazer-feminino',
    name: 'Blazer Feminino Forrado',
    bullets: [
      'Elegância máxima feminina',
      'Forrado para melhor caimento',
      'Tecido nobre premium',
      'Acabamento sob medida'
    ],
    fabrics: ['Prada']
  },
  {
    id: 'colete-feminino',
    name: 'Colete Feminino com Zíper',
    bullets: [
      'Praticidade com zíper frontal',
      'Corte feminino moderno',
      'Versatilidade de uso',
      'Tecido de qualidade'
    ],
    fabrics: ['Prada']
  },
  {
    id: 'blusa-gola-drape',
    name: 'Blusa Gola Drape',
    bullets: [
      'Design sofisticado drapeado',
      'Tecido com elastano',
      'Conforto e elegância',
      'Modelagem exclusiva'
    ],
    fabrics: ['Crepe com elastano']
  },
  {
    id: 'blusa-gola-redonda',
    name: 'Blusa Gola Redonda',
    bullets: [
      'Clássica e versátil',
      'Tecido com elastano',
      'Conforto superior',
      'Corte feminino valorizado'
    ],
    fabrics: ['Crepe com elastano']
  },
  {
    id: 'guarda-po-operacional',
    name: 'Guarda-Pó Operacional',
    bullets: [
      'Proteção completa',
      'Resistência industrial',
      'Tecidos reforçados',
      'Praticidade operacional'
    ],
    fabrics: ['Brim leve', 'Brim pesado']
  }
];

export default function DistributionStep({
  totalUniforms,
  initialDistribution,
  initialCustomUniformTypes,
  onDistributionChange,
  onCustomUniformTypesChange
}: DistributionStepProps) {
  const [distribution, setDistribution] = useState<{ [key: string]: UniformDetail }>(initialDistribution);

  // Calcular totais
  const totalDistributed = Object.values(distribution).reduce((sum, detail) => sum + (detail?.quantity || 0), 0);
  
  // Converter faixa de funcionários para texto
  const getFuncionariosDisplay = () => {
    const ranges: { [key: string]: string } = {
      '10-49': '10 a 49',
      '50-100': '50 a 100',
      '101-300': '101 a 300',
      '301-500': '301 a 500',
      '501-1000': '501 a 1000',
      'mais-1000': 'Mais de 1000'
    };
    return ranges[totalUniforms] || totalUniforms;
  };

  // Determinar cor do status
  const getStatusColor = () => {
    if (totalDistributed > 0) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = () => {
    if (totalDistributed > 0) return <CheckCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const getStatusMessage = () => {
    if (totalDistributed > 0) return `${totalDistributed} uniformes selecionados para ${getFuncionariosDisplay()} funcionários`;
    return `Selecione os uniformes necessários para ${getFuncionariosDisplay()} funcionários`;
  };

  // Atualizar distribuição
  const updateDistribution = (productId: string, field: keyof UniformDetail, value: any) => {
    const currentDetail = distribution[productId] || { quantity: 0 };
    const newDistribution = {
      ...distribution,
      [productId]: {
        ...currentDetail,
        [field]: field === 'quantity' ? Math.max(0, value) : value
      }
    };
    setDistribution(newDistribution);
    onDistributionChange(newDistribution);
  };

  // Distribuir automaticamente
  const distributeAutomatically = () => {
    // Pegar apenas produtos com quantidade > 0
    const selectedProducts = Object.keys(distribution).filter(key => distribution[key]?.quantity > 0);
    
    if (selectedProducts.length === 0) {
      // Se nenhum produto selecionado, distribuir entre os 3 primeiros
      const defaultProducts = uniformProducts.slice(0, 3);
      const baseQuantity = 50; // Quantidade base para distribuição automática
      
      const newDistribution: { [key: string]: UniformDetail } = {};
      
      defaultProducts.forEach((product, index) => {
        newDistribution[product.id] = {
          quantity: baseQuantity,
          malhaType: product.fabrics[0]
        };
      });
      
      setDistribution(newDistribution);
      onDistributionChange(newDistribution);
    } else {
      // Distribuir entre produtos já selecionados
      const baseQuantity = 30;
      
      const newDistribution = { ...distribution };
      
      selectedProducts.forEach((productId, index) => {
        newDistribution[productId] = {
          ...newDistribution[productId],
          quantity: baseQuantity
        };
      });
      
      setDistribution(newDistribution);
      onDistributionChange(newDistribution);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Catálogo de Uniformes
        </h2>
        <p className="text-gray-600">
          Selecione os modelos e quantidades necessárias para sua empresa
        </p>
      </div>

      {/* Informational Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Nosso consultor especializado poderá auxiliar com detalhes técnicos, medidas e personalizações específicas.
        </p>
      </div>

      {/* Status Counter */}
      <div className={`p-4 rounded-lg border-2 ${getStatusColor()} transition-all duration-300`}>
        <div className="flex items-center justify-center space-x-3">
          {getStatusIcon()}
          <div className="text-center">
            <p className="font-semibold text-lg">
              Total distribuído: {totalDistributed} de {totalUniforms}
            </p>
            <p className="text-sm">
              {getStatusMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={distributeAutomatically}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <Zap className="w-4 h-4 mr-2" />
          Distribuir automaticamente
        </button>
      </div>

      {/* Upload de imagem atual */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Uniforme atual da empresa (opcional)
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Envie uma foto do uniforme atual para nosso consultor analisar
        </p>
        <input
          type="file"
          accept="image/*"
          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          placeholder="Selecionar arquivo..."
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniformProducts.map((product) => {
          const currentDetail = distribution[product.id] || { quantity: 0 };
          const hasQuantity = currentDetail.quantity > 0;

          return (
            <div key={product.id} className={`bg-white border-2 rounded-lg p-4 transition-all ${
              hasQuantity ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
            }`}>
              {/* Nome do produto */}
              <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">
                {product.name}
              </h3>

              {/* Bullets descritivos */}
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                {product.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* Campo Quantidade */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade *
                </label>
                <input
                  type="number"
                  value={currentDetail.quantity || ''}
                  onChange={(e) => updateDistribution(product.id, 'quantity', parseInt(e.target.value) || 0)}
                  placeholder="Mín. 10"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    currentDetail.quantity > 0 && currentDetail.quantity < 10 ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {currentDetail.quantity > 0 && currentDetail.quantity < 10 && (
                  <p className="text-red-600 text-xs mt-1">Quantidade mínima: 10 unidades</p>
                )}
              </div>

              {hasQuantity && (
                <>
                  {/* Dropdown Tecido */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tecido
                    </label>
                    <select
                      value={currentDetail.malhaType || ''}
                      onChange={(e) => updateDistribution(product.id, 'malhaType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o tecido</option>
                      <option value="preciso-ajuda">Preciso de ajuda para definir</option>
                      {product.fabrics.map(fabric => (
                        <option key={fabric} value={fabric}>
                          {fabric}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Se não tiver certeza, não selecione agora. A definição será feita com nosso consultor ao elaborar o orçamento.
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Aviso sobre consultor */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 text-center">
          💡 <strong>Dica:</strong> Nosso consultor especializado entrará em contato para ajudar com detalhes técnicos, medidas e personalizações específicas.
        </p>
      </div>
    </div>
  );
}
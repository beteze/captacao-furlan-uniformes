import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';
import { UniformDetail } from '../types';

interface DistributionStepProps {
  totalUniforms: number;
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
  image?: string;
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
    fabrics: ['PV Premium', 'PV', 'Dry Fit Esportivo', 'PP', 'Dry Fit Poliamida'],
    image: '/images/placeholder.png'
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
    fabrics: ['PV Premium', 'PV', 'Dry Fit Esportivo', 'PP', 'Dry Fit Poliamida'],
    image: '/images/placeholder.png'
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
    fabrics: ['PV Premium', 'PV', 'Dry Fit Esportivo', 'PP'],
    image: '/images/placeholder.png'
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
    fabrics: ['Piquet Supremo', 'PV Premium', 'PV', 'Dry Fit Supremo', 'PP'],
    image: '/images/placeholder.png'
  },
  {
    id: 'camisa-social-masculina',
    name: 'Camisa Social Masculina',
    bullets: [
      'Corte estruturado que valoriza a silhueta masculina',
      'Gola e punhos duplos e encorpados',
      'Ideal para personalização com bordados',
      'Elegância para ambientes corporativos'
    ],
    fabrics: ['Tricoline Ibiza', 'Tricoline Cannes', 'Tricoline Profit', 'Tricoline London', 'Tricoline Micro Vichy', 'Tricoline Confort Plus', 'Tricoline London Confort', 'Tricoline Importada'],
    image: '/images/placeholder.png'
  },
  {
    id: 'camisa-social-feminina',
    name: 'Camisa Social Feminina',
    bullets: [
      'Corte feminino que valoriza o caimento',
      'Gola e punhos delicados que mantêm a forma',
      'Conforto e elegância em longas jornadas',
      'Tecidos nobres e duráveis'
    ],
    fabrics: ['Tricoline Ibiza', 'Tricoline Cannes', 'Tricoline Profit', 'Tricoline London', 'Tricoline Micro Vichy', 'Tricoline Confort Plus', 'Tricoline London Confort', 'Tricoline Importada'],
    image: '/images/placeholder.png'
  },
  {
    id: 'calca-social-masculina',
    name: 'Calça Social Masculina (Sport Fino)',
    bullets: [
      'Corte alinhado que valoriza a silhueta masculina e garante conforto',
      'Bolso embutido discreto e funcional',
      'Tecido resistente, confortável e de fácil manutenção',
      'Estilo elegante ideal para ambientes corporativos'
    ],
    fabrics: ['Prada', 'Brim Pesado'],
    image: ''
  },
  {
    id: 'calca-social-feminina',
    name: 'Calça Social Feminina com Bolso Embutido e Friso na Perna',
    bullets: [
      'Corte feminino que valoriza a silhueta e garante conforto',
      'Friso na perna que confere aparência elegante e alinhada',
      'Bolso embutido discreto e funcional',
      'Tecido resistente, confortável e de fácil manutenção'
    ],
    fabrics: ['Prada'],
    image: ''
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
    fabrics: ['Brim pesado', 'Brim leve', 'Jeans', 'Jeans com elastano'],
    image: '/images/placeholder.png'
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
    fabrics: ['Gabardine', 'Oxfordine', 'Oxford', 'Prada'],
    image: '/images/placeholder.png'
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
    fabrics: ['Brim pesado', 'Brim leve'],
    image: '/images/placeholder.png'
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
    fabrics: ['Brim leve', 'Brim pesado'],
    image: '/images/placeholder.png'
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
    fabrics: ['Prada'],
    image: '/images/placeholder.png'
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
    fabrics: ['Prada'],
    image: '/images/placeholder.png'
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
    fabrics: ['Crepe com elastano'],
    image: '/images/placeholder.png'
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
    fabrics: ['Crepe com elastano'],
    image: '/images/placeholder.png'
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
    fabrics: ['Brim leve', 'Brim pesado'],
    image: '/images/placeholder.png'
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
  const [expandedBullets, setExpandedBullets] = useState<{ [key: string]: boolean }>({});

  // Calcular totais
  const totalDistributed = Object.values(distribution).reduce((sum, detail) => sum + (detail?.quantity || 0), 0);

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
    if (totalDistributed > 0) return `${totalDistributed} uniformes selecionados de ${totalUniforms} solicitados`;
    return `Selecione os uniformes necessários (total solicitado: ${totalUniforms})`;
  };

  const productsThatNeedGender = [
    'camisa-gola-redonda',
    'camisa-gola-v',
    'camisa-gola-v-raglan',
    'camisa-polo',
    'jaleco-consultorio',
    'jaleco-operacional-botao',
    'jaleco-operacional-polo',
    'guarda-po-operacional',
    'blusa-gola-drape',
    'blusa-gola-redonda',
    'calca-elastico-cordao'
  ];

  const shouldShowGenderField = (productId: string) => {
    return productsThatNeedGender.includes(productId);
  };

  const updateDistribution = (productId: string, field: keyof UniformDetail, value: any) => {
    const currentDetail = distribution[productId] || { quantity: 0 };
    const newDistribution = {
      ...distribution,
      [productId]: {
        ...currentDetail,
        [field]: field === 'quantity' ? Math.max(0, value) : value,
        gender: field === 'quantity' && value > 0 && !currentDetail.gender && shouldShowGenderField(productId)
          ? 'Unissex'
          : currentDetail.gender
      }
    };
    setDistribution(newDistribution);
    onDistributionChange(newDistribution);
  };

  return (
    <div className="space-y-6 px-4 sm:px-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Catálogo de Uniformes
        </h2>
        <p className="text-base text-gray-600">
          Informe abaixo a quantidade de cada modelo desejado.
        </p>
      </div>

      <div className="border-t mt-6 pt-6"></div>

      {/* Informational Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Nosso consultor especializado poderá auxiliar com detalhes técnicos, medidas e personalizações específicas.
        </p>
      </div>

      {/* Status Counter - Hidden on mobile, shown on desktop */}
      <div className={`hidden sm:block p-4 rounded-lg border-2 ${getStatusColor()} transition-all duration-300 mb-6`}>
        <div className="flex items-center justify-center space-x-3">
          {getStatusIcon()}
          <div className="text-center">
            <p className="text-lg font-semibold">
              Total distribuído: {totalDistributed} de {totalUniforms}
            </p>
            <p className="text-sm">
              {getStatusMessage()}
            </p>
          </div>
        </div>
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
          aria-label="Upload de imagem do uniforme atual da empresa"
          className="w-full px-4 py-2 text-base border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>

      {/* Products Grid - Add bottom margin for mobile fixed bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mb-32 sm:mb-6">
        {uniformProducts.map((product) => {
          const currentDetail = distribution[product.id] || { quantity: 0 };
          const hasQuantity = currentDetail.quantity > 0;

          return (
            <div
              key={product.id}
              id={`product-${product.id}`}
              data-product-id={product.id}
              data-product-category={product.id.split('-')[0]}
              data-has-image={product.image ? 'true' : 'false'}
              className={`uniform-product-card bg-white border-2 rounded-lg p-4 transition-all min-h-[360px] flex flex-col space-y-2 ${
              hasQuantity ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
            }`}>
              {/* Imagem do produto */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  data-product-id={product.id}
                  data-image-status="loaded"
                  className="product-image w-full h-32 object-cover rounded-md mb-3"
                />
              ) : (
                <div
                  role="img"
                  aria-label="Imagem do produto em breve"
                  className="product-image-placeholder w-full h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center"
                  data-product-id={product.id}
                >
                  <span className="text-gray-600 text-sm">Imagem em breve</span>
                </div>
              )}

              {/* Nome do produto */}
              <h3 className="product-name font-bold text-gray-900 text-lg leading-tight">
                {product.name}
              </h3>

              {/* Bullets descritivos */}
              <ul className="text-sm leading-snug text-gray-600 space-y-1">
                {product.bullets.slice(0, expandedBullets[product.id] ? product.bullets.length : 3).map((bullet, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {bullet}
                  </li>
                ))}
              </ul>
              {product.bullets.length > 3 && (
                <button
                  onClick={() => setExpandedBullets(prev => ({ ...prev, [product.id]: !prev[product.id] }))}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {expandedBullets[product.id] ? 'Ver menos' : `Ver mais detalhes (+${product.bullets.length - 3})`}
                </button>
              )}

              {/* Campo Quantidade */}
              <div className="product-quantity-section mt-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  value={currentDetail.quantity || ''}
                  onChange={(e) => updateDistribution(product.id, 'quantity', parseInt(e.target.value) || 0)}
                  placeholder="Mín. 10"
                  min="0"
                  aria-label={`Quantidade de ${product.name}`}
                  data-product-id={product.id}
                  className={`product-quantity-input w-full px-4 py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    currentDetail.quantity > 0 && currentDetail.quantity < 10 ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {currentDetail.quantity > 0 && currentDetail.quantity < 10 && (
                  <p className="text-sm text-red-600 mt-1">Quantidade mínima: 10 unidades</p>
                )}
              </div>

              {hasQuantity && (
                <div className="product-details" data-product-id={product.id}>
                  {shouldShowGenderField(product.id) && (
                    <div className="product-gender-section">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gênero
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                        {['Masculino', 'Feminino', 'Unissex'].map((genderOption) => (
                          <label key={genderOption} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`gender-${product.id}`}
                              value={genderOption}
                              checked={(currentDetail.gender || 'Unissex') === genderOption}
                              onChange={(e) => updateDistribution(product.id, 'gender', e.target.value as 'Masculino' | 'Feminino' | 'Unissex')}
                              className="w-4 h-4 accent-blue-600 focus:ring-blue-600 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-gray-700">{genderOption}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dropdown Tecido */}
                  <div className="product-fabric-section">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tecido
                    </label>
                    <select
                      value={currentDetail.malhaType || ''}
                      onChange={(e) => updateDistribution(product.id, 'malhaType', e.target.value)}
                      className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o tecido</option>
                      <option value="preciso-ajuda">Preciso de ajuda para definir</option>
                      {product.fabrics.map(fabric => (
                        <option key={fabric} value={fabric}>
                          {fabric}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Se não tiver certeza, não selecione agora. A definição será feita com nosso consultor ao elaborar o orçamento.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aviso sobre consultor */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 text-center">
          💡 <strong>Dica:</strong> Nosso consultor especializado entrará em contato para ajudar com detalhes técnicos, medidas e personalizações específicas.
        </p>
      </div>

      {/* Fixed Mobile Summary Bar */}
      <div className="fixed bottom-4 left-0 right-0 bg-white border-t shadow-lg p-4 sm:hidden z-20 safe-area-bottom">
        <div className="flex items-center justify-between text-sm font-medium">
          <div>
            <span className="text-gray-600">Total selecionado:</span>
            <strong className="text-blue-600 ml-2">{totalDistributed} unidades</strong>
          </div>
          <div className="text-xs text-gray-500">
            {totalUniforms > 0 && `de ${totalUniforms} solicitados`}
          </div>
        </div>
        {totalDistributed > 0 && (
          <div className="mt-2 text-xs text-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full ${
              totalDistributed >= totalUniforms * 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {totalDistributed >= totalUniforms * 0.8 ? '✓ Distribuição completa' : '⚠️ Continue distribuindo'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { UniformDetail } from '../types';

const DEFAULT_UNIFORM_DESCRIPTIONS = {
  'camisa-polo': 'Malha piquet 50% algodão, 50% poliéster, gramatura 200g.',
  'calca': 'Brim leve 100% algodão, resistente e confortável.',
  'jaleco': 'Gabardine 67% poliéster, 33% algodão, de fácil manutenção.',
  'outros': 'Malha fria poliéster, toque leve, ideal para uniformes promocionais.'
};

interface DistributionStepProps {
  totalUniforms: number;
  initialDistribution: { [key: string]: UniformDetail };
  initialCustomUniformTypes: string[];
  onDistributionChange: (distribution: { [key: string]: UniformDetail }) => void;
  onCustomUniformTypesChange: (customTypes: string[]) => void;
}

const defaultCategories = [
  { 
    id: 'camisa-polo', 
    name: 'Camisa Polo',
    imageUrl: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'
  },
  { 
    id: 'calca', 
    name: 'Calça',
    imageUrl: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'
  },
  { 
    id: 'jaleco', 
    name: 'Jaleco',
    imageUrl: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'
  },
  { 
    id: 'outros', 
    name: 'Outros',
    imageUrl: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'
  }
];

const malhaOptions = [
  { id: 'malha-fria', name: 'Malha Fria', description: 'Tecido leve e fresco' },
  { id: 'algodao-penteado', name: 'Algodão Penteado', description: 'Macio e resistente' },
  { id: 'dry-fit', name: 'Dry Fit', description: 'Tecnologia que absorve o suor' },
  { id: 'piquet', name: 'Piquet', description: 'Textura diferenciada' }
];

const cutOptions = [
  { id: 'feminino', name: 'Feminino' },
  { id: 'masculino', name: 'Masculino' },
  { id: 'unissex', name: 'Unissex' }
];

export default function DistributionStep({
  totalUniforms,
  initialDistribution,
  initialCustomUniformTypes,
  onDistributionChange,
  onCustomUniformTypesChange
}: DistributionStepProps) {
  const [distribution, setDistribution] = useState<{ [key: string]: UniformDetail }>(initialDistribution);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    // Inicializar com tipos que já têm distribuição
    return Object.keys(initialDistribution).filter(key => initialDistribution[key]?.quantity > 0);
  });
  const [isSelectionPhase, setIsSelectionPhase] = useState(() => {
    // Se já há tipos selecionados, pular a fase de seleção
    return Object.keys(initialDistribution).filter(key => initialDistribution[key]?.quantity > 0).length === 0;
  });

  // Calcular totais
  const totalDistributed = Object.values(distribution).reduce((sum, detail) => sum + (detail?.quantity || 0), 0);
  const remaining = totalUniforms - totalDistributed;
  const isExceeded = totalDistributed > totalUniforms;
  const isComplete = totalDistributed === totalUniforms;

  // Determinar cor do status
  const getStatusColor = () => {
    if (isExceeded) return 'text-red-600 bg-red-50 border-red-200';
    if (isComplete) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getStatusIcon = () => {
    if (isExceeded) return <AlertCircle className="w-5 h-5" />;
    if (isComplete) return <CheckCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const getStatusMessage = () => {
    if (isExceeded) return `Excesso de ${totalDistributed - totalUniforms} uniformes`;
    if (isComplete) return 'Distribuição completa!';
    return `Restam ${remaining} uniformes para distribuir`;
  };

  // Atualizar distribuição
  const updateDistribution = (categoryId: string, field: keyof UniformDetail, value: any) => {
    const currentDetail = distribution[categoryId] || { quantity: 0 };
    const newDistribution = {
      ...distribution,
      [categoryId]: {
        ...currentDetail,
        [field]: field === 'quantity' ? Math.max(0, value) : value
      }
    };
    setDistribution(newDistribution);
    onDistributionChange(newDistribution);
  };

  // Selecionar/deselecionar tipo de uniforme
  const toggleTypeSelection = (typeId: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  // Continuar para fase de quantidade
  const proceedToQuantityPhase = () => {
    if (selectedTypes.length > 0) {
      setIsSelectionPhase(false);
      // Inicializar distribuição para tipos selecionados
      const newDistribution: { [key: string]: UniformDetail } = {};
      selectedTypes.forEach(typeId => {
        newDistribution[typeId] = distribution[typeId] || { 
          quantity: 0,
          malhaDescription: DEFAULT_UNIFORM_DESCRIPTIONS[typeId as keyof typeof DEFAULT_UNIFORM_DESCRIPTIONS] || ''
        };
      });
      setDistribution(newDistribution);
      onDistributionChange(newDistribution);
    }
  };

  // Distribuir automaticamente
  const distributeAutomatically = () => {
    const perCategory = Math.floor(totalUniforms / selectedTypes.length);
    const remainder = totalUniforms % selectedTypes.length;
    
    const newDistribution: { [key: string]: UniformDetail } = {};
    
    selectedTypes.forEach((categoryId, index) => {
      newDistribution[categoryId] = {
        quantity: perCategory + (index < remainder ? 1 : 0),
        malhaDescription: DEFAULT_UNIFORM_DESCRIPTIONS[categoryId as keyof typeof DEFAULT_UNIFORM_DESCRIPTIONS] || ''
      };
    });
    
    setDistribution(newDistribution);
    onDistributionChange(newDistribution);
  };


  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isSelectionPhase ? 'Selecione os tipos de uniformes' : 'Distribuição de Uniformes'}
        </h2>
        <p className="text-gray-600">
          {isSelectionPhase 
            ? 'Escolha quais tipos de uniformes sua empresa precisa'
            : `Distribua os ${totalUniforms} uniformes entre os tipos selecionados`
          }
        </p>
      </div>

      {isSelectionPhase ? (
        <>
          {/* Fase de Seleção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleTypeSelection(category.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedTypes.includes(category.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <div className="flex items-center mt-2">
                      <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                        selectedTypes.includes(category.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedTypes.includes(category.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedTypes.includes(category.id) ? 'Selecionado' : 'Selecionar'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Botão Continuar */}
          <div className="flex justify-center">
            <button
              onClick={proceedToQuantityPhase}
              disabled={selectedTypes.length === 0}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                selectedTypes.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continuar ({selectedTypes.length} tipo{selectedTypes.length !== 1 ? 's' : ''} selecionado{selectedTypes.length !== 1 ? 's' : ''})
            </button>
          </div>
        </>
      ) : (
        <>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={distributeAutomatically}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Distribuir automaticamente
            </button>
            
            <button
              onClick={() => setIsSelectionPhase(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Alterar seleção
            </button>
          </div>

          {/* Distribution Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTypes.map((typeId) => {
              const category = defaultCategories.find(c => c.id === typeId);
              if (!category) return null;
              
              return (
                <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateDistribution(category.id, 'quantity', (distribution[category.id]?.quantity || 0) - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      disabled={(distribution[category.id]?.quantity || 0) <= 0}
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    
                    <input
                      type="number"
                      value={distribution[category.id]?.quantity || 0}
                      onChange={(e) => updateDistribution(category.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="flex-1 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                    
                    <button
                      onClick={() => updateDistribution(category.id, 'quantity', (distribution[category.id]?.quantity || 0) + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                  
                  {/* Campos adicionais opcionais */}
                  {(distribution[category.id]?.quantity || 0) > 0 && (
                    <div className="mt-4 space-y-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-2">
                        Esses detalhes podem ser definidos depois com o atendente
                      </p>
                      
                      {/* Tipo de malha */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de malha
                        </label>
                        <select
                          value={distribution[category.id]?.malhaType || ''}
                          onChange={(e) => updateDistribution(category.id, 'malhaType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione o tipo de malha</option>
                          {malhaOptions.map(option => (
                            <option key={option.id} value={option.id}>
                              {option.name} - {option.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Descrição da malha (somente leitura) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição da malha
                        </label>
                        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600">
                          {distribution[category.id]?.malhaDescription || 'Descrição será preenchida automaticamente'}
                        </div>
                      </div>

                      {/* Tipo de corte */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de corte
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {cutOptions.map(option => (
                            <label key={option.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={distribution[category.id]?.cutType?.includes(option.id) || false}
                                onChange={(e) => {
                                  const currentCuts = distribution[category.id]?.cutType || [];
                                  const newCuts = e.target.checked
                                    ? [...currentCuts, option.id]
                                    : currentCuts.filter(cut => cut !== option.id);
                                  updateDistribution(category.id, 'cutType', newCuts);
                                }}
                                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{option.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
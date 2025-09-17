import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building, Palette, Clock, Upload } from 'lucide-react';
import { QuizData } from '../types';
import DistributionStep from './DistributionStep';
import HelpButton from './HelpButton';
import HelpModal from './HelpModal';

interface QuizProps {
  onComplete: (data: QuizData) => void;
  quizData: Partial<QuizData>;
  onQuizDataChange: (updates: Partial<QuizData>) => void;
  onBack: () => void;
  onDisqualified: () => void;
  onStepChange: (step: number) => void;
  cnpj: string;
  email: string;
  companyName: string;
  onCnpjChange: (cnpj: string) => void;
  onEmailChange: (email: string) => void;
  onCompanyNameChange: (companyName: string) => void;
}

const Quiz: React.FC<QuizProps> = ({
  onComplete,
  quizData,
  onQuizDataChange,
  onBack,
  onDisqualified,
  onStepChange,
  cnpj,
  email,
  companyName,
  onCnpjChange,
  onEmailChange,
  onCompanyNameChange
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const formatCNPJ = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara 00.000.000/0000-00
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    onCnpjChange(formatted);
  };

  const handleOpenHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const handleCloseHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange(nextStep);
    } else {
      // Etapa final - completar quiz
      onComplete(quizData as QuizData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange(prevStep);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return cnpj.trim() && email.trim() && quizData.segmento && quizData.colaboradores && quizData.colaboradores > 0;
      case 2:
        const totalDistributed = Object.values(quizData.distribution || {}).reduce((sum, detail) => sum + (detail?.quantity || 0), 0);
        return totalDistributed === quizData.colaboradores;
      case 3:
        if (!quizData.personalizacao || !quizData.personalizacao.trim()) return false;
        
        // Se escolheu bordado ou silk, precisa ter elemento personalizado OU marcar a opção de ajuda
        if (quizData.personalizacao === 'bordado' || quizData.personalizacao === 'silk') {
          return (quizData.elementoPersonalizado && quizData.elementoPersonalizado.trim()) || quizData.elementoPersonalizadoHelp;
        }
        
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="relative space-y-6">
            {/* Botão de ajuda no canto superior direito */}
            <div className="absolute top-0 right-0">
              <HelpButton onClick={handleOpenHelpModal} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dados da Empresa</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu nome
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => onCompanyNameChange(e.target.value)}
                  placeholder="Nome do responsável"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="contato@empresa.com"
                  maxLength={254}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segmento *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'transportadora', name: 'Transportadora' },
                    { id: 'centro-distribuicao', name: 'Centro de Distribuição' },
                    { id: 'industria', name: 'Indústria' },
                    { id: 'construcao-civil', name: 'Construção Civil' },
                    { id: 'contabilidade', name: 'Contabilidade' },
                    { id: 'outro', name: 'Outro' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => onQuizDataChange({ segmento: option.id })}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        quizData.segmento === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{option.name}</span>
                    </button>
                  ))}
                </div>
                
                {quizData.segmento === 'outro' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Qual segmento?"
                      value={quizData.segmentoOutro || ''}
                      onChange={(e) => onQuizDataChange({ segmentoOutro: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade total de uniformes necessários *
                </label>
                <input
                  type="number"
                  value={quizData.colaboradores || ''}
                  onChange={(e) => onQuizDataChange({ colaboradores: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 150"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Informe o número total de peças de uniforme que sua empresa precisa
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="relative">
            {/* Botão de ajuda no canto superior direito */}
            <div className="absolute top-0 right-0 z-10">
              <HelpButton onClick={handleOpenHelpModal} />
            </div>
            
            <DistributionStep
              totalUniforms={quizData.colaboradores || 0}
              initialDistribution={quizData.distribution || {}}
              initialCustomUniformTypes={quizData.customUniformTypes || []}
              onDistributionChange={(distribution) => onQuizDataChange({ distribution })}
              onCustomUniformTypesChange={(customUniformTypes) => onQuizDataChange({ customUniformTypes })}
            />
          </div>
        );

      case 3:
        return (
          <div className="relative space-y-6">
            {/* Botão de ajuda no canto superior direito */}
            <div className="absolute top-0 right-0">
              <HelpButton onClick={handleOpenHelpModal} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Palette className="w-6 h-6 mr-3 text-blue-900" />
              Detalhes do Pedido
            </h2>
            
            <div className="space-y-6">
              {/* Personalização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de personalização *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'sem', name: 'Sem personalização', desc: 'Uniformes sem logo ou bordado' },
                    { id: 'bordado', name: 'Bordado', desc: 'Mais durável e elegante' },
                    { id: 'silk', name: 'Silk Screen', desc: 'Econômico para designs grandes' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => onQuizDataChange({ personalizacao: option.id })}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        quizData.personalizacao === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Elemento Personalizado - apenas se bordado ou silk */}
              {(quizData.personalizacao === 'bordado' || quizData.personalizacao === 'silk') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Elemento personalizado
                  </label>
                  <div className="flex items-center space-x-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={quizData.elementoPersonalizado || ''}
                      onChange={(e) => onQuizDataChange({ elementoPersonalizado: e.target.value })}
                      placeholder="Descreva seu logotipo, desenho, frase, etc."
                      disabled={quizData.elementoPersonalizadoHelp}
                      className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        quizData.elementoPersonalizadoHelp ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Descreva o elemento que deseja personalizar nos uniformes
                  </p>
                  
                  {/* Opção de ajuda */}
                  <div className="mt-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={quizData.elementoPersonalizadoHelp || false}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          onQuizDataChange({ 
                            elementoPersonalizadoHelp: isChecked,
                            elementoPersonalizado: isChecked ? '' : quizData.elementoPersonalizado
                          });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Ainda não tenho certeza, preciso de ajuda nisso
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Prazo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prazo ideal de entrega
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={quizData.prazoEntrega || ''}
                    onChange={(e) => onQuizDataChange({ prazoEntrega: e.target.value })}
                    placeholder="30"
                    min="1"
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-700 font-medium">dias úteis</span>
                </div>
                <p className="text-sm text-orange-600 mt-2 font-medium">
                  ⚠️ O orçamento pode variar conforme o prazo.
                </p>
              </div>

              {/* Informações sobre prazos */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Prazos padrão da empresa:
                </h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• 30 dias úteis (pedidos urgentes)</li>
                  <li>• 35 dias úteis (prazo padrão recomendado)</li>
                  <li>• 45 dias úteis (pedidos com maior volume)</li>
                </ul>
                <p className="text-blue-700 text-sm mt-2">
                  Todos os prazos incluem confecção e personalização completa
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderStep()}
          
          {/* Navegação */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t gap-3">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-all ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 3 ? 'Fazer pedido de orçamento' : 'Próximo'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
        
        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={handleCloseHelpModal}
          currentView="dados"
          currentStep={currentStep}
          quizData={quizData}
          cnpj={cnpj}
          email={email}
          companyName={companyName}
        />
      </div>
    </div>
  );
};

export default Quiz;
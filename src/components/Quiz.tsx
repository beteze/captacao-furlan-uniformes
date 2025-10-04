import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building, Palette, Clock, Upload, X, ChevronDown, Check } from 'lucide-react';
import { QuizData } from '../types';
import DistributionStep from './DistributionStep';
import HelpButton from './HelpButton';
import HelpModal from './HelpModal';

interface QuizProps {
  onComplete: (data: QuizData) => void;
  quizData: Partial<QuizData>;
  onQuizDataChange: (updates: Partial<QuizData>) => void;
  onBack: () => void;
  onStepChange: (step: number) => void;
  onDisqualified: () => void;
  cnpj: string;
  email: string;
  companyName: string;
  onCnpjChange: (cnpj: string) => void;
  onEmailChange: (email: string) => void;
  onCompanyNameChange: (companyName: string) => void;
  onBackToLanding: () => void;
}

const Quiz: React.FC<QuizProps> = ({
  onComplete,
  quizData,
  onQuizDataChange,
  onBack,
  onStepChange,
  onDisqualified,
  cnpj,
  email,
  companyName,
  onCnpjChange,
  onEmailChange,
  onCompanyNameChange,
  onBackToLanding
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [colaboradoresError, setColaboradoresError] = useState<string>('');
  const [quantidadeUniformesError, setQuantidadeUniformesError] = useState<string>('');

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

  const handleEmailChange = (value: string) => {
    onEmailChange(value);

    // Validação de e-mail com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === '') {
      setEmailError('');
    } else if (!emailRegex.test(value)) {
      setEmailError('Por favor, insira um e-mail válido');
    } else {
      setEmailError('');
    }
  };

  const handleColaboradoresChange = (value: string) => {
    onQuizDataChange({ colaboradores: value });
    setColaboradoresError('');
  };

  const handleQuantidadeUniformesChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onQuizDataChange({ quantidadeUniformes: numValue });

    if (value.trim() === '' || numValue === 0) {
      setQuantidadeUniformesError('');
    } else if (numValue < 10) {
      setQuantidadeUniformesError('A quantidade mínima é de 10 uniformes');
    } else {
      setQuantidadeUniformesError('');
    }
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
      case 1: {
        // Validar CNPJ (14 dígitos)
        const cnpjDigits = cnpj.replace(/\D/g, '');
        const cnpjValid = cnpjDigits.length === 14;

        // Validar Segmento "Outro"
        const segmentoValid = quizData.segmento && quizData.segmento.trim() !== '' &&
                               (quizData.segmento !== 'outro' || (quizData.segmentoOutro && quizData.segmentoOutro.trim() !== ''));

        return cnpjValid &&
               email.trim() !== '' &&
               !emailError &&
               segmentoValid &&
               quizData.colaboradores &&
               quizData.colaboradores.trim() !== '' &&
               quizData.quantidadeUniformes &&
               quizData.quantidadeUniformes >= 10 &&
               !quantidadeUniformesError;
      }
      case 2: {
        // Validar que todos os produtos selecionados tenham pelo menos 10 unidades
        const distribution = quizData.distribution || {};
        const selectedProducts = Object.values(distribution).filter(detail => detail && detail.quantity > 0);

        // Deve ter pelo menos um produto selecionado
        if (selectedProducts.length === 0) return false;

        // Todos os produtos selecionados devem ter quantidade >= 10
        const allProductsValid = selectedProducts.every(detail => detail.quantity >= 10);
        return allProductsValid;
      }
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
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Solicitação de Orçamento</h2>
              <p className="text-base text-gray-600">
                Use os dados da sua empresa para gerar uma proposta personalizada sob medida
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Dados da Empresa</h2>
              <HelpButton onClick={handleOpenHelpModal} />
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  aria-label="CNPJ da empresa"
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu nome
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => onCompanyNameChange(e.target.value)}
                  placeholder="Nome do responsável"
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="contato@empresa.com"
                  maxLength={254}
                  aria-label="E-mail de contato"
                  className={`w-full px-4 py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6"></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className={`p-3 border-2 rounded-lg text-left transition-all flex items-center justify-between ${
                        quizData.segmento === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{option.name}</span>
                      {quizData.segmento === option.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
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
                      className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6"></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade de funcionários da empresa *
                </label>
                <div className="relative">
                  <select
                    value={quizData.colaboradores || ''}
                    onChange={(e) => handleColaboradoresChange(e.target.value)}
                    aria-label="Quantidade de funcionários da empresa"
                    className={`w-full px-4 py-2 text-base border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      colaboradoresError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione a quantidade de funcionários</option>
                    <option value="10-49">10 a 49 funcionários</option>
                    <option value="50-100">50 a 100 funcionários</option>
                    <option value="101-300">101 a 300 funcionários</option>
                    <option value="301-500">301 a 500 funcionários</option>
                    <option value="501-1000">501 a 1000 funcionários</option>
                    <option value="mais-1000">Mais de 1000 funcionários</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {colaboradoresError && (
                  <p className="text-red-600 text-sm mt-1">{colaboradoresError}</p>
                )}
                <p className="text-sm text-gray-600 leading-snug mt-1">
                  Selecione a faixa que melhor representa o número de funcionários da sua empresa
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade de uniformes *
                </label>
                <input
                  type="number"
                  value={quizData.quantidadeUniformes || ''}
                  onChange={(e) => handleQuantidadeUniformesChange(e.target.value)}
                  placeholder="Mínimo 10 unidades"
                  min="10"
                  aria-label="Quantidade total de uniformes"
                  className={`w-full px-4 py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    quantidadeUniformesError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {quantidadeUniformesError && (
                  <p className="text-red-600 text-sm mt-1">{quantidadeUniformesError}</p>
                )}
                <p className="text-sm text-gray-600 leading-snug mt-1">
                  Informe a quantidade total de uniformes que deseja solicitar (mínimo 10)
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div id="quizStep2Loaded" data-quiz-step="distribution">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Distribuição de Uniformes</h2>
              <HelpButton onClick={handleOpenHelpModal} />
            </div>

            <DistributionStep
              totalUniforms={quizData.quantidadeUniformes || 0}
              initialDistribution={quizData.distribution || {}}
              initialCustomUniformTypes={quizData.customUniformTypes || []}
              onDistributionChange={(distribution) => onQuizDataChange({ distribution })}
              onCustomUniformTypesChange={(customUniformTypes) => onQuizDataChange({ customUniformTypes })}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Palette className="w-6 h-6 mr-3 text-blue-900" />
                Detalhes do Pedido
              </h2>
              <HelpButton onClick={handleOpenHelpModal} />
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de personalização *
                </label>
                <p className="text-sm text-gray-600 leading-snug mb-3">
                  Escolha como deseja personalizar seus uniformes. Suas escolhas serão refletidas no orçamento final.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'sem', name: 'Sem personalização', desc: 'Uniformes sem logo ou bordado' },
                    { id: 'bordado', name: 'Bordado', desc: 'Mais durável e elegante' },
                    { id: 'silk', name: 'Silk Screen', desc: 'Econômico para designs grandes' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => onQuizDataChange({ personalizacao: option.id })}
                      className={`p-4 border-2 rounded-lg text-left transition-all hover:border-blue-500 focus:ring-blue-600 relative ${
                        quizData.personalizacao === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                        </div>
                        {quizData.personalizacao === option.id && (
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {(quizData.personalizacao === 'bordado' || quizData.personalizacao === 'silk') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className={`flex-1 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        quizData.elementoPersonalizadoHelp ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-600 leading-snug mt-1">
                    Descreva o elemento que deseja personalizar nos uniformes
                  </p>
                  
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo ideal de entrega
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={quizData.prazoEntrega || ''}
                    onChange={(e) => onQuizDataChange({ prazoEntrega: e.target.value })}
                    placeholder="30"
                    min="1"
                    aria-label="Prazo ideal de entrega em dias úteis"
                    className="max-w-[120px] px-4 py-2 text-center text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-700 font-medium">dias úteis</span>
                </div>
                <p className="text-sm text-gray-500 leading-snug mt-1">
                  Use um dos prazos sugeridos abaixo para evitar alterações no orçamento.
                </p>
                <p className="text-sm text-orange-600 mt-2 font-medium">
                  ⚠️ O orçamento pode variar conforme o prazo.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-6">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-md sm:max-w-6xl mx-auto">
        {/* Botão Fechar - Oculto no mobile */}
        <div className="hidden sm:flex justify-end mb-4">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Fechar e voltar ao início"
          >
            <X className="w-5 h-5 mr-2" />
            Fechar
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 flex flex-col min-h-[calc(100vh-8rem)] pb-32 sm:pb-0 mb-4 sm:mb-0">
          <div className="flex-grow">
            {renderStep()}
          </div>
          
          <div className="fixed bottom-4 left-4 right-4 sm:static sm:mt-8 sm:pt-6 sm:border-t bg-white sm:bg-transparent p-4 sm:p-0 shadow-lg sm:shadow-none rounded-lg sm:rounded-none z-10 safe-area-bottom">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
              <button
                onClick={handleBack}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </button>

              <div className="w-full sm:w-auto">
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-md font-semibold shadow-sm transition-all ${
                    canProceed()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentStep === 3 ? 'Fazer pedido de orçamento' : 'Próximo'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <span className="text-xs text-gray-600 mt-1 block text-center sm:text-right">
                  Suas escolhas serão refletidas no orçamento final
                </span>
              </div>
            </div>
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
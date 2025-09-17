import React from 'react';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, User, Building, Clock, Palette, Mail, FileText, ArrowRight } from 'lucide-react';
import HelpButton from './HelpButton';
import HelpModal from './HelpModal';
import { QuizData } from '../types';

interface OrcamentoPageProps {
  quizData: QuizData;
  cnpj: string;
  email: string;
  companyName: string;
  onBackToLanding: () => void;
  onBack: () => void;
  isReview: boolean;
  onReviewComplete?: () => void;
  onStartNewQuiz: () => void;
  setIsQuoteFinalized: (value: boolean) => void;
  hasSavedQuotes?: boolean;
  onViewSavedQuotes?: () => void;
}

export default function OrcamentoPage({ 
  quizData, 
  cnpj, 
  email, 
  companyName,
  onBackToLanding, 
  onBack,
  isReview,
  onReviewComplete,
  onStartNewQuiz,
  setIsQuoteFinalized,
  hasSavedQuotes = false,
  onViewSavedQuotes
}: OrcamentoPageProps) {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleOpenHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const handleCloseHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  const handleQuoteFinalization = () => {
    setIsQuoteFinalized(true);
  };
  const getSegmentoDisplay = () => {
    if (quizData.segmento === 'outro' && quizData.segmentoOutro) {
      return `Outro (${quizData.segmentoOutro})`;
    }
    const segmentos: { [key: string]: string } = {
      'transportadora': 'Transportadora',
      'centro-distribuicao': 'Centro de Distribuição',
      'industria': 'Indústria',
      'construcao-civil': 'Construção Civil',
      'contabilidade': 'Contabilidade',
      'outro': 'Outro'
    };
    return segmentos[quizData.segmento] || quizData.segmento;
  };

  const getPersonalizacaoDisplay = () => {
    const personalizacoes: { [key: string]: string } = {
      'sem': 'Sem personalização',
      'bordado': 'Bordado',
      'silk': 'Silk Screen'
    };
    return personalizacoes[quizData.personalizacao] || quizData.personalizacao;
  };

  const formatUniformType = (type: string) => {
    const types: { [key: string]: string } = {
      'camisa-polo': 'Camisa Polo',
      'calca': 'Calça',
      'jaleco': 'Jaleco',
      'outros': 'Outros'
    };
    return types[type] || type;
  };

  const generateWhatsAppMessage = () => {
    let message = `💼 SOLICITAÇÃO DE ORÇAMENTO - FURLAN UNIFORMES\n\n`;
    
    message += `🏢 DADOS DA EMPRESA:\n`;
    message += `• CNPJ: ${cnpj}\n`;
    if (companyName) {
      message += `• Nome: ${companyName}\n`;
    }
    message += `• E-mail: ${email}\n`;
    message += `• Segmento: ${getSegmentoDisplay()}\n`;
    
    const hasDistribution = quizData.distribution && Object.values(quizData.distribution).some(detail => detail?.quantity > 0);
    if (hasDistribution) {
      message += `\n👕 DISTRIBUIÇÃO DOS UNIFORMES:\n`;
      Object.entries(quizData.distribution || {})
        .filter(([_, detail]) => detail?.quantity > 0)
        .forEach(([type, detail]) => {
          message += `• ${formatUniformType(type)}: ${detail.quantity} unidades\n`;
          if (detail.malhaType) {
            const malhaOption = [
              { id: 'malha-fria', name: 'Malha Fria' },
              { id: 'algodao-penteado', name: 'Algodão Penteado' },
              { id: 'dry-fit', name: 'Dry Fit' },
              { id: 'piquet', name: 'Piquet' }
            ].find(opt => opt.id === detail.malhaType);
            message += `  - Malha: ${malhaOption?.name || detail.malhaType}\n`;
          }
          if (detail.malhaDescription) {
            message += `  - Descrição: ${detail.malhaDescription}\n`;
          }
          if (detail.cutType && detail.cutType.length > 0) {
            const cutNames = detail.cutType.map(cut => {
              const cutOption = [
                { id: 'feminino', name: 'Feminino' },
                { id: 'masculino', name: 'Masculino' },
                { id: 'unissex', name: 'Unissex' }
              ].find(opt => opt.id === cut);
              return cutOption?.name || cut;
            }).join(', ');
            message += `  - Corte: ${cutNames}\n`;
          }
        });
    }
    
    message += `\n🎨 DETALHES DO PEDIDO:\n`;
    message += `• Personalização: ${getPersonalizacaoDisplay()}\n`;
    if (quizData.elementoPersonalizado) {
      message += `• Elemento personalizado: ${quizData.elementoPersonalizado}\n`;
    } else if (quizData.elementoPersonalizadoHelp) {
      message += `• Elemento personalizado: Precisa de ajuda para definir\n`;
    }
    if (quizData.prazoEntrega) {
      message += `• Prazo desejado: ${quizData.prazoEntrega} dias úteis\n`;
    }
    
    message += `\n📊 RESUMO:\n`;
    message += `• Total de peças no pedido: ${quizData.colaboradores}\n`;
    message += `• Prazo padrão: 35 dias úteis\n`;
    
    message += `\n➡️ PRÓXIMOS PASSOS:\n`;
    message += `Aguardo retorno com:\n`;
    message += `• Orçamento detalhado\n`;
    message += `• Detalhes da personalização\n`;
    message += `• Confirmação de prazo\n`;
    message += `• Condições de pagamento\n\n`;
    
    message += `🙏 Obrigado pela atenção! 🙏`;
    
    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/5519990040666?text=${generateWhatsAppMessage()}`;
  const whatsappUrl = `https://tintim.link/whatsapp/50e910d9-fdf1-4e71-86db-aa6f9701e2cb/bf4c6f7d-8dcc-4a76-af54-1ed4f79becfe?text=${generateWhatsAppMessage()}`;
  const emailSubject = encodeURIComponent('Solicitação de Orçamento - Uniformes Corporativos');
  const emailBody = encodeURIComponent(generateWhatsAppMessage().replace(/\n/g, '\r\n'));
  const emailUrl = `mailto:comercial@furlanunifromes.com.br?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar ao pedido
          </button>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <h1 className="text-3xl font-bold text-gray-900">
              {isReview ? 'Revisão do seu Orçamento' : 'Resumo do seu Orçamento'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isReview ? 'Confira todos os detalhes antes de continuar' : 'Confira todos os detalhes antes de finalizar'}
            </p>
            <div className="flex gap-3">
              <HelpButton onClick={handleOpenHelpModal} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Resumo Detalhado */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados da Empresa */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="mr-2 w-5 h-5 text-blue-900" />
                Dados da Empresa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <p className="text-gray-900 font-mono">{cnpj}</p>
                </div>
                {companyName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                    <p className="text-gray-900">{companyName}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <p className="text-gray-900">{email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
                  <p className="text-gray-900">
                    {getSegmentoDisplay()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Total</label>
                  <p className="text-gray-900 font-semibold">{quizData.colaboradores} uniformes</p>
                </div>
                {quizData.distribution && Object.values(quizData.distribution).some(detail => detail?.quantity > 0) && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distribuição</label>
                    <div className="text-gray-900">
                      {Object.entries(quizData.distribution || {})
                        .filter(([_, detail]) => detail?.quantity > 0)
                        .map(([type, detail]) => (
                          <span key={type} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-1">
                            {formatUniformType(type)}: {detail.quantity}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes do Pedido */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="mr-2 w-5 h-5 text-blue-900" />
                Detalhes do Pedido
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Personalização</h3>
                  <p className="text-gray-700">
                    {getPersonalizacaoDisplay()}
                  </p>
                </div>
                
                {quizData.elementoPersonalizado && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Elemento Personalizado</h3>
                    <p className="text-gray-700">{quizData.elementoPersonalizado}</p>
                  </div>
                )}
                
                {quizData.prazoEntrega && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Prazo Desejado</h3>
                    <p className="text-gray-700">{quizData.prazoEntrega} dias úteis</p>
                  </div>
                )}
                
                {quizData.distribution && Object.values(quizData.distribution).some(detail => detail?.quantity > 0) && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Distribuição dos Uniformes</h3>
                    <div className="space-y-1">
                      {Object.entries(quizData.distribution || {})
                        .filter(([_, detail]) => detail?.quantity > 0)
                        .map(([type, detail]) => (
                          <div key={type} className="border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                            <div className="flex justify-between">
                              <span className="text-gray-700">{formatUniformType(type)}:</span>
                              <span className="font-medium">{detail.quantity} unidades</span>
                            </div>
                            {(detail.malhaType || detail.malhaDescription || (detail.cutType && detail.cutType.length > 0)) && (
                              <div className="mt-1 text-xs text-gray-600 space-y-1">
                                {detail.malhaType && (
                                  <div>
                                    • Malha: {(() => {
                                      const malhaOption = [
                                        { id: 'malha-fria', name: 'Malha Fria' },
                                        { id: 'algodao-penteado', name: 'Algodão Penteado' },
                                        { id: 'dry-fit', name: 'Dry Fit' },
                                        { id: 'piquet', name: 'Piquet' }
                                      ].find(opt => opt.id === detail.malhaType);
                                      return malhaOption?.name || detail.malhaType;
                                    })()}
                                  </div>
                                )}
                                {detail.malhaDescription && (
                                  <div>• Descrição: {detail.malhaDescription}</div>
                                )}
                                {detail.cutType && detail.cutType.length > 0 && (
                                  <div>
                                    • Corte: {detail.cutType.map(cut => {
                                      const cutOption = [{ id: 'feminino', name: 'Feminino' }, { id: 'masculino', name: 'Masculino' }, { id: 'unissex', name: 'Unissex' }].find(opt => opt.id === cut);
                                      return cutOption?.name || cut;
                                    }).join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total de peças:</span>
                    <span className="text-2xl font-bold text-blue-900">{quizData.colaboradores}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prazo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="mr-2 w-5 h-5 text-blue-900" />
                Informações sobre Prazo
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Prazos padrão da empresa:</h3>
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
          </div>

          {/* Ações */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2 w-5 h-5" />
                {isReview ? 'Confirmar Dados' : 'Finalizar Orçamento'}
              </h3>
              
              <div className="space-y-4 mb-6">
                {isReview ? (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      {hasSavedQuotes ? '📋 Gerenciar Orçamentos' : '📋 Revisão dos dados'}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {hasSavedQuotes 
                        ? 'Você já tem orçamentos salvos. Gerencie todos ou continue com este.'
                        : 'Confira se todas as informações estão corretas antes de solicitar o orçamento.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">SEU ORÇAMENTO FOI SALVO</h4>
                    <p className="text-sm text-green-700">
                      Todos os dados foram coletados. Escolha como deseja receber sua proposta:
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {isReview ? (
                  <button
                    onClick={hasSavedQuotes ? onViewSavedQuotes : onReviewComplete}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition-all font-medium"
                  >
                    <ArrowRight className="mr-2 w-5 h-5" />
                    {hasSavedQuotes ? 'Ver todos meus pedidos de orçamento' : 'Salvar pedido de orçamento'}
                  </button>
                ) : (
                  <>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleQuoteFinalization}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium"
                    >
                      <MessageCircle className="mr-2 w-5 h-5" />
                      Enviar via WhatsApp
                    </a>
                    
                    <a
                      href={emailUrl}
                      onClick={handleQuoteFinalization}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
                    >
                      <Mail className="mr-2 w-5 h-5" />
                      Enviar por E-mail
                    </a>
                    
                    <button
                      onClick={onStartNewQuiz}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                    >
                      <User className="mr-2 w-5 h-5" />
                      Fazer Novo Orçamento
                    </button>
                  </>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Resposta em até 24 horas úteis
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={handleCloseHelpModal}
          currentView={isReview ? 'review' : 'orcamento'}
          currentStep={1}
          quizData={quizData}
          cnpj={cnpj}
          email={email}
          companyName={companyName}
        />
      </div>
    </div>
  );
}
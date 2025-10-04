import React, { useState } from 'react';
import { X, FileText, MessageCircle, Mail, Trash2, Eye, Calendar, Building } from 'lucide-react';
import { QuizData } from '../types';

interface SavedQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuizzes: Array<QuizData & { cnpj: string; email: string; companyName: string; createdAt: Date }>;
  onDeleteQuote: (index: number) => void;
  onSendMultiple: (selectedQuotes: number[]) => void;
  onViewQuote: (index: number) => void;
  onStartNewQuiz: () => void;
}

export default function SavedQuotesModal({
  isOpen,
  onClose,
  savedQuizzes,
  onDeleteQuote,
  onSendMultiple,
  onViewQuote,
  onStartNewQuiz
}: SavedQuotesModalProps) {
  const [selectedQuotes, setSelectedQuotes] = useState<number[]>([]);

  if (!isOpen) return null;

  const formatUniformType = (type: string) => {
    const types: { [key: string]: string } = {
      'camisa-polo': 'Camisa Polo',
      'calca': 'Calça',
      'jaleco': 'Jaleco',
      'outros': 'Outros'
    };
    return types[type] || type;
  };

  const getSegmentoDisplay = (segmento: string, segmentoOutro?: string) => {
    if (segmento === 'outro' && segmentoOutro) {
      return `Outro (${segmentoOutro})`;
    }
    const segmentos: { [key: string]: string } = {
      'transportadora': 'Transportadora',
      'centro-distribuicao': 'Centro de Distribuição',
      'industria': 'Indústria',
      'construcao-civil': 'Construção Civil',
      'contabilidade': 'Contabilidade',
      'outro': 'Outro'
    };
    return segmentos[segmento] || segmento;
  };

  const toggleQuoteSelection = (index: number) => {
    setSelectedQuotes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSendMultiple = () => {
    if (selectedQuotes.length > 0) {
      onSendMultiple(selectedQuotes);
    }
  };

  const generateMultipleQuotesMessage = () => {
    let message = `💼 MÚLTIPLOS ORÇAMENTOS - FURLAN UNIFORMES\n\n`;
    message += `Olá! Tenho ${selectedQuotes.length} orçamentos para solicitar:\n\n`;
    
    selectedQuotes.forEach((quoteIndex, index) => {
      const quote = savedQuizzes[quoteIndex];
      message += `📋 ORÇAMENTO ${index + 1}:\n`;
      message += `• CNPJ: ${quote.cnpj}\n`;
      if (quote.companyName) {
        message += `• Nome: ${quote.companyName}\n`;
      }
      message += `• E-mail: ${quote.email}\n`;
      message += `• Segmento: ${getSegmentoDisplay(quote.segmento, quote.segmentoOutro)}\n`;
      message += `• Total de uniformes: ${quote.colaboradores}\n`;
      
      if (quote.distribution && Object.values(quote.distribution).some(detail => detail?.quantity > 0)) {
        message += `• Distribuição:\n`;
        Object.entries(quote.distribution)
          .filter(([_, detail]) => detail?.quantity > 0)
          .forEach(([type, detail]) => {
            message += `  - ${formatUniformType(type)}: ${detail.quantity} unidades\n`;
          });
      }
      message += `\n`;
    });
    
    message += `🙏 Aguardo retorno com os orçamentos. Obrigado! 🙏`;
    return encodeURIComponent(message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-md sm:max-w-4xl p-4 sm:p-8 mx-2 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0" />
              Orçamentos Salvos ({savedQuizzes.length})
            </h3>
            <button
              onClick={onClose}
              aria-label="Fechar modal de orçamentos salvos"
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {savedQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum orçamento salvo ainda</p>
              <p className="text-gray-400 text-sm mt-2">
                Quando você criar novos orçamentos, eles aparecerão aqui
              </p>
            </div>
          ) : (
            <>
              {selectedQuotes.length > 0 && (
                <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-blue-800 font-medium">
                      {selectedQuotes.length} orçamento{selectedQuotes.length > 1 ? 's' : ''} selecionado{selectedQuotes.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <a
                        href={`https://wa.me/553198692472?text=${generateMultipleQuotesMessage()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Enviar {selectedQuotes.length} via WhatsApp
                      </a>
                      <button
                        onClick={() => setSelectedQuotes([])}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                      >
                        Cancelar seleção
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto" id="saved-quotes-list">
                {savedQuizzes.map((quote, index) => (
                  <div
                    key={index}
                    data-quote-index={index}
                    data-quote-cnpj={quote.cnpj}
                    className="saved-quote-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedQuotes.includes(index)}
                          onChange={() => toggleQuoteSelection(index)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {quote.companyName || 'Empresa não informada'}
                            </span>
                            <span className="text-sm text-gray-500">
                              • {quote.colaboradores} uniformes
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>CNPJ: {quote.cnpj}</p>
                            <p>Segmento: {getSegmentoDisplay(quote.segmento, quote.segmentoOutro)}</p>
                            {quote.distribution && Object.values(quote.distribution).some(detail => detail?.quantity > 0) && (
                              <div className="flex flex-wrap gap-1 mt-2" data-quote-index={index}>
                                {Object.entries(quote.distribution)
                                  .filter(([_, detail]) => detail?.quantity > 0)
                                  .map(([type, detail]) => (
                                    <span
                                      key={type}
                                      data-product-type={type}
                                      data-product-quantity={detail.quantity}
                                      className="product-tag inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                    >
                                      {formatUniformType(type)}: {detail.quantity}
                                    </span>
                                  ))
                                }
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-400 mt-2">
                            <Calendar className="w-3 h-3 mr-1" />
                            Criado em {quote.createdAt.toLocaleDateString('pt-BR')} às {quote.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3 sm:mt-0 sm:ml-4">
                        <button
                          onClick={() => onViewQuote(index)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar orçamento"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteQuote(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir orçamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Como usar:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Marque os orçamentos que deseja enviar juntos</li>
                  <li>• Use "Enviar via WhatsApp" para solicitar múltiplos orçamentos</li>
                  <li>• Clique no ícone do olho para visualizar um orçamento específico</li>
                  <li>• Use a lixeira para excluir orçamentos que não precisa mais</li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={onStartNewQuiz}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <FileText className="mr-2 w-5 h-5" />
                  Iniciar Novo Orçamento
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Começar um novo orçamento do zero
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
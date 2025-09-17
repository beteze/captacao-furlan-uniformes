import React from 'react';

interface ProgressBarProps {
  currentView: string;
  currentQuizStep?: number;
  isQuoteFinalized?: boolean;
  hasSavedQuotes?: boolean;
}

export default function ProgressBar({ currentView, currentQuizStep = 1, isQuoteFinalized = false, hasSavedQuotes = false }: ProgressBarProps) {
  const getProgressPercentage = () => {
    switch (currentView) {
      case 'landing':
        return 0;
      case 'dados':
        // Etapa 1: 25%, Etapa 2: 50%, Etapa 3: 75%
        return currentQuizStep === 1 ? 25 : currentQuizStep === 2 ? 50 : 75;
      case 'review':
        return 90;
      case 'orcamento':
        return isQuoteFinalized ? 100 : 90;
      case 'disqualified':
        return 100;
      default:
        return 0;
    }
  };

  const getStepLabel = () => {
    switch (currentView) {
      case 'landing':
        return 'Início';
      case 'dados':
        const stepPrefix = hasSavedQuotes ? 'Novo Orçamento - ' : '';
        return currentQuizStep === 1 ? `${stepPrefix}1. Dados da Empresa` : 
               currentQuizStep === 2 ? `${stepPrefix}2. Distribuição de Uniformes` : 
               `${stepPrefix}3. Detalhes do Pedido`;
      case 'review':
        return hasSavedQuotes ? '4. Revisão - Gerenciar Orçamentos' : '4. Revisão';
      case 'orcamento':
        return isQuoteFinalized ? '5. Pedido de orçamento finalizado' : '5. Finalizar pedido de orçamento';
      case 'disqualified':
        return 'Contato';
      default:
        return 'Carregando...';
    }
  };

  const percentage = getProgressPercentage();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{getStepLabel()}</span>
          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${hasSavedQuotes ? 'bg-orange-500' : 'bg-blue-900'} h-2 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
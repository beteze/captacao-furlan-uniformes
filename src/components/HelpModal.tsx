import React, { useState } from 'react';
import { X, Mail, MessageCircle, ChevronLeft, HelpCircle } from 'lucide-react';
import { QuizData } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  currentStep: number;
  quizData: Partial<QuizData>;
  cnpj?: string;
  email?: string;
  companyName?: string;
}

type HelpStep = 'categories' | 'faq' | 'contact';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

const helpCategories: HelpCategory[] = [
  {
    id: 'cadastro',
    title: 'Dúvidas sobre cadastro',
    description: 'Problemas para preencher o questionário',
    faq: [
      {
        question: 'Como contar o número de colaboradores?',
        answer: 'Conte todos os funcionários que precisarão usar uniformes, incluindo terceirizados que trabalham na sua empresa.'
      },
      {
        question: 'Minha empresa tem menos de 100 colaboradores, posso pedir?',
        answer: 'Sim! Entre em contato diretamente conosco via WhatsApp ou email para um atendimento personalizado.'
      }
    ]
  },
  {
    id: 'pedido',
    title: 'Problemas com o pedido',
    description: 'Dificuldades para montar ou finalizar o pedido',
    faq: [
      {
        question: 'Como escolher a quantidade certa?',
        answer: 'Recomendamos 2-3 peças por colaborador para permitir rodízio durante a lavagem.'
      },
      {
        question: 'Posso misturar diferentes tipos de personalização?',
        answer: 'Sim! Você pode escolher bordado para algumas peças e silk screen para outras.'
      }
    ]
  },
  {
    id: 'prazos',
    title: 'Prazos',
    description: 'Informações sobre tempo de entrega',
    faq: [
      {
        question: 'Quais são os prazos padrão da empresa?',
        answer: 'Nossos prazos padrão são: • 30 dias úteis - Pedidos urgentes • 35 dias úteis - Prazo padrão (recomendado) • 45 dias úteis - Pedidos com maior volume. Todos os prazos são negociáveis conforme sua necessidade!'
      },
      {
        question: 'O prazo inclui a personalização?',
        answer: 'Sim, o prazo informado já inclui a confecção e personalização completa dos uniformes.'
      },
      {
        question: 'Posso acelerar meu pedido?',
        answer: 'Em casos especiais, podemos avaliar prazos menores. Entre em contato para verificar disponibilidade.'
      }
    ]
  },
  {
    id: 'personalizacao',
    title: 'Personalização',
    description: 'Dúvidas sobre bordado e silk screen',
    faq: [
      {
        question: 'Qual a diferença entre bordado e silk screen?',
        answer: 'Bordado é mais durável e elegante, ideal para logos. Silk screen é mais econômico para designs grandes e coloridos.'
      },
      {
        question: 'Posso enviar minha arte depois?',
        answer: 'Sim! Após finalizar o pedido, nossa equipe entrará em contato para receber os arquivos da arte.'
      }
    ]
  }
];

export default function HelpModal({ 
  isOpen, 
  onClose, 
  currentView, 
  currentStep, 
  quizData,
  cnpj = '',
  email = '',
  companyName = ''
}: HelpModalProps) {
  const [currentHelpStep, setCurrentHelpStep] = useState<HelpStep>('categories');
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(null);

  const getSegmentoDisplayHelp = () => {
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
    return segmentos[quizData.segmento || ''] || quizData.segmento || 'Não informado';
  };

  const getPersonalizacaoDisplayHelp = () => {
    const personalizacoes: { [key: string]: string } = {
      'sem': 'Sem personalização',
      'bordado': 'Bordado',
      'silk': 'Silk Screen'
    };
    return personalizacoes[quizData.personalizacao || ''] || quizData.personalizacao || 'Não definida';
  };

  const formatUniformTypeHelp = (type: string) => {
    const types: { [key: string]: string } = {
      'camisa-polo': 'Camisa Polo',
      'calca': 'Calça',
      'jaleco': 'Jaleco',
      'outros': 'Outros'
    };
    return types[type] || type;
  };
  const generateWhatsAppMessage = (categoryTitle: string) => {
    const clientName = companyName || 'Cliente';
    
    let message = `💼 SOLICITAÇÃO DE AJUDA - FURLAN UNIFORMES\n\n`;
    message += `Olá! Sou ${clientName} e estou preenchendo o orçamento de uniformes.\n`;
    message += `Estou na etapa: *${getStepDescription()}*\n`;
    message += `Preciso de ajuda com: *${categoryTitle}*\n\n`;
    
    message += `🏢 DADOS DA EMPRESA:\n`;
    if (cnpj) {
      message += `• CNPJ: ${cnpj}\n`;
    } else {
      message += `• CNPJ: Não informado\n`;
    }
    if (companyName) {
      message += `• Nome: ${companyName}\n`;
    }
    if (email) {
      message += `• E-mail: ${email}\n`;
    } else {
      message += `• E-mail: Não informado\n`;
    }
    message += `• Segmento: ${getSegmentoDisplayHelp()}\n`;
    message += `• Funcionários da empresa: ${(() => {
      if (!quizData.colaboradores) return 'Não informado';
      const ranges: { [key: string]: string } = {
        '50-100': '50 a 100',
        '101-300': '101 a 300', 
        '301-500': '301 a 500',
        '501-1000': '501 a 1000',
        'mais-1000': 'Mais de 1000'
      };
      return ranges[quizData.colaboradores] || quizData.colaboradores;
    })()}\n`;
    
    const hasDistribution = quizData.distribution && Object.values(quizData.distribution).some(qty => qty > 0);
    if (hasDistribution) {
      message += `\n👕 DISTRIBUIÇÃO DOS UNIFORMES:\n`;
      Object.entries(quizData.distribution || {})
        .filter(([_, quantity]) => quantity > 0)
        .forEach(([type, quantity]) => {
          message += `• ${formatUniformTypeHelp(type)}: ${quantity} unidades\n`;
        });
    }
    
    message += `\n🎨 DETALHES DO PEDIDO:\n`;
    message += `• Personalização: ${getPersonalizacaoDisplayHelp()}\n`;
    if (quizData.elementoPersonalizado) {
      message += `• Elemento personalizado: ${quizData.elementoPersonalizado}\n`;
    }
    if (quizData.prazoEntrega) {
      message += `• Prazo desejado: ${quizData.prazoEntrega} dias úteis\n`;
    }
    
    message += `\n❓ DÚVIDA ESPECÍFICA:\n${categoryTitle}\n\n`;
    message += `🙏 Aguardo retorno. Obrigado! 🙏`;
    
    return encodeURIComponent(message);
  };

  const getStepDescription = () => {
    switch (currentView) {
      case 'dados':
        return currentStep === 1 ? 'Dados da Empresa' :
               currentStep === 2 ? 'Distribuição de Uniformes' :
               'Detalhes do Pedido';
      case 'review':
        return 'Revisão do Orçamento';
      case 'orcamento':
        return 'Finalização do Orçamento';
      case 'disqualified':
        return 'Página de contato';
      default:
        return 'Navegando no site';
    }
  };

  const handleCategorySelect = (category: HelpCategory) => {
    setSelectedCategory(category);
    setCurrentHelpStep('faq');
  };

  const handleBackToCategories = () => {
    setCurrentHelpStep('categories');
    setSelectedCategory(null);
  };

  const handleContactClick = () => {
    setCurrentHelpStep('contact');
  };

  const resetModal = () => {
    setCurrentHelpStep('categories');
    setSelectedCategory(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose}></div>

        <div className="inline-block w-full max-w-md p-4 sm:p-6 mx-2 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {currentHelpStep !== 'categories' && (
                <button
                  onClick={currentHelpStep === 'faq' ? handleBackToCategories : handleBackToCategories}
                  className="mr-2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                {currentHelpStep === 'categories' && 'Com o que você precisa de ajuda?'}
                {currentHelpStep === 'faq' && selectedCategory?.title}
                {currentHelpStep === 'contact' && 'Entre em contato'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              aria-label="Fechar modal de ajuda"
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4" data-help-context="modal-content">
            {currentHelpStep === 'categories' && (
              <div className="space-y-3" data-help-step="categories">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{category.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                  </button>
                ))}
              </div>
            )}

            {currentHelpStep === 'faq' && selectedCategory && (
              <div className="space-y-4" data-help-step="faq" data-help-category={selectedCategory.id}>
                {selectedCategory.faq.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                    <p className="text-gray-600 text-sm">{item.answer}</p>
                  </div>
                ))}
                
                <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-center text-gray-700 font-medium mb-4">
                    Ainda não resolveu?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`mailto:comercial@furlanunifromes.com.br?subject=Ajuda: ${selectedCategory.title}&body=${generateWhatsAppMessage(selectedCategory.title).replace(/%0A/g, '%0D%0A')}`}
                      className="w-full sm:flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                    <a
                      href={`https://wa.me/553192485816?text=${generateWhatsAppMessage(selectedCategory.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
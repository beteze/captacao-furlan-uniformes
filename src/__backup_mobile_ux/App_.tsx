import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Quiz from './components/Quiz';
import OrcamentoPage from './components/OrcamentoPage';
import DisqualifiedPage from './components/DisqualifiedPage';
import ProgressBar from './components/ProgressBar';
import SavedQuotesModal from './components/SavedQuotesModal';
import { QuizData } from './types';

type AppState = 'landing' | 'dados' | 'pedido' | 'review' | 'orcamento' | 'disqualified';

function App() {
  const [currentView, setCurrentView] = useState<AppState>('landing');
  const [quizData, setQuizData] = useState<Partial<QuizData>>({
    distribution: {},
    customUniformTypes: []
  });
  const [cnpj, setCnpj] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [currentQuizStep, setCurrentQuizStep] = useState<number>(1);
  const [isQuoteFinalized, setIsQuoteFinalized] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState<Array<QuizData & { cnpj: string; email: string; companyName: string; createdAt: Date }>>([]);
  const [showSavedQuotes, setShowSavedQuotes] = useState(false);

  const hasSavedQuotes = savedQuizzes.length > 0;


  const handleStartQuiz = () => {
    setCurrentView('dados');
  };

  const handleQuizComplete = (data: QuizData) => {
    setQuizData(data);
    setCurrentView('review');
  };

  const handleQuizDataChange = (updates: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...updates }));
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setQuizData({
      distribution: {},
      customUniformTypes: []
    });
    setCnpj('');
    setEmail('');
    setCompanyName('');
    setCurrentQuizStep(1);
    setIsQuoteFinalized(false);
  };

  const handleStartNewQuiz = () => {
    // Tentar salvar o orçamento atual
    const wasSaved = saveCurrentQuizIfValid();
    
    // Se foi salvo ou já existem orçamentos salvos, mostrar modal
    if (wasSaved || hasSavedQuotes) {
      setShowSavedQuotes(true); // Mostrar modal após salvar
      return; // Não resetar ainda, deixar o usuário decidir
    } else {
      // Se não há dados para salvar, ir direto para novo orçamento
      startFreshQuiz();
    }
  };

  const startFreshQuiz = () => {
    setCurrentView('dados');
    setQuizData({
      distribution: {},
      customUniformTypes: []
    });
    setCnpj('');
    setEmail('');
    setCompanyName('');
    setCurrentQuizStep(1);
    setIsQuoteFinalized(false);
    setShowSavedQuotes(false);
  };

  const handleDeleteSavedQuote = (index: number) => {
    setSavedQuizzes(prev => prev.filter((_, i) => i !== index));
  };

  const handleViewSavedQuote = (index: number) => {
    const savedQuote = savedQuizzes[index];
    setQuizData(savedQuote);
    setCnpj(savedQuote.cnpj);
    setEmail(savedQuote.email);
    setCompanyName(savedQuote.companyName);
    setCurrentView('review');
    setShowSavedQuotes(false);
  };

  const handleSendMultipleQuotes = (selectedQuotes: number[]) => {
    // Esta função será chamada quando o usuário enviar múltiplos orçamentos
    // Por enquanto, apenas fecha o modal
    setShowSavedQuotes(false);
  };

  const handleQuizStepChange = (step: number) => {
    setCurrentQuizStep(step);
  };

  const handleDisqualified = () => {
    setCurrentView('disqualified');
  };

  const handleCnpjChange = (newCnpj: string) => {
    setCnpj(newCnpj);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handleCompanyNameChange = (newCompanyName: string) => {
    setCompanyName(newCompanyName);
  };

  const handleReviewComplete = () => {
    // Salvar o orçamento atual antes de prosseguir
    const wasSaved = saveCurrentQuizIfValid();
    
    // Ir para a tela final de orçamento
    setCurrentView('orcamento');
  };

  const handleViewSavedQuotes = () => {
    // Salvar o orçamento atual antes de mostrar todos
    const wasSaved = saveCurrentQuizIfValid();
    
    // Mostrar modal com todos os orçamentos (incluindo o que acabou de ser salvo)
    setShowSavedQuotes(true);
  };

  const saveCurrentQuizIfValid = () => {
    const hasValidData = quizData.colaboradores && 
                        quizData.colaboradores > 0 && 
                        cnpj && 
                        cnpj.trim() !== '' && 
                        email && 
                        email.trim() !== '';
    
    if (hasValidData) {
      setSavedQuizzes(prev => {
        // Verificar se já existe um orçamento com os mesmos dados para evitar duplicatas
        const isDuplicate = prev.some(saved => 
          saved.cnpj === cnpj && 
          saved.email === email && 
          saved.colaboradores === quizData.colaboradores
        );
        
        if (isDuplicate) {
          return prev;
        }
        
        return [...prev, {
          ...(quizData as QuizData),
          cnpj,
          email,
          companyName,
          createdAt: new Date()
        }];
      });
      return true;
    } else {
      return false;
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage onStartQuiz={handleStartQuiz} />
        );
      
      case 'dados':
        return (
          <Quiz
            onComplete={handleQuizComplete}
            quizData={quizData}
            onQuizDataChange={handleQuizDataChange}
            onBack={handleBackToLanding}
            onDisqualified={handleDisqualified}
            onStepChange={handleQuizStepChange}
            cnpj={cnpj}
            email={email}
            companyName={companyName}
            onCnpjChange={handleCnpjChange}
            onEmailChange={handleEmailChange}
            onCompanyNameChange={handleCompanyNameChange}
          />
        );
      
      case 'review':
        return (
          <OrcamentoPage
            quizData={quizData as QuizData}
            cnpj={cnpj}
            email={email}
            companyName={companyName}
            onBackToLanding={handleBackToLanding}
            onBack={() => setCurrentView('dados')}
            isReview={true}
            onReviewComplete={handleReviewComplete}
            onStartNewQuiz={handleStartNewQuiz}
            setIsQuoteFinalized={setIsQuoteFinalized}
            hasSavedQuotes={hasSavedQuotes}
            onViewSavedQuotes={handleViewSavedQuotes}
          />
        );
      
      case 'orcamento':
        return (
          <OrcamentoPage
            quizData={quizData as QuizData}
            cnpj={cnpj}
            email={email}
            companyName={companyName}
            onBackToLanding={handleBackToLanding}
            onBack={() => setCurrentView('review')}
            isReview={false}
            onStartNewQuiz={handleStartNewQuiz}
            setIsQuoteFinalized={setIsQuoteFinalized}
            hasSavedQuotes={hasSavedQuotes}
            onViewSavedQuotes={handleViewSavedQuotes}
          />
        );
      
      case 'disqualified':
        return (
          <DisqualifiedPage onBack={handleBackToLanding} />
        );
      
      default:
        return (
          <LandingPage onStartQuiz={handleStartQuiz} />
        );
    }
  };

  return (
    <div className={`App ${currentView !== 'landing' ? 'pt-16 pb-20' : 'pb-20'}`}>
      {currentView !== 'landing' && (
        <ProgressBar 
          currentView={currentView}
          currentQuizStep={currentQuizStep}
          isQuoteFinalized={isQuoteFinalized}
          hasSavedQuotes={hasSavedQuotes}
        />
      )}
      {renderCurrentView()}
      
      <SavedQuotesModal
        isOpen={showSavedQuotes}
        onClose={() => setShowSavedQuotes(false)}
        savedQuizzes={savedQuizzes}
        onDeleteQuote={handleDeleteSavedQuote}
        onSendMultiple={handleSendMultipleQuotes}
        onViewQuote={handleViewSavedQuote}
        onStartNewQuiz={startFreshQuiz}
      />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://tintim.link/whatsapp/50e910d9-fdf1-4e71-86db-aa6f9701e2cb/bf4c6f7d-8dcc-4a76-af54-1ed4f79becfe" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          zIndex: 9999,
          right: '20px',
          bottom: '20px',
          width: '64px',
          height: '64px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#00AD57',
          borderRadius: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" width="32" height="32">
          <path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM9.52375 7.2279C9.86155 6.24215 10.8731 5.57875 12.001 5.57875C13.1289 5.57875 14.1405 6.24215 14.4783 7.2279L14.8589 8.32402C14.9709 8.64632 15.2781 8.86825 15.6194 8.86825H16.7706C17.8277 8.86825 18.6706 9.71113 18.6706 10.7683C18.6706 11.8254 17.8277 12.6683 16.7706 12.6683H15.6194C15.2781 12.6683 14.9709 12.8902 14.8589 13.2125L14.4783 14.3086C14.1405 15.2944 13.1289 15.9578 12.001 15.9578C10.8731 15.9578 9.86155 15.2944 9.52375 14.3086L9.14315 13.2125C9.03115 12.8902 8.72395 12.6683 8.38265 12.6683H7.23145C6.17435 12.6683 5.33145 11.8254 5.33145 10.7683C5.33145 9.71113 6.17435 8.86825 7.23145 8.86825H8.38265C8.72395 8.86825 9.03115 8.64632 9.14315 8.32402L9.52375 7.2279Z"></path>
        </svg>
      </a>
    </div>
  );
}

export default App;
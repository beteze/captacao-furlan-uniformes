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
  const [currentView, setCurrentView] = useState<AppState>('dados');
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

  const handleQuizComplete = (data: QuizData) => {
    setQuizData(data);
    setCurrentView('review');
  };

  const handleQuizDataChange = (updates: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...updates }));
  };

  const handleBackToLanding = () => {
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
    }
  };

  return (
    <div className="App pt-16">
      <ProgressBar 
        currentView={currentView}
        currentQuizStep={currentQuizStep}
        isQuoteFinalized={isQuoteFinalized}
        hasSavedQuotes={hasSavedQuotes}
      />
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
    </div>
  );
}

export default App;
import React from 'react';
import { useState } from 'react';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import HelpButton from './HelpButton';
import HelpModal from './HelpModal';

interface DisqualifiedPageProps {
  onBack: () => void;
}

const DisqualifiedPage: React.FC<DisqualifiedPageProps> = ({ onBack }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleOpenHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const handleCloseHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  const whatsappSmallCompanies = "https://tintim.link/whatsapp/50e910d9-fdf1-4e71-86db-aa6f9701e2cb/bf4c6f7d-8dcc-4a76-af54-1ed4f79becfe?text=Olá,%20tenho%20uma%20empresa%20com%20menos%20de%20100%20colaboradores%20e%20gostaria%20de%20saber%20sobre%20uniformes";
  const emailContact = "comercial@furlanunifromes.com.br";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
          <div className="flex justify-between items-start mb-4">
            <HelpButton onClick={handleOpenHelpModal} />
          </div>

          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Obrigado pelo seu interesse!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              No momento, atendemos empresas com 100 colaboradores ou mais através do nosso sistema automatizado.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Mas não se preocupe! Temos uma solução para você:
            </h2>
            <p className="text-gray-700 mb-6">
              Entre em contato diretamente conosco através dos canais abaixo.
              Nossa equipe especializada poderá te atender com uma proposta personalizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappSmallCompanies}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                WhatsApp Direto
              </a>

              <a
                href={`mailto:${emailContact}?subject=Interesse em uniformes - Empresa pequeno porte`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Mail className="mr-2 w-5 h-5" />
                Enviar E-mail
              </a>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-8">
            <p>E-mail: {emailContact}</p>
            <p>Respondemos em até 24 horas</p>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar ao início
          </button>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center">
            <HelpButton onClick={handleOpenHelpModal} />
          </div>
        </div>

        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={handleCloseHelpModal}
          currentView="disqualified"
          currentStep={1}
          quizData={{}}
          cnpj=""
          email=""
          companyName=""
        />
      </div>
    </div>
  );
};

export default DisqualifiedPage;

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-md sm:max-w-3xl mx-auto">
        <div className="relative bg-white rounded-md shadow-md p-6 sm:p-8 text-center">
          <div className="flex justify-end mb-4">
            <HelpButton onClick={handleOpenHelpModal} />
          </div>

          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Parece que este pedido não se encaixa no nosso perfil atual.
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 leading-snug mb-6">
              Mas ficamos felizes com seu interesse! Você pode tentar novamente ou falar com nossa equipe.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6"></div>

          <div className="bg-blue-50 rounded-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Entre em contato conosco
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-snug mb-6">
              Nossa equipe especializada poderá te atender com uma proposta personalizada.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={onBack}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Voltar ao início
              </button>

              <a
                href={whatsappSmallCompanies}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition-all"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Falar com um consultor
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">E-mail: {emailContact}</p>
            <p className="text-sm text-gray-500">Respondemos em até 24 horas</p>
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

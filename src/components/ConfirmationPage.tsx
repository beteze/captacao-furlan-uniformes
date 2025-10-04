import React from 'react';
import { CheckCircle, ArrowLeft, Instagram } from 'lucide-react';

interface ConfirmationPageProps {
  onBackToLanding: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ onBackToLanding }) => {
  const instagramUrl = "https://www.instagram.com/furlanunifromes/";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Orçamento enviado com sucesso!
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Acompanhe novidades e cases nas nossas redes sociais.
          </p>

          <div className="border-t pt-6 mb-6"></div>

          <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-col sm:items-center sm:gap-4">
            <button
              onClick={onBackToLanding}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao início
            </button>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-sm transition-all"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Visitar nosso Instagram
            </a>
          </div>

          <div className="border-t mt-6 pt-6">
            <p className="text-sm text-gray-500">
              Nossa equipe entrará em contato em até 24 horas úteis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;

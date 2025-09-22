import React from 'react';
import { CheckCircle, ArrowRight, Users, Clock, Palette, Scissors, MessageCircle, Eye, Zap, Target, Award, Truck } from 'lucide-react';

interface LandingPageProps {
  onStartQuiz: () => void;
}

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  const diferenciais = [
    {
      icon: <Scissors className="w-8 h-8 text-blue-900" />,
      title: "Costura dupla e fio 50",
      description: "Resistência superior e acabamento profissional para maior durabilidade"
    },
    {
      icon: <Palette className="w-8 h-8 text-blue-900" />,
      title: "Bordado e silk screen de alta qualidade",
      description: "Personalização robusta que valoriza sua marca"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-900" />,
      title: "Prazo médio de entrega: 35 dias úteis",
      description: "Entrega garantida no prazo combinado"
    },
    {
      icon: <Truck className="w-8 h-8 text-blue-900" />,
      title: "Especialistas em uniformes para cada segmento",
      description: "Desenvolvemos uniformes corretos para sua área, priorizando durabilidade e segurança"
    }
  ];

  const comoFunciona = [
    {
      numero: "1",
      titulo: "Preencha as informações da sua empresa",
      descricao: "Dados básicos em poucos cliques",
      icon: <Target className="w-12 h-12 text-blue-900" />
    },
    {
      numero: "2", 
      titulo: "Monte seu pedido no sistema automático",
      descricao: "Escolha produtos, quantidades e personalizações",
      icon: <CheckCircle className="w-12 h-12 text-blue-900" />
    },
    {
      numero: "3",
      titulo: "Receba seu orçamento estruturado direto no WhatsApp",
      descricao: "Proposta personalizada no seu celular",
      icon: <MessageCircle className="w-12 h-12 text-blue-900" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
        }}
      >
        {/* Faixa de destaque no topo */}
        <div className="absolute top-0 left-0 right-0 w-full bg-orange-500 text-white text-center py-3 z-10">
          <p className="text-lg sm:text-xl font-bold">
            GARANTA SEU UNIFORME DE FORMA RÁPIDA E PRÁTICA
          </p>
        </div>

        {/* Logo no topo */}
        <div className="absolute top-16 left-6 flex items-center">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
            <div className="w-6 h-6 bg-blue-900" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
          </div>
          <h1 className="text-xl font-bold text-white">Furlan Uniformes</h1>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Uniformes que vestem sua empresa com 
            <span className="text-yellow-400"> qualidade e rapidez</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
            Personalização robusta, costura reforçada e prazos competitivos. 
            Preencha em poucos minutos e receba seu orçamento direto no WhatsApp.
          </p>

          {/* Botão CTA único e central */}
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-xl font-bold text-blue-900 bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Zap className="mr-3 w-6 h-6" />
            Quero meu orçamento agora
          </button>
        </div>
      </section>

      {/* Seção de Diferenciais */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Por que escolher a Furlan Uniformes?
          </h2>
          <p className="text-lg sm:text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Mais de 18 anos de experiência vestindo empresas com qualidade e confiança
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {diferenciais.map((item, index) => (
              <div key={index} className="bg-white p-4 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-900">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 p-4 bg-blue-50 rounded-full">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Como funciona o processo
          </h2>
          <p className="text-lg sm:text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Simples, rápido e profissional para você receber seu orçamento
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {comoFunciona.map((passo, index) => (
              <div key={index} className="text-center relative">
                {index < comoFunciona.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-blue-200 z-0" style={{ transform: 'translateX(50%)' }}></div>
                )}
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-900 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                    {passo.numero}
                  </div>
                  
                  <div className="mb-6">
                    {passo.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {passo.titulo}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {passo.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center mr-3">
                <div className="w-5 h-5 bg-blue-900" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
              </div>
              <span className="text-xl font-bold">Furlan Uniformes</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-300">comercial@furlanunifromes.com.br</p>
              <p className="text-gray-400 text-sm mt-2">
                &copy; 2025 Furlan Uniformes. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
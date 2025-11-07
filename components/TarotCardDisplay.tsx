
import React, { useMemo } from 'react';
import type { TarotCardData } from '../types';

declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice: string, options?: object) => void;
    };
  }
}

const SpeakButton: React.FC<{ text: string }> = ({ text }) => {
  const handleSpeak = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.speak(text, 'Russian Female');
    } else {
      console.error('ResponsiveVoice not loaded. Please ensure the script is included and an API key is provided if required.');
      alert('Функция озвучивания не доступна. Проверьте подключение к интернету или настройки.');
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className="ml-4 px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800"
    >
      Озвучить
    </button>
  );
};

interface TarotCardDisplayProps {
  card: TarotCardData;
}

const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({ card }) => {
  const cardKey = useMemo(() => card.id, [card]);
  const { interpretation } = card;

  return (
    <div key={cardKey} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
      <div className="flex flex-col items-center bg-slate-800/50 p-6 rounded-2xl shadow-2xl shadow-indigo-900/50 border border-slate-700">
        <div className="w-full aspect-[2/3] max-w-sm rounded-lg overflow-hidden shadow-lg border-2 border-purple-500/50">
          <video 
            key={card.videoUrl} 
            className="w-full h-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src={card.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="text-center mt-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">{card.name}</h2>
          <p className="text-xl text-indigo-300 font-light">{card.keyword}</p>
        </div>
      </div>
      
      <div className="space-y-6 text-gray-300">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h4 className="text-xl font-semibold text-purple-300 mb-2 flex items-center">
            Кратко
            <SpeakButton text={interpretation.short} />
          </h4>
          <p className="leading-relaxed">{interpretation.short}</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h4 className="text-xl font-semibold text-purple-300 mb-2 flex items-center">
            Развернуто
            <SpeakButton text={interpretation.long} />
          </h4>
          <p className="leading-relaxed">{interpretation.long}</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h4 className="text-xl font-semibold text-purple-300 mb-2">Практические векторы</h4>
          <div className="space-y-3">
            <div>
              <strong className="text-indigo-300">Отношения:</strong> {interpretation.advice.relationships}
              <SpeakButton text={`Отношения: ${interpretation.advice.relationships}`} />
            </div>
            <div>
              <strong className="text-indigo-300">Здоровье:</strong> {interpretation.advice.health}
              <SpeakButton text={`Здоровье: ${interpretation.advice.health}`} />
            </div>
            <div>
              <strong className="text-indigo-300">Деньги:</strong> {interpretation.advice.money}
              <SpeakButton text={`Деньги: ${interpretation.advice.money}`} />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h4 className="text-xl font-semibold text-purple-300 mb-2 flex items-center">
            Совет дня
            <SpeakButton text={interpretation.intent} />
          </h4>
          <p className="leading-relaxed italic">{interpretation.intent}</p>
        </div>
      </div>
    </div>
  );
};

export default TarotCardDisplay;

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }
  .scrollbar-thumb-indigo-500 {
    --scrollbar-thumb: #6366f1;
  }
  .scrollbar-track-slate-800 {
    --scrollbar-track: #1e293b;
  }
`;
document.head.appendChild(style);

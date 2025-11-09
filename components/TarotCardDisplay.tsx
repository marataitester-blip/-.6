import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { TarotCardData } from '../types';

declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice: string, options?: object) => void;
      cancel: () => void;
      isPlaying: () => boolean;
    };
  }
}

const CardDisplayStyles = () => (
  <style>{`
    .card-display-container {
      animation: fade-in 0.6s ease-out forwards;
    }
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .card-video-container { 
      display: flex; 
      justify-content: center; 
      margin: 16px 0;
    }
    .card-video-container video, .card-video-container img { 
      width: 100%; 
      max-width: 400px; 
      height: auto; 
      border-radius: 12px; 
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      object-fit: contain; /* Ensure image is not cropped */
      background: #000; /* Add black background for letterboxing */
    }
    .card-title { 
      text-align: center; 
      font-size: 1.5em; 
      color: var(--accent); 
      margin: 12px 0 8px; 
      font-family: "Cinzel", serif;
    }
    .card-keyword { 
      text-align: center; 
      color: var(--muted); 
      font-size: 1.1em; 
      margin-bottom: 24px;
    }
    .interpretation-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    @media (min-width: 1024px) {
      .interpretation-grid {
        grid-template-columns: 420px 1fr;
        gap: 32px;
        align-items: flex-start;
      }
    }
    .content-block { 
      margin-top: 14px; 
      padding: 16px; 
      background: rgba(199, 168, 123, 0.05); 
      border-left: 3px solid var(--accent); 
      border-radius: 0 8px 8px 0;
    }
    .content-block h4 {
      display: flex;
      align-items: center;
      font-family: "Cinzel", serif;
      color: var(--accent);
      font-size: 1.2em;
      margin-bottom: 8px;
    }
    .content-block p, .content-block span {
      color: var(--fg);
    }
    .aspects { 
      display: grid; 
      grid-template-columns: 1fr; 
      gap: 12px; 
      margin-top: 10px;
    }
    .aspect { 
      background: rgba(255, 255, 255, 0.02); 
      border: 1px solid rgba(199, 168, 123, 0.2); 
      border-radius: 8px; 
      padding: 12px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .aspect strong { 
      color: var(--accent);
      flex-shrink: 0;
      padding-top: 2px;
    }
    .speak-button {
      margin-left: auto;
      padding: 4px 12px;
      font-size: 0.8em;
      border-radius: 12px;
      border: 1px solid var(--accent);
      background: transparent;
      color: var(--accent);
      cursor: pointer;
      transition: all 0.3s;
      font-family: "Cinzel", serif;
      flex-shrink: 0;
    }
    .speak-button:hover {
      background: var(--accent);
      color: var(--bg);
    }
    .speak-button.speaking {
      background: #c77b7b;
      color: var(--bg);
      border-color: #c77b7b;
    }
  `}</style>
);


const SpeakButton: React.FC<{ text: string }> = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
        window.responsiveVoice.cancel();
      }
    };
  }, [text]);

  const handleSpeak = useCallback(() => {
    if (!window.responsiveVoice) {
      console.error('ResponsiveVoice not loaded.');
      alert('Функция озвучивания не доступна.');
      return;
    }

    if (window.responsiveVoice.isPlaying()) {
      window.responsiveVoice.cancel();
      setIsSpeaking(false);
    } else {
      window.responsiveVoice.speak(text, 'Russian Female', {
        onstart: () => setIsSpeaking(true),
        onend: () => setIsSpeaking(false),
        onerror: () => setIsSpeaking(false)
      });
    }
  }, [text]);


  return (
    <button
      onClick={handleSpeak}
      className={`speak-button ${isSpeaking ? 'speaking' : ''}`}
    >
      {isSpeaking ? 'Стоп' : 'Озвучить'}
    </button>
  );
};

interface TarotCardDisplayProps {
  card: TarotCardData;
}

const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({ card }) => {
  const cardKey = useMemo(() => card.id, [card]);
  const { interpretation } = card;

  useEffect(() => {
      if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
          window.responsiveVoice.cancel();
      }
  }, [card]);

  return (
    <div key={cardKey} className="card-display-container interpretation-grid">
      <CardDisplayStyles />
      <div>
        <div className="card-video-container">
          {card.videoUrl ? (
            <video 
              key={card.videoUrl} 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src={card.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : card.imageUrl ? (
            <img 
              key={card.imageUrl}
              src={card.imageUrl} 
              alt={card.name} 
            />
          ) : (
            <div className="card-video-container">
               <img src="https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/rubashka.png" alt="Card Back" />
            </div>
          )}
        </div>
        <h2 className="card-title">{card.name}</h2>
        <p className="card-keyword">{card.keyword}</p>
      </div>
      
      <div>
        <div className="content-block">
          <h4>
            Кратко
            <SpeakButton text={interpretation.short} />
          </h4>
          <p>{interpretation.short}</p>
        </div>
        <div className="content-block">
          <h4>
            Развернуто
            <SpeakButton text={interpretation.long} />
          </h4>
          <p>{interpretation.long}</p>
        </div>
        <div className="content-block">
          <h4>Практические векторы</h4>
          <div className="aspects">
            <div className="aspect">
              <strong>Отношения:</strong>
              <span>{interpretation.advice.relationships}</span>
              <SpeakButton text={`Отношения: ${interpretation.advice.relationships}`} />
            </div>
            <div className="aspect">
              <strong>Здоровье:</strong>
              <span>{interpretation.advice.health}</span>
              <SpeakButton text={`Здоровье: ${interpretation.advice.health}`} />
            </div>
            <div className="aspect">
              <strong>Деньги:</strong>
              <span>{interpretation.advice.money}</span>
              <SpeakButton text={`Деньги: ${interpretation.advice.money}`} />
            </div>
          </div>
        </div>
        <div className="content-block">
          <h4>
            Совет дня
            <SpeakButton text={interpretation.intent} />
          </h4>
          <p><em>{interpretation.intent}</em></p>
        </div>
      </div>
    </div>
  );
};

export default TarotCardDisplay;

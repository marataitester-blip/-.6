import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { TarotCardData } from '../types';

const CardDisplayStyles = () => (
  <style>{`
    .card-display-container {
      animation: fade-in 0.6s ease-out forwards;
    }
    .card-display-container.is-shuffling {
      animation: none;
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
        grid-template-columns: 360px 1fr;
        gap: 32px;
        align-items: flex-start;
      }
      .card-video-container video, .card-video-container img {
          max-width: 340px;
      }
    }
    .content-block { 
      margin-top: 14px; 
      padding: 16px; 
      background: rgba(199, 168, 123, 0.05); 
      border-left: 3px solid var(--accent); 
      border-radius: 0 8px 8px 0;
    }
    .content-block:first-child {
      margin-top: 0;
    }
    .content-block h4 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: "Cinzel", serif;
      color: var(--accent);
      font-size: 1.2em;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .content-block p, .content-block span {
      color: var(--fg);
      margin: 0;
    }
    .aspects { 
      display: grid; 
      grid-template-columns: 1fr; 
      gap: 12px;
    }
    .aspect-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .aspect-item strong {
      color: var(--accent);
      font-weight: 600;
      flex-shrink: 0;
    }
    .speaker-button {
      background: transparent;
      border: none;
      color: var(--accent);
      cursor: pointer;
      margin-left: 8px;
      padding: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease, transform 0.2s ease;
    }
    .speaker-button.is-playing,
    .speaker-button:hover:not(:disabled) {
      color: #ffd700;
      transform: scale(1.2);
    }
     .speaker-button:active:not(:disabled) {
      transform: scale(1.1);
    }
    .speaker-button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .speaker-button svg {
      width: 24px;
      height: 24px;
    }

    @media (max-width: 767px) {
      .card-title { 
        font-size: 1.8em;
      }
      .card-keyword {
        font-size: 1.3em;
      }
      .content-block h4 {
        font-size: 1.4em;
      }
      .content-block p, .content-block span, .aspect-item span {
        font-size: 1.15em;
      }
      .speaker-button {
        color: #ffd700; /* Make golden on mobile */
      }
      .speaker-button svg {
        width: 40px; /* Increased size */
        height: 40px;
      }
    }
  `}</style>
);

const SpeakerIcon = ({ isPlaying }: { isPlaying: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    {isPlaying ? (
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM9 8.25a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0V8.25zm6 0a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0V8.25z"
        clipRule="evenodd"
      />
    ) : (
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
        clipRule="evenodd"
      />
    )}
  </svg>
);


interface TarotCardDisplayProps {
  card: TarotCardData;
  isShuffling: boolean;
}

const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({ card, isShuffling }) => {
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length === 0) return;

      const maleVoiceMatcher = /male|muzh|mikhail|муж|yuri/i;
      const russianLangMatcher = /^ru(-RU)?$/i;

      let finalVoice: SpeechSynthesisVoice | undefined;

      // 1. Prioritize Russian Male voice
      finalVoice = allVoices.find(v => russianLangMatcher.test(v.lang) && maleVoiceMatcher.test(v.name));

      // 2. Any Russian voice as a fallback
      if (!finalVoice) {
        finalVoice = allVoices.find(v => russianLangMatcher.test(v.lang));
      }
      
      // 3. Any Male voice as a second fallback (for timbre, but might mispronounce)
      if (!finalVoice) {
        finalVoice = allVoices.find(v => maleVoiceMatcher.test(v.name));
      }
      
      // 4. Fallback to the first available voice
      if (!finalVoice) {
        finalVoice = allVoices[0];
      }

      setSelectedVoice(finalVoice || null);
    };

    // Voices are loaded asynchronously
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = useCallback((text: string, sectionId: string) => {
    if (!selectedVoice) {
      console.error('Voice not available or not loaded yet.');
      alert('Сервис озвучивания недоступен в вашем браузере или еще не загрузился. Пожалуйста, попробуйте снова через несколько секунд.');
      return;
    }

    if (speakingSection === sectionId) {
      window.speechSynthesis.cancel();
      setSpeakingSection(null);
    } else {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.lang = 'ru-RU'; // Force Russian language for the utterance
      
      utterance.onstart = () => {
        setSpeakingSection(sectionId);
      };
      
      utterance.onend = () => {
        setSpeakingSection(null);
      };
      
      utterance.onerror = (e) => {
        setSpeakingSection(null);
        console.error('Speech synthesis error:', e);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, [selectedVoice, speakingSection]);

  useEffect(() => {
    // Stop speech when card changes
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setSpeakingSection(null);
      }
    };
  }, [card]);
  
  const adviceText = useMemo(() => 
    `Отношения: ${card.interpretation.advice.relationships}. Здоровье: ${card.interpretation.advice.health}. Деньги: ${card.interpretation.advice.money}.`
  , [card]);

  const cardMedia = useMemo(() => {
    if (card.videoUrl) {
      return (
        <video
          key={card.id}
          src={card.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster={card.imageUrl} // Fallback image for video
        />
      );
    }
    if (card.imageUrl) {
      return <img key={card.id} src={card.imageUrl} alt={card.name} />;
    }
    return null;
  }, [card]);

  return (
    <>
      <CardDisplayStyles />
      <div className={`card-display-container ${isShuffling ? 'is-shuffling' : ''}`}>
        <div className="interpretation-grid">
          <div className="card-media-column">
            <div className="card-video-container">
              {cardMedia}
            </div>
            <h2 className="card-title">{card.id}. {card.name}</h2>
            <p className="card-keyword">{card.keyword}</p>
          </div>

          <div className="card-text-column">
            <div className="content-block">
              <h4>
                <span>Краткое значение</span>
                <button 
                  onClick={() => handleSpeak(card.interpretation.short, 'short')} 
                  className={`speaker-button ${speakingSection === 'short' ? 'is-playing' : ''}`}
                  aria-label="Озвучить краткое значение"
                  disabled={!selectedVoice}
                  title={selectedVoice ? "Озвучить" : "Озвучивание загружается..."}
                >
                  <SpeakerIcon isPlaying={speakingSection === 'short'} />
                </button>
              </h4>
              <p>{card.interpretation.short}</p>
            </div>

            <div className="content-block">
              <h4>
                <span>Подробное толкование</span>
                <button 
                  onClick={() => handleSpeak(card.interpretation.long, 'long')}
                  className={`speaker-button ${speakingSection === 'long' ? 'is-playing' : ''}`}
                  aria-label="Озвучить подробное толкование"
                  disabled={!selectedVoice}
                  title={selectedVoice ? "Озвучить" : "Озвучивание загружается..."}
                >
                  <SpeakerIcon isPlaying={speakingSection === 'long'} />
                </button>
              </h4>
              <p>{card.interpretation.long}</p>
            </div>
            
            <div className="content-block">
                <h4>
                  <span>Советы Карты</span>
                  <button 
                    onClick={() => handleSpeak(adviceText, 'advice')} 
                    className={`speaker-button ${speakingSection === 'advice' ? 'is-playing' : ''}`}
                    aria-label="Озвучить советы карты"
                    disabled={!selectedVoice}
                    title={selectedVoice ? "Озвучить" : "Озвучивание загружается..."}
                  >
                    <SpeakerIcon isPlaying={speakingSection === 'advice'} />
                  </button>
                </h4>
                <div className="aspects">
                    <div className="aspect-item">
                        <strong>Отношения:</strong>
                        <span>{card.interpretation.advice.relationships}</span>
                    </div>
                    <div className="aspect-item">
                        <strong>Здоровье:</strong>
                        <span>{card.interpretation.advice.health}</span>
                    </div>
                    <div className="aspect-item">
                        <strong>Деньги:</strong>
                        <span>{card.interpretation.advice.money}</span>
                    </div>
                </div>
            </div>

            <div className="content-block">
              <h4>
                <span>Аффирмация дня</span>
                <button 
                  onClick={() => handleSpeak(card.interpretation.intent, 'intent')}
                  className={`speaker-button ${speakingSection === 'intent' ? 'is-playing' : ''}`}
                  aria-label="Озвучить аффирмацию"
                  disabled={!selectedVoice}
                  title={selectedVoice ? "Озвучить" : "Озвучивание загружается..."}
                >
                  <SpeakerIcon isPlaying={speakingSection === 'intent'} />
                </button>
              </h4>
              <p><em>{card.interpretation.intent}</em></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TarotCardDisplay;
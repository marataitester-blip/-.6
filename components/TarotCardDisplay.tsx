import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { TarotCardData } from '../types';

const CardDisplayStyles = () => (
  <style>{`
    @keyframes mystical-reveal {
      from { 
        opacity: 0; 
        transform: scale(0.95) translateY(20px); 
        filter: blur(4px) brightness(1.5);
      }
      to { 
        opacity: 1; 
        transform: scale(1) translateY(0);
        filter: blur(0) brightness(1);
      }
    }
    .card-display-container {
      animation: mystical-reveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    .card-display-container.is-shuffling {
      animation: none;
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
      background: rgba(240, 196, 117, 0.05); 
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
    
    .master-response-container {
      margin-top: 24px;
      padding-bottom: 16px;
      text-align: center;
    }
    
    .master-response-button {
      display: inline-block;
      padding: 12px 24px;
      font-family: "Cinzel", serif;
      font-size: 1.2em;
      font-weight: 700;
      color: #0a0914;
      background: linear-gradient(145deg, #f0c475, #ffd700);
      border: none;
      border-radius: 50px;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .master-response-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
    }
    
    .master-response-button:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
    }

    @media (max-width: 767px) {
      .card-video-container {
        margin: 8px 0;
      }
      .card-title { 
        font-size: 1.8em;
        margin: 8px 0 4px;
      }
      .card-keyword {
        font-size: 1.3em;
        margin-bottom: 16px;
      }
      .content-block {
        margin-top: 10px;
        padding: 12px;
      }
      .content-block h4 {
        font-size: 1.4em;
        margin-bottom: 6px;
      }
      .content-block p, .content-block span, .aspect-item span {
        font-size: 1.15em;
        line-height: 1.4;
      }
      .aspects {
        gap: 8px;
      }
      .speaker-button {
        color: #ffd700; /* Make golden on mobile */
      }
      .speaker-button svg {
        width: 40px; /* Increased size */
        height: 40px;
      }
      .master-response-container {
        margin-top: 16px;
        padding-bottom: 8px;
      }
      .master-response-button {
        font-size: 1.3em;
        padding: 14px 28px;
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

const getRussianVoice = (): SpeechSynthesisVoice | null => {
  if (!('speechSynthesis' in window) || typeof window.speechSynthesis.getVoices !== 'function') {
    return null;
  }
  const allVoices = window.speechSynthesis.getVoices();
  if (allVoices.length === 0) {
    return null;
  }
  const maleVoiceMatcher = /male|muzh|mikhail|dmitry|мужской|муж|yuri|maxim|pavel/i;
  const russianLangMatcher = /^ru(-RU)?$/i;

  return (
    allVoices.find(v => russianLangMatcher.test(v.lang) && maleVoiceMatcher.test(v.name)) ||
    allVoices.find(v => russianLangMatcher.test(v.lang)) ||
    null
  );
};


const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({ card, isShuffling }) => {
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // Check for API support to avoid crashes in unsupported environments like Telegram's webview
    if (!('speechSynthesis' in window) || typeof window.speechSynthesis.getVoices !== 'function') {
      console.warn('Speech Synthesis API not supported in this browser/webview.');
      return;
    }

    const setVoice = () => {
      const voice = getRussianVoice();
      if (voice) {
        setSelectedVoice(voice);
      }
    };
    setVoice();
    window.speechSynthesis.onvoiceschanged = setVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = useCallback((text: string, sectionId: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      alert('Сервис озвучивания не поддерживается в этом браузере.');
      return;
    }

    if (speakingSection === sectionId) {
      window.speechSynthesis.cancel();
      setSpeakingSection(null);
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    let voiceToUse = selectedVoice;

    if (!voiceToUse) {
      voiceToUse = getRussianVoice();
      if (voiceToUse) {
        setSelectedVoice(voiceToUse);
      }
    }
    
    if (!voiceToUse) {
      console.error('Speech synthesis voice not available.');
      alert('Сервис озвучивания недоступен. Пожалуйста, убедитесь, что ваш браузер обновлен, или попробуйте перезагрузить страницу.');
      return;
    }
      
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceToUse;
    utterance.lang = 'ru-RU';
    utterance.pitch = 0.7;
    utterance.rate = 0.8;
    
    utterance.onstart = () => setSpeakingSection(sectionId);
    utterance.onend = () => setSpeakingSection(null);
    utterance.onerror = (e) => {
      setSpeakingSection(null);
      console.error('Speech synthesis error:', e);
    };
    
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, speakingSection]);

  useEffect(() => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeakingSection(null);
    }
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
            <h2 className="card-title">{`${card.id}. ${card.name}`}</h2>
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
                  title={selectedVoice ? "Озвучить" : "Озвучивание недоступно"}
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
                  title={selectedVoice ? "Озвучить" : "Озвучивание недоступно"}
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
                    title={selectedVoice ? "Озвучить" : "Озвучивание недоступно"}
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
                  title={selectedVoice ? "Озвучить" : "Озвучивание недоступно"}
                >
                  <SpeakerIcon isPlaying={speakingSection === 'intent'} />
                </button>
              </h4>
              <p><em>{card.interpretation.intent}</em></p>
            </div>
            
            <div className="master-response-container">
              <a
                href="https://t.me/otvety_mastera_astralhero_tarot"
                target="_blank"
                rel="noopener noreferrer"
                className="master-response-button"
              >
                Соединитесь с телеграмм
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TarotCardDisplay;
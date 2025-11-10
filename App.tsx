
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { TAROT_DECK } from './constants';
import type { TarotCardData } from './types';
import CardSelector from './components/CardSelector';
import TarotCardDisplay from './components/TarotCardDisplay';
import InitialCardView from './components/InitialCardView';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string,
  }>;
  prompt(): Promise<void>;
}

const GlobalStyles = () => (
  <style>{`
    :root { 
      --bg: #0a0914; 
      --fg: #e0e0e0; 
      --muted: #a0a0b0; 
      --accent: #f0c475; 
      --card-bg: #1a1829; 
    }
    html, body, #root {
      height: 100%;
    }
    @keyframes move-twink-back {
        from {background-position:0 0;}
        to {background-position:-10000px 5000px;}
    }
    body {
      background-color: var(--bg);
      color: var(--fg);
      font-family: "Cormorant Garamond", "Georgia", serif;
      line-height: 1.5;
      margin: 0;
      background: #000 url(https://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
      animation: move-twink-back 200s linear infinite;
    }
    main {
      display: flex;
      flex-direction: column;
      transition: min-height 0.5s ease;
    }
    .oracle-single { 
      padding: 14px; 
      border-radius: 12px; 
      max-width: 900px; 
      margin: 0 auto; 
    }
    @media (min-width: 768px) { .oracle-single { padding: 18px; } }
    @media (min-width: 1024px) { .oracle-single { padding: 22px; } }
    
    .app-header {
      text-align: center;
      margin: 16px 0;
    }
    .title-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }
    .app-title {
      font-size: 2.2em;
      color: var(--accent);
      font-family: "Cinzel", serif;
      font-weight: 700;
      letter-spacing: 2px;
      margin: 0;
      text-shadow: 0 0 10px rgba(240, 196, 117, 0.5);
    }
    .header-buttons {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      align-items: center;
    }
    .header-button {
      background: transparent;
      color: var(--accent);
      padding: 5px 14px;
      border-radius: 18px;
      text-decoration: none;
      font-family: "Cinzel", serif;
      border: 1px solid var(--accent);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.8em;
    }
    .header-button:hover:not(:disabled) {
      background: var(--accent);
      color: var(--bg);
    }
    .header-button:disabled, .header-button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .header-button.pulsate {
      border-color: gold;
      color: gold;
      animation: expressive-pulse 2s infinite;
    }
    .header-button.pulsate:hover:not(:disabled) {
        background: gold;
        color: var(--bg);
    }

    @keyframes expressive-pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.2);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.5);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.2);
      }
    }
    
    .card-display-wrapper {
      margin-top: 24px;
      transition: filter 0.4s ease-out, transform 0.4s ease-out, flex-grow 0.5s ease;
    }
    .card-display-wrapper.shuffling-active {
      filter: blur(4px) brightness(0.8);
      transform: scale(0.96);
    }
    
    /* Revealed state for centered card */
    .card-revealed main {
      min-height: calc(100vh - 28px);
      min-height: calc(100dvh - 28px);
    }
    .card-revealed .card-display-wrapper {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
     @media (min-width: 768px) {
      .card-revealed main {
        min-height: calc(100vh - 36px);
        min-height: calc(100dvh - 36px);
      }
    }


    .app-footer {
      text-align: center;
      margin-top: 48px;
      padding: 16px 0;
      border-top: 1px solid rgba(240, 196, 117, 0.2);
    }
    .app-footer p {
      color: var(--muted);
      font-size: 0.9em;
    }
    
    @media (max-width: 767px) {
      .app-header {
        margin: 8px 0;
      }
      .app-title {
        font-size: 1.6em;
        letter-spacing: 1px;
        white-space: nowrap;
      }
      .header-buttons {
        gap: 6px;
        margin-top: 8px;
        flex-wrap: nowrap;
        justify-content: center;
      }
      .header-button {
        padding: 6px 12px;
        font-size: 0.85em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
      }
      .card-display-wrapper {
        margin-top: 16px;
      }
      .app-footer p {
        font-size: 1.05em;
      }
    }
  `}</style>
);

const preloadCardMedia = (card: TarotCardData): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (card.videoUrl) {
      const video = document.createElement('video');
      video.src = card.videoUrl;
      video.oncanplaythrough = () => resolve();
      video.onerror = (e) => reject(`Failed to load video: ${card.videoUrl}`);
      video.load();
    } else if (card.imageUrl) {
      const img = new Image();
      img.src = card.imageUrl;
      img.onload = () => resolve();
      img.onerror = () => reject(`Failed to load image: ${card.imageUrl}`);
    } else {
      resolve();
    }
  });
};


const App: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const shuffleIntervalRef = useRef<number | null>(null);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  const revealSound = useMemo(() => new Audio('https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/keyword_reveal.mp3'), []);
  const clickSound = useMemo(() => new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2491a5499d.mp3'), []);

  const playSound = useCallback((sound: HTMLAudioElement) => {
    sound.currentTime = 0;
    sound.play().catch(error => console.error("Error playing sound effect:", error));
  }, []);

  useEffect(() => {
    // Service Worker registration for PWA caching
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered: ', registration);
          })
          .catch(registrationError => {
            console.log('Service Worker registration failed: ', registrationError);
          });
      });
    }
    
    // PWA install prompt handler
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    playSound(clickSound);
    if (installPromptEvent) {
      installPromptEvent.prompt();
    } else {
      alert(
        'Чтобы добавить приложение на главный экран:\n\n' +
        'На iPhone: Нажмите "Поделиться" в Safari, затем "На экран \'Домой\'".\n' +
        'На Android: Откройте меню браузера и выберите "Установить приложение" или "Добавить на главный экран".'
      );
    }
  };

  const handleCardSelect = useCallback((card: TarotCardData) => {
    if (isShuffling) return;
    playSound(clickSound);
    setSelectedCard(card);
    playSound(revealSound);
  }, [isShuffling, playSound, clickSound, revealSound]);
  
  const handleRandomCardSelect = useCallback(async () => {
    if (isShuffling) return;
    playSound(clickSound);

    setIsShuffling(true);
    const initialCardId = selectedCard?.id;

    shuffleIntervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * TAROT_DECK.length);
      setSelectedCard(TAROT_DECK[randomIndex]);
    }, 150);

    let finalCard: TarotCardData;
    do {
      const finalCardIndex = Math.floor(Math.random() * TAROT_DECK.length);
      finalCard = TAROT_DECK[finalCardIndex];
    } while (TAROT_DECK.length > 1 && finalCard.id === initialCardId);

    const minimumShuffleTime = new Promise(resolve => setTimeout(resolve, 3000));
    const maximumShuffleTime = new Promise(resolve => setTimeout(resolve, 10000));
    const preloadPromise = preloadCardMedia(finalCard);
    
    try {
      await minimumShuffleTime;
      await Promise.race([preloadPromise, maximumShuffleTime]);
    } catch (error) {
      console.error("Media preloading failed or timed out:", error);
    } finally {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
        shuffleIntervalRef.current = null;
      }

      setSelectedCard(finalCard);
      setIsShuffling(false);
      playSound(revealSound);
    }
  }, [isShuffling, selectedCard, playSound, clickSound, revealSound]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isShuffling || !selectedCard) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isShuffling || !selectedCard) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (isShuffling || !touchStartX.current || !touchEndX.current || !selectedCard) return;
    
    const swipeDistance = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      const currentIndex = TAROT_DECK.findIndex(card => card.id === selectedCard.id);
      if (swipeDistance > 0) {
        const nextIndex = (currentIndex + 1) % TAROT_DECK.length;
        handleCardSelect(TAROT_DECK[nextIndex]);
      } else {
        const nextIndex = (currentIndex - 1 + TAROT_DECK.length) % TAROT_DECK.length;
        handleCardSelect(TAROT_DECK[nextIndex]);
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };


  return (
    <>
      <GlobalStyles />
      <div className={`oracle-single ${selectedCard && !isShuffling ? 'card-revealed' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
      >
        <main>
          <header className="app-header">
            <div className="title-wrapper">
              <h1 className="app-title">
                ASTRAL HERO TAROT
              </h1>
            </div>
            <div className="header-buttons">
              <button 
                onClick={handleRandomCardSelect}
                disabled={isShuffling}
                className="header-button pulsate"
              >
                Что скажет Карта?
              </button>
              <button 
                onClick={handleInstallClick}
                disabled={isShuffling}
                className={`header-button ${!installPromptEvent ? 'disabled' : ''}`}
              >
                На главный экран
              </button>
            </div>
          </header>
          
          <div className={`card-display-wrapper ${isShuffling ? 'shuffling-active' : ''}`}>
            {selectedCard ? (
              <>
                <CardSelector
                  cards={TAROT_DECK}
                  selectedCard={selectedCard}
                  onSelect={handleCardSelect}
                  isShuffling={isShuffling}
                />
                <TarotCardDisplay card={selectedCard} isShuffling={isShuffling} />
              </>
            ) : (
              <InitialCardView onCardClick={handleRandomCardSelect} />
            )}
          </div>
        </main>
        
        {selectedCard && !isShuffling && (
          <footer className="app-footer">
            <p>ASTRAL HERO TAROT © 2024</p>
          </footer>
        )}
      </div>
    </>
  );
};

export default App;

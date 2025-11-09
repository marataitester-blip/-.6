import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TAROT_DECK } from './constants';
import type { TarotCardData } from './types';
import CardSelector from './components/CardSelector';
import TarotCardDisplay from './components/TarotCardDisplay';

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
      --bg: #0f0f14; 
      --fg: #eae6df; 
      --muted: #c9c3b8; 
      --accent: #c7a87b; 
      --card-bg: #16161d; 
    }
    body {
      background-color: var(--bg);
      color: var(--fg);
      font-family: "Cormorant Garamond", "Georgia", serif;
      line-height: 1.5;
      margin: 0;
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
      margin: 24px 0;
    }
    .app-title {
      font-size: 2.2em;
      color: var(--accent);
      font-family: "Cinzel", serif;
      font-weight: 700;
      letter-spacing: 2px;
    }
    .header-buttons {
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      align-items: center;
    }
    .header-button {
      background: transparent;
      color: var(--accent);
      padding: 8px 20px;
      border-radius: 24px;
      text-decoration: none;
      font-family: "Cinzel", serif;
      border: 1px solid var(--accent);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9em;
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
      animation: pulsate 2s infinite;
    }
    .header-button.pulsate:hover:not(:disabled) {
        background: gold;
        color: var(--bg);
    }

    @keyframes pulsate {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
      }
      70% {
        transform: scale(1.05);
        box-shadow: 0 0 10px 15px rgba(255, 215, 0, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
      }
    }
    
    .app-footer {
      text-align: center;
      margin-top: 48px;
      padding: 16px 0;
      border-top: 1px solid rgba(199, 168, 123, 0.2);
    }
    .app-footer p {
      color: var(--muted);
      font-size: 0.9em;
    }
  `}</style>
);


const App: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<TarotCardData>(TAROT_DECK[0]);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const shuffleIntervalRef = useRef<number | null>(null);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
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
    setSelectedCard(card);
  }, [isShuffling]);
  
  const handleRandomCardSelect = useCallback(() => {
    if (isShuffling) return;

    setIsShuffling(true);
    const initialCardId = selectedCard.id;

    shuffleIntervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * TAROT_DECK.length);
      setSelectedCard(TAROT_DECK[randomIndex]);
    }, 120);

    setTimeout(() => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
        shuffleIntervalRef.current = null;
      }

      let finalCardIndex;
      do {
        finalCardIndex = Math.floor(Math.random() * TAROT_DECK.length);
      } while (TAROT_DECK.length > 1 && TAROT_DECK[finalCardIndex].id === initialCardId);

      setSelectedCard(TAROT_DECK[finalCardIndex]);
      setIsShuffling(false);
    }, 2000);
  }, [isShuffling, selectedCard.id]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isShuffling) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = 0; // Reset endX
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isShuffling) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (isShuffling || !touchStartX.current || !touchEndX.current) return;
    
    const swipeDistance = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (Math.abs(swipeDistance) > swipeThreshold) {
      const currentIndex = TAROT_DECK.findIndex(card => card.id === selectedCard.id);
      if (swipeDistance > 0) { // Swipe left
        const nextIndex = (currentIndex + 1) % TAROT_DECK.length;
        handleCardSelect(TAROT_DECK[nextIndex]);
      } else { // Swipe right
        const nextIndex = (currentIndex - 1 + TAROT_DECK.length) % TAROT_DECK.length;
        handleCardSelect(TAROT_DECK[nextIndex]);
      }
    }
    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };


  return (
    <>
      <GlobalStyles />
      <div className="oracle-single"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
      >
        <main>
          <header className="app-header">
            <h1 className="app-title">
              ASTRAL HERO TAROT
            </h1>
            <div className="header-buttons">
              <a 
                href="https://t.me/+y7Inf371g7w0NzMy" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`header-button ${isShuffling ? 'disabled' : ''}`}
              >
                Связь с Мастером
              </a>
              <button 
                onClick={handleRandomCardSelect}
                disabled={isShuffling}
                className="header-button pulsate"
              >
                Карта говорит
              </button>
              <button 
                onClick={handleInstallClick}
                disabled={isShuffling}
                className="header-button"
              >
                Сохранить на экран
              </button>
            </div>
          </header>
          
          <CardSelector
            cards={TAROT_DECK}
            selectedCard={selectedCard}
            onSelect={handleCardSelect}
            isShuffling={isShuffling}
          />

          <div style={{marginTop: '32px'}}>
            {selectedCard && <TarotCardDisplay card={selectedCard} />}
          </div>
          
          <footer className="app-footer">
              <p>
                  Интерпретации синтезированы ИИ на основе классических и современных школ Таро.
              </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default App;
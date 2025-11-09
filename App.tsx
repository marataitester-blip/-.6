import React, { useState, useCallback, useEffect } from 'react';
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
      font-size: 2.5em;
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
    .header-button:hover {
      background: var(--accent);
      color: var(--bg);
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
    setSelectedCard(card);
  }, []);

  return (
    <>
      <GlobalStyles />
      <div className="oracle-single">
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
                className="header-button"
              >
                Связь с Мастером
              </a>
              <button 
                onClick={handleInstallClick}
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

import React, { useState, useCallback } from 'react';
import { TAROT_DECK } from './constants';
import type { TarotCardData } from './types';
import CardSelector from './components/CardSelector';
import TarotCardDisplay from './components/TarotCardDisplay';

const App: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<TarotCardData>(TAROT_DECK[0]);

  const handleCardSelect = useCallback((card: TarotCardData) => {
    setSelectedCard(card);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center my-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Таро-Синтезатор
          </h1>
          <p className="text-indigo-300 mt-2 text-lg">Мудрость Арканов в цифровом воплощении</p>
        </header>
        
        <CardSelector
          cards={TAROT_DECK}
          selectedCard={selectedCard}
          onSelect={handleCardSelect}
        />

        <div className="mt-8">
          {selectedCard && <TarotCardDisplay card={selectedCard} />}
        </div>
        
        <footer className="text-center mt-12 py-4 border-t border-slate-700">
            <p className="text-sm text-slate-500">
                Интерпретации синтезированы ИИ на основе классических и современных школ Таро.
            </p>
        </footer>
      </main>
    </div>
  );
};

export default App;

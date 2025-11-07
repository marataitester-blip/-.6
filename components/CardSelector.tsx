
import React from 'react';
import type { TarotCardData } from '../types';

interface CardSelectorProps {
  cards: TarotCardData[];
  selectedCard: TarotCardData;
  onSelect: (card: TarotCardData) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({ cards, selectedCard, onSelect }) => {
  return (
    <div className="py-4">
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-slate-800">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelect(card)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
              ${selectedCard.id === card.id
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-purple-400'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
              }
            `}
          >
            {card.id}. {card.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;

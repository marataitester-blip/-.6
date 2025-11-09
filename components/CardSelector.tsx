import React from 'react';
import type { TarotCardData } from '../types';

interface CardSelectorProps {
  cards: TarotCardData[];
  selectedCard: TarotCardData;
  onSelect: (card: TarotCardData) => void;
}

const CardSelectorStyles = () => (
  <style>{`
    .card-selector {
      display: flex;
      overflow-x: auto;
      padding: 16px 0;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: var(--accent) var(--card-bg);
    }
    .card-selector::-webkit-scrollbar {
      height: 8px;
    }
    .card-selector::-webkit-scrollbar-track {
      background: var(--card-bg);
      border-radius: 4px;
    }
    .card-selector::-webkit-scrollbar-thumb {
      background-color: var(--accent);
      border-radius: 4px;
    }

    .card-selector-button {
      flex-shrink: 0;
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid var(--accent);
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      transition: all 0.3s;
      font-family: "Cormorant Garamond", serif;
      font-size: 1em;
      white-space: nowrap;
    }
    .card-selector-button:hover {
      background: rgba(199, 168, 123, 0.1);
      color: var(--fg);
    }
    .card-selector-button.active {
      background: var(--accent);
      color: var(--bg);
      font-weight: 600;
    }
  `}</style>
);

const CardSelector: React.FC<CardSelectorProps> = ({ cards, selectedCard, onSelect }) => {
  return (
    <>
      <CardSelectorStyles />
      <div className="card-selector">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelect(card)}
            className={`card-selector-button ${selectedCard.id === card.id ? 'active' : ''}`}
          >
            {card.id}. {card.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default CardSelector;
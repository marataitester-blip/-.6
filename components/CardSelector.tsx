import React, { useRef, useEffect } from 'react';
import type { TarotCardData } from '../types';

interface CardSelectorProps {
  cards: TarotCardData[];
  selectedCard: TarotCardData | null;
  onSelect: (card: TarotCardData) => void;
  isShuffling: boolean;
}

const CardSelectorStyles = () => (
  <style>{`
    .card-selector {
      display: flex;
      overflow-x: auto;
      padding: 12px 0 8px 0;
      gap: 8px;
      scrollbar-width: thin;
      scrollbar-color: var(--accent) var(--card-bg);
      -ms-overflow-style: none; /* IE and Edge */
      -webkit-overflow-scrolling: touch; /* Momentum scrolling for iOS */
    }
    .card-selector.shuffling {
      pointer-events: none;
      opacity: 0.7;
    }
    .card-selector::-webkit-scrollbar {
      height: 6px;
    }
    .card-selector::-webkit-scrollbar-track {
      background: var(--card-bg);
      border-radius: 3px;
    }
    .card-selector::-webkit-scrollbar-thumb {
      background-color: var(--accent);
      border-radius: 3px;
    }

    .card-selector-button {
      flex-shrink: 0;
      padding: 5px 12px;
      border-radius: 16px;
      border: 1px solid var(--accent);
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      transition: all 0.3s;
      font-family: "Cormorant Garamond", serif;
      font-size: 0.9em;
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
    
    @media (max-width: 767px) {
      .card-selector-button {
        font-size: 1.05em;
        padding: 6px 14px;
      }
    }
  `}</style>
);

const CardSelector: React.FC<CardSelectorProps> = ({ cards, selectedCard, onSelect, isShuffling }) => {
  const buttonRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  useEffect(() => {
    if (selectedCard) {
      const button = buttonRefs.current.get(selectedCard.id);
      if (button) {
        button.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedCard]);

  return (
    <>
      <CardSelectorStyles />
      <div className={`card-selector ${isShuffling ? 'shuffling' : ''}`}>
        {cards.map((card) => (
          <button
            key={card.id}
            ref={(el) => buttonRefs.current.set(card.id, el)}
            onClick={() => onSelect(card)}
            className={`card-selector-button ${selectedCard?.id === card.id ? 'active' : ''}`}
          >
            {card.id}. {card.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default CardSelector;

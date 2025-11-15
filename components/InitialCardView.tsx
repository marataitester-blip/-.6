
import React from 'react';

const InitialCardViewStyles = () => (
  <style>{`
    @keyframes subtle-float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    @keyframes mystical-reveal-initial {
      from { 
        opacity: 0; 
        transform: scale(0.95);
      }
      to { 
        opacity: 1; 
        transform: scale(1);
      }
    }
    .initial-card-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
      flex-grow: 1;
      animation: mystical-reveal-initial 1s ease-out forwards;
    }
    .initial-card-image {
      width: 100%;
      max-width: 300px;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 0 40px rgba(240, 196, 117, 0.3);
      animation: subtle-float 6s ease-in-out infinite;
      cursor: pointer;
    }
    .initial-card-text {
      font-family: "Cinzel", serif;
      font-size: 1.4em;
      color: var(--accent);
      max-width: 400px;
      text-shadow: 0 0 10px rgba(240, 196, 117, 0.3);
      margin-bottom: 24px;
      line-height: 1.2;
    }
    @media (max-width: 767px) {
      .initial-card-image {
        max-width: 250px;
      }
      .initial-card-text {
        font-size: 1.2em;
      }
    }
  `}</style>
);

interface InitialCardViewProps {
  onCardClick: () => void;
}

const InitialCardView: React.FC<InitialCardViewProps> = ({ onCardClick }) => {
  return (
    <>
      <InitialCardViewStyles />
      <div className="initial-card-view">
        <p className="initial-card-text">
          Задайте вопрос. Коснитесь карты, чтобы получить ответ.
        </p>
        <img 
          src="https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/rubashka.png" 
          alt="Рубашка карты Таро" 
          className="initial-card-image"
          onClick={onCardClick}
          title="Получить ответ"
        />
      </div>
    </>
  );
};

export default InitialCardView;
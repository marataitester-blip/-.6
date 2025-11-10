
import React from 'react';

const SplashScreenStyles = () => (
  <style>{`
    :root { 
      --bg: #0a0914; 
      --accent: #f0c475; 
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes subtle-pulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.05); opacity: 1; }
    }
    .splash-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      height: 100dvh;
      background-color: var(--bg);
      animation: fadeIn 1s ease-in-out;
      background: #000 url(https://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
    }
    .splash-content {
      text-align: center;
    }
    .splash-logo {
      width: 150px;
      height: auto;
      margin-bottom: 24px;
      animation: subtle-pulse 3s ease-in-out infinite;
    }
    .splash-title {
      font-size: 2.5em;
      color: var(--accent);
      font-family: "Cinzel", serif;
      font-weight: 700;
      letter-spacing: 2px;
      margin: 0;
      text-shadow: 0 0 15px rgba(240, 196, 117, 0.6);
    }
     @media (max-width: 767px) {
        .splash-logo {
            width: 120px;
        }
        .splash-title {
            font-size: 1.8em;
        }
     }
  `}</style>
);

const SplashScreen: React.FC = () => {
  return (
    <>
      <SplashScreenStyles />
      <div className="splash-screen">
        <div className="splash-content">
          <img 
            src="https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/icon-512x512.png" 
            alt="Astral Hero Tarot Logo" 
            className="splash-logo" 
          />
          <h1 className="splash-title">ASTRAL HERO TAROT</h1>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;

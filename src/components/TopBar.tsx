import React from 'react';
import daddcoinImg from '../assets/daddcoin.webp';

interface TopBarProps {
  levelTitle: string;
  coins: number;
  onMapClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  levelTitle,
  coins,
  onMapClick
}) => {
  return (
    <header className="topbar-container">
      {/* Coins Badge (Left) */}
      <div className="coins-badge-container">
        <div className="gold-coin-wrapper">
          <img src={daddcoinImg} alt="coin" className="custom-coin-img" />
        </div>
        <span className="coins-amount">{coins}</span>
      </div>

      {/* Level Title (Hidden or Center, the screenshot doesn't show a level title, but we can keep it if needed) */}
      <h1 className="level-title">{levelTitle}</h1>

      {/* Map Badge Button (Right) */}
      <button
        className="map-btn"
        onClick={onMapClick}
        title="خريطة المراحل"
        aria-label="خريطة المراحل"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </header>
  );
};

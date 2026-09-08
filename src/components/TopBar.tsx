import React from 'react';

interface TopBarProps {
  levelTitle: string;
  coins: number;
  onMapClick?: () => void;
  onAddCoins?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  levelTitle,
  coins,
  onMapClick,
  onAddCoins
}) => {
  return (
    <header className="topbar-container">
      {/* Map Badge Button */}
      <button 
        className="map-btn"
        onClick={onMapClick}
        title="خريطة المراحل"
        aria-label="خريطة المراحل"
      >
        <svg viewBox="0 0 24 24" className="map-icon" fill="currentColor">
          <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
        </svg>
      </button>

      {/* Level Title */}
      <h1 className="level-title">{levelTitle}</h1>

      {/* Coins Badge */}
      <div className="coins-badge-container">
        <span className="coins-amount">{coins}</span>
        <div className="gold-coin-icon">
          <div className="coin-inner-ring"></div>
        </div>
        <button 
          className="coins-plus-btn" 
          onClick={onAddCoins} 
          title="شراء عملات"
        >
          +
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import daddcoinImg from '../assets/daddcoin.webp';

interface BottomBarProps {
  coins: number;
  onHintClick: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  coins,
  onHintClick,
}) => {
  const canAffordHint = coins >= 10;

  return (
    <footer className="bottombar-container" dir="rtl">
      {/* Main Hint Button Only (matching screenshot) */}
      <button 
        className={`footer-hint-btn ${!canAffordHint ? 'hint-disabled' : ''}`}
        onClick={onHintClick}
        disabled={!canAffordHint}
        title="كشف كلمة أو حرف"
      >
        <span className="hint-btn-text">تلميح</span>
        <span className="hint-cost">1</span>
        <img src={daddcoinImg} alt="coin" className="hint-coin-img" />
      </button>
    </footer>
  );
};

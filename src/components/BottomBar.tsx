import React from 'react';

interface BottomBarProps {
  coins: number;
  onHintClick: () => void;
  onVideoRewardClick: () => void;
  onExitClick: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  coins,
  onHintClick,
  onVideoRewardClick,
  onExitClick
}) => {
  const canAffordHint = coins >= 10;

  return (
    <footer className="bottombar-container" dir="rtl">
      {/* Exit / Return button */}
      <button 
        className="footer-icon-btn exit-btn" 
        onClick={onExitClick}
        title="خروج"
        aria-label="خروج"
      >
        <svg viewBox="0 0 24 24" className="footer-svg-icon" fill="currentColor">
          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>
      </button>

      {/* Main Hint Button */}
      <button 
        className={`footer-hint-btn ${!canAffordHint ? 'hint-disabled' : ''}`}
        onClick={onHintClick}
        disabled={!canAffordHint}
        title="كشف كلمة أو حرف"
      >
        <span className="hint-btn-text">تلميح</span>
        <div className="hint-coin-pill">
          <span className="hint-cost">(10</span>
          <div className="gold-coin-mini"></div>
          <span className="hint-cost">)</span>
        </div>
      </button>

      {/* Video Ad / Free Coins Button */}
      <button 
        className="footer-icon-btn video-btn"
        onClick={onVideoRewardClick}
        title="مشاهدة فيديو للحصول على عملات مجانية (+25)"
        aria-label="عملات مجانية"
      >
        <svg viewBox="0 0 24 24" className="footer-svg-icon" fill="currentColor">
          <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zM10 8l6 4-6 4V8z"/>
        </svg>
      </button>
    </footer>
  );
};

import React from 'react';
import daddcoinImg from '../assets/daddcoin.webp';
import ExitButtonImg from '../assets/ExitButton.svg';
import './TopBar.css';

interface TopBarProps {
  currentChoice: number;
  totalChoices: number;
  coins: number;
  onExitClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentChoice,
  totalChoices,
  coins,
  onExitClick
}) => {
  const progressPercent = totalChoices > 0 ? (currentChoice / totalChoices) * 100 : 0;

  return (
    <header className="topbar-container">
      <div className="topbar-content">
        {/* Left Side: Coins */}
        <div className="topbar-coins-badge">
          <div className="topbar-coin-wrapper">
            <img src={daddcoinImg} alt="coin" className="topbar-coin-img" />
          </div>
          <span className="topbar-coins-amount">{coins}</span>
        </div>

        {/* Center: Question Info */}
        <div className="topbar-center-info">
          <span className="topbar-question-label">الاختيارات</span>
          <span className="topbar-question-count">{currentChoice}/{totalChoices}</span>
        </div>

        {/* Right Side: Exit Button */}
        <button
          className="topbar-exit-btn"
          onClick={onExitClick}
          title="خروج"
          aria-label="خروج"
        >
          <img src={ExitButtonImg} alt="خروج" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="topbar-progress-container">
        <div 
          className="topbar-progress-fill" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};

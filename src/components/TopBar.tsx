import React from 'react';
import daddcoinImg from '../assets/daddcoin.webp';
import heartImg from '../assets/heart.png';
import ExitButtonImg from '../assets/ExitButton.svg';
import './TopBar.css';

interface TopBarProps {
  currentChoice: number;
  totalChoices: number;
  coins: number;
  lives: number;
  maxLives?: number;
  onExitClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentChoice,
  totalChoices,
  coins,
  lives,
  maxLives = 5,
  onExitClick
}) => {
  const progressPercent = totalChoices > 0 ? (currentChoice / totalChoices) * 100 : 0;

  return (
    <header className="topbar-container">
      <div className="topbar-content">
        {/* Left Side: Lives & Coins */}
        <div className="topbar-left-group">
          <div className="topbar-lives" dir="rtl">
            <span className="topbar-lives-label">القلوب</span>
            <div className="topbar-hearts">
              {Array.from({ length: maxLives }).map((_, idx) => (
                <img
                  key={idx}
                  src={heartImg}
                  alt=""
                  className={idx < lives ? 'is-active' : 'is-inactive'}
                />
              ))}
            </div>
          </div>
          <div className="topbar-coins-badge" aria-label={`النقاط: ${coins}`}>
            <div className="topbar-coin-wrapper">
              <img src={daddcoinImg} alt="coin" className="topbar-coin-img" />
            </div>
            <span className="topbar-coins-amount">{coins}</span>
          </div>
        </div>

        {/* Center: Question Info */}
        <div className="topbar-center-info" dir="rtl">
          <span className="topbar-question-label">السؤال</span>
          <span className="topbar-question-count" dir="ltr">{currentChoice}/{totalChoices}</span>
        </div>

        {/* Right Side: Exit Button */}
        <button
          className="topbar-exit-btn"
          type="button"
          onClick={onExitClick}
          title="خروج"
          aria-label="خروج"
        >
          <img src={ExitButtonImg} alt="خروج" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="topbar-progress-container" role="progressbar" aria-valuemin={0} aria-valuemax={totalChoices} aria-valuenow={currentChoice}>
        <div 
          className="topbar-progress-fill" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};

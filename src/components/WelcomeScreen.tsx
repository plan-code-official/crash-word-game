import React from 'react';
import './WelcomeScreen.css';

// Assets
import questionCoinImg from '../assets/QuestionCoin.png';
import daddcoinImg from '../assets/daddcoin.webp';
import descriptionImg from '../assets/description.png';
import exitButtonImg from '../assets/exit_transparent.png';
import startButtonImg from '../assets/start_transparent.png';

export interface WelcomeScreenProps {
  choicesCount: number;
  isLoading?: boolean;
  error?: string | null;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  choicesCount,
  isLoading = false,
  error = null,
  onStart,
}) => {
  return (
    <div className="welcome-screen-new">
      <div className="welcome-stats-bg">
        <img src={questionCoinImg} alt="Question Coin" />
        <span className="stat-value">{choicesCount}</span>
        <span className="stat-separator">=</span>
        <span className="stat-value xp-text">{choicesCount}</span>
        <img src={daddcoinImg} alt="Gold Coin" />
      </div>

      <div className="welcome-body">
        <img src={descriptionImg} alt="كيفية اللعب" className="how-to-play-img" />
      </div>

      <div className="welcome-footer">
        {error || (!isLoading && choicesCount === 0) ? (
          <div className="error-text">
            {error ? `حدث خطأ: ${error}` : 'لا توجد اختيارات متاحة حالياً.'}
          </div>
        ) : (
          <>
            <button
              className="welcome-action-button exit-button"
              onClick={() => window.history.back()}
              aria-label="خروج"
            >
              <img src={exitButtonImg} alt="خروج" />
            </button>
            <button
              className="welcome-action-button start-button"
              onClick={onStart}
              disabled={isLoading}
              aria-label={isLoading ? 'تحميل' : 'ابدأ'}
            >
              <img src={startButtonImg} alt="ابدأ" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

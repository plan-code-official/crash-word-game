import React from 'react';
import './WelcomeScreen.css';

// Assets
import questionCoinImg from '../assets/QuestionCoin.png';
import daddcoinImg from '../assets/daddcoin.webp';
import descriptionImg from '../assets/description.png';

export interface WelcomeScreenProps {
  questionsCount: number;
  isLoading?: boolean;
  error?: string | null;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  questionsCount,
  isLoading = false,
  error = null,
  onStart,
}) => {
  return (
    <div className="welcome-screen-new">
      {/* Header section positioned top-right (but LTR inside for stats) */}
      <div className="welcome-header">
        <div className="welcome-stats-bg">
          <img src={questionCoinImg} alt="Question Coin" />
          <div className="welcome-stats-center">
            <span>{questionsCount}</span>
            <span className="separator">{'>'}</span>
            {/* The points equal the question point number as requested */}
            <span className="xp-text">{questionsCount}</span>
          </div>
          <img src={daddcoinImg} alt="Gold Coin" />
        </div>
      </div>

      {/* Body section vertically centered */}
      <div className="welcome-body">
        <img src={descriptionImg} alt="كيفية اللعب" className="how-to-play-img" />
      </div>

      {/* Footer / Start Button */}
      <div className="welcome-footer">
        {error && <div className="error-text">حدث خطأ: {error}</div>}
        {!error && questionsCount === 0 && !isLoading && (
          <div className="error-text">لا توجد أسئلة متاحة حالياً.</div>
        )}
        <button 
          className="start-button" 
          onClick={onStart}
          disabled={isLoading || questionsCount === 0 || !!error}
        >
          {isLoading ? 'جاري تحميل الأسئلة...' : 'ابدَأ!'}
        </button>
      </div>
    </div>
  );
};

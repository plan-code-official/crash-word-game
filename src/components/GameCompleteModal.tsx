import React from 'react';
import daddcoinImg from '../assets/daddcoin.webp';

interface GameCompleteModalProps {
  isOpen: boolean;
  score: number;
  stars: number;
  coins: number;
  experience: number;
  onExit: () => void;
}

export const GameCompleteModal: React.FC<GameCompleteModalProps> = ({
  isOpen,
  score,
  stars,
  coins,
  experience,
  onExit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="victory-modal-content game-complete-modal">
        <h2 className="victory-title">اكتملت اللعبة!</h2>
        
        <div className="stars-container">
          {[1, 2, 3].map((starIdx) => (
            <div key={starIdx} className={`star ${starIdx <= stars ? 'filled' : 'empty'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill={starIdx <= stars ? "#FFD700" : "#E0E0E0"} stroke={starIdx <= stars ? "#F57F17" : "#BDBDBD"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          ))}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">النقاط</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">العملات</span>
            <div className="stat-value coin-value">
              <span>{coins}</span>
              <img src={daddcoinImg} alt="coin" className="stat-coin" />
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">الخبرة</span>
            <span className="stat-value">{experience} XP</span>
          </div>
        </div>

        <button className="primary-action-btn" onClick={onExit}>
          خروج
        </button>
      </div>
    </div>
  );
};

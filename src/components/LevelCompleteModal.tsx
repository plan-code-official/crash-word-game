import React from 'react';

interface LevelCompleteModalProps {
  isOpen: boolean;
  levelNumber: number;
  onNextLevel: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  levelNumber,
  onNextLevel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {/* Stars */}
        <div className="modal-stars-row">
          <span className="star-item star-side">⭐</span>
          <span className="star-item star-main">⭐</span>
          <span className="star-item star-side">⭐</span>
        </div>

        <h2 className="modal-title">أحسنت!</h2>
        <p className="modal-subtitle">تم إكمال المرحلة {levelNumber} بنجاح</p>

        <div className="modal-reward-badge">
          <span>+20</span>
          <div className="gold-coin-icon"></div>
        </div>

        <button className="modal-next-btn" onClick={onNextLevel}>
          المرحلة التالية ◀
        </button>
      </div>
    </div>
  );
};

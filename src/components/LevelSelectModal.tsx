import React from 'react';
import type { LevelData } from '../types';

interface LevelSelectModalProps {
  isOpen: boolean;
  levels: LevelData[];
  currentLevelIndex: number;
  onSelectLevel: (index: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  levels,
  currentLevelIndex,
  onSelectLevel,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card level-select-card" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="modal-header-row">
          <h2 className="modal-title">خريطة المراحل</h2>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        <div className="level-grid-selection">
          {levels.map((lvl, idx) => {
            const isCurrent = currentLevelIndex === idx;
            return (
              <button
                key={lvl.id}
                className={`level-node-btn ${isCurrent ? 'node-active' : ''}`}
                onClick={() => {
                  onSelectLevel(idx);
                  onClose();
                }}
              >
                <span className="node-number">{lvl.levelNumber}</span>
                <span className="node-name">{lvl.theme}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

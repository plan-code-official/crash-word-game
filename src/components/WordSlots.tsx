import React from 'react';
import type { TargetWord } from '../types';

interface WordSlotsProps {
  targetWords: TargetWord[];
  foundWordIds: string[];
  lastFoundId: string | null;
}

export const WordSlots: React.FC<WordSlotsProps> = ({
  targetWords,
  foundWordIds,
  lastFoundId
}) => {
  return (
    <div className="word-slots-container" dir="rtl">
      {targetWords.map((item) => {
        const isFound = foundWordIds.includes(item.id);
        const isRecent = lastFoundId === item.id;
        const colorClass = `theme-${item.color || 'green'}`;

        if (isFound) {
          return (
            <div 
              key={item.id} 
              className={`word-slot-capsule slot-solved ${colorClass} ${isRecent ? 'slot-pop-anim' : ''}`}
            >
              <span className="solved-word-text">{item.word}</span>
            </div>
          );
        }

        return (
          <div key={item.id} className="word-slot-capsule slot-empty">
            <div className="empty-dots-row">
              {Array.from({ length: item.word.length }).map((_, i) => (
                <div key={i} className="empty-dash"></div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

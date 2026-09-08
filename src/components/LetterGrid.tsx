import React, { useRef, useEffect } from 'react';
import { sounds } from '../utils/audio';

interface LetterGridProps {
  grid: string[];
  cols: number;
  rows: number;
  selectedIndices: number[];
  solvedMap: { [index: number]: string }; // index -> color theme ('orange', 'purple', 'green', etc.)
  wrongSelection: boolean;
  hintIndices: number[];
  onStartSelection: (index: number) => void;
  onHoverLetter: (index: number) => void;
  onEndSelection: () => void;
}

export const LetterGrid: React.FC<LetterGridProps> = ({
  grid,
  cols,
  selectedIndices,
  solvedMap,
  wrongSelection,
  hintIndices,
  onStartSelection,
  onHoverLetter,
  onEndSelection
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Global mouse up / touch end listener
  useEffect(() => {
    const handleGlobalEnd = () => {
      onEndSelection();
    };

    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    window.addEventListener('touchcancel', handleGlobalEnd);

    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('touchcancel', handleGlobalEnd);
    };
  }, [onEndSelection]);

  // Touch move handler to detect element under finger
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!targetElement) return;

    const tileElement = targetElement.closest('[data-tile-index]') as HTMLElement | null;
    if (tileElement && tileElement.dataset.tileIndex !== undefined) {
      const index = parseInt(tileElement.dataset.tileIndex, 10);
      onHoverLetter(index);
    }
  };

  const isStone = (letter: string) => !letter || letter === 'ROCK';

  return (
    <div className="letter-grid-wrapper">
      <div 
        ref={gridRef}
        className={`letter-grid-container grid-cols-${cols} ${wrongSelection ? 'grid-shake-anim' : ''}`}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`
        }}
        onTouchMove={handleTouchMove}
        dir="rtl"
      >
        {grid.map((letter, index) => {
          const isObstacle = isStone(letter);
          const isSelected = selectedIndices.includes(index);
          const solvedColor = solvedMap[index];
          const isSolved = Boolean(solvedColor);
          const isHinted = hintIndices.includes(index);
          const orderInSelection = selectedIndices.indexOf(index) + 1;

          if (isObstacle) {
            return (
              <div 
                key={index}
                className="grid-tile-slot stone-tile"
                data-tile-index={index}
              >
                <div className="stone-texture">
                  <div className="stone-crack-1"></div>
                  <div className="stone-crack-2"></div>
                </div>
              </div>
            );
          }

          // Solved / Used Letter Tile (Color-coded permanently & cannot be reused)
          if (isSolved) {
            return (
              <div
                key={index}
                data-tile-index={index}
                className={`grid-tile-slot letter-tile tile-solved theme-${solvedColor}`}
              >
                <span className="tile-arabic-char">{letter}</span>
              </div>
            );
          }

          // Interactive Normal / Selected Tile
          return (
            <div
              key={index}
              data-tile-index={index}
              className={`grid-tile-slot letter-tile ${isSelected ? 'tile-active-green' : 'tile-normal'} ${isHinted ? 'tile-hinted' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                sounds.playLetterSelect(0);
                onStartSelection(index);
              }}
              onMouseEnter={() => {
                onHoverLetter(index);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                sounds.playLetterSelect(0);
                onStartSelection(index);
              }}
            >
              <span className="tile-arabic-char">{letter}</span>
              {isSelected && selectedIndices.length > 1 && (
                <span className="selection-badge">{orderInSelection}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

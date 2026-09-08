import { useState, useCallback } from 'react';
import { LEVELS } from './data/levels';
import { TopBar } from './components/TopBar';
import { PictureArea } from './components/PictureArea';
import { WordSlots } from './components/WordSlots';
import { LetterGrid } from './components/LetterGrid';
import { BottomBar } from './components/BottomBar';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { sounds } from './utils/audio';

export function App() {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [coins, setCoins] = useState<number>(6);
  const [foundWordIds, setFoundWordIds] = useState<string[]>([]);
  const [solvedMap, setSolvedMap] = useState<{ [index: number]: string }>({}); // index -> word color theme
  const [lastFoundId, setLastFoundId] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [wrongSelection, setWrongSelection] = useState<boolean>(false);
  const [hintIndices, setHintIndices] = useState<number[]>([]);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  const currentLevel = LEVELS[levelIndex] || LEVELS[0];
  const cols = currentLevel.cols || 6;
  const rows = currentLevel.rows || 6;

  // Check if two grid indices are adjacent (orthogonally or diagonally: 8 directions)
  const areAdjacent = useCallback((idx1: number, idx2: number): boolean => {
    const r1 = Math.floor(idx1 / cols);
    const c1 = idx1 % cols;
    const r2 = Math.floor(idx2 / cols);
    const c2 = idx2 % cols;

    const dR = Math.abs(r1 - r2);
    const dC = Math.abs(c1 - c2);

    return dR <= 1 && dC <= 1 && !(dR === 0 && dC === 0);
  }, [cols]);

  // Check if a tile is already solved or blocked (rock)
  const isTileBlocked = useCallback((idx: number): boolean => {
    const letter = currentLevel.grid[idx];
    if (!letter || letter === 'ROCK') return true;
    if (solvedMap[idx]) return true; // Already used/solved -> cannot be reused!
    return false;
  }, [currentLevel, solvedMap]);

  // Start selection when pressing down on any valid tile
  const handleStartSelection = (index: number) => {
    if (wrongSelection || isTileBlocked(index)) return;

    setIsDragging(true);
    setSelectedIndices([index]);
    setHintIndices([]);
  };

  // Freeform adjacent drag handler: supports straight lines, L-shapes, zig-zag, curves, etc.
  const handleHoverLetter = (targetIndex: number) => {
    if (!isDragging || wrongSelection) return;
    if (isTileBlocked(targetIndex)) return;

    // 1. Backtracking: if user moves back to previous tile, pop the head of the path
    if (selectedIndices.length > 1 && selectedIndices[selectedIndices.length - 2] === targetIndex) {
      const nextList = selectedIndices.slice(0, selectedIndices.length - 1);
      setSelectedIndices(nextList);
      sounds.playLetterSelect(nextList.length);
      return;
    }

    // 2. Ignore if already in current selection path (no self-loops)
    if (selectedIndices.includes(targetIndex)) return;

    // 3. Connect freely if adjacent to the current head of the path
    const currentHead = selectedIndices[selectedIndices.length - 1];
    if (currentHead !== undefined && areAdjacent(currentHead, targetIndex)) {
      const nextList = [...selectedIndices, targetIndex];
      setSelectedIndices(nextList);
      sounds.playLetterSelect(nextList.length);
    }
  };

  // Release mouse or touch
  const handleEndSelection = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (selectedIndices.length < 2) {
      setSelectedIndices([]);
      return;
    }

    // Build the candidate string from selected tiles (supports any shape: L, line, curved)
    const formedWord = selectedIndices.map((i) => currentLevel.grid[i]).join('');
    const reversedWord = [...formedWord].reverse().join('');

    // Check if matches an unfound target word
    const matchedTarget = currentLevel.targetWords.find(
      (tw) => (tw.word === formedWord || tw.word === reversedWord) && !foundWordIds.includes(tw.id)
    );

    if (matchedTarget) {
      // Correct word found!
      sounds.playWordCorrect();
      const updatedFound = [...foundWordIds, matchedTarget.id];
      setFoundWordIds(updatedFound);
      setLastFoundId(matchedTarget.id);

      // Permanently mark these tiles as solved with the word's color (No reusing!)
      const newSolvedMap = { ...solvedMap };
      selectedIndices.forEach((idx) => {
        newSolvedMap[idx] = matchedTarget.color || 'green';
      });
      setSolvedMap(newSolvedMap);

      setSelectedIndices([]);
      setCoins((c) => c + 5);

      // Check if level is complete
      if (updatedFound.length === currentLevel.targetWords.length) {
        setTimeout(() => {
          sounds.playLevelComplete();
          setIsCompletedModalOpen(true);
          setCoins((c) => c + 20);
        }, 500);
      }
    } else {
      // Wrong word
      sounds.playWrong();
      setWrongSelection(true);
      setTimeout(() => {
        setWrongSelection(false);
        setSelectedIndices([]);
      }, 450);
    }
  }, [isDragging, selectedIndices, currentLevel, foundWordIds, solvedMap]);

  // Hint button: reveal next unsolved word
  const handleHint = () => {
    if (coins < 10) return;

    const unsolved = currentLevel.targetWords.find((tw) => !foundWordIds.includes(tw.id));
    if (!unsolved) return;

    sounds.playHint();
    setCoins((c) => c - 10);

    const updatedFound = [...foundWordIds, unsolved.id];
    setFoundWordIds(updatedFound);
    setLastFoundId(unsolved.id);

    // Mark solved on grid permanently
    if (unsolved.indices) {
      const newSolvedMap = { ...solvedMap };
      unsolved.indices.forEach((idx) => {
        newSolvedMap[idx] = unsolved.color || 'green';
      });
      setSolvedMap(newSolvedMap);
      setHintIndices(unsolved.indices);
      setTimeout(() => setHintIndices([]), 1200);
    }

    if (updatedFound.length === currentLevel.targetWords.length) {
      setTimeout(() => {
        sounds.playLevelComplete();
        setIsCompletedModalOpen(true);
        setCoins((c) => c + 20);
      }, 600);
    }
  };

  // Video reward (+25 coins)
  const handleVideoReward = () => {
    sounds.playHint();
    setCoins((c) => c + 25);
    setRewardToast('+25 عملة ذهبية مجاناً!');
    setTimeout(() => setRewardToast(null), 2500);
  };

  // Next level transition
  const handleNextLevel = () => {
    setIsCompletedModalOpen(false);
    const nextIdx = (levelIndex + 1) % LEVELS.length;
    setLevelIndex(nextIdx);
    setFoundWordIds([]);
    setSolvedMap({});
    setLastFoundId(null);
    setSelectedIndices([]);
    setHintIndices([]);
  };

  // Switch to specific level from map modal
  const handleSelectLevel = (idx: number) => {
    setLevelIndex(idx);
    setFoundWordIds([]);
    setSolvedMap({});
    setLastFoundId(null);
    setSelectedIndices([]);
    setHintIndices([]);
  };

  const currentFormedWord = selectedIndices.map((i) => currentLevel.grid[i]).join('');

  return (
    <div className="game-screen-wrapper">
      <main className="game-main-container">
        
        {/* Top Header */}
        <TopBar 
          levelTitle={currentLevel.title}
          coins={coins}
          onMapClick={() => setIsMapModalOpen(true)}
          onAddCoins={handleVideoReward}
        />

        {/* Responsive Content Area */}
        <div className="game-body-layout">
          
          {/* Picture & Word Slots Section */}
          <div className="game-picture-section">
            <PictureArea 
              imageType={currentLevel.imageSvgType} 
              theme={currentLevel.theme} 
            />

            <WordSlots 
              targetWords={currentLevel.targetWords}
              foundWordIds={foundWordIds}
              lastFoundId={lastFoundId}
            />

            {/* Floating drag word preview */}
            <div className={`formed-word-floating ${currentFormedWord ? 'visible' : ''}`}>
              <span>{currentFormedWord || ' '}</span>
            </div>
          </div>

          {/* Interactive Letter Grid with Freeform Drag (L-shape, straight, curved) */}
          <div className="game-grid-section">
            <LetterGrid 
              grid={currentLevel.grid}
              cols={cols}
              rows={rows}
              selectedIndices={selectedIndices}
              solvedMap={solvedMap}
              wrongSelection={wrongSelection}
              hintIndices={hintIndices}
              onStartSelection={handleStartSelection}
              onHoverLetter={handleHoverLetter}
              onEndSelection={handleEndSelection}
            />
          </div>

        </div>

        {/* Bottom Bar Controls */}
        <BottomBar 
          coins={coins}
          onHintClick={handleHint}
          onVideoRewardClick={handleVideoReward}
          onExitClick={() => setIsMapModalOpen(true)}
        />

        {/* Floating Reward Toast */}
        {rewardToast && (
          <div className="reward-toast-badge">
            <span>{rewardToast}</span>
          </div>
        )}

        {/* Map / Level Select Modal */}
        <LevelSelectModal 
          isOpen={isMapModalOpen}
          levels={LEVELS}
          currentLevelIndex={levelIndex}
          onSelectLevel={handleSelectLevel}
          onClose={() => setIsMapModalOpen(false)}
        />

        {/* Victory Modal */}
        <LevelCompleteModal 
          isOpen={isCompletedModalOpen}
          levelNumber={currentLevel.levelNumber}
          onNextLevel={handleNextLevel}
        />

      </main>
    </div>
  );
}

export default App;

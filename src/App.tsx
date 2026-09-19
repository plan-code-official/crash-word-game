import { useState, useCallback, useEffect, useRef } from 'react';
import type { LevelData } from './types';
import { convertQuestionToLevel } from './utils/GridGenerator';
import { TopBar } from './components/TopBar';
import { PictureArea } from './components/PictureArea';
import { WordSlots } from './components/WordSlots';
import { LetterGrid } from './components/LetterGrid';
import { BottomBar } from './components/BottomBar';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { GameCompleteModal } from './components/GameCompleteModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { sounds } from './utils/audio';
import { fetchQuestions, startSession, submitAnswers, completeSession } from './services/api';
import type { BackendQuestion, SubmitAnswerPayload } from './services/api';

export function App() {
  // Backend Integration State
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<{ token: string; sessionId: string; } | null>(null);
  const [backendQuestions, setBackendQuestions] = useState<BackendQuestion[]>([]);
  const [levels, setLevels] = useState<LevelData[]>([]);
  const answersRef = useRef<SubmitAnswerPayload[]>([]);
  const levelStartTimeRef = useRef<number>(Date.now());
  const [isGameCompleteModalOpen, setIsGameCompleteModalOpen] = useState(false);
  const [finalStats, setFinalStats] = useState<any>(null);

  // Game State
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

  // Fetch Questions & Start Session on Mount
  useEffect(() => {
    const initGame = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const lessonId = searchParams.get('lessonId');
        const token = searchParams.get('token');

        if (!lessonId || !token) {
          throw new Error('Missing lessonId or token in URL');
        }

        const questions = await fetchQuestions(lessonId, token);
        setBackendQuestions(questions);
        
        const dynamicLevels = questions.map((q, idx) => convertQuestionToLevel(q, idx));
        setLevels(dynamicLevels);

        const sessionId = await startSession(lessonId, token);
        setSessionData({ token, sessionId });
        levelStartTimeRef.current = Date.now();
      } catch (err: any) {
        setApiError(err.message || 'Failed to initialize game');
      } finally {
        setIsLoading(false);
      }
    };
    initGame();
  }, []);

  const currentLevel = levels[levelIndex];
  const cols = currentLevel?.cols || 6;
  const rows = currentLevel?.rows || 6;

  const areAdjacent = useCallback((idx1: number, idx2: number): boolean => {
    const r1 = Math.floor(idx1 / cols);
    const c1 = idx1 % cols;
    const r2 = Math.floor(idx2 / cols);
    const c2 = idx2 % cols;

    const dR = Math.abs(r1 - r2);
    const dC = Math.abs(c1 - c2);

    return dR <= 1 && dC <= 1 && !(dR === 0 && dC === 0);
  }, [cols]);

  const isTileBlocked = useCallback((idx: number): boolean => {
    if (!currentLevel) return true;
    const letter = currentLevel.grid[idx];
    if (!letter || letter === 'ROCK') return true;
    if (solvedMap[idx]) return true; 
    return false;
  }, [currentLevel, solvedMap]);

  const handleStartSelection = (index: number) => {
    if (wrongSelection || isTileBlocked(index)) return;

    setIsDragging(true);
    setSelectedIndices([index]);
    setHintIndices([]);
  };

  const handleHoverLetter = (targetIndex: number) => {
    if (!isDragging || wrongSelection) return;
    if (isTileBlocked(targetIndex)) return;

    if (selectedIndices.length > 1 && selectedIndices[selectedIndices.length - 2] === targetIndex) {
      const nextList = selectedIndices.slice(0, selectedIndices.length - 1);
      setSelectedIndices(nextList);
      sounds.playLetterSelect(nextList.length);
      return;
    }

    if (selectedIndices.includes(targetIndex)) return;

    const currentHead = selectedIndices[selectedIndices.length - 1];
    if (currentHead !== undefined && areAdjacent(currentHead, targetIndex)) {
      const nextList = [...selectedIndices, targetIndex];
      setSelectedIndices(nextList);
      sounds.playLetterSelect(nextList.length);
    }
  };

  const handleEndSelection = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (selectedIndices.length < 2) {
      setSelectedIndices([]);
      return;
    }

    const formedWord = selectedIndices.map((i) => currentLevel.grid[i]).join('');
    const reversedWord = [...formedWord].reverse().join('');

    const matchedTarget = currentLevel.targetWords.find(
      (tw) => (tw.word === formedWord || tw.word === reversedWord) && !foundWordIds.includes(tw.id)
    );

    if (matchedTarget) {
      sounds.playWordCorrect();
      const updatedFound = [...foundWordIds, matchedTarget.id];
      setFoundWordIds(updatedFound);
      setLastFoundId(matchedTarget.id);

      const newSolvedMap = { ...solvedMap };
      selectedIndices.forEach((idx) => {
        newSolvedMap[idx] = matchedTarget.color || 'green';
      });
      setSolvedMap(newSolvedMap);

      setSelectedIndices([]);
      setCoins((c) => c + 5);

      if (updatedFound.length === currentLevel.targetWords.length) {
        setTimeout(() => {
          sounds.playLevelComplete();
          setIsCompletedModalOpen(true);
          setCoins((c) => c + 20);
        }, 500);
      }
    } else {
      sounds.playWrong();
      setWrongSelection(true);
      setTimeout(() => {
        setWrongSelection(false);
        setSelectedIndices([]);
      }, 450);
    }
  }, [isDragging, selectedIndices, currentLevel, foundWordIds, solvedMap]);

  const handleHint = () => {
    if (coins < 10) return;

    const unsolved = currentLevel.targetWords.find((tw) => !foundWordIds.includes(tw.id));
    if (!unsolved) return;

    sounds.playHint();
    setCoins((c) => c - 10);

    const updatedFound = [...foundWordIds, unsolved.id];
    setFoundWordIds(updatedFound);
    setLastFoundId(unsolved.id);

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

  const handleNextLevel = async () => {
    setIsCompletedModalOpen(false);

    // Record dummy answer for this level
    if (sessionData && backendQuestions.length > 0) {
      const timeTaken = Math.floor((Date.now() - levelStartTimeRef.current) / 1000);
      const qId = backendQuestions[Math.min(levelIndex, backendQuestions.length - 1)]?.id || 0;
      
      answersRef.current.push({
        questionId: qId,
        selectedAnswer: 'Completed',
        timeTaken
      });
    }

    const nextIdx = levelIndex + 1;
    if (nextIdx < levels.length) {
      // Continue to next level
      setLevelIndex(nextIdx);
      setFoundWordIds([]);
      setSolvedMap({});
      setLastFoundId(null);
      setSelectedIndices([]);
      setHintIndices([]);
      levelStartTimeRef.current = Date.now();
    } else {
      // Game Over Sequence
      if (sessionData) {
        try {
          setIsLoading(true);
          await submitAnswers(sessionData.sessionId, sessionData.token, answersRef.current);
          const stats = await completeSession(sessionData.sessionId, sessionData.token);
          setFinalStats(stats);
          setIsGameCompleteModalOpen(true);
        } catch (err: any) {
          setApiError(err.message || 'Failed to complete game');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Fallback
        setFinalStats({ score: 100, stars: 3, coins, experience: 100 });
        setIsGameCompleteModalOpen(true);
      }
    }
  };

  const handleSelectLevel = (idx: number) => {
    setLevelIndex(idx);
    setFoundWordIds([]);
    setSolvedMap({});
    setLastFoundId(null);
    setSelectedIndices([]);
    setHintIndices([]);
  };

  if (!hasStarted) {
    return (
      <WelcomeScreen 
        questionsCount={levels.length}
        isLoading={isLoading}
        error={apiError}
        onStart={() => setHasStarted(true)}
      />
    );
  }

  const currentFormedWord = selectedIndices.map((i) => currentLevel.grid[i]).join('');

  return (
    <div className="game-screen-wrapper">
      <main className="game-main-container">
        <TopBar 
          levelTitle={currentLevel.title}
          coins={coins}
          onMapClick={() => setIsMapModalOpen(true)}
        />
        <div className="game-body-layout">
          <div className="game-picture-section">
            <PictureArea 
              imageSvgType={currentLevel.imageSvgType}
              imageUrl={currentLevel.imageUrl}
              theme={currentLevel.theme} 
            />
            <WordSlots 
              targetWords={currentLevel.targetWords}
              foundWordIds={foundWordIds}
              lastFoundId={lastFoundId}
            />
            <div className={`formed-word-floating ${currentFormedWord ? 'visible' : ''}`}>
              <span>{currentFormedWord || ' '}</span>
            </div>
          </div>
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
        <BottomBar 
          coins={coins}
          onHintClick={handleHint}
        />
        <LevelSelectModal 
          isOpen={isMapModalOpen}
          levels={levels}
          currentLevelIndex={levelIndex}
          onSelectLevel={handleSelectLevel}
          onClose={() => setIsMapModalOpen(false)}
        />
        <LevelCompleteModal 
          isOpen={isCompletedModalOpen}
          levelNumber={currentLevel.levelNumber}
          onNextLevel={handleNextLevel}
        />
        <GameCompleteModal
          isOpen={isGameCompleteModalOpen}
          score={finalStats?.score || 0}
          stars={finalStats?.stars || 3}
          coins={finalStats?.coins || coins}
          experience={finalStats?.experience || 0}
          onExit={() => window.parent.postMessage('GAME_COMPLETED', '*')}
        />
      </main>
    </div>
  );
}

export default App;

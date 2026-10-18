import { useState, useCallback, useEffect, useRef } from 'react';
import type { LevelData } from './types';
import { convertQuestionToLevel } from './utils/GridGenerator';
import { TopBar } from './components/TopBar';
import { PictureArea } from './components/PictureArea';
import { WordSlots } from './components/WordSlots';
import { LetterGrid } from './components/LetterGrid';
import { BottomBar } from './components/BottomBar';
import { LevelSelectModal } from './components/LevelSelectModal';
import { CelebrationWrapper } from './components/CelebrationWrapper';
import ResultsPanel from './ResultsPanel/ResultsPanel';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { sounds } from './utils/audio';
import { exitGame } from './utils/exitGame';
import { fetchQuestions, startSession, submitAnswers, completeSession, getIsNonStudentAuth } from './services/api';
import { QuestionMedia } from './components/QuestionMedia';
import { preloadQuestionAssets } from './utils/preloadAssets';
import type { BackendQuestion, SubmitAnswerPayload } from './services/api';

const MAX_LIVES = 5;

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
  const [showCelebration, setShowCelebration] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finalStats, setFinalStats] = useState<any>(null);
  const [supervisorWarning, setSupervisorWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // Overlays
  const [showCorrectOverlay, setShowCorrectOverlay] = useState(false);
  const [showWrongOverlay, setShowWrongOverlay] = useState(false);
  const [showNoCoinsOverlay, setShowNoCoinsOverlay] = useState(false);

  // Game State
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [coins, setCoins] = useState<number>(6);
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const livesRef = useRef<number>(MAX_LIVES);
  const [choicesFound, setChoicesFound] = useState<number>(0);
  const choicesFoundRef = useRef<number>(0);
  const [wrongWordAttempts, setWrongWordAttempts] = useState<number>(0);
  const [coinsUsed, setCoinsUsed] = useState<number>(0);
  const [foundWordIds, setFoundWordIds] = useState<string[]>([]);
  const [solvedMap, setSolvedMap] = useState<{ [index: number]: string }>({}); // index -> word color theme
  const [lastFoundId, setLastFoundId] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [wrongSelection, setWrongSelection] = useState<boolean>(false);
  const [hintIndices, setHintIndices] = useState<number[]>([]);
  const [hintCount, setHintCount] = useState<number>(0);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // Fetch Questions & Start Session on Mount
  useEffect(() => {
    const initGame = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const lessonId = searchParams.get('lessonId');
        // Optional: when absent, api.ts obtains the token via the refresh endpoint
        const token = searchParams.get('token') || '';

        if (!lessonId) {
          throw new Error('Missing lessonId in URL');
        }

        const questions = await fetchQuestions(lessonId, token);
        if (!questions || questions.length === 0) {
          throw new Error('لم يتم العثور على أي أسئلة لهذا الدرس');
        }
        setBackendQuestions(questions);
        preloadQuestionAssets(questions);
        
        const dynamicLevels = questions.map((q, idx) => convertQuestionToLevel(q, idx));
        setLevels(dynamicLevels);

        const { sessionId, coins: fetchedCoins } = await startSession(lessonId, token);
        setSessionData({ token, sessionId });
        
        if (typeof fetchedCoins === 'number' && !isNaN(fetchedCoins)) {
          setCoins(fetchedCoins);
        }
        
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

  // Supervisor warning toast when words cannot fit into the grid
  useEffect(() => {
    if (getIsNonStudentAuth()) {
      if (currentLevel?.hasFittingIssue) {
        setSupervisorWarning('الكلمات كثيرة ولا تتسع في الشبكة');
      } else if (!hasStarted && levels.some((l) => l.hasFittingIssue)) {
        setSupervisorWarning('الكلمات كثيرة ولا تتسع في الشبكة');
      } else {
        setSupervisorWarning(null);
      }
    }
  }, [currentLevel, levels, hasStarted]);
  const cols = currentLevel?.cols || 6;
  const rows = currentLevel?.rows || 6;
  const totalChoices = levels.reduce((total, level) => total + level.targetWords.length, 0);

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

  const finishGame = async (currentChoices?: number, _currentWrongs = wrongWordAttempts) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const validChoices = typeof currentChoices === 'number' ? currentChoices : choicesFoundRef.current;
    const questionsCount = totalChoices || backendQuestions.length || 1;
    const percentage = questionsCount > 0 ? Math.round((validChoices / questionsCount) * 100) : 0;
    const shouldCelebrate = percentage > 50;

    if (sessionData) {
      try {
        if (answersRef.current.length === 0 && backendQuestions.length > 0) {
          const timeTaken = Math.max(1, Math.floor((Date.now() - levelStartTimeRef.current) / 1000));
          const qId = backendQuestions[Math.min(levelIndex, backendQuestions.length - 1)]?.id || 0;
          answersRef.current.push({
            questionId: qId,
            selectedAnswer: 'Completed',
            timeTaken,
            nofvalidanswers: validChoices
          });
        }
        if (answersRef.current.length > 0) {
          await submitAnswers(sessionData.sessionId, sessionData.token, answersRef.current, validChoices);
        }
        const stats = await completeSession(sessionData.sessionId, sessionData.token, coinsUsed);
        setFinalStats(stats);
        if (shouldCelebrate) {
          setShowCelebration(true);
        } else {
          setShowResults(true);
        }
      } catch (err: any) {
        setApiError(err.message || 'Failed to complete game');
      } finally {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    } else {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      // Fallback
      setFinalStats({ score: percentage, stars: percentage > 50 ? 2 : 0, coins: coins, experience: percentage });
      if (shouldCelebrate) {
        setShowCelebration(true);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleLevelComplete = async () => {
    // Record dummy answer for this level
    if (sessionData && backendQuestions.length > 0) {
      const timeTaken = Math.floor((Date.now() - levelStartTimeRef.current) / 1000);
      const qId = backendQuestions[Math.min(levelIndex, backendQuestions.length - 1)]?.id || 0;
      
      answersRef.current.push({
        questionId: qId,
        selectedAnswer: 'Completed',
        timeTaken,
        nofvalidanswers: currentLevel?.targetWords.length || 0
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
      setHintCount(0);
      levelStartTimeRef.current = Date.now();
    } else {
      // Game Over Sequence
      finishGame();
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

    // Only the exact order is valid; the reversed word must NOT match.
    const matchedTarget = currentLevel.targetWords.find(
      (tw) => tw.word === formedWord && !foundWordIds.includes(tw.id)
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
      setHintIndices([]);
      setHintCount(0);
      setCoins((c) => c + 1);
      setChoicesFound((count) => {
        const next = count + 1;
        choicesFoundRef.current = next;
        return next;
      });

      setShowCorrectOverlay(true);
      setTimeout(() => setShowCorrectOverlay(false), 1200);

      if (updatedFound.length === currentLevel.targetWords.length) {
        setTimeout(() => {
          sounds.playLevelComplete();
          handleLevelComplete();
        }, 500);
      }
    } else {
      const nextWrongs = wrongWordAttempts + 1;
      setWrongWordAttempts(nextWrongs);
      const nextLives = Math.max(0, livesRef.current - 1);
      livesRef.current = nextLives;
      setLives(nextLives);

      sounds.playWrong();
      setWrongSelection(true);
      setShowWrongOverlay(true);
      setTimeout(() => {
        setWrongSelection(false);
        setSelectedIndices([]);
      }, 450);
      setTimeout(() => setShowWrongOverlay(false), 1200);

      if (nextLives <= 0) {
        setTimeout(() => {
          finishGame(choicesFound, nextWrongs);
        }, 500);
      }
    }
  }, [isDragging, selectedIndices, currentLevel, foundWordIds, solvedMap, choicesFound, wrongWordAttempts]);

  const handleHint = () => {
    if (coins < 1) {
      setShowNoCoinsOverlay(true);
      setTimeout(() => setShowNoCoinsOverlay(false), 1500);
      return;
    }

    const unsolved = currentLevel.targetWords.find((tw) => !foundWordIds.includes(tw.id));
    if (!unsolved || !unsolved.indices) return;

    sounds.playHint();
    setCoins((c) => c - 1);
    setCoinsUsed((prev) => prev + 1);

    // Give hint for a single character in the unsolved word
    const hintIdx = unsolved.indices[hintCount % unsolved.indices.length];
    
    setHintIndices((prev) => {
      if (!prev.includes(hintIdx)) {
        return [...prev, hintIdx];
      }
      return prev;
    });
    setHintCount((c) => c + 1);
  };

  const handleSelectLevel = (idx: number) => {
    setLevelIndex(idx);
    setFoundWordIds([]);
    setSolvedMap({});
    setLastFoundId(null);
    setSelectedIndices([]);
    setHintIndices([]);
  };

  // Endgame: Celebration finishes → show ResultsPanel
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setShowResults(true);
  };

  // ResultsPanel: Retry → reload page for fresh state
  const handleRetry = () => {
    window.location.reload();
  };

  // ResultsPanel / Exit Game: Back → exit game
  const handleExitSite = exitGame;

  if (apiError) {
    return (
      <ErrorScreen
        onExit={handleExitSite}
        description={
          apiError.toLowerCase().includes('lessonid')
            ? 'لا يمكننا العثور على الدرس المطلوب. يرجى التأكد من الرابط أو العودة للرئيسية.'
            : 'تعذر تحميل بيانات اللعبة في الوقت الحالي. دعنا نذهب إلى مكان مألوف.'
        }
      />
    );
  }

  if (!isLoading && levels.length === 0) {
    return (
      <ErrorScreen
        onExit={handleExitSite}
        description="لم يتم العثور على أي مراحل أو أسئلة متاحة في هذا الدرس."
      />
    );
  }

  if (!hasStarted) {
    return (
      <>
        {supervisorWarning && (
          <div className="warning-toast-badge" dir="rtl">
            <span>⚠️ {supervisorWarning}</span>
          </div>
        )}
        <WelcomeScreen 
          choicesCount={totalChoices}
          isLoading={isLoading}
          error={apiError}
          onStart={() => {
            setLives(MAX_LIVES);
            livesRef.current = MAX_LIVES;
            setHasStarted(true);
          }}
        />
      </>
    );
  }

  if (!currentLevel) {
    return (
      <ErrorScreen
        onExit={handleExitSite}
        description="حدث خطأ أثناء تحميل المرحلة الحالية."
      />
    );
  }

  const currentFormedWord = selectedIndices.map((i) => currentLevel.grid[i]).join('');

  return (
    <div className="game-screen-wrapper">
      <main className="game-main-container">
        {supervisorWarning && (
          <div className="warning-toast-badge" dir="rtl">
            <span>⚠️ {supervisorWarning}</span>
          </div>
        )}
        
        {showCorrectOverlay && (
          <div className="answer-overlay answer-feedback-card answer-feedback-card--success" dir="rtl">
            <svg className="answer-feedback__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg><span>أحسنت!</span>
          </div>
        )}
        
        {showWrongOverlay && (
          <div className="answer-overlay answer-feedback-card answer-feedback-card--wrong" dir="rtl">
            <svg className="answer-feedback__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></svg><span>خطأ</span>
          </div>
        )}

        {showNoCoinsOverlay && (
          <div className="answer-overlay wrong" style={{ fontSize: '2.5rem', padding: '15px 30px' }}>
            لا يوجد رصيد كافي
          </div>
        )}

        <TopBar 
          currentChoice={choicesFound}
          totalChoices={totalChoices}
          coins={coins}
          lives={lives}
          maxLives={MAX_LIVES}
          onExitClick={handleExitSite}
        />
        <div className="game-body-layout">
          <div className="game-picture-section">
            <QuestionMedia text={currentLevel.questionText} audioUrl={currentLevel.audioUrl} />
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
      </main>

      {isSubmitting && (
        <div className="submitting-overlay" aria-busy="true">
          <div className="submitting-spinner" />
        </div>
      )}

      <CelebrationWrapper
        isVisible={showCelebration}
        onComplete={handleCelebrationComplete}
      />

      {showResults && (
        <ResultsPanel
          score={finalStats?.score ?? 0}
          totalScore={100}
          correctAnswers={choicesFound}
          wrongAnswers={wrongWordAttempts}
          totalAnswers={choicesFound + wrongWordAttempts}
          totalQuestions={totalChoices}
          coins={finalStats?.coins ?? (sessionData ? 0 : coins)}
          onRetry={handleRetry}
          onBack={handleExitSite}
        />
      )}
    </div>
  );
}

export default App;

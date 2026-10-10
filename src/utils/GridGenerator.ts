import type { LevelData, TargetWord } from '../types';
import type { BackendQuestion } from '../services/api';

const ARABIC_LETTERS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';

function generateRandomArabicLetter() {
  return ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
}

export function convertQuestionToLevel(question: BackendQuestion, index: number): LevelData {
  const words = question.options.map(o => o.text).filter(w => typeof w === 'string' && w.trim().length > 0);
  const questionImage = question.imageUrl || question.options.find((option: any) => option?.imageUrl)?.imageUrl;
  const questionAudio = question.audioUrl || question.options.find((option: any) => option?.audioUrl)?.audioUrl;
  
  const colors = ['purple', 'orange', 'green', 'blue', 'pink', 'amber', 'cyan', 'red'];

  // Calculate required grid dimensions so all words fit
  const longestWord = words.reduce((max, w) => Math.max(max, w.length), 0);
  const totalLetters = words.reduce((sum, w) => sum + w.length, 0);

  // Minimum grid size is 6x6. If any word is longer than 6, adapt to fit it.
  let cols = Math.max(6, longestWord);
  let rows = Math.max(6, longestWord);

  // Ensure grid has enough space for all letters with breathing room
  while (cols * rows < totalLetters + 6 && cols < 9) {
    cols++;
    rows++;
  }

  // Allowed directions strictly:
  // 1. Right-to-left: [0, 1] (since the container has dir="rtl", column index increases from right to left)
  // 2. Down-to-up: [-1, 0] (row decreases, moving upwards)
  // 3. Up-to-down: [1, 0] (row increases, moving downwards)
  // Left-to-right [0, -1] and diagonals are STRICTLY FORBIDDEN.
  const dirs = [
    [0, 1],  // from right to left
    [-1, 0], // from down to up
    [1, 0]   // from up to down
  ];

  function tryGenerateGrid(gridCols: number, gridRows: number): { grid: string[]; targetWords: TargetWord[]; unplaced: string[] } {
    const totalSize = gridCols * gridRows;
    const tempGrid: string[] = Array(totalSize).fill('');
    const tempTargetWords: TargetWord[] = [];
    const unplaced: string[] = [];

    // Sort words descending by length with slight random variation between attempts
    const sortedWords = [...words].sort((a, b) => b.length - a.length || (Math.random() - 0.5));

    function placeWord(word: string, currentGrid: string[]): number[] | null {
      const emptyCells: number[] = [];
      for (let i = 0; i < totalSize; i++) {
        if (currentGrid[i] === '') emptyCells.push(i);
      }
      emptyCells.sort(() => Math.random() - 0.5);

      for (const startIdx of emptyCells) {
        const startR = Math.floor(startIdx / gridCols);
        const startC = startIdx % gridCols;
        const shuffledDirs = [...dirs].sort(() => Math.random() - 0.5);

        for (const [dr, dc] of shuffledDirs) {
          const path: number[] = [];
          let canPlace = true;

          for (let i = 0; i < word.length; i++) {
            const nr = startR + dr * i;
            const nc = startC + dc * i;

            if (nr >= 0 && nr < gridRows && nc >= 0 && nc < gridCols) {
              const idx = nr * gridCols + nc;
              if (currentGrid[idx] === '') {
                path.push(idx);
              } else {
                canPlace = false;
                break;
              }
            } else {
              canPlace = false;
              break;
            }
          }

          if (canPlace && path.length === word.length) {
            return path;
          }
        }
      }
      return null;
    }

    for (let i = 0; i < sortedWords.length; i++) {
      const word = sortedWords[i];
      const path = placeWord(word, tempGrid);
      if (path) {
        for (let j = 0; j < word.length; j++) {
          tempGrid[path[j]] = word[j];
        }
        tempTargetWords.push({
          id: `w_${index}_${i}`,
          word: word,
          color: colors[i % colors.length],
          indices: path
        });
      } else {
        unplaced.push(word);
      }
    }

    return { grid: tempGrid, targetWords: tempTargetWords, unplaced };
  }

  // Attempt placement with retries to guarantee all words fit for the student
  let bestResult = tryGenerateGrid(cols, rows);

  // If some words couldn't fit on the first attempt, try up to 60 random restarts
  if (bestResult.unplaced.length > 0) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const result = tryGenerateGrid(cols, rows);
      if (result.unplaced.length === 0) {
        bestResult = result;
        break;
      }
      if (result.unplaced.length < bestResult.unplaced.length) {
        bestResult = result;
      }
    }
  }

  // If still not fitting, progressively expand grid size to guarantee all words fit for the student
  while (bestResult.unplaced.length > 0 && cols < 9) {
    cols++;
    rows++;
    for (let attempt = 0; attempt < 40; attempt++) {
      const result = tryGenerateGrid(cols, rows);
      if (result.unplaced.length === 0) {
        bestResult = result;
        break;
      }
      if (result.unplaced.length < bestResult.unplaced.length) {
        bestResult = result;
      }
    }
  }

  const finalGrid = bestResult.grid;
  const targetWords = bestResult.targetWords;
  const unplacedWords = bestResult.unplaced;

  // Fill remaining empty cells with random Arabic letters
  for (let i = 0; i < cols * rows; i++) {
    if (finalGrid[i] === '') finalGrid[i] = generateRandomArabicLetter();
  }

  return {
    id: question.id,
    levelNumber: index + 1,
    title: `${index + 1}`,
    theme: question.question || question.hint || 'لغز',
    imageUrl: questionImage,
    questionText: question.question || null,
    audioUrl: questionAudio || null,
    cols,
    rows,
    grid: finalGrid,
    targetWords,
    unplacedWords,
    hasFittingIssue: unplacedWords.length > 0
  };
}

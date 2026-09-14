import type { LevelData, TargetWord } from '../types';
import type { BackendQuestion } from '../services/api';

const ARABIC_LETTERS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';

function generateRandomArabicLetter() {
  return ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
}

export function convertQuestionToLevel(question: BackendQuestion, index: number): LevelData {
  const words = question.options.map(o => o.text).filter(w => typeof w === 'string' && w.trim().length > 0);
  const cols = 6;
  const rows = 6;
  const gridSize = cols * rows;
  const grid: string[] = Array(gridSize).fill('');
  const targetWords: TargetWord[] = [];
  
  const colors = ['purple', 'orange', 'green', 'blue', 'pink', 'red'];
  
  // Sort words by length descending to place longer words first
  words.sort((a, b) => b.length - a.length);

    function placeWord(word: string, currentGrid: string[], allowCurves: boolean): number[] | null {
      const emptyCells = [];
      for(let i = 0; i < gridSize; i++) {
        if (currentGrid[i] === '') emptyCells.push(i);
      }
      
      emptyCells.sort(() => Math.random() - 0.5);

      const dirs = [
        [-1, 0], [1, 0], [0, -1], [0, 1] // up, down, left, right
      ];
      
      for (const startIdx of emptyCells) {
        if (!allowCurves) {
          // Straight line logic
          const startR = Math.floor(startIdx / cols);
          const startC = startIdx % cols;
          dirs.sort(() => Math.random() - 0.5);

          for (const [dr, dc] of dirs) {
             const path: number[] = [];
             let canPlace = true;
             
             for (let i = 0; i < word.length; i++) {
               const nr = startR + dr * i;
               const nc = startC + dc * i;
               
               if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                 const idx = nr * cols + nc;
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
        } else {
          // Curve logic (DFS)
          const path: number[] = [];
          
          const dfs = (currIdx: number, letterIndex: number): boolean => {
            path.push(currIdx);
            if (letterIndex === word.length) return true;
            
            const r = Math.floor(currIdx / cols);
            const c = currIdx % cols;
            
            const shuffledDirs = [...dirs].sort(() => Math.random() - 0.5);
            for (const [dr, dc] of shuffledDirs) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                const nextIdx = nr * cols + nc;
                if (currentGrid[nextIdx] === '' && !path.includes(nextIdx)) {
                  if (dfs(nextIdx, letterIndex + 1)) return true;
                }
              }
            }
            path.pop();
            return false;
          };
          
          if (dfs(startIdx, 1)) {
            return path;
          }
        }
      }
      return null;
    }

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const allowCurves = Math.random() > 0.70; // 30% chance for curves, 70% straight
    const path = placeWord(word, grid, allowCurves);
    if (path) {
      for(let j = 0; j < word.length; j++) {
        grid[path[j]] = word[j];
      }
      targetWords.push({
        id: `w_${index}_${i}`,
        word: word,
        color: colors[i % colors.length],
        indices: path
      });
    } else {
      console.warn(`Failed to place word: ${word}`);
      // Even if one fails, we continue with others
    }
  }

  // Fill remaining empty cells with random Arabic letters
  for(let i = 0; i < gridSize; i++) {
    if (grid[i] === '') grid[i] = generateRandomArabicLetter();
  }

  return {
    id: question.id,
    levelNumber: index + 1,
    title: `مرحلة ${index + 1}`,
    theme: question.question || question.hint || 'لغز',
    imageUrl: question.imageUrl,
    cols,
    rows,
    grid,
    targetWords
  };
}

// Preload game assets for instant rendering (Welcome Screen, Celebration, Results Panel, Gameplay)
import bgImg from '../assets/BG.png';
import questionNumberBg from '../assets/QuestionNumber.png';
import questionCoinImg from '../assets/QuestionCoin.png';
import daddcoinImg from '../assets/daddcoin.webp';
import descriptionImg from '../assets/description.png';
import startButtonImg from '../assets/start_transparent.png';
import exitButtonImg from '../assets/Exit1.png';

// Celebration assets
import celebrationRobotsImg from '../../Celebration/Celebration/assets/celbr.png';
import fireworksAudioUrl from '../../Celebration/Celebration/fireworks.mp3';

// Results panel assets
import resultsPanelArt from '../assets/results-panel-empty.png';
import celebrationTitleImg from '../ResultsPanel/assets/good.png';
import retryButtonImg from '../assets/retry.png';

let hasPreloadedCore = false;

/**
 * Preloads a single image and decodes it into memory if supported
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (!url) {
      resolve();
      return;
    }
    const img = new Image();
    img.src = url;
    if (typeof img.decode === 'function') {
      img.decode().then(() => resolve()).catch(() => resolve());
    } else {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    }
  });
}

/**
 * Preloads an audio file
 */
export function preloadAudio(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (!url) {
      resolve();
      return;
    }
    const audio = new Audio();
    audio.preload = 'auto';
    audio.oncanplaythrough = () => resolve();
    audio.onerror = () => resolve();
    audio.src = url;
    audio.load();
  });
}

export const CORE_ASSETS = {
  welcome: [
    bgImg,
    questionNumberBg,
    questionCoinImg,
    daddcoinImg,
    descriptionImg,
    startButtonImg,
    exitButtonImg,
  ],
  celebration: {
    images: [celebrationRobotsImg],
    audio: [fireworksAudioUrl],
  },
  results: [
    resultsPanelArt,
    celebrationTitleImg,
    retryButtonImg,
    exitButtonImg,
  ],
};

/**
 * Staged preloading: Welcome assets load first; Celebration & Results defer to idle time.
 */
export async function preloadAllCoreAssets(): Promise<void> {
  if (hasPreloadedCore || typeof window === 'undefined') return;
  hasPreloadedCore = true;

  try {
    await Promise.allSettled(CORE_ASSETS.welcome.map(preloadImage));

    const preloadEndScreen = () => {
      [...CORE_ASSETS.celebration.images, ...CORE_ASSETS.results].forEach((src) => {
        void preloadImage(src);
      });
      CORE_ASSETS.celebration.audio.forEach((src) => {
        void preloadAudio(src);
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadEndScreen, { timeout: 2000 });
    } else {
      setTimeout(preloadEndScreen, 1000);
    }
  } catch (err) {
    console.warn('Asset preloading completed with minor issues:', err);
  }
}

/**
 * Progressive question media preload (first 2 immediately, remaining in idle time)
 */
export function preloadQuestionAssets(
  questions: Array<{ imageUrl?: string | null; audioUrl?: string | null; options?: Array<{ imageUrl?: string | null; audioUrl?: string | null }> }>
): void {
  const preloadBatch = (list: typeof questions) => {
    for (const q of list) {
      if (q.imageUrl) void preloadImage(q.imageUrl);
      if (q.audioUrl) void preloadAudio(q.audioUrl);
      if (Array.isArray(q.options)) {
        for (const opt of q.options) {
          if (opt?.imageUrl) void preloadImage(opt.imageUrl);
          if (opt?.audioUrl) void preloadAudio(opt.audioUrl);
        }
      }
    }
  };

  preloadBatch(questions.slice(0, 2));
  if (questions.length > 2 && typeof window !== 'undefined') {
    const rest = questions.slice(2);
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => preloadBatch(rest), { timeout: 2500 });
    } else {
      setTimeout(() => preloadBatch(rest), 1200);
    }
  }
}

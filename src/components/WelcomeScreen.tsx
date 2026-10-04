import React from 'react';
import GameWelcomeScreen from './GameWelcomeScreen/GameWelcomeScreen';

// Assets
import questionCoinImg from '../assets/QuestionCoin.png';
import daddcoinImg from '../assets/daddcoin.webp';
import descriptionImg from '../assets/description.png';
import exitButtonImg from '../assets/Exit1.png';
import startButtonImg from '../assets/start_transparent.png';
import questionNumberBg from '../assets/QuestionNumber.png';
import bgImg from '../assets/BG.png';

export interface WelcomeScreenProps {
  choicesCount: number;
  isLoading?: boolean;
  error?: string | null;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  choicesCount,
  isLoading = false,
  error = null,
  onStart,
}) => {
  const isReady = !isLoading && choicesCount > 0;

  if (error) {
    return (
      <div className="error-text" style={{ textAlign: 'center', padding: '20px', direction: 'rtl' }}>
        حدث خطأ: {error}
      </div>
    );
  }

  return (
    <GameWelcomeScreen
      backgroundImage={bgImg}
      statsBgImage={questionNumberBg}
      statLeftIcon={questionCoinImg}
      statLeftAlt="عدد الأسئلة"
      statLeftValue={choicesCount}
      statRightValue={choicesCount}
      statRightIcon={daddcoinImg}
      statRightAlt="النقاط"
      descriptionImage={descriptionImg}
      startButtonImage={startButtonImg}
      exitButtonImage={exitButtonImg}
      onStart={onStart}
      onExit={() => window.history.back()}
      isLoading={isLoading}
      isReady={isReady}
    />
  );
};

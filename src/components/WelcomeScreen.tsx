import React from 'react';
import GameWelcomeScreen from './GameWelcomeScreen/GameWelcomeScreen';
import { ErrorScreen } from './ErrorScreen';

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
      <ErrorScreen
        description={
          error.toLowerCase().includes('lessonid')
            ? 'لا يمكننا العثور على الدرس المطلوب. يرجى التأكد من الرابط أو العودة للرئيسية.'
            : 'تعذر تحميل بيانات اللعبة في الوقت الحالي. دعنا نذهب إلى مكان مألوف.'
        }
        onExit={() => window.history.back()}
      />
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

import { useRef, useEffect } from 'react';
import { ResultsPanel } from '../../ResultsPanel/ResultsPanel/ResultsPanel.js';

interface ResultsPanelWrapperProps {
  score: number;
  totalScore?: number;
  correctAnswers: number;
  wrongAnswers: number;
  coins: number;
  onRetry: () => void;
  onBack: () => void;
}

export function ResultsPanelWrapper({
  score,
  totalScore = 100,
  correctAnswers,
  wrongAnswers,
  coins,
  onRetry,
  onBack,
}: ResultsPanelWrapperProps) {
  const panelRef = useRef<InstanceType<typeof ResultsPanel> | null>(null);

  useEffect(() => {
    // Mount to document.body so it covers the entire viewport and cannot be clipped by containers
    const panel = new ResultsPanel(document.body, {
      onRetry,
      onBack,
    });

    panel.show({
      score,
      totalScore,
      correctAnswers,
      wrongAnswers,
      coins,
    });

    panelRef.current = panel;

    return () => {
      panel.hide();
      panelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

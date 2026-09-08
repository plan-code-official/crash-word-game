import React from 'react';
import { LogOut, Sparkles } from 'lucide-react';

interface ScoreHUDProps {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  currentTurn: 'player1' | 'player2';
  pairsMatched: number;
  totalPairs: number;
  streakCount: number;
  onExit: () => void;
  opponentType: 'ai' | 'local' | 'online';
}

export const ScoreHUD: React.FC<ScoreHUDProps> = ({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  currentTurn,
  pairsMatched,
  totalPairs,
  streakCount,
  onExit,
  opponentType,
}) => {
  const isP1Turn = currentTurn === 'player1';
  const isP2Turn = currentTurn === 'player2';
  const progressPct = totalPairs > 0 ? (pairsMatched / totalPairs) * 100 : 0;

  return (
    <div className="hud-bar">
      {/* ── Exit ── */}
      <button id="btn-exit-game" onClick={onExit} className="hud-exit-btn" title="خروج">
        <LogOut style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
      </button>

      {/* ── Player 1 ── */}
      <div className={`hud-player ${isP1Turn ? 'hud-player--active' : 'hud-player--idle'}`}>
        <div className="hud-avatar hud-avatar--p1">
          <svg viewBox="0 0 100 100" style={{ width: 26, height: 26 }}>
            <circle cx="50" cy="50" r="40" fill="#f97316" />
            <circle cx="50" cy="58" r="26" fill="#ffedd5" />
            <ellipse cx="40" cy="47" rx="4" ry="5" fill="#222" />
            <ellipse cx="60" cy="47" rx="4" ry="5" fill="#222" />
          </svg>
        </div>
        <div className="hud-info">
          <span className="hud-name">{player1Name}</span>
          <span className="hud-score">⭐ {player1Score}</span>
        </div>
        {isP1Turn && streakCount > 1 && (
          <span className="hud-streak">
            <Sparkles style={{ width: 8, height: 8 }} />×{streakCount}
          </span>
        )}
        {isP1Turn && <span className="hud-turn-dot hud-turn-dot--p1" />}
      </div>

      {/* ── Center: progress + pairs ── */}
      <div className="hud-center">
        <span className="hud-pairs">{pairsMatched}/{totalPairs}</span>
        <div className="hud-progress-track">
          <div className="hud-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="hud-vs">VS</span>
      </div>

      {/* ── Player 2 ── */}
      <div className={`hud-player ${isP2Turn ? 'hud-player--active' : 'hud-player--idle'}`}>
        {isP2Turn && <span className="hud-turn-dot hud-turn-dot--p2" />}
        {isP2Turn && streakCount > 1 && (
          <span className="hud-streak">
            <Sparkles style={{ width: 8, height: 8 }} />×{streakCount}
          </span>
        )}
        <div className="hud-info hud-info--ltr">
          <span className="hud-name">{player2Name}</span>
          <span className="hud-score">⭐ {player2Score}</span>
        </div>
        <div className="hud-avatar hud-avatar--p2">
          {opponentType === 'ai' ? (
            <img src="/assets/cute_robot.png" alt="حكيم" style={{ width: 26, height: 26, objectFit: 'contain' }} />
          ) : (
            <svg viewBox="0 0 100 100" style={{ width: 26, height: 26 }}>
              <circle cx="50" cy="50" r="40" fill="#0ea5e9" />
              <circle cx="50" cy="58" r="26" fill="#e0f2fe" />
              <ellipse cx="40" cy="47" rx="4" ry="5" fill="#222" />
              <ellipse cx="60" cy="47" rx="4" ry="5" fill="#222" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

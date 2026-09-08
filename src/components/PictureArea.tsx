import React from 'react';

interface PictureAreaProps {
  imageType: 'election' | 'honey' | 'sun_beach' | 'coffee' | 'space_rocket';
  theme: string;
}

export const PictureArea: React.FC<PictureAreaProps> = ({ imageType, theme }) => {
  return (
    <div className="picture-area-container" title={theme}>
      <div className="picture-card-wrapper">
        {/* 1. Election Ballot Box (صندوق الانتخابات) */}
        {imageType === 'election' && (
          <svg viewBox="0 0 240 240" className="level-illustration" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="rgba(0,0,0,0.35)" />
              </filter>
              <linearGradient id="woodBoxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a0633b" />
                <stop offset="100%" stopColor="#7a4722" />
              </linearGradient>
              <linearGradient id="woodLidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87532d" />
                <stop offset="100%" stopColor="#693a19" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffdbac" />
                <stop offset="100%" stopColor="#f1c27d" />
              </linearGradient>
            </defs>

            {/* Hand & Ballot Paper (Top) */}
            <g>
              {/* Sleeve */}
              <path d="M 135 15 L 165 42 L 148 62 L 118 35 Z" fill="#1e3a8a" stroke="#0f172a" strokeWidth="4" />

              {/* Hand holding paper */}
              <path d="M 125 35 Q 140 50 148 60 Q 140 78 128 78 Q 112 78 108 65 L 105 52 Z" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="4" />
              
              {/* Folded fingers */}
              <path d="M 120 52 Q 132 52 135 62 Q 132 72 120 72 Z" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="3" />
              <path d="M 112 58 Q 124 58 126 68 Q 120 76 112 74 Z" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="3" />

              {/* White Ballot Paper */}
              <rect x="100" y="60" width="30" height="38" rx="2" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
              <line x1="106" y1="70" x2="124" y2="70" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="106" y1="78" x2="124" y2="78" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="106" y1="86" x2="118" y2="86" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Ballot Box Body with Shadow */}
            <g filter="url(#boxShadow)">
              {/* Box Top Lid */}
              <rect x="75" y="85" width="90" height="15" rx="3" fill="url(#woodLidGrad)" stroke="#1a0f05" strokeWidth="4.5" />
              {/* Box Slot */}
              <rect x="98" y="89" width="44" height="6" rx="2" fill="#1a0f05" />

              {/* Main Box Body */}
              <path d="M 82 100 L 82 188 L 158 188 L 158 100 Z" fill="url(#woodBoxGrad)" stroke="#1a0f05" strokeWidth="4.5" />
              
              {/* Box Base Plate */}
              <rect x="78" y="185" width="84" height="10" rx="2" fill="url(#woodLidGrad)" stroke="#1a0f05" strokeWidth="4" />

              {/* Round Emblem in Center */}
              <circle cx="120" cy="144" r="22" fill="#693a19" stroke="#1a0f05" strokeWidth="4" />
              {/* Emblem slot symbol */}
              <rect x="108" y="138" width="24" height="4" rx="2" fill="#a0633b" stroke="#1a0f05" strokeWidth="2" />
              <circle cx="120" cy="150" r="4" fill="#a0633b" stroke="#1a0f05" strokeWidth="2" />
            </g>
          </svg>
        )}

        {/* 2. Honey Jar */}
        {imageType === 'honey' && (
          <svg viewBox="0 0 240 240" className="level-illustration" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="honeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffb300" />
                <stop offset="50%" stopColor="#ff8f00" />
                <stop offset="100%" stopColor="#e65100" />
              </linearGradient>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="80%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
              </linearGradient>
              <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8d6e63" />
                <stop offset="50%" stopColor="#bcaaa4" />
                <stop offset="100%" stopColor="#6d4c41" />
              </linearGradient>
              <filter id="honeyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.3)" />
              </filter>
            </defs>
            <circle cx="120" cy="140" r="70" fill="rgba(255, 179, 0, 0.2)" filter="blur(15px)" />
            <g filter="url(#honeyGlow)">
              <path d="M 68 100 Q 50 145 72 195 Q 120 215 168 195 Q 190 145 172 100 Z" fill="#dcedc8" opacity="0.25" />
              <path d="M 72 120 Q 56 155 76 190 Q 120 208 164 190 Q 184 155 168 120 Q 120 128 72 120 Z" fill="url(#honeyGrad)" />
              <ellipse cx="120" cy="120" rx="48" ry="12" fill="#ffa000" />
              <ellipse cx="120" cy="120" rx="42" ry="9" fill="#ffb300" />
              <path d="M 68 100 Q 50 145 72 195 Q 120 215 168 195 Q 190 145 172 100 Z" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="3" />
              <path d="M 78 125 Q 66 155 80 182" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 86 130 Q 77 155 87 175" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="120" cy="98" rx="44" ry="10" fill="rgba(255,255,255,0.6)" stroke="#ffffff" strokeWidth="3" />
              <ellipse cx="120" cy="98" rx="38" ry="7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            </g>
            <g>
              <rect x="115" y="42" width="105" height="12" rx="6" fill="url(#woodGrad)" stroke="#4e342e" strokeWidth="1.5" />
              <ellipse cx="108" cy="48" rx="20" ry="18" fill="#ffb300" stroke="#ff6f00" strokeWidth="2" />
              <ellipse cx="108" cy="48" rx="16" ry="15" fill="#ffa000" />
              <circle cx="100" cy="48" r="8" fill="#8d6e63" stroke="#4e342e" strokeWidth="1" />
              <circle cx="108" cy="48" r="10" fill="#a1887f" stroke="#4e342e" strokeWidth="1" />
              <circle cx="116" cy="48" r="9" fill="#8d6e63" stroke="#4e342e" strokeWidth="1" />
              <path d="M 94 48 Q 108 32 122 48 Q 124 64 108 64 Q 92 64 94 48 Z" fill="url(#honeyGrad)" opacity="0.9" />
              <path d="M 106 62 Q 108 95 106 122 Q 108 126 112 122 Q 110 95 110 62 Z" fill="#ff8f00" />
              <circle cx="108" cy="90" r="3" fill="#ffc107" />
              <circle cx="108" cy="118" r="4.5" fill="#ffa000" />
            </g>
          </svg>
        )}

        {/* 3. Sunny Beach */}
        {imageType === 'sun_beach' && (
          <svg viewBox="0 0 240 240" className="level-illustration" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
              <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="sandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="120" r="95" fill="url(#skyGrad)" />
            <circle cx="175" cy="65" r="30" fill="#facc15" stroke="#f59e0b" strokeWidth="4" />
            <path d="M 25 140 Q 60 130 95 140 Q 130 150 165 140 Q 200 130 215 140 L 215 190 L 25 190 Z" fill="url(#seaGrad)" />
            <path d="M 25 145 Q 70 135 120 145 Q 170 155 215 145 L 215 160 L 25 160 Z" fill="#7dd3fc" opacity="0.6" />
            <path d="M 25 165 Q 80 140 140 165 Q 185 150 215 165 L 215 215 L 25 215 Z" fill="url(#sandGrad)" />
            <g transform="translate(60, 100)">
              <line x1="40" y1="20" x2="40" y2="70" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
              <path d="M 10 30 Q 40 5 70 30 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <path d="M 25 24 Q 40 5 55 24 Z" fill="#ffffff" />
            </g>
          </svg>
        )}

        {/* 4. Coffee Cup */}
        {imageType === 'coffee' && (
          <svg viewBox="0 0 240 240" className="level-illustration" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
            <ellipse cx="120" cy="185" rx="75" ry="18" fill="#cbd5e1" />
            <ellipse cx="120" cy="182" rx="70" ry="15" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />
            <path d="M 68 100 L 80 168 Q 120 182 160 168 L 172 100 Z" fill="url(#cupGrad)" stroke="#94a3b8" strokeWidth="4" />
            <ellipse cx="120" cy="100" rx="52" ry="16" fill="#451a03" stroke="#94a3b8" strokeWidth="3" />
            <ellipse cx="120" cy="100" rx="46" ry="12" fill="#78350f" />
            <path d="M 105 98 Q 120 106 135 98" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 168 115 Q 200 125 190 152 Q 180 165 158 160" fill="none" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
            <path d="M 105 80 Q 98 60 108 40" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
            <path d="M 122 75 Q 130 55 118 35" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 138 80 Q 144 60 136 42" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {/* 5. Space Rocket */}
        {imageType === 'space_rocket' && (
          <svg viewBox="0 0 240 240" className="level-illustration" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="fireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="120" r="95" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="65" cy="65" r="2.5" fill="#ffffff" />
            <circle cx="175" cy="80" r="3" fill="#fde047" />
            <circle cx="60" cy="155" r="2" fill="#ffffff" />
            <circle cx="180" cy="165" r="2.5" fill="#ffffff" />
            <path d="M 170 50 A 20 20 0 0 0 150 70 A 25 25 0 0 1 170 50 Z" fill="#fde047" />
            <g transform="translate(45, 20) rotate(25, 120, 120)">
              <path d="M 108 160 Q 120 205 120 220 Q 120 205 132 160 Z" fill="url(#fireGrad)" />
              <path d="M 114 160 Q 120 185 120 195 Q 120 185 126 160 Z" fill="#ffffff" />
              <path d="M 98 135 L 82 165 L 105 155 Z" fill="#ef4444" />
              <path d="M 142 135 L 158 165 L 135 155 Z" fill="#ef4444" />
              <path d="M 104 158 L 104 95 Q 120 40 136 95 L 136 158 Z" fill="url(#rocketGrad)" />
              <path d="M 108 80 Q 120 40 132 80 Z" fill="#ef4444" />
              <circle cx="120" cy="102" r="12" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};

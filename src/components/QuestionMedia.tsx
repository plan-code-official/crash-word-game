import React, { useRef, useState } from 'react';

interface Props { text?: string | null; audioUrl?: string | null; }

const VolumeIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l4 3V7l-4 3H4Z" /><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11" /></svg>;

export const QuestionMedia: React.FC<Props> = ({ text, audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  if (!text && !audioUrl) return null;
  const play = () => {
    if (!audioUrl) return;
    if (!audioRef.current) audioRef.current = new Audio(audioUrl);
    audioRef.current.onended = () => setPlaying(false);
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  return <div className="question-media" dir="rtl">
    {text && text !== '.' && text !== '<p>.</p>' && text !== '<p>.</p>\n' && <div className="question-media__text">{text}</div>}
    {audioUrl && <button className={`question-media__audio ${playing ? 'is-playing' : ''}`} type="button" onClick={play} aria-label="تشغيل صوت السؤال"><VolumeIcon /></button>}
  </div>;
};

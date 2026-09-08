export interface TargetWord {
  id: string;
  word: string;
  color: string; // Color theme for this word (e.g., 'orange', 'purple', 'green', 'blue', 'pink')
  indices: number[]; // Grid indices forming this straight line word
}

export interface LevelData {
  id: number;
  levelNumber: number;
  title: string;
  theme: string;
  imageSvgType: 'election' | 'honey' | 'sun_beach' | 'coffee' | 'space_rocket';
  cols: number; // e.g. 6
  rows: number; // e.g. 6
  grid: string[]; // Length = cols * rows. Empty string '' is a stone obstacle
  targetWords: TargetWord[];
}

export interface WordColorStyle {
  bg: string;
  border: string;
  text: string;
  shadow: string;
  glow: string;
}

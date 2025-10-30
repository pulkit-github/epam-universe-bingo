export interface Persona {
  min: number;
  max: number;
  title: string;
  desc: string;
}

export interface Score {
  cells: number;
  lines: number;
  total: number;
}

export interface GameState {
  board: string[];
  selected: boolean[];
  showResult: boolean;
}

export interface TileProps {
  text: string;
  index: number;
  isSelected: boolean;
  inLine: boolean;
  onToggle: (index: number) => void;
}

export interface BoardProps {
  board: string[];
  selected: boolean[];
  completedLines: number[][];
  onToggle: (index: number) => void;
}

export interface ScoreDisplayProps {
  score: Score;
}

export interface ResultModalProps {
  persona: Persona;
  score: Score;
  isOpen: boolean;
  onClose: () => void;
}

import type { BoardProps } from '../types';
import { Tile } from './Tile';

export function Board({ board, selected, completedLines, onToggle }: BoardProps) {
  function isInHighlightedLine(index: number): boolean {
    return completedLines.some(line => line.includes(index));
  }

  return (
    <section className="grid grid-cols-5 gap-3 sm:gap-4">
      {board.map((text, idx) => (
        <Tile
          key={idx}
          text={text}
          index={idx}
          isSelected={!!selected[idx]}
          inLine={isInHighlightedLine(idx)}
          onToggle={onToggle}
        />
      ))}
    </section>
  );
}

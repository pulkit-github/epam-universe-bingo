import type { TileProps } from '../types';

export function Tile({ text, index, isSelected, inLine, onToggle }: TileProps) {
  const base = 'relative h-24 sm:h-28 md:h-32 p-2 sm:p-3 rounded-lg border border-tile-dark/30 bg-gradient-to-br from-tile-light to-tile-dark hover:from-tile-dark hover:to-tile-light transition-all duration-200 shadow-card';
  const selectedCls = isSelected ? ' tile-selected ' : '';
  const lineCls = inLine ? ' line-highlight ' : '';

  return (
    <button
      onClick={() => onToggle(index)}
      className={base + selectedCls + lineCls}
    >
      <span className="text-xs sm:text-sm md:text-base text-left block text-tile-text font-medium leading-tight">
        {text}
      </span>
    </button>
  );
}

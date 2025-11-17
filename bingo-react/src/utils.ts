import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {}
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}

// export function shuffle<T>(array: T[]): T[] {
//   const result = array.slice();
//   for (let i = result.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [result[i], result[j]] = [result[j], result[i]];
//   }
//   return result;
// }

export function computeLines(selected: boolean[]): number[][] {
  const size = 5;
  const lines: number[][] = [];
  
  // rows
  for (let r = 0; r < size; r++) {
    const indices = Array.from({ length: size }, (_, c) => r * size + c);
    if (indices.every(i => selected[i])) lines.push(indices);
  }
  
  // cols
  for (let c = 0; c < size; c++) {
    const indices = Array.from({ length: size }, (_, r) => r * size + c);
    if (indices.every(i => selected[i])) lines.push(indices);
  }
  
  // diagonals
  const d1 = [0, 6, 12, 18, 24];
  const d2 = [4, 8, 12, 16, 20];
  if (d1.every(i => selected[i])) lines.push(d1);
  if (d2.every(i => selected[i])) lines.push(d2);
  
  return lines;
}

export function scoreFromSelection(selected: boolean[]): { cells: number; lines: number; total: number } {
  const cells = selected.filter(Boolean).length; // 1 point each
  const lines = computeLines(selected).length;   // +5 per line
  const total = Math.min(85, cells + lines * 5);
  return { cells, lines, total };
}

export function personaForScore(score: number, personas: Array<{ min: number; max: number; title: string; desc: string }>) {
  return personas.find(p => score >= p.min && score <= p.max) || personas[0];
}

export function GameControls({ 
  onShuffle, 
  onReset, 
  onGetResult 
}: {
  onShuffle: () => void;
  onReset: () => void;
  onGetResult: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onShuffle}
        className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium transition-all"
      >
        Shuffle
      </button>
      <button
        onClick={onReset}
        className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium transition-all"
      >
        Reset
      </button>
      <button
        onClick={onGetResult}
        className="px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-accent-teal text-cosmic-900 font-semibold hover:bg-accent-teal/90 text-xs sm:text-sm transition-all shadow-lg"
      >
        Get Result
      </button>
    </div>
  );
}

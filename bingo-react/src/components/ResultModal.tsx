import { useState } from 'react';
import type { ResultModalProps } from '../types';
import { ShareModal } from './ShareModal';

export function ResultModal({ persona, score, isOpen, onClose }: ResultModalProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <section className="mt-2 rounded-xl border border-accent-purple/20 bg-gradient-to-br from-cosmic-800/80 to-cosmic-700/80 backdrop-blur-sm p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="title-font text-lg sm:text-xl text-accent-teal font-bold">
              {persona.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
              {persona.desc}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="text-xs sm:text-sm text-white/70 font-medium">
                Score: <span className="font-bold text-accent-teal">{score.total}/85</span>
              </div>
              <div className="text-xs sm:text-sm text-white/70 font-medium">
                {score.cells} cells • {score.lines} lines
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-purple/20 to-accent-teal/20 hover:from-accent-purple/30 hover:to-accent-teal/30 border border-accent-purple/30 text-sm font-medium transition-all w-full sm:w-auto"
            >
              🌟 Share
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 w-full sm:w-auto font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </section>

      <ShareModal
        persona={persona}
        score={score}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}

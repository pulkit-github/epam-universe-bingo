import { useState } from 'react';
import type { Persona, Score } from '../types';
import { downloadShareableImage } from '../utils/shareUtils';

interface ShareModalProps {
  persona: Persona;
  score: Score;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ persona, score, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `🚀 I scored ${score.total} points and became a "${persona.title}" in EPAM Universe Bingo! 🌌✨\n\n${persona.desc}\n\nPlay your own cosmic journey at EPAM Universe Bingo!`;

  const shareUrl = window.location.origin;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank', 'width=600,height=400');
  };

  const shareToTeams = () => {
    const teamsUrl = `https://teams.microsoft.com/share?msgText=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(teamsUrl, '_blank', 'width=600,height=400');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-cosmic-800 to-cosmic-700 border border-accent-purple/30 rounded-xl p-4 sm:p-6 max-w-full sm:max-w-md w-full mx-2 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-font text-accent-teal text-xl font-bold">🌟 Share Your Cosmic Achievement</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-br from-accent-purple/10 to-accent-teal/10 border border-accent-purple/20 rounded-lg">
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-accent-teal mb-1">{score.total}/85</div>
            <div className="title-font text-accent-purple text-lg font-semibold">{persona.title}</div>
          </div>
          <p className="text-sm text-white/90 text-center leading-relaxed">{persona.desc}</p>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-white/60 mb-3">Share on social media:</div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
              onClick={shareToTeams}
              className="flex items-center justify-center gap-2 p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2228.833 2073.333">
                <path fill="#5059C9" d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483c0,0,0,0,0,0v524.398 c0,199.901-162.051,361.952-361.952,361.952h0h-1.711c-199.901,0.028-361.975-162-362.004-361.901c0-0.017,0-0.034,0-0.052V828.971 C1503.167,800.544,1526.211,777.5,1554.637,777.5L1554.637,777.5z"/>
                <circle fill="#5059C9" cx="1943.75" cy="440.583" r="233.25"/>
                <circle fill="#7B83EB" cx="1218.083" cy="336.917" r="336.917"/>
                <path fill="#7B83EB" d="M1667.323,777.5H717.01c-53.743,1.33-96.257,45.931-95.01,99.676v598.105 c-7.505,322.519,247.657,590.16,570.167,598.053c322.51-7.893,577.671-275.534,570.167-598.053V877.176 C1763.579,823.431,1721.066,778.83,1667.323,777.5z"/>
                <path opacity=".1" d="M1244,777.5v838.145c-0.258,38.435-23.549,72.964-59.09,87.598 c-11.316,4.787-23.478,7.254-35.765,7.257H667.613c-6.738-17.105-12.958-34.21-18.142-51.833 c-18.144-59.477-27.402-121.307-27.472-183.49V877.02c-1.246-53.659,41.198-98.19,94.855-99.52H1244z"/>
                <path opacity=".2" d="M1192.167,777.5v889.978c-0.002,12.287-2.47,24.449-7.257,35.765 c-14.634,35.541-49.163,58.833-87.598,59.09H691.975c-8.812-17.105-17.105-34.21-24.362-51.833 c-7.257-17.623-12.958-34.21-18.142-51.833c-18.144-59.476-27.402-121.307-27.472-183.49V877.02 c-1.246-53.659,41.198-98.19,94.855-99.52H1192.167z"/>
                <path opacity=".2" d="M1192.167,777.5v786.312c-0.395,52.223-42.632,94.46-94.855,94.855h-447.84 c-18.144-59.476-27.402-121.307-27.472-183.49V877.02c-1.246-53.659,41.198-98.19,94.855-99.52H1192.167z"/>
                <path opacity=".2" d="M1140.333,777.5v786.312c-0.395,52.223-42.632,94.46-94.855,94.855H649.472 c-18.144-59.476-27.402-121.307-27.472-183.49V877.02c-1.246-53.659,41.198-98.19,94.855-99.52H1140.333z"/>
                <path opacity=".1" d="M1244,509.522v163.275c-8.812,0.518-17.105,1.037-25.917,1.037 c-8.812,0-17.105-0.518-25.917-1.037c-17.496-1.161-34.848-3.937-51.833-8.293c-104.963-24.857-191.679-98.469-233.25-198.003 c-7.153-16.715-12.706-34.071-16.587-51.833h258.648C1201.449,414.866,1243.801,457.217,1244,509.522z"/>
                <path opacity=".2" d="M1192.167,561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293 c-104.963-24.857-191.679-98.469-233.25-198.003h190.228C1149.616,466.699,1191.968,509.051,1192.167,561.355z"/>
                <path opacity=".2" d="M1192.167,561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293 c-104.963-24.857-191.679-98.469-233.25-198.003h190.228C1149.616,466.699,1191.968,509.051,1192.167,561.355z"/>
                <path opacity=".2" d="M1140.333,561.355v103.148c-104.963-24.857-191.679-98.469-233.25-198.003 h138.395C1097.783,466.699,1140.134,509.051,1140.333,561.355z"/>
                <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="198.099" y1="1683.0726" x2="942.2344" y2="394.2607" gradientTransform="matrix(1 0 0 -1 0 2075.3333)">
                  <stop offset="0" stop-color="#5a62c3"/>
                  <stop offset=".5" stop-color="#4d55bd"/>
                  <stop offset="1" stop-color="#3940ab"/>
                </linearGradient>
                <path fill="url(#a)" d="M95.01,466.5h950.312c52.473,0,95.01,42.538,95.01,95.01v950.312c0,52.473-42.538,95.01-95.01,95.01 H95.01c-52.473,0-95.01-42.538-95.01-95.01V561.51C0,509.038,42.538,466.5,95.01,466.5z"/>
                <path fill="#FFF" d="M820.211,828.193H630.241v517.297H509.211V828.193H320.123V727.844h500.088V828.193z"/>
              </svg>
              {/* <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.625 8.127h-2.813V5.314a1.688 1.688 0 00-1.688-1.688h-12.75A1.688 1.688 0 001.687 5.314v8.438a1.688 1.688 0 001.688 1.688h2.813v2.813a1.688 1.688 0 001.688 1.688h12.75a1.688 1.688 0 001.688-1.688V9.814a1.688 1.688 0 00-1.689-1.687zM7.875 13.752H5.063V5.314h10.125v2.813H7.875v5.625zm13.5 4.5h-12.75v-8.438h12.75v8.438zM18 13.5h-1.5v-1.5h1.5v1.5zm0-3h-1.5v-1.5h1.5v1.5zm-3 3h-1.5v-1.5h1.5v1.5zm0-3h-1.5v-1.5h1.5v1.5z"/>
              </svg> */}
              <span className="text-sm">MS Teams</span>
            </button>
            
            <button
              onClick={shareToTwitter}
              className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-sm">Twitter</span>
            </button>

            <button
              onClick={shareToLinkedIn}
              className="flex items-center justify-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-sm">LinkedIn</span>
            </button>

            <button
              onClick={shareToFacebook}
              className="flex items-center justify-center gap-2 p-3 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-700/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm">Facebook</span>
            </button>

            {/* <button
              onClick={shareToWhatsApp}
              className="flex items-center justify-center gap-2 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="text-sm">WhatsApp</span>
            </button>

            <button
              onClick={shareToTelegram}
              className="flex items-center justify-center gap-2 p-3 bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="text-sm">Telegram</span>
            </button> */}

            <div className="col-start-2">
              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors w-full ${
                  copied 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-white/10 hover:bg-white/15 border border-white/20'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-white/60 mb-3">Download shareable image</div>
            <button
              onClick={() => downloadShareableImage(persona, score)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-accent-purple/20 to-accent-teal/20 hover:from-accent-purple/30 hover:to-accent-teal/30 border border-accent-purple/30 rounded-lg transition-all font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              <span className="text-sm">Download Image</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent-purple/10 border border-accent-purple/20 rounded-lg text-xs text-white/70">
          <strong className="text-accent-teal">Preview:</strong> {shareText.substring(0, 100)}...
        </div>
      </div>
    </div>
  );
}

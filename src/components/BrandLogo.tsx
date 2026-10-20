import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 40, className = '' }) => {
  const id = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`om-shell-${id}`} x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="45%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id={`om-tooth-${id}`} x1="20" y1="10" x2="44" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="38%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id={`om-face-${id}`} x1="18" y1="12" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id={`om-ai-${id}`} x1="36" y1="8" x2="58" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <filter id={`om-shadow-${id}`} x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#042f2e" floodOpacity="0.45" />
        </filter>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#om-shell-${id})`} filter={`url(#om-shadow-${id})`} />
      <path d="M10 18c8-10 36-10 44 0" stroke="#ecfeff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />

      <path
        d="M32 12c6.2 0 11 4.6 11 11.2 0 4.2-1.1 8.6-2.4 13.1-1.1 3.7-3.6 7.2-8.6 7.2s-7.5-3.5-8.6-7.2C22.1 31.8 21 27.4 21 23.2 21 16.6 25.8 12 32 12Z"
        fill={`url(#om-tooth-${id})`}
      />
      <path
        d="M32 14.2c5.1 0 8.8 3.6 8.8 8.8 0 3.6-.9 7.5-2 11.4-0.8 2.8-2.6 5.3-6.8 5.3s-6-2.5-6.8-5.3c-1.1-3.9-2-7.8-2-11.4 0-5.2 3.7-8.8 8.8-8.8Z"
        fill={`url(#om-face-${id})`}
      />
      <path d="M26.5 20.5c2.2-2.4 7.2-2.6 9.8.2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />

      <circle cx="48.5" cy="17.5" r="7.2" fill={`url(#om-ai-${id})`} />
      <circle cx="48.5" cy="17.5" r="2.1" fill="#ecfeff" />
      <circle cx="44.2" cy="14.2" r="1.15" fill="#ecfeff" />
      <circle cx="53.1" cy="14.6" r="1.05" fill="#ecfeff" />
      <circle cx="52.6" cy="21.4" r="1.1" fill="#ecfeff" />
      <path d="M46.6 16.2 44.8 14.7M50.4 16.1 52.5 15M50.2 19.1 52.2 20.9" stroke="#ecfeff" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
};

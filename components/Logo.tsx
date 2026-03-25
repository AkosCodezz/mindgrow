'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 32, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>

        {/* Outer Frame - Window/Terminal */}
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="12"
          stroke="url(#logoGradient)"
          strokeWidth="4"
          fill="none"
        />

        {/* Left Bracket < */}
        <path
          d="M 42 35 L 30 50 L 42 65"
          stroke="url(#logoGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Right Bracket > */}
        <path
          d="M 58 35 L 70 50 L 58 65"
          stroke="url(#logoGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Center Dot/Cursor */}
        <circle
          cx="50"
          cy="50"
          r="3"
          fill="url(#logoGradient)"
        />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span className="text-lg font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
          CodeRift
        </span>
      )}
    </div>
  );
}

// Simplified icon-only version for favicon
export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="80" height="80" rx="12" stroke="url(#iconGradient)" strokeWidth="4" fill="none" />
      <path d="M 42 35 L 30 50 L 42 65" stroke="url(#iconGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 58 35 L 70 50 L 58 65" stroke="url(#iconGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="50" cy="50" r="3" fill="url(#iconGradient)" />
    </svg>
  );
}

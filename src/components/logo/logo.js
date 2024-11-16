import React from 'react';
import '@components/logo/logo.scss';

export default function Component() {
  return (
    <div className="logo">
      <svg width="150" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
          </linearGradient>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#047857" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background */}
        <rect width="200" height="200" fill="url(#bgGradient)" rx="40" ry="40" />

        {/* Main icon */}
        <g transform="translate(40, 40)" filter="url(#shadow)">
          <path
            d="M60 0 C90 0 120 30 120 60 C120 90 90 120 60 120 C30 120 0 90 0 60 C0 30 30 0 60 0 Z"
            fill="url(#iconGradient)"
          />
          <path
            d="M60 10 C85 10 110 35 110 60 C110 85 85 110 60 110 C35 110 10 85 10 60 C10 35 35 10 60 10 Z"
            fill="#ecfdf5"
          />

          {/* Stylized tree/book combination */}
          <path
            d="M60 20 L90 50 L75 50 L90 65 L75 65 L90 80 L60 100 L30 80 L45 80 L30 65 L45 65 L30 50 L60 20 Z"
            fill="url(#iconGradient)"
            opacity="0.9"
          />

          {/* Connection lines */}
          <path d="M30 70 Q60 55, 90 70" stroke="#ecfdf5" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M40 85 Q60 70, 80 85" stroke="#ecfdf5" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Dots representing people/leaves */}
          <circle cx="30" cy="70" r="4" fill="#ecfdf5" />
          <circle cx="90" cy="70" r="4" fill="#ecfdf5" />
          <circle cx="40" cy="85" r="4" fill="#ecfdf5" />
          <circle cx="80" cy="85" r="4" fill="#ecfdf5" />
          <circle cx="60" cy="20" r="4" fill="#ecfdf5" />
        </g>

        {/* Text */}
        <text
          x="100"
          y="160"
          fontFamily="Arial, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="#047857"
          textAnchor="middle"
        >
          GrowthHub
        </text>
        <text x="100" y="180" fontFamily="Arial, sans-serif" fontSize="14" fill="#059669" textAnchor="middle">
          Learn • Connect • Flourish
        </text>
      </svg>
    </div>
  );
}

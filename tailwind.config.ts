import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Pastikan sesuai dengan struktur proyekmu
  theme: {
    extend: {
      // Custom "geek" design tokens -> usable as bg-geek-bg, text-geek-accent, etc.
      colors: {
        geek: {
          bg: '#f8fafc', // Light slate canvas
          sidebar: '#f1f5f9', // Subtle darker slate
          card: '#ffffff', // Pure white
          border: '#e2e8f0', // Soft slate border
          accent: '#00cc7d', // Electric cyber mint
          secondary: '#6366f1', // Electric indigo
          cyan: '#0284c7', // Vivid cyan
          warning: '#e11d48', // Warning rose
          text: '#0f172a', // Deep dark slate
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        pulseRotate: {
          '0%, 100%': {
            transform: 'rotate(0deg) scale(1)',
            boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.6)',
          },
          '50%': {
            transform: 'rotate(1deg) scale(1.05)',
            boxShadow: '0 0 10px 2px rgba(6, 182, 212, 0.4)',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-10px)' },
        },
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        zoom: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInTop: {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInBottom: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-10px)' },
          '40%, 80%': { transform: 'translateX(10px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(0.95)' },
          '75%': { transform: 'scale(1.05)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        scaleDown: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.9)', opacity: 0 },
        },
      },

      animation: {
        'pulse-rotate': 'pulseRotate 1.5s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'bounce-x': 'bounceX 0.6s ease-in-out infinite',
        'bounce-y': 'bounceY 0.6s ease-in-out infinite',
        zoom: 'zoom 0.8s ease-in-out infinite',
        fade: 'fadeIn 0.5s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-top': 'slideInTop 0.4s ease-out forwards',
        'slide-in-bottom': 'slideInBottom 0.4s ease-out forwards',
        shake: 'shake 0.5s ease-in-out infinite',
        heartbeat: 'heartbeat 1.2s ease-in-out infinite',
        'spin-slow': 'spinSlow 3s linear infinite',
        'scale-up': 'scaleUp 0.3s ease-out forwards',
        'scale-down': 'scaleDown 0.3s ease-in forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config

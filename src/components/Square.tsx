import React from 'react';

interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinningSquare: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare }) => {
  // Base classes for all squares, focusing on a dark, sleek look
  const baseClasses = "w-full h-24 text-6xl font-extrabold flex items-center justify-center rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75";

  // Different styling based on value and winning status
  const getSquareClasses = () => {
    if (isWinningSquare) {
      // Winning square: bright, glowing effect
      return `${baseClasses} bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-lg shadow-green-400/50 border-4 border-green-300 animate-pulse-once`;
    }
    
    if (!value) {
      // Empty square: dark, interactive, with a subtle border
      return `${baseClasses} bg-gray-800 hover:bg-gray-700 cursor-pointer border-2 border-gray-700 focus:ring-blue-500`;
    }
    
    if (value === 'X') {
      // Player X square: cyber blue, bold
      return `${baseClasses} bg-blue-900 text-cyan-400 border-2 border-blue-700 shadow-inner shadow-blue-500/30`;
    }
    
    // Player O square: cyber magenta, bold
    return `${baseClasses} bg-purple-900 text-fuchsia-400 border-2 border-purple-700 shadow-inner shadow-fuchsia-500/30`;
  };

  return (
    <button
      className={getSquareClasses()}
      onClick={onClick}
      aria-label={value ? `Square with ${value}` : "Empty square"}
      // Add a custom animation keyframe for `animate-pulse-once` if not already defined in your CSS/Tailwind config
      // For example, in tailwind.config.js:
      // extend: {
      //   keyframes: {
      //     'pulse-once': {
      //       '0%, 100%': { opacity: '1' },
      //       '50%': { opacity: '.7' },
      //     }
      //   },
      //   animation: {
      //     'pulse-once': 'pulse-once 1s ease-in-out',
      //   }
      // }
    >
      {value}
    </button>
  );
};

export default Square;
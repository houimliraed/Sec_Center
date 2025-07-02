import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Grid, Play } from 'lucide-react'; // Added Play icon
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameHistory from './components/GameHistory';
import { calculateWinner, checkDraw } from './utils/gameLogic';

// New NameInputScreen component
interface NameInputScreenProps {
  onNameSubmit: (name: string) => void;
}

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onNameSubmit }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onNameSubmit(playerName.trim());
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center p-8 font-mono text-white overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '20px 20px' }}></div>

      <div className="relative z-10 max-w-xl w-full bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-glow overflow-hidden border border-purple-700 p-12 text-center transform scale-95 animate-fade-in"> {/* Adjusted size and added fade-in animation */}
        <h2 className="text-5xl font-extrabold text-yellow-400 mb-6 flex items-center justify-center gap-4 animate-bounce-slow">
          <Play className="h-12 w-12" />
          Enter the Arena
        </h2>
        <p className="text-xl text-gray-300 mb-8 italic">Identify yourself, challenger!</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your Alias"
            className="w-full max-w-sm p-4 text-center bg-gray-700 border-2 border-purple-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600 text-2xl font-bold tracking-wide transition-colors duration-200"
            maxLength={15} // Limit input length
            required
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400 text-2xl font-semibold uppercase tracking-wide"
          >
            <Trophy className="h-7 w-7" />
            Commence Battle
          </button>
        </form>
      </div>
    </div>
  );
};


function App() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState<Array<{
    winner: string | null;
    board: Array<string | null>;
    date: Date;
  }>>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // New state for player name and controlling the intro screen
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  // Function to handle name submission from intro screen
  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowIntro(false);
  };

  // Check for winner or draw
  useEffect(() => {
    const result = calculateWinner(board);
    
    if (result) {
      setGameStatus('won');
      setWinningLine(result.line);
      
      // Update scores
      setScores(prevScores => ({
        ...prevScores,
        [result.winner]: prevScores[result.winner as keyof typeof prevScores] + 1
      }));
      
      // Add to history
      setGameHistory(prev => [
        ...prev, 
        { winner: result.winner, board: [...board], date: new Date() }
      ]);
    } else if (checkDraw(board)) {
      setGameStatus('draw');
      
      // Update draw count
      setScores(prevScores => ({
        ...prevScores,
        draws: prevScores.draws + 1
      }));
      
      // Add to history
      setGameHistory(prev => [
        ...prev, 
        { winner: null, board: [...board], date: new Date() }
      ]);
    }
  }, [board]);

  // Handle square click
  const handleClick = (index: number) => {
    // Return if square is filled or game is over
    if (board[index] || gameStatus !== 'playing') return;
    
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus('playing');
    setWinningLine(null);
  };

  // Reset all stats
  const resetStats = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
    setGameHistory([]);
  };

  // Get current game status message
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      const winner = !xIsNext ? 'X' : 'O';
      return `Player ${winner} triumphs!`;
    } else if (gameStatus === 'draw') {
      return "It's a stalemate!";
    } else {
      // Incorporate player name into the status message
      return `Next up: ${xIsNext ? (playerName || 'X') : 'O'}`;
    }
  };

  // Conditional rendering for the intro screen or the main game
  if (showIntro) {
    return <NameInputScreen onNameSubmit={handleNameSubmit} />;
  }

  // Main game rendering
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center p-8 font-mono text-white overflow-hidden"> {/* Full screen, darker gradient, monospace font, white text */}
      {/* Background grid pattern for a techy feel */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10 max-w-5xl w-full bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-3xl shadow-glow overflow-hidden border border-purple-700"> {/* Larger max-width, darker translucent background, glow shadow, border */}
        <div className="p-10 bg-gradient-to-r from-purple-800 to-indigo-800 text-white text-center border-b border-purple-700"> {/* New header gradient, border bottom */}
          <h1 className="text-5xl font-extrabold flex items-center justify-center gap-4 tracking-wider uppercase text-shadow-lg"> {/* Larger, more spacing, uppercase, text shadow */}
            <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" /> {/* Larger icon, pulsed animation */}
            Gridlock Arena <Grid className="h-10 w-10 text-cyan-400" /> {/* Added Grid icon to title */}
          </h1>
          <p className="text-purple-300 mt-3 text-xl font-light italic">Master the Digital Grid</p> {/* New tagline, italic, light font */}
        </div>
        
        <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12"> {/* Increased padding and gap */}
          {/* Game section */}
          <div className="md:col-span-2 flex flex-col items-center">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-yellow-300 mb-3 animate-fade-in-down">{getStatusMessage()}</h2> {/* Stronger color, more spacing, animation */}
              <p className="text-xl text-gray-300 animate-fade-in-up">Unleash your strategy!</p> {/* Added a sub-message, animation */}
            </div>
            
            <Board 
              squares={board} 
              onClick={handleClick} 
              winningLine={winningLine}
            />
            
            <div className="mt-10 flex flex-col sm:flex-row gap-6 w-full justify-center"> {/* Increased gap, responsive button layout */}
              <button 
                onClick={resetGame}
                className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg font-semibold w-full sm:w-auto"
              >
                <RotateCcw className="h-6 w-6" />
                Initiate New Round
              </button>
              <button 
                onClick={resetStats}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 text-lg font-semibold w-full sm:w-auto"
              >
                Clear All Protocols
              </button>
            </div>
          </div>
          
          {/* Stats section */}
          <div className="flex flex-col gap-10"> {/* Increased gap */}
            <ScoreBoard scores={scores} />
            <GameHistory history={gameHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
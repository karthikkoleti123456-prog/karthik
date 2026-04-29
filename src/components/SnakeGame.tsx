import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    isGameOver: false,
    isPaused: true,
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food on snake
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameState(prev => ({ ...prev, score: 0, isGameOver: false, isPaused: false }));
    onScoreChange(0);
  };

  const gameOver = () => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.score, prev.highScore);
      localStorage.setItem('snakeHighScore', newHighScore.toString());
      return { ...prev, isGameOver: true, highScore: newHighScore };
    });
  };

  const moveSnake = useCallback(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = gameState.score + 10;
        setGameState(prev => ({ ...prev, score: newScore }));
        onScoreChange(newScore);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameState.isPaused, gameState.isGameOver, gameState.score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setGameState(prev => ({ ...prev, isPaused: !prev.isPaused })); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(gameState.score / 50) * 10);
    gameLoopRef.current = setInterval(moveSnake, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameState.isPaused, gameState.isGameOver, gameState.score]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-[400px] font-display text-xs tracking-widest text-neon-blue uppercase">
        <div className="flex flex-col">
          <span className="opacity-50">Score</span>
          <span className="text-xl neon-text-blue">{gameState.score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="opacity-50">High Score</span>
          <span className="text-xl neon-text-pink">{gameState.highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-cyber-gray border-2 border-neon-blue rounded-lg neon-shadow-blue overflow-hidden"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
            backgroundSize: `${400 / GRID_SIZE}px ${400 / GRID_SIZE}px`
          }}
        />

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute rounded-sm ${i === 0 ? 'bg-neon-blue z-10' : 'bg-neon-blue/60'}`}
            initial={false}
            animate={{
              x: segment.x * (400 / GRID_SIZE),
              y: segment.y * (400 / GRID_SIZE),
            }}
            transition={{ type: 'tween', duration: 0.1 }}
            style={{
              width: 400 / GRID_SIZE - 2,
              height: 400 / GRID_SIZE - 2,
              margin: 1,
              boxShadow: i === 0 ? '0 0 10px #00ffff' : 'none'
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute bg-neon-pink rounded-full neon-shadow-pink"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            left: food.x * (400 / GRID_SIZE) + 2,
            top: food.y * (400 / GRID_SIZE) + 2,
            width: 400 / GRID_SIZE - 4,
            height: 400 / GRID_SIZE - 4,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameState.isPaused || gameState.isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20"
            >
              <h2 className={`font-display text-4xl mb-6 ${gameState.isGameOver ? 'text-neon-pink neon-text-pink' : 'text-neon-blue neon-text-blue'}`}>
                {gameState.isGameOver ? 'SYS FAILURE' : 'SYSTEM PAUSED'}
              </h2>
              
              {gameState.isGameOver ? (
                <button
                  onClick={resetGame}
                  className="px-8 py-3 border-2 border-neon-pink text-neon-pink font-display uppercase tracking-widest hover:bg-neon-pink hover:text-black transition-colors neon-shadow-pink"
                >
                  Reboot
                </button>
              ) : (
                <button
                  onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
                  className="px-8 py-3 border-2 border-neon-blue text-neon-blue font-display uppercase tracking-widest hover:bg-neon-blue hover:text-black transition-colors neon-shadow-blue"
                >
                  Resume
                </button>
              )}

              <p className="mt-8 text-xs font-mono text-white/40 tracking-[0.2em] uppercase">
                {gameState.isGameOver ? 'Worm segment collision detected' : 'Press SPACE to cycle state'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-4 text-[10px] font-mono text-white/40 tracking-wider uppercase">
        <div className="flex items-center gap-2">
          <kbd className="px-1 py-0.5 border border-white/20 rounded">ARROWS</kbd>
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1 py-0.5 border border-white/20 rounded">SPACE</kbd>
          <span>Pause/Start</span>
        </div>
      </div>
    </div>
  );
};

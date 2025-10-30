import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { Button } from '../components/ui/button';
import { Home, RotateCcw } from 'lucide-react';
import GameScene from '../game/GameScene';

const Game = () => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const navigate = useNavigate();
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);
  const [finalCoins, setFinalCoins] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLives, setCurrentLives] = useState(3);

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 },
          debug: false
        }
      },
      scene: GameScene,
      backgroundColor: '#87CEEB'
    };

    phaserGameRef.current = new Phaser.Game(config);

    // Listen for game events
    window.addEventListener('gameOver', (e) => {
      setGameOver(true);
      setFinalScore(e.detail.score);
      setFinalLevel(e.detail.level);
      setFinalCoins(e.detail.coins);
      
      // Save to leaderboard
      const leaderboard = JSON.parse(localStorage.getItem('pixelRunnerLeaderboard') || '[]');
      leaderboard.push({
        score: e.detail.score,
        level: e.detail.level,
        coins: e.detail.coins,
        date: new Date().toISOString(),
        playerName: 'Player'
      });
      leaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem('pixelRunnerLeaderboard', JSON.stringify(leaderboard.slice(0, 10)));
    });

    window.addEventListener('scoreUpdate', (e) => {
      setCurrentScore(e.detail.score);
      setCurrentLevel(e.detail.level);
      setCurrentLives(e.detail.lives);
    });

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  const handleRestart = () => {
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }
    setGameOver(false);
    setFinalScore(0);
    setCurrentScore(0);
    setCurrentLevel(1);
    setCurrentLives(3);
    
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      {/* HUD */}
      {!gameOver && (
        <div className="mb-4 flex gap-6 bg-white/10 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/20">
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-sm">SCORE</div>
            <div className="text-white font-black text-3xl">{currentScore}</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-sm">LEVEL</div>
            <div className="text-white font-black text-3xl">{currentLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-sm">LIVES</div>
            <div className="text-white font-black text-3xl">{'❤️'.repeat(currentLives)}</div>
          </div>
        </div>
      )}

      {/* Game Container */}
      <div className="relative">
        <div 
          ref={gameRef} 
          className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
          style={{ display: gameOver ? 'none' : 'block' }}
        />
        
        {/* Game Over Screen */}
        {gameOver && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center w-[800px]">
            <h2 className="text-6xl font-black text-white mb-6">Game Over!</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center bg-white/10 rounded-xl p-4">
                <span className="text-2xl font-bold text-purple-200">Final Score:</span>
                <span className="text-4xl font-black text-yellow-400">{finalScore}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 rounded-xl p-4">
                <span className="text-2xl font-bold text-purple-200">Level Reached:</span>
                <span className="text-4xl font-black text-white">{finalLevel}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 rounded-xl p-4">
                <span className="text-2xl font-bold text-purple-200">Coins Collected:</span>
                <span className="text-4xl font-black text-yellow-400">{finalCoins}</span>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-8 py-6 text-xl rounded-xl"
              >
                <RotateCcw className="mr-2 h-6 w-6" />
                Play Again
              </Button>
              <Button
                onClick={() => navigate('/')}
                size="lg"
                variant="outline"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 font-bold px-8 py-6 text-xl rounded-xl"
              >
                <Home className="mr-2 h-6 w-6" />
                Home
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      {!gameOver && (
        <div className="mt-4 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-xl border border-white/20">
          <p className="text-purple-200 text-center">
            Press <span className="font-bold text-yellow-400">SPACE</span> to jump!
          </p>
        </div>
      )}
    </div>
  );
};

export default Game;
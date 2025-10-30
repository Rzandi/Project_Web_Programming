import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Trophy, Play, Gamepad2 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <Gamepad2 className="w-24 h-24 text-yellow-400 animate-bounce" />
          </div>
          <h1 className="text-7xl font-black text-white mb-4 tracking-tight">
            Pixel <span className="text-yellow-400">Runner</span>
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Jump, dodge, and collect coins in this addictive endless runner!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => navigate('/game')}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-12 py-8 text-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Play className="mr-3 h-8 w-8" />
            Start Game
          </Button>
          <Button
            onClick={() => navigate('/leaderboard')}
            size="lg"
            variant="outline"
            className="border-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 font-bold px-12 py-8 text-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Trophy className="mr-3 h-8 w-8" />
            Leaderboard
          </Button>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-200">
            <div className="flex justify-center mb-3">
              <Zap className="w-16 h-16 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Fast-Paced Action</h3>
            <p className="text-purple-200">Speed increases with each level!</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-200">
            <div className="flex justify-center mb-3">
              <Coins className="w-16 h-16 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Collect Coins</h3>
            <p className="text-purple-200">Maximize your score with coins!</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-200">
            <div className="flex justify-center mb-3">
              <Gamepad2 className="w-16 h-16 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Simple Controls</h3>
            <p className="text-purple-200">Just press SPACE to jump!</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-purple-200">
            <div>
              <span className="font-bold text-yellow-400">SPACE:</span> Jump
            </div>
            <div>
              <span className="font-bold text-yellow-400">Goal:</span> Avoid obstacles & collect coins
            </div>
            <div>
              <span className="font-bold text-yellow-400">Lives:</span> You have 3 lives per game
            </div>
            <div>
              <span className="font-bold text-yellow-400">Levels:</span> Each level gets faster!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
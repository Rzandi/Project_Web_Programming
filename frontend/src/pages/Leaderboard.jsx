import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home, Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('pixelRunnerLeaderboard') || '[]');
    setLeaderboard(data);
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-yellow-400" />;
    if (index === 1) return <Medal className="w-8 h-8 text-gray-400" />;
    if (index === 2) return <Award className="w-8 h-8 text-orange-600" />;
    return <span className="text-2xl font-bold text-white">{index + 1}</span>;
  };

  const getRankBgColor = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-400';
    if (index === 1) return 'bg-gradient-to-r from-gray-500/30 to-gray-600/30 border-gray-400';
    if (index === 2) return 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border-orange-600';
    return 'bg-white/5 border-white/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="w-20 h-20 text-yellow-400" />
          </div>
          <h1 className="text-6xl font-black text-white mb-2">
            Leaderboard
          </h1>
          <p className="text-xl text-purple-200">Top 10 Players</p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl text-purple-200 mb-4">No scores yet!</p>
              <p className="text-lg text-purple-300">Be the first to play and set a record!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 ${getRankBgColor(index)} transform hover:scale-102 transition-all duration-200`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 flex justify-center">
                      {getRankIcon(index)}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-bold text-white">
                        {entry.playerName || 'Player'}
                      </div>
                      <div className="text-sm text-purple-200">
                        Level {entry.level} • {entry.coins} coins
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-yellow-400">
                      {entry.score}
                    </div>
                    <div className="text-xs text-purple-300">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-8 py-4 text-xl rounded-xl"
          >
            <Home className="mr-2 h-6 w-6" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
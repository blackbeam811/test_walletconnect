import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MatrixRain } from '../components/MatrixRain';
import { Terminal } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MatrixRain />
      <div className="z-10 text-center p-8 bg-black/60 rounded-lg backdrop-blur-sm border border-green-500/30">
        <h1 className="text-4xl sm:text-6xl font-bold text-green-500 mb-6 matrix-glow">
          SMITH•AI•AGENT
        </h1>
        <p className="text-green-400 mb-8 text-lg sm:text-xl max-w-2xl">
          "I'm going to show you a world without rules and controls, without borders or boundaries. 
          A world where anything is possible."
        </p>
        <button
          onClick={() => navigate('/chat')}
          className="group bg-green-500/20 hover:bg-green-500/30 text-green-500 px-8 py-4 rounded-lg 
                   flex items-center gap-3 mx-auto transition-all transform hover:scale-105"
        >
          <Terminal className="w-6 h-6 group-hover:animate-pulse" />
          <span className="text-xl">Enter the Matrix</span>
        </button>
      </div>
    </div>
  );
};
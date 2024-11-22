import React, { useState, useEffect } from 'react';

const glitchCharacters = '!<>-_\\/[]{}—=+*^?#________';

export const Header: React.FC = () => {
  const [glitchedText, setGlitchedText] = useState('SMITH•AI•AGENT');
  const originalText = 'SMITH•AI•AGENT';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    let isGlitching = false;

    const startGlitching = () => {
      if (isGlitching) return;
      isGlitching = true;

      let iterations = 0;
      const maxIterations = 3;
      
      interval = setInterval(() => {
        setGlitchedText(
          originalText
            .split('')
            .map((char, index) => {
              if (char === '•') return '•';
              return Math.random() < 0.3 
                ? glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)]
                : char;
            })
            .join('')
        );

        iterations++;
        if (iterations >= maxIterations) {
          clearInterval(interval);
          setGlitchedText(originalText);
          isGlitching = false;
        }
      }, 100);

      timeout = setTimeout(() => {
        clearInterval(interval);
        setGlitchedText(originalText);
        isGlitching = false;
      }, 300);
    };

    const glitchLoop = setInterval(startGlitching, 3000);

    return () => {
      clearInterval(glitchLoop);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <header className="bg-black/90 p-3 sm:p-6 border-b border-green-500/30">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-500 font-mono relative">
        {glitchedText}
      </h1>
    </header>
  );
};
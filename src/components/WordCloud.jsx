import React, { useEffect, useRef } from 'react';

const WordCloud = ({ words, width = 400, height = 300 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load wordcloud2.js dynamically
    const script = document.createElement('script');
    script.src = '/wordcloud2.js';
    script.onload = () => {
      if (window.WordCloud) {
        // Clear canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Prepare word list for wordcloud2.js
        const wordList = words.map(({ word, count }) => [word, count * 10]); // Scale up for better visibility

        // Generate word cloud
        window.WordCloud(canvas, {
          list: wordList,
          gridSize: Math.round(16 * canvas.width / 1024),
          weightFactor: function (size) {
            return Math.pow(size, 2.3) * canvas.width / 1024;
          },
          fontFamily: 'Inter, system-ui, sans-serif',
          color: function (word, weight) {
            // Use a nice color palette
            const colors = ['#1e40af', '#3b82f6', '#60a5fa', '#0891b2', '#06b6d4', '#22d3ee'];
            return colors[Math.floor(Math.random() * colors.length)];
          },
          rotateRatio: 0.3,
          rotationSteps: 2,
          backgroundColor: 'transparent',
          minSize: 12,
          drawOutOfBound: false,
          shrinkToFit: true
        });
      }
    };
    
    // Only add script if it doesn't exist
    if (!document.querySelector('script[src="/wordcloud2.js"]')) {
      document.head.appendChild(script);
    } else if (window.WordCloud) {
      // Script already loaded, generate word cloud immediately
      script.onload();
    }

    return () => {
      // Cleanup if needed
    };
  }, [words, width, height]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: 'auto' }}
        className="border rounded-lg"
      />
    </div>
  );
};

export default WordCloud;


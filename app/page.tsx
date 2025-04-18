'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WordResult from './components/WordResult';
import { motion } from 'framer-motion';

export default function Page() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For the falling words animation with random positions and 3D effect
  useEffect(() => {
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon'];
    const container = document.getElementById('falling-words');

    const createFallingWords = () => {
      const wordElement = document.createElement('div');
      wordElement.textContent = words[Math.floor(Math.random() * words.length)];
      wordElement.classList.add('falling-word');
      
      // Set random initial positions for each word
      const randomX = Math.floor(Math.random() * 100) + '%'; // Random X position
      const randomDelay = Math.random() * 2 + 's'; // Random delay for each word's animation start
      const randomRotation = Math.floor(Math.random() * 360) + 'deg'; // Random rotation angle
      const randomScale = Math.random() * 0.5 + 0.5; // Random scale for 3D effect
      const randomColor = `hsl(${Math.random() * 360}, 100%, 75%)`; // Random color for more vibrancy

      wordElement.style.left = randomX;
      wordElement.style.animationDelay = randomDelay;
      wordElement.style.transform = `rotate(${randomRotation}) scale(${randomScale})`;
      wordElement.style.color = randomColor;

      container?.appendChild(wordElement);

      setTimeout(() => {
        wordElement.remove();
      }, 6000); // Remove the word after it finishes falling
    };

    const intervalId = setInterval(createFallingWords, 300); // Make it faster for more "rain"

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  const fetchDefinition = useCallback(async (word: string) => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError(null);
    setTerm(word);
    setDefinition(null);
    setSuggestions([]);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      );

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Word not found' : 'API error');
      }

      const data = await response.json();

      const firstResult = data[0];
      setDefinition(
        firstResult.meanings?.[0]?.definitions?.[0]?.definition || 'Definition not available'
      );

      const audioUrl = firstResult.phonetics?.find((p: { audio?: string }) => p.audio)?.audio;
      if (audioUrl) {
        audioRef.current = new Audio(audioUrl);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setSuggestions(['Try another word']);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playSound = useCallback(() => {
    audioRef.current?.play().catch((e) => {
      console.error('Audio playback failed', e);
      setError('Could not play pronunciation');
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 dark:from-indigo-900 dark:to-indigo-800 p-6 relative overflow-hidden">
      {/* Background falling words container */}
      <div id="falling-words" className="absolute inset-0 pointer-events-none z-0"></div>

      <motion.h1
        className="text-5xl font-bold text-white mb-6 z-10 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        📖 Smart Dictionary
      </motion.h1>

      <SearchBar
        onSearch={fetchDefinition}
        suggestions={suggestions}
        onPlaySound={playSound}
        isLoading={isLoading}
        setSuggestions={setSuggestions}
      />

      {isLoading && (
        <div className="mt-6 p-4 text-blue-700 dark:text-blue-300 z-10 relative">
          Loading...
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg z-10 relative">
          {error}
        </div>
      )}

      {term && !isLoading && <WordResult term={term} />}

      {definition && !error && (
        <motion.div
          className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-xl mt-6 max-w-xl text-center text-lg z-10 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {definition}
        </motion.div>
      )}
    </main>
  );
}

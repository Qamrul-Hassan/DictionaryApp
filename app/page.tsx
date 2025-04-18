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
  const resultRef = useRef<HTMLDivElement | null>(null);

  const scrollToResult = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (resultRef.current) {
          const topOffset = resultRef.current.getBoundingClientRect().top + window.scrollY;
          const currentScroll = window.scrollY;

          if (Math.abs(currentScroll - topOffset) > 100) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    });
  }, []);

  useEffect(() => {
    const dictionaryWords = [
      'ephemeral', 'serendipity', 'melancholy', 'ineffable', 'sonder', 'limerence',
      'solitude', 'sonder', 'ethereal', 'labyrinth', 'eloquence', 'sonder', 'mellifluous',
      'sonder', 'effervescent', 'sonder', 'epiphany', 'sonder', 'resilience', 'sonder',
      'sonder', 'sonder', 'sonder', 'sonder', 'sonder', 'sonder', 'sonder', 'sonder'
    ];

    const container = document.getElementById('fireworks-container');

    const createFireworks = () => {
      const wordElement = document.createElement('div');
      const word = dictionaryWords[Math.floor(Math.random() * dictionaryWords.length)];
      wordElement.textContent = word;
      wordElement.classList.add('firework-word');

      const randomX = Math.floor(Math.random() * window.innerWidth) + 'px';
      const randomY = Math.floor(Math.random() * window.innerHeight) + 'px';
      const randomDelay = Math.random() * 1 + 's';
      const randomRotation = Math.floor(Math.random() * 360) + 'deg';
      const randomScale = Math.random() * 0.5 + 0.8;
      const randomColor = `hsl(${Math.random() * 360}, 100%, 75%)`;

      wordElement.style.left = randomX;
      wordElement.style.top = randomY;
      wordElement.style.animationDelay = randomDelay;
      wordElement.style.transform = `rotate(${randomRotation}) scale(${randomScale})`;
      wordElement.style.color = randomColor;
      wordElement.style.position = 'absolute';
      wordElement.style.fontSize = '24px';
      wordElement.style.pointerEvents = 'none';
      wordElement.style.whiteSpace = 'nowrap';

      wordElement.style.animation = `burstEffect 1.5s ease-out forwards`;

      container?.appendChild(wordElement);

      setTimeout(() => {
        wordElement.remove();
      }, 2000);
    };

    const intervalId = setInterval(createFireworks, 200); // more frequent bursts

    return () => clearInterval(intervalId);
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

      scrollToResult();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setSuggestions(['Try another word']);
    } finally {
      setIsLoading(false);
    }
  }, [scrollToResult]);

  const playSound = useCallback(() => {
    audioRef.current?.play().catch((e) => {
      console.error('Audio playback failed', e);
      setError('Could not play pronunciation');
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 dark:from-indigo-900 dark:to-indigo-800 p-6 relative overflow-hidden">
      {/* Firework background */}
      <div id="fireworks-container" className="absolute inset-0 pointer-events-none z-0" />

      {/* Heading */}
      <motion.h1
        className="text-5xl font-bold text-white mb-6 z-10 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        📖 Smart Dictionary
      </motion.h1>

      {/* Search */}
      <div className="w-full flex justify-center z-10 relative">
        <SearchBar
          onSearch={fetchDefinition}
          suggestions={suggestions}
          onPlaySound={playSound}
          isLoading={isLoading}
          setSuggestions={setSuggestions}
        />
      </div>

      {isLoading && (
        <div className="mt-6 p-4 text-blue-700 dark:text-blue-300 z-10 relative">Loading...</div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg z-10 relative">
          {error}
        </div>
      )}

      {term && !isLoading && <WordResult term={term} />}

      {definition && !error && (
        <motion.div
          className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-xl mt-6 max-w-xl text-center text-lg z-10 relative w-full sm:w-11/12 md:w-3/4 lg:w-1/2"
          ref={resultRef}
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

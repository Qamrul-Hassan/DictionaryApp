'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WordResult from './components/WordResult';
import { motion } from 'framer-motion';
import { DictionaryProvider, useDictionary } from './components/DictionaryContext';

function DictionaryPageContent() {
  const { state, dispatch } = useDictionary();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    const words = [
      'ephemeral', 'serendipity', 'melancholy', 'ineffable', 'sonder', 'limerence',
      'solitude', 'ethereal', 'labyrinth', 'eloquence', 'mellifluous', 'effervescent',
      'epiphany', 'resilience'
    ];

    const container = document.getElementById('fireworks-container');

    const createFirework = () => {
      const wordElement = document.createElement('div');
      const word = words[Math.floor(Math.random() * words.length)];
      wordElement.textContent = word;
      wordElement.className = 'firework-word';

      const style = wordElement.style;
      style.left = Math.random() * window.innerWidth + 'px';
      style.top = Math.random() * window.innerHeight + 'px';
      style.animationDelay = Math.random() * 1 + 's';
      style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.8})`;
      style.color = `hsl(${Math.random() * 360}, 100%, 75%)`;
      Object.assign(style, {
        position: 'absolute',
        fontSize: '24px',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        animation: 'burstEffect 1.5s ease-out forwards'
      });

      container?.appendChild(wordElement);

      setTimeout(() => wordElement.remove(), 2000);
    };

    const intervalId = setInterval(createFirework, 200);
    return () => clearInterval(intervalId);
  }, []);

  const fetchDefinition = useCallback(async (word: string) => {
    if (!word.trim()) return;

    setIsLoading(true);
    dispatch({ type: 'FETCH_START' });
    dispatch({ type: 'SET_CURRENT_WORD', payload: word });
    setSuggestions([]);

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (!res.ok) throw new Error(res.status === 404 ? 'Word not found' : 'API error');

      const data = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      scrollToResult();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      setSuggestions(['Try another word']);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, scrollToResult]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 dark:from-indigo-900 dark:to-indigo-800 p-6 relative overflow-hidden">
      {/* Background Fireworks */}
      <div id="fireworks-container" className="absolute inset-0 pointer-events-none z-0" />

      {/* Title */}
      <motion.h1
        className="text-5xl font-bold text-white mb-6 z-10 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        📖 Smart Dictionary
      </motion.h1>

      {/* Search Bar */}
      <div className="w-full flex justify-center z-10 relative">
        <SearchBar
          onSearch={fetchDefinition}
          suggestions={suggestions}
          isLoading={isLoading}
          setSuggestions={setSuggestions}
        />
      </div>

      {/* Loading State */}
      {state.loading && (
        <div className="mt-6 p-4 text-blue-700 dark:text-blue-300 z-10 relative">
          Loading...
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg z-10 relative">
          {state.error}
        </div>
      )}

      {/* Word Result Info */}
      {state.currentWord && !state.loading && <WordResult term={state.currentWord} />}

      {/* Definition */}
      {state.data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition && !state.error && (
        <motion.div
          ref={resultRef}
          className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-xl mt-6 max-w-xl text-center text-lg z-10 relative w-full sm:w-11/12 md:w-3/4 lg:w-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {state.data[0].meanings[0].definitions[0].definition}
        </motion.div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <DictionaryProvider>
      <DictionaryPageContent />
    </DictionaryProvider>
  );
}
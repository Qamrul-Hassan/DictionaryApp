'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from './components/SearchBar';
import WordResult from './components/WordResult';
import { DictionaryProvider, useDictionary } from './components/DictionaryContext';
import { DictionaryResponse } from './types/dictionary';

const AMBIENT_WORDS = [
  'lexicon',
  'dictionary',
  'pronunciation',
  'etymology',
  'definition',
  'vocabulary',
  'semantics',
  'synonym',
  'antonym',
  'idiom',
  'phonetics',
  'context',
  'adjective',
  'verb',
  'noun',
  'grammar',
  'fluency',
  'accent',
  'morpheme',
  'linguistics',
  'phrase',
  'language',
  'wordbook',
  'expression',
];

function DictionaryPageContent() {
  const { state, dispatch } = useDictionary();
  const resultRef = useRef<HTMLElement | null>(null);
  const hasResult = Boolean(state.data?.length);
  const [now, setNow] = useState(new Date());
  const localTime = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(now);

  useEffect(() => {
    if (state.data?.length && !state.loading) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.data, state.loading]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const fetchDefinition = useCallback(
    async (word: string) => {
      const term = word.trim();
      if (!term) return;

      dispatch({ type: 'FETCH_START' });
      dispatch({ type: 'SET_CURRENT_WORD', payload: term });

      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? `No result found for "${term}".`
              : 'Could not fetch dictionary data.'
          );
        }

        const data: DictionaryResponse[] = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      }
    },
    [dispatch]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-app px-4 py-10 sm:px-6 sm:py-14">
      <div aria-hidden="true" className="decor-orb decor-orb-one" />
      <div aria-hidden="true" className="decor-orb decor-orb-two" />
      <div aria-hidden="true" className="floating-word-layer">
        {AMBIENT_WORDS.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="floating-word-burst"
            style={{
              left: `${2 + ((index * 11) % 94)}%`,
              top: `${4 + ((index * 19) % 92)}%`,
              fontSize: `${0.8 + ((index % 5) * 0.15)}rem`,
              animationDelay: `-${(index % 7) * 1.8}s`,
              animationDuration: `${15 + ((index * 2) % 13)}s`,
            }}
          >
            <span className="floating-word">{word}</span>
            <span className="floating-ring" />
            <span className="floating-spark floating-spark-one" />
            <span className="floating-spark floating-spark-two" />
            <span className="floating-spark floating-spark-three" />
          </span>
        ))}
      </div>

      <section
        className={`relative z-10 mx-auto w-full max-w-3xl transition-all duration-500 ${
          hasResult ? '' : 'flex min-h-[80vh] flex-col justify-center'
        }`}
      >
        <header className="glass-panel accent-glow relative mb-6 rounded-3xl border border-white/45 px-5 py-6 text-center shadow-[0_16px_44px_rgba(15,23,42,0.12)] sm:mb-8 sm:px-8 sm:py-8">
          <p className="glass-panel absolute right-3 top-3 rounded-full border border-white/55 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-slate-700 sm:right-4 sm:top-4 sm:text-xs">
            {localTime}
          </p>
          <motion.p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
          >
            Vocabulary Companion
          </motion.p>

          <motion.h1
            className="accent-title text-4xl font-bold tracking-tight sm:text-5xl"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.32 }}
          >
            Smart Dictionary
          </motion.h1>
        </header>

        <SearchBar onSearch={fetchDefinition} isLoading={state.loading} />

        <section aria-live="polite" className="mt-4 min-h-8">
          {state.loading ? (
            <motion.p
              className="text-center text-sm font-medium text-slate-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Searching definition...
            </motion.p>
          ) : null}

          {state.error ? (
            <motion.p
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {state.error}
            </motion.p>
          ) : null}
        </section>

        <section ref={resultRef}>
          {state.data?.length ? <WordResult entries={state.data} /> : null}
        </section>
      </section>

      <footer className="relative z-10 mx-auto mt-8 w-full max-w-3xl px-4 pb-4 text-center sm:mt-10 sm:pb-6">
        <p className="glass-panel inline-flex rounded-full border border-white/50 px-4 py-2 text-xs font-medium text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.12)] sm:text-sm">
          &copy; {new Date().getFullYear()} Qamrul Hassan Shajal. All rights reserved.
        </p>
      </footer>
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

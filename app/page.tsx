'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaMoon, FaSun } from 'react-icons/fa';
import SearchBar from './components/SearchBar';
import WordResult from './components/WordResult';
import Footer from './components/Footer';
import BannerBookArt from './components/BannerBookArt';
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

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 127.1) * 10000;
  return value - Math.floor(value);
};

const AMBIENT_BG_LETTERS = Array.from({ length: 120 }, (_, index) => {
  const r1 = pseudoRandom(index + 1);
  const r2 = pseudoRandom(index + 11);
  const r3 = pseudoRandom(index + 21);
  const r4 = pseudoRandom(index + 31);
  const r5 = pseudoRandom(index + 41);
  const r6 = pseudoRandom(index + 51);

  return {
    id: index,
    letter: String.fromCharCode(65 + Math.floor(r1 * 26)),
    left: `${Math.round(r2 * 100)}%`,
    top: `${Math.round(r3 * 100)}%`,
    size: `${1.8 + r4 * 4.8}rem`,
    rotate: `${Math.round((r5 - 0.5) * 42)}deg`,
    delay: `-${(r6 * 9).toFixed(2)}s`,
    duration: `${9 + Math.round(r1 * 11)}s`,
    opacity: 0.1 + r2 * 0.2,
  };
});

function DictionaryPageContent() {
  const { state, dispatch } = useDictionary();
  const resultRef = useRef<HTMLElement | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [showAmbientLetters, setShowAmbientLetters] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const localTime = now
    ? new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      }).format(now)
    : '--:--:--';

  useEffect(() => {
    if (state.data?.length && !state.loading) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.data, state.loading]);

  useEffect(() => {
    setNow(new Date());
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    setShowAmbientLetters(true);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    const initialTheme =
      storedTheme === 'dark' || storedTheme === 'light'
        ? (storedTheme as 'light' | 'dark')
        : 'dark';
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchDefinition = useCallback(
    async (word: string) => {
      const term = word.trim();
      if (!term) return;

      dispatch({ type: 'FETCH_START' });
      dispatch({ type: 'SET_CURRENT_WORD', payload: term });

      try {
        const lookupWord = async (query: string) => {
          const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`
          );
          if (!response.ok) {
            return null;
          }
          const data: DictionaryResponse[] = await response.json();
          return data;
        };

        let data = await lookupWord(term);

        if (!data) {
          const suggestionResponse = await fetch(
            `https://api.datamuse.com/sug?s=${encodeURIComponent(term)}`
          );

          if (suggestionResponse.ok) {
            const suggestions: Array<{ word: string }> = await suggestionResponse.json();
            const candidates = suggestions.map((item) => item.word).filter(Boolean).slice(0, 5);

            for (const candidate of candidates) {
              data = await lookupWord(candidate);
              if (data) break;
            }

            if (!data && candidates.length > 0) {
              throw new Error(`No result found for "${term}". Did you mean "${candidates[0]}"?`);
            }
          }
        }

        if (!data) {
          throw new Error(`No result found for "${term}".`);
        }

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      }
    },
    [dispatch]
  );

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-app px-4 pb-0 pt-10 sm:px-6 sm:pb-0 sm:pt-12">
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

      <div aria-hidden="true" className="floating-letter-layer">
        {showAmbientLetters
          ? AMBIENT_BG_LETTERS.map((item) => (
              <span
                key={`bg-letter-${item.id}`}
                className="floating-letter"
                style={{
                  left: item.left,
                  top: item.top,
                  fontSize: item.size,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                  transform: `rotate(${item.rotate})`,
                  opacity: item.opacity,
                }}
              >
                {item.letter}
              </span>
            ))
          : null}
      </div>

      <section className="relative z-20 mx-auto mt-6 w-full max-w-4xl transition-all duration-500 sm:mt-8">
        <nav className="mb-5 flex flex-wrap items-center justify-center gap-1.5 sm:mb-6">
          <a
            href="#definitions"
            className="glass-panel rounded-full border border-white/55 bg-white/74 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
          >
            Definitions
          </a>
          <a
            href="#synonyms-antonyms"
            className="glass-panel rounded-full border border-white/55 bg-white/74 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
          >
            Synonyms
          </a>
          <a
            href="#examples"
            className="glass-panel rounded-full border border-white/55 bg-white/74 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
          >
            Examples
          </a>
          <a
            href="/contact"
            className="glass-panel rounded-full border border-white/55 bg-white/74 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
          >
            Contact
          </a>
          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className="glass-panel inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-white/74 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-toggle-icon inline-flex text-sm">
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </span>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
        <div className="relative mt-2 sm:mt-3">
          <p className="clock-chip absolute left-1/2 top-0 z-30 inline-flex -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-slate-900/55 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(2,6,23,0.45)] sm:text-xs">
            {localTime}
          </p>
          <header className="accent-glow relative mb-4 overflow-hidden rounded-[2rem] border border-white/30 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9),rgba(6,182,212,0.82))] px-5 py-7 shadow-[0_32px_80px_rgba(2,6,23,0.45)] sm:mb-6 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-95 [background-image:radial-gradient(circle_at_14%_20%,rgba(125,211,252,0.34),transparent_30%),radial-gradient(circle_at_84%_74%,rgba(129,140,248,0.34),transparent_32%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_35%,transparent_58%)]" />
          <div className="pointer-events-none absolute inset-[10px] rounded-[1.55rem] border border-white/20" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 left-10 h-44 w-44 rounded-full bg-indigo-300/25 blur-2xl" />
          <div className="pointer-events-none absolute inset-x-0 -bottom-4 h-36 opacity-22 sm:-bottom-5 sm:h-44">
            <BannerBookArt />
          </div>

          <div className="relative flex items-center justify-start gap-4 sm:gap-6">
            <div className="inline-flex items-center overflow-hidden rounded-2xl border border-cyan-300/65 px-2 py-1.5 shadow-[0_0_0_1px_rgba(165,243,252,0.35)_inset,0_0_18px_rgba(34,211,238,0.24)]">
              <Image
                src="/dic-logo.png"
                alt="Dictionary logo"
                width={175}
                height={52}
                priority
                className="scale-[1.02] transform-gpu"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>

            <div className="text-left">
              <motion.h1
                className="bg-gradient-to-r from-cyan-200 via-white to-cyan-100 bg-clip-text text-4xl font-black tracking-tight text-transparent [filter:drop-shadow(0_12px_24px_rgba(15,23,42,0.45))] sm:text-[4rem]"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.32 }}
              >
                Smart Dictionary
              </motion.h1>

              <motion.p
                className="mt-3 inline-flex rounded-full border border-cyan-200/75 bg-gradient-to-r from-cyan-400/28 to-indigo-400/28 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-cyan-50 shadow-[0_10px_24px_rgba(6,182,212,0.34)] backdrop-blur-md sm:text-sm"
                style={{ textShadow: '0 2px 12px rgba(2,6,23,0.45)' }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
              >
                Vocabulary Companion
              </motion.p>
            </div>
          </div>
          </header>
        </div>

        <div className="mt-3 sm:mt-4">
          <SearchBar onSearch={fetchDefinition} isLoading={state.loading} />
        </div>

        <section aria-live="polite" className="mt-4 min-h-8">
          {state.loading ? (
            <motion.p
              className="text-center text-sm font-medium text-slate-700 dark:text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Searching definition...
            </motion.p>
          ) : null}

          {state.error ? (
            <motion.p
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-200"
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

      <Footer />
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

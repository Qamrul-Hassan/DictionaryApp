import { useEffect, useId, useRef, useState } from 'react';
import { FaSearch, FaVolumeUp } from 'react-icons/fa';
import { useDictionary } from './DictionaryContext';

interface SearchBarProps {
  onSearch: (word: string) => Promise<void>;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const { playPronunciation, dispatch } = useDictionary();
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const reactId = useId();
  const inputId = `search-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const listId = `${inputId}-listbox`;
  const hasVisibleSuggestions = showSuggestions && suggestions.length > 0;
  const activeDescendantId =
    hasVisibleSuggestions && selectedIndex >= 0
      ? `${inputId}-option-${selectedIndex}`
      : undefined;
  const requestRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      dispatch({ type: 'CLEAR_RESULTS' });
    }
  }, [dispatch, input]);

  useEffect(() => {
    const searchTerm = input.trim();
    if (searchTerm.length < 2) {
      setShowSuggestions(false);
      setSuggestions([]);
      setSelectedIndex(-1);
      requestRef.current?.abort();
      return;
    }

    setShowSuggestions(isInputFocused);
    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.datamuse.com/sug?s=${encodeURIComponent(searchTerm)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Suggestion request failed');
        }

        const data: { word: string }[] = await response.json();
        setSuggestions(data.map((item) => item.word).slice(0, 7));
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      }
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [input, isInputFocused]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const word = input.trim();
        if (word) {
          void handleSearch(word);
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        const word = selectedIndex >= 0 ? suggestions[selectedIndex] : input.trim();
        if (word) {
          void handleSearch(word);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = async (word: string) => {
    requestRef.current?.abort();
    setInput(word);
    setShowSuggestions(false);
    setIsInputFocused(false);
    setSelectedIndex(-1);
    setSuggestions([]);
    inputRef.current?.blur();
    await onSearch(word);
  };

  return (
    <div className="relative z-40 mx-auto w-full max-w-xl">
      <form
        className="search-shell glass-panel accent-glow rounded-2xl border border-white/60 bg-white/70 p-2 shadow-lg transition-shadow duration-300 dark:border-slate-600/60 dark:bg-slate-900/60"
        onSubmit={(e) => {
          e.preventDefault();
          const word = input.trim();
          if (word) {
            void handleSearch(word);
          }
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Search for a word
        </label>
        <div className="flex items-center gap-1">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id={inputId}
              name="search-word"
              type="text"
              className="min-h-11 w-full rounded-xl border border-transparent bg-transparent px-3 text-base text-slate-900 outline-none transition placeholder:text-slate-500 focus-visible:border-sky-400 sm:text-lg dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder="Search a word"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setSelectedIndex(-1);
              }}
              onFocus={() => {
                setIsInputFocused(true);
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setIsInputFocused(false);
                setShowSuggestions(false);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              disabled={isLoading}
              role="combobox"
              aria-expanded={hasVisibleSuggestions}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeDescendantId}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-cyan-100/70 hover:text-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-cyan-500/20 dark:hover:text-cyan-200"
            aria-label="Search"
          >
            <FaSearch aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={playPronunciation}
            disabled={!input.trim() || isLoading}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-indigo-100/70 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-200"
            aria-label="Play pronunciation"
          >
            <FaVolumeUp aria-hidden="true" />
          </button>
        </div>
      </form>

      <ul
        id={listId}
        role="listbox"
        aria-label="Word suggestions"
        hidden={!hasVisibleSuggestions}
        className="glass-panel absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-white/55 bg-white/78 p-1 shadow-2xl dark:border-slate-600/60 dark:bg-slate-900/85"
      >
        {suggestions.map((suggestion, index) => {
          const isActive = index === selectedIndex;
          return (
            <li key={`${suggestion}-${index}`} role="presentation">
              <button
                id={`${inputId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition sm:text-base ${
                  isActive
                    ? 'bg-cyan-100 text-cyan-900 shadow-[0_0_0_1px_rgba(8,145,178,0.35),0_0_20px_rgba(34,211,238,0.45)] dark:bg-cyan-500/20 dark:text-cyan-100'
                    : 'text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 hover:shadow-[0_0_0_1px_rgba(14,116,144,0.25),0_0_18px_rgba(34,211,238,0.38)] dark:text-slate-200 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-100'
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  void handleSearch(suggestion);
                }}
              >
                {suggestion}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchBar;

'use client';

import { useState, useRef, KeyboardEvent, Dispatch, SetStateAction } from 'react';
import { FaSearch, FaVolumeUp } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (word: string) => void;
  suggestions: string[];
  isLoading: boolean;
  onPlaySound: () => void;
  setSuggestions: Dispatch<SetStateAction<string[]>>;
}

const SearchBar = ({
  onSearch,
  suggestions,
  onPlaySound,
  setSuggestions,
}: SearchBarProps) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setShowSuggestions(true);

    if (value.length > 0) {
      fetch(`https://api.datamuse.com/sug?s=${value}`)
        .then((res) => res.json())
        .then((data) => {
          const words = data.map((item: { word: string }) => item.word);
          setSuggestions(words);
        })
        .catch(() => setSuggestions(['No suggestions']));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      const word =
        selectedIndex >= 0 ? suggestions[selectedIndex] : input.trim();
      if (word) {
        onSearch(word);
        setInput(word);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setSuggestions([]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (word: string) => {
    setInput(word);
    onSearch(word);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-xl relative z-10">
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-full shadow-md overflow-hidden px-3 py-2 sm:px-4 sm:py-3">
        {/* Input field with search icon */}
        <div className="flex items-center flex-grow relative">
        <input
  id="search-word"
  name="search-word"
  ref={inputRef}
  type="text"
  className="flex-grow text-base sm:text-lg px-3 py-2 text-gray-800 dark:text-white bg-transparent outline-none focus:ring-0 focus:outline-none"
  placeholder="Type a word..."
  value={input}
  onChange={handleInputChange}
  onKeyDown={handleKeyDown}
  autoComplete="off"
/>

          {/* Search Icon (placed inside the input field) */}
          <FaSearch
            className="absolute right-3 text-gray-500 dark:text-white sm:text-lg cursor-pointer"
            onClick={() => {
              if (input.trim()) {
                onSearch(input.trim());
                setShowSuggestions(false);
                setSuggestions([]);
              }
            }}
            aria-label="Search"
          />
        </div>

        {/* Play Sound Button */}
        <div className="ml-2">
          <button
            onClick={onPlaySound}
            className="flex items-center justify-center text-xl sm:text-2xl text-red-600 dark:text-blue-300 hover:text-blue-800 rounded-full p-2 min-w-[44px] min-h-[44px] transition-all active:scale-95 focus:outline-none"
            aria-label="Play Sound"
          >
            <FaVolumeUp />
          </button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-b-xl mt-1 max-h-48 overflow-y-auto z-20">
          {suggestions.map((s, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer ${
                index === selectedIndex
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onMouseDown={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

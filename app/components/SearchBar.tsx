import { useState, useRef, KeyboardEvent } from 'react';
import { FaSearch, FaVolumeUp } from 'react-icons/fa';
import { useDictionary } from './DictionaryContext';

interface SearchBarProps {
  onSearch: (word: string) => Promise<void>;
  suggestions: string[];
  isLoading: boolean;
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
}

const SearchBar = ({
  onSearch,
  suggestions,
  isLoading,
  setSuggestions,
}: SearchBarProps) => {
  const { playPronunciation } = useDictionary();
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
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
        if (word) handleSearch(word);
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = async (word: string) => {
    setInput(word);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSuggestions([]);
    await onSearch(word);
  };

  const handleSuggestionClick = (word: string) => {
    handleSearch(word);
  };

  return (
    <div className="w-full max-w-xl relative z-10">
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-full shadow-md overflow-hidden px-3 py-2 sm:px-4 sm:py-3">
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
            disabled={isLoading}
          />
          <FaSearch
            className="absolute right-3 text-gray-500 dark:text-white sm:text-lg cursor-pointer"
            onClick={() => input.trim() && handleSearch(input.trim())}
            aria-label="Search"
          />
        </div>

        <div className="ml-2">
          <button
            onClick={playPronunciation}
            disabled={!input.trim() || isLoading}
            className="flex items-center justify-center text-xl sm:text-2xl text-red-600 dark:text-blue-300 hover:text-blue-800 rounded-full p-2 min-w-[44px] min-h-[44px] transition-all active:scale-95 focus:outline-none disabled:opacity-50"
            aria-label="Play Sound"
          >
            <FaVolumeUp />
          </button>
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-b-xl mt-1 max-h-48 overflow-y-auto z-20">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer ${
                index === selectedIndex
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
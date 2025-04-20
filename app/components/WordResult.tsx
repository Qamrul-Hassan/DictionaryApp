import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaVolumeUp } from 'react-icons/fa';

interface Phonetic {
  text?: string;
  audio?: string;
  region?: 'USA' | 'UK' | 'Australia';
}

interface DefinitionDetail {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: DefinitionDetail[];
}

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Phonetic[];
  meanings: Meaning[];
}

interface WordResultProps {
  term: string;
}

const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.play().catch((err) => {
    console.error('Playback failed:', err);
  });
};

const WordResult: React.FC<WordResultProps> = ({ term }) => {
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
    }, 500);
    return () => clearTimeout(timer);
  }, [term]);

  // Fetch API
  useEffect(() => {
    if (!debouncedTerm.trim() || debouncedTerm.trim().length < 2) return;

    const fetchData = async () => {
      try {
        const response = await axios.get<DictionaryEntry[]>(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${debouncedTerm}`
        );
        setEntries(response.data);
        setError(null);
      } catch {
        setEntries([]);
        setError("Sorry, we couldn't find that word.");
      }
    };

    fetchData();
  }, [debouncedTerm]);

  return (
    <div className="word-result-container mt-8 relative z-10">
      {error && <p className="text-red-500 text-center">{error}</p>}

      {entries.length > 0 && (
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow bg-amber-50 dark:bg-gray-800 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-200 mb-3 capitalize">
            {entries[0].word}
          </h2>

          {/* Phonetics Section */}
          <div className="flex flex-wrap gap-3 mb-4">
            {entries[0].phonetics?.map((phon, i) =>
              phon.audio ? (
                <button
                  key={i}
                  onClick={() => playSound(phon.audio!)}
                  className="flex items-center bg-white dark:bg-gray-200 text-blue-600 dark:text-blue-500 hover:text-blue-800 rounded-full px-3 py-2 min-w-[44px] min-h-[44px] text-sm shadow-md transition active:scale-95"
                  aria-label={`Play ${phon.region || 'Phonetic'} pronunciation`}
                >
                  <FaVolumeUp className="mr-2" />
                  {phon.region || 'Play'}
                  {phon.text ? ` (${phon.text})` : ''}
                </button>
              ) : null
            )}
          </div>

          {/* Meanings Section */}
          {entries.map((entry, entryIndex) => (
            <div key={entryIndex}>
              {entry.meanings.map((meaning, meaningIndex) => (
                <div key={`${entryIndex}-${meaningIndex}`} className="mb-4">
                  <p className="text-xl font-semibold text-purple-700 dark:text-purple-300 italic">
                    {meaning.partOfSpeech}
                  </p>

                  <ul className="list-disc ml-6 mt-2 space-y-2">
                    {meaning.definitions.map((def, defIndex) => (
                      <li key={defIndex} className="text-gray-800 dark:text-gray-300">
                        {def.definition}
                        {def.example && (
                          <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-1">
                            Example: {def.example}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordResult;

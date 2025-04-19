import { useEffect, useState } from 'react';
import axios from 'axios';

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

const WordResult: React.FC<WordResultProps> = ({ term }) => {
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Debounce the input term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
    }, 500);
    return () => clearTimeout(timer);
  }, [term]);

  // Fetch with Axios
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
    <div className="word-result-container mt-8">
      {error && <p className="text-red-500 text-center">{error}</p>}

      {entries.length > 0 && (
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow bg-amber-50 dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-200 mb-2 capitalize">
            {entries[0].word}
          </h2>

          {/* Phonetics by Region */}
          <div>
            {entries[0].phonetics?.map((phon, i) => (
              <div key={i} className="text-gray-600 dark:text-gray-300 text-lg mb-1 flex items-center space-x-2">
                {phon.text && (
                  <span className="flex items-center">
                    /{phon.text}/ <span className="ml-2 text-sm text-gray-500">({phon.region || "General"})</span>
                  </span>
                )}
                {phon.audio && (
                  <audio controls src={phon.audio} className="h-6">
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>

          {/* Meanings */}
          {entries.map((entry, entryIndex) => (
            <div key={entryIndex}>
              {entry.meanings.map((meaning, meaningIndex) => (
                <div key={`${entryIndex}-${meaningIndex}`} className="mt-4">
                  <p className="text-xl font-semibold text-purple-700 dark:text-purple-300 italic">
                    {meaning.partOfSpeech}
                  </p>

                  <ul className="list-disc ml-6 mt-1 space-y-2">
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

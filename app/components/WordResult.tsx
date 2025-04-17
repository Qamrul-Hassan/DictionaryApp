import { useState, useEffect } from 'react';

interface Definition {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
    }[];
  }[];
}

interface WordResultProps {
  term: string;
}

const WordResult: React.FC<WordResultProps> = ({ term }) => {
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(term);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [term]);

  // Fetch word definition
  useEffect(() => {
    if (debouncedTerm.trim().length < 3) return; // Don't fetch if term is too short

    const fetchWord = async () => {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${debouncedTerm}`);
        if (!response.ok) {
          throw new Error('Word not found');
        }
        const data = await response.json();
        setDefinition(data[0]); // Assuming API returns an array, use the first result
        setError(null); // Clear any previous errors
      } catch {
        setDefinition(null); // Clear previous definitions
        setError('Sorry, we couldn\'t find that word. Please try another.');
      }
    };

    fetchWord();
  }, [debouncedTerm]);

  return (
    <div className="word-result-container mt-8">
      {error && (
        <p className="text-red-500 mt-2 text-center">{error}</p>
      )}

      {definition && !error && (
        <div className="word-definition p-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-5xl bg-amber-50 dark:bg-gray-800">
          <h2 className="text-3xl font-extrabold text-blue-900 dark:text-blue-200 mb-4">{definition.word}</h2>
          
          <div className="definition mt-4">
            <h3 className="text-xl font-semibold">Meaning:</h3>
            {definition.meanings.map((meaning, index) => (
              <div key={index} className="mt-2">
                <p className="text-lg text-gray-700 dark:text-gray-300">{meaning.partOfSpeech}</p>
                <ul className="list-disc ml-6 mt-2">
                  {meaning.definitions.map((def, i) => (
                    <li key={i} className="text-lg text-gray-700 dark:text-gray-300">{def.definition}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordResult;

import { motion } from 'framer-motion';
import { FaVolumeUp } from 'react-icons/fa';
import { DictionaryResponse } from '../types/dictionary';

interface WordResultProps {
  entries: DictionaryResponse[];
}

const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.play().catch((err) => {
    console.error('Playback failed:', err);
  });
};

const WordResult = ({ entries }: WordResultProps) => {
  if (!entries.length) return null;

  const firstEntry = entries[0];
  const phoneticsWithAudio =
    firstEntry.phonetics?.filter((phonetic) => Boolean(phonetic.audio)) ?? [];

  return (
    <motion.section
      aria-label="Dictionary result"
      className="glass-panel accent-glow relative z-10 mt-6 w-full max-w-3xl rounded-2xl border border-white/55 bg-white/72 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <header className="mb-5 border-b border-slate-200/80 pb-4">
        <h2 className="text-3xl font-bold capitalize tracking-tight text-slate-900 sm:text-4xl">
          <span className="accent-title">{firstEntry.word}</span>
        </h2>
        {firstEntry.phonetic ? (
          <p className="mt-1 text-sm text-slate-600">{firstEntry.phonetic}</p>
        ) : null}
      </header>

      {phoneticsWithAudio.length > 0 ? (
        <section aria-label="Pronunciations" className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Pronunciation
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {phoneticsWithAudio.map((phonetic, index) => (
              <button
                key={`${phonetic.audio}-${index}`}
                type="button"
                onClick={() => phonetic.audio && playSound(phonetic.audio)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
                aria-label={`Play pronunciation ${phonetic.text ?? ''}`.trim()}
              >
                <FaVolumeUp aria-hidden="true" />
                <span>{phonetic.text || `Audio ${index + 1}`}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-label="Word meanings" className="space-y-5">
        {entries.map((entry, entryIndex) =>
          entry.meanings?.map((meaning, meaningIndex) => (
            <article
              key={`${entryIndex}-${meaning.partOfSpeech}-${meaningIndex}`}
              className="glass-panel accent-chip rounded-xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.1)] sm:p-5"
            >
              <h3 className="text-lg font-semibold italic text-slate-800">
                {meaning.partOfSpeech}
              </h3>
              <ol className="mt-3 list-decimal space-y-2 pl-6 marker:text-slate-500">
                {meaning.definitions.map((definition, definitionIndex) => (
                  <li key={`${meaning.partOfSpeech}-${definitionIndex}`} className="text-slate-700">
                    <p>{definition.definition}</p>
                    {definition.example ? (
                      <p className="mt-1 text-sm italic text-slate-500">
                        Example: {definition.example}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </article>
          ))
        )}
      </section>
    </motion.section>
  );
};

export default WordResult;

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaVolumeUp } from 'react-icons/fa';
import { DictionaryResponse, Meaning, Phonetic } from '../types/dictionary';

interface WordResultProps {
  entries: DictionaryResponse[];
}

type DialectFilter = 'all' | 'american' | 'british';

const NAV_ITEMS = [
  { id: 'definitions', label: 'Definitions' },
  { id: 'synonyms-antonyms', label: 'Synonyms & Antonyms' },
  { id: 'examples', label: 'Examples' },
  { id: 'related', label: 'Related Words' },
  { id: 'usage', label: 'Usage' },
  { id: 'more', label: 'More' },
] as const;

const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.play().catch((err) => {
    console.error('Playback failed:', err);
  });
};

const getUniqueTerms = (terms?: string[]) =>
  Array.from(new Set((terms ?? []).map((term) => term.trim()).filter(Boolean)));

const detectDialect = (phonetic: Phonetic): Exclude<DialectFilter, 'all'> | null => {
  const signal = `${phonetic.text ?? ''} ${phonetic.audio ?? ''} ${phonetic.sourceUrl ?? ''} ${phonetic.region ?? ''}`.toLowerCase();
  if (signal.includes('uk') || signal.includes('british') || signal.includes('en-gb')) {
    return 'british';
  }
  if (signal.includes('us') || signal.includes('american') || signal.includes('en-us')) {
    return 'american';
  }
  return null;
};

const collectExamples = (meanings: Meaning[]) =>
  meanings
    .flatMap((meaning) => meaning.definitions)
    .map((definition) => definition.example)
    .filter((example): example is string => Boolean(example));

const TermCloud = ({
  title,
  terms,
  tone,
}: {
  title: string;
  terms?: string[];
  tone: 'green' | 'violet' | 'amber';
}) => {
  const uniqueTerms = getUniqueTerms(terms);
  if (!uniqueTerms.length) return null;

  const toneClassMap: Record<typeof tone, string> = {
    green:
      'border-green-200 bg-green-50 text-green-800 dark:border-green-500/40 dark:bg-green-500/20 dark:text-green-100',
    violet:
      'border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-100',
    amber:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100',
  };

  return (
    <section
      aria-label={title}
      className="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-600 dark:bg-slate-800/80"
    >
      <h4 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h4>
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {uniqueTerms.map((term) => (
          <li
            key={`${title}-${term}`}
            className={`rounded-xl border px-3 py-1.5 text-sm font-semibold ${toneClassMap[tone]}`}
          >
            {term}
          </li>
        ))}
      </ul>
    </section>
  );
};

const WordResult = ({ entries }: WordResultProps) => {
  const [dialectFilter, setDialectFilter] = useState<DialectFilter>('all');
  const hasEntries = entries.length > 0;
  const firstEntry = entries[0];
  const allMeanings = entries.flatMap((entry) => entry.meanings ?? []);
  const allPhonetics = entries.flatMap((entry) => entry.phonetics ?? []);
  const sourceUrls = Array.from(new Set(entries.flatMap((entry) => entry.sourceUrls ?? [])));

  const allSynonyms = useMemo(
    () =>
      getUniqueTerms([
        ...allMeanings.flatMap((meaning) => meaning.synonyms ?? []),
        ...allMeanings.flatMap((meaning) =>
          meaning.definitions.flatMap((definition) => definition.synonyms ?? [])
        ),
      ]),
    [allMeanings]
  );

  const allAntonyms = useMemo(
    () =>
      getUniqueTerms([
        ...allMeanings.flatMap((meaning) => meaning.antonyms ?? []),
        ...allMeanings.flatMap((meaning) =>
          meaning.definitions.flatMap((definition) => definition.antonyms ?? [])
        ),
      ]),
    [allMeanings]
  );

  const relatedWords = useMemo(
    () => getUniqueTerms([...allSynonyms, ...allAntonyms]).slice(0, 40),
    [allSynonyms, allAntonyms]
  );

  const examples = useMemo(() => collectExamples(allMeanings), [allMeanings]);

  const filteredPhonetics = useMemo(() => {
    if (dialectFilter === 'all') return allPhonetics;

    const exactMatches = allPhonetics.filter((phonetic) => detectDialect(phonetic) === dialectFilter);
    return exactMatches.length ? exactMatches : allPhonetics;
  }, [allPhonetics, dialectFilter]);

  if (!hasEntries || !firstEntry) return null;

  return (
    <motion.article
      aria-label="Detailed dictionary result"
      className="glass-panel accent-glow relative z-10 mt-6 w-full max-w-5xl rounded-3xl border border-white/55 bg-white/72 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-6 dark:border-slate-600/60 dark:bg-slate-900/60"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <nav
        aria-label="Word details navigation"
        className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white/70 p-2 dark:border-slate-600/60 dark:bg-slate-800/70"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <header className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_8px_26px_rgba(15,23,42,0.08)] dark:border-slate-600/60 dark:bg-slate-800/80">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
          <span className="accent-title">{firstEntry.word}</span>
        </h2>
        {firstEntry.phonetic ? (
          <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base dark:text-slate-300">{firstEntry.phonetic}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDialectFilter('american')}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              dialectFilter === 'american'
                ? 'bg-sky-100 text-sky-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            American
          </button>
          <button
            type="button"
            onClick={() => setDialectFilter('british')}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              dialectFilter === 'british'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            British
          </button>
          <button
            type="button"
            onClick={() => setDialectFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              dialectFilter === 'all'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
        </div>

        {filteredPhonetics.length ? (
          <section aria-label="Pronunciation" className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {filteredPhonetics.map((phonetic, index) => (
              <article
                key={`${phonetic.audio ?? 'no-audio'}-${phonetic.text ?? 'no-text'}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-600 dark:bg-slate-800/70"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{phonetic.text || 'Phonetic form'}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {detectDialect(phonetic) ?? phonetic.region ?? 'General'}
                </p>

                {phonetic.audio ? (
                  <button
                    type="button"
                    onClick={() => playSound(phonetic.audio!)}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
                    aria-label={`Play pronunciation ${phonetic.text ?? ''}`.trim()}
                  >
                    <FaVolumeUp aria-hidden="true" />
                    <span>Play</span>
                  </button>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}
      </header>

      <section id="definitions" aria-label="Definitions" className="mt-6 space-y-4">
        {allMeanings.map((meaning, meaningIndex) => (
          <article
            key={`${meaning.partOfSpeech}-${meaningIndex}`}
            className="accent-chip rounded-2xl border border-slate-200/90 p-4 sm:p-5"
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-200">
              {meaning.partOfSpeech}
            </h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 marker:text-slate-500 dark:marker:text-slate-300">
              {meaning.definitions.map((definition, definitionIndex) => (
                <li
                  key={`${meaning.partOfSpeech}-${definitionIndex}`}
                  className="text-slate-800 dark:text-slate-100"
                >
                  <p>{definition.definition}</p>
                  {definition.example ? (
                    <p className="mt-1 text-sm italic text-slate-300">{definition.example}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>

      <section id="synonyms-antonyms" className="mt-6 grid gap-4 sm:grid-cols-2">
        <TermCloud title="Synonyms" terms={allSynonyms} tone="green" />
        <TermCloud title="Antonyms" terms={allAntonyms} tone="violet" />
      </section>

      <section
        id="examples"
        className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5 dark:border-slate-600 dark:bg-slate-800/80"
      >
        <h3 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Example Sentences
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Examples are provided from dictionary definitions and usage context.
        </p>

        {examples.length ? (
          <ul className="mt-4 space-y-3">
            {examples.map((example, index) => (
              <li
                key={`${example}-${index}`}
                className="border-l-4 border-slate-200 pl-3 text-slate-700 dark:border-slate-500 dark:text-slate-100"
              >
                {example}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            No example sentences available for this word.
          </p>
        )}
      </section>

      <section
        id="related"
        className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5 dark:border-slate-600 dark:bg-slate-800/80"
      >
        <h3 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Related Words
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Related words are derived from synonyms and antonyms in the current entry.
        </p>
        {relatedWords.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {relatedWords.map((word) => (
              <li
                key={word}
                className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800"
              >
                {word}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">No related words available.</p>
        )}
      </section>

      <section
        id="usage"
        className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5 dark:border-slate-600 dark:bg-slate-800/80"
      >
        <h3 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Usage</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-100">
          A person or thing described as <strong>{`"${firstEntry.word}"`}</strong> typically carries
          qualities highlighted in the definitions above. Review the part-of-speech blocks and examples to
          choose the right sense in context.
        </p>
      </section>

      <section
        id="more"
        className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5 dark:border-slate-600 dark:bg-slate-800/80"
      >
        <h3 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">More</h3>

        {sourceUrls.length ? (
          <section className="mt-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
              Source URLs
            </h4>
            <ul className="mt-2 space-y-1 text-sm">
              {sourceUrls.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 underline-offset-2 hover:underline dark:text-cyan-300"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {firstEntry.license ? (
          <p className="mt-4 text-sm text-slate-700 dark:text-slate-100">
            License:{' '}
            <a
              href={firstEntry.license.url}
              target="_blank"
              rel="noreferrer"
              className="text-sky-700 underline-offset-2 hover:underline dark:text-cyan-300"
            >
              {firstEntry.license.name}
            </a>
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            No additional metadata available for this word.
          </p>
        )}
      </section>
    </motion.article>
  );
};

export default WordResult;

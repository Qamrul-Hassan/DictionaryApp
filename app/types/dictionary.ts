export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: {
    name: string;
    url: string;
  };
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryResponse {
  word: string;
  phonetic?: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls?: string[];
}

export interface DictionaryErrorResponse {
  title: string;
  message: string;
  resolution?: string;
}
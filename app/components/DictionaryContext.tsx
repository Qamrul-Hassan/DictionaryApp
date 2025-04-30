import React, { createContext, useReducer, useContext, ReactNode } from 'react';

interface Phonetic {
  audio?: string;
  text?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}

type DictionaryResponse = DictionaryEntry[];

type State = {
  data: DictionaryResponse | null;
  loading: boolean;
  error: string | null;
  currentWord: string | null;
  pronunciation: string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: DictionaryResponse }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_CURRENT_WORD'; payload: string }
  | { type: 'SET_PRONUNCIATION'; payload: string };

const initialState: State = {
  data: null,
  loading: false,
  error: null,
  currentWord: null,
  pronunciation: null,
};

function dictionaryReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      const firstAudio = action.payload[0]?.phonetics?.find(p => p.audio)?.audio;
      return {
        ...state,
        loading: false,
        data: action.payload,
        pronunciation: firstAudio || null,
        currentWord: action.payload[0]?.word || state.currentWord,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_CURRENT_WORD':
      return { ...state, currentWord: action.payload };
    case 'SET_PRONUNCIATION':
      return { ...state, pronunciation: action.payload };
    default:
      return state;
  }
}

type DictionaryContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  playPronunciation: () => void;
};

const DictionaryContext = createContext<DictionaryContextType>({
  state: initialState,
  dispatch: () => {
    throw new Error('DictionaryContext dispatch function not implemented');
  },
  playPronunciation: () => {
    throw new Error('playPronunciation function not implemented');
  },
});

export const useDictionary = () => useContext(DictionaryContext);

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dictionaryReducer, initialState);

  const playPronunciation = () => {
    if (!state.currentWord) return;

    if (state.pronunciation) {
      const audio = new Audio(state.pronunciation);
      audio.play().catch(e => console.error('Audio playback failed:', e));
    } else {
      const utterance = new SpeechSynthesisUtterance(state.currentWord);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <DictionaryContext.Provider value={{ state, dispatch, playPronunciation }}>
      {children}
    </DictionaryContext.Provider>
  );
};
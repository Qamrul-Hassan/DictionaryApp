'use client';

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { DictionaryResponse } from '../types/dictionary';

type State = {
  data: DictionaryResponse | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: DictionaryResponse }
  | { type: 'FETCH_ERROR'; payload: string };

const initialState: State = {
  data: null,
  loading: false,
  error: null,
};

function dictionaryReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const DictionaryContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {
    throw new Error('Dispatch used outside of DictionaryProvider');
  },
});

export const useDictionary = () => useContext(DictionaryContext);

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dictionaryReducer, initialState);

  return (
    <DictionaryContext.Provider value={{ state, dispatch }}>
      {children}
    </DictionaryContext.Provider>
  );
};

import { useContext, createContext } from 'react';

export const AppContext = createContext(null);

export default function useAppContext() {
  return useContext(AppContext);
}

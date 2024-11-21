'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import TCharacter from '@/types/character';
import { initializeCharacter } from './slices/active-character-slice';

export default function StoreProvider({
  activeCharacter,
  children,
}: {
  activeCharacter: TCharacter;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(initializeCharacter(activeCharacter));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

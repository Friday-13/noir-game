import { configureStore } from '@reduxjs/toolkit';
import { activeCharacterSlice } from './slices/active-character-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      activeCharacter: activeCharacterSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

import TCharacter from '@/types/character';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IActiveCharacter {
  value: TCharacter;
}

const initialState: IActiveCharacter = {
  value: {
    id: 0,
    name: {
      ru: '???',
      eng: '???',
    },
    photo: {
      noir: './characters/noir/default.png',
      victorian: './characters/victorian/default.png',
    },
    description: {
      noir: '',
      victorian: '',
    },
  },
};

export const activeCharacterSlice = createSlice({
  name: 'activeCharacter',
  initialState,
  reducers: {
    initializeCharacter: (state, action: PayloadAction<TCharacter>) => {
      state.value = action.payload;
    },
    updateCharacter: (state, action: PayloadAction<TCharacter>) => {
      state.value = action.payload;
    },
  },
});

export const { initializeCharacter, updateCharacter } =
  activeCharacterSlice.actions;

export const selectActiveCharacter = (state: RootState) =>
  state.activeCharacter.value;

export default activeCharacterSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
}

const initialState: UiState = {
  isDarkMode: true,
  isMobileMenuOpen: false,
  isScrolled: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    setIsScrolled: (state, action: PayloadAction<boolean>) => {
      state.isScrolled = action.payload;
    },
  },
});

export const { toggleDarkMode, toggleMobileMenu, closeMobileMenu, setIsScrolled } = uiSlice.actions;

export default uiSlice.reducer;

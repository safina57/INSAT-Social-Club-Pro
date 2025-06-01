import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  role: string;
  email: string;
}

interface InitialStateTypes {
  user: User | null;
}

const initialState: InitialStateTypes = {
  user: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = globalSlice.actions;

export default globalSlice.reducer;

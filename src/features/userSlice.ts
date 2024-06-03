// src/features/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  points: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  points: 0,
  status: 'idle',
  error: null,
};

export const fetchUserPoints = createAsyncThunk('user/fetchUserPoints', async (userId: string) => {
  const response = await axios.get(`http://localhost:3000/users/${userId}`);
  return response.data.points;
});

export const updateUserPoints = createAsyncThunk('user/updateUserPoints', async ({ userId, points }: { userId: string; points: number }) => {
  const response = await axios.patch(`http://localhost:3000/users/updateUserPoints/${userId}`, { points });
  return response.data.points;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPoints.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPoints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.points = action.payload;
      })
      .addCase(fetchUserPoints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(updateUserPoints.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserPoints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.points = action.payload;
      })
      .addCase(updateUserPoints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export default userSlice.reducer;

// src/features/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { RootState } from '../app/store';

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
  const token = Cookies.get('token');
  const response = await axios.get(`https://geotagger.adaptable.app/users/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data.points;
});

export const updateUserPoints = createAsyncThunk('user/updateUserPoints', async ({ userId, points }: { userId: string; points: number }) => {
  const token = Cookies.get('token');
  const response = await axios.patch(`https://geotagger.adaptable.app/users/updateUserPoints/${userId}`, 
  { points }, 
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data.points;
});

export const addUserPoints = createAsyncThunk('user/addUserPoints', async ({ userId, points }: { userId: string; points: number }) => {
  const token = Cookies.get('token');
  const response = await axios.patch(`https://geotagger.adaptable.app/users/addUserPoints/${userId}`, 
  { points }, 
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
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
      })
      .addCase(addUserPoints.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUserPoints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.points += action.payload;
      })
      .addCase(addUserPoints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const selectUserPoints = (state: RootState) => state.user.points;
export const selectUserStatus = (state: RootState) => state.user.status;
export default userSlice.reducer;

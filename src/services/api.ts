import {  createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

export interface LocationInterface {
    id: number;
    userID: number;
    name: string;
    location: string;
    photo: string;
    date: Date;
  }

  export interface Guess {
    id: number;
    UserID: number;
    LocationID: number;
    guessedLocation: string;
    distance: number;
    date: Date;
  }
  
  export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
      baseUrl: 'http://localhost:3000/',
      prepareHeaders: (headers) => {
        const token = Cookies.get('token'); 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
        headers.set('Authorization', `Bearer ${token}`);
        return headers;
      },
    }),
    endpoints: (builder) => ({
      getLocationById: builder.query<LocationInterface, number>({
        query: (id) => `locations/${id}`,
      }),
      getGuessesByUserId: builder.query<Guess[], string>({
        query: (userId) => `guesses/user/${userId}`,
      }),
    }),
  });
  
  export const { useGetLocationByIdQuery, useGetGuessesByUserIdQuery } = api;
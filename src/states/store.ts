import { configureStore } from "@reduxjs/toolkit";
import satelliteReducer from "./satellite/satellite"

export const store = configureStore({
    reducer:{
        satellite: satelliteReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
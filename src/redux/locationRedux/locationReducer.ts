import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Location from 'expo-location';

interface LocationState {
	userLocation: Location.LocationObject | undefined;
}

const initialState: LocationState = {
	userLocation: undefined,
};

export const locationSlice = createSlice({
	name: 'gig',
	initialState,
	reducers: {
		setUserLocation: (state, action: PayloadAction<Location.LocationObject | undefined>) => {
			state.userLocation = action.payload;
		},
	},
});

export const { setUserLocation } = locationSlice.actions;

export default locationSlice.reducer;

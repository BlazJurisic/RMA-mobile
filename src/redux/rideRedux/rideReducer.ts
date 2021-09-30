import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GigResponse } from '../../service/responses';

export enum RideStateEnum {
	NoRide,
	Accepted,
	Driving,
	Payment,
}

interface RideState {
	rideState: RideStateEnum;
	currentGig: GigResponse | undefined;
	time: number;
}

const initialState: RideState = {
	rideState: RideStateEnum.NoRide,
	currentGig: undefined,
	time: 0,
};

export const rideSlice = createSlice({
	name: 'ride',
	initialState,
	reducers: {
		startRide: (state) => {
			state.rideState = RideStateEnum.Driving;
			state.time = 0;
		},
		acceptRide: (state, action: PayloadAction<GigResponse>) => {
			state.rideState = RideStateEnum.Accepted;
			state.currentGig = { ...action.payload, is_taken: true };
		},
		chargeRide: (state) => {
			state.rideState = RideStateEnum.Payment;
		},
		endRide: (state) => {
			state.rideState = RideStateEnum.NoRide;
			state.currentGig = undefined;
		},
		updateTimer: (state) => {
			state.time += 1;
		},
	},
});

export const { startRide, acceptRide, chargeRide, updateTimer, endRide } = rideSlice.actions;

export default rideSlice.reducer;

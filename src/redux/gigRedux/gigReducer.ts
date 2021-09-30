import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GigResponse } from '../../service/responses';

interface GigState {
	gigs: GigResponse[];
}

const initialState: GigState = {
	gigs: [],
};

export const gigSlice = createSlice({
	name: 'gig',
	initialState,
	reducers: {
		setGigs: (state, action: PayloadAction<GigResponse[]>) => {
			state.gigs = action.payload;
		},
	},
});

export const { setGigs } = gigSlice.actions;

export default gigSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import gigReducer from './gigRedux/gigReducer';
import locationReducer from './locationRedux/locationReducer';
import rideReducer from './rideRedux/rideReducer';

const store = configureStore({
	reducer: {
		gig: gigReducer,
		location: locationReducer,
		ride: rideReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

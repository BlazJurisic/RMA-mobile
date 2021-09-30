import React from 'react';

import { COLORS } from '../styles/colors';
import { createStackNavigator } from '@react-navigation/stack';
import MapContainer from '../containers/MapContainer';
import RideContainer from '../containers/RideContainer';
import PaymentContainer from '../containers/PaymentCotainer';

const Stack = createStackNavigator();

function StackRouter() {
	return (
		<Stack.Navigator initialRouteName="Map" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Map" component={MapContainer} />
			<Stack.Screen name="Ride" component={RideContainer} />
			<Stack.Screen name="Payment" component={PaymentContainer} />
		</Stack.Navigator>
	);
}

export default StackRouter;

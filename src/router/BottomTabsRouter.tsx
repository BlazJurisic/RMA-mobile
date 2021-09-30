import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapContainer from '../containers/MapContainer';
import ListContainer from '../containers/ListContainer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';
import StackRouter from './StackRouter';
import { useAppSelector } from '../redux/useAppSelector';
import { RideStateEnum, updateTimer } from '../redux/rideRedux/rideReducer';
import store from '../redux/store';

const Tab = createBottomTabNavigator();

let interval: any;

function BottomTabsRouter() {
	const rideState = useAppSelector((state) => state.ride.rideState);

	React.useEffect(() => {
		if (rideState === RideStateEnum.Driving) {
			interval = setInterval(() => {
				store.dispatch(updateTimer());
			}, 1000);
		} else {
			clearInterval(interval);
		}
	}, [rideState]);

	return (
		<Tab.Navigator initialRouteName="StackRouter" screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
			<Tab.Screen
				options={{
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? 'md-location' : 'md-location-outline'}
							size={32}
							color={COLORS.primary}
						/>
					),
				}}
				name="StackRouter"
				component={StackRouter}
			/>
			<Tab.Screen
				options={{
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? 'md-navigate' : 'md-navigate-outline'}
							size={32}
							color={COLORS.primary}
						/>
					),
				}}
				name="List"
				component={ListContainer}
			/>
		</Tab.Navigator>
	);
}

export default BottomTabsRouter;

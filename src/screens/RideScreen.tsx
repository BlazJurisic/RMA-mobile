import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { chargeRide, RideStateEnum, startRide } from '../redux/rideRedux/rideReducer';
import store from '../redux/store';
import { useAppSelector } from '../redux/useAppSelector';
import { CommonActions, StackActions } from '@react-navigation/routers';
import MapView, { Callout, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { COLORS } from '../styles/colors';

export const GOOGLE_MAPS_APIKEY = 'AIzaSyD11Em87vTXECFgTIsUMSMcm9HtR7zWlAw';

function RideScreen() {
	const ride = useAppSelector((state) => state.ride);
	const location = useAppSelector((state) => state.location.userLocation);
	const mapRef = React.useRef<MapView>(null);

	const navigation = useNavigation();

	React.useEffect(() => {
		if (location)
			mapRef.current?.animateToRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			});
	}, [location]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View>
				<Text style={styles.title}>
					{ride.rideState === RideStateEnum.Driving ? 'Putnici preuzeti' : 'Vožnja započeta'}
				</Text>
				<Text style={styles.timer}>
					{ride.rideState === RideStateEnum.Driving ? timeFromUnixToStringFormat(ride.time) : ' '}
				</Text>
			</View>
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={{
					latitude: location!.coords.latitude,
					longitude: location!.coords.longitude,
					latitudeDelta: 0.005,
					longitudeDelta: 0.005,
				}}
				showsPointsOfInterest={false}
				toolbarEnabled={false}
				showsUserLocation>
				<Marker
					coordinate={
						ride.rideState === RideStateEnum.Accepted
							? {
									latitude: ride.currentGig!.location_pickup.lat,
									longitude: ride.currentGig!.location_pickup.lng,
							  }
							: {
									latitude: ride.currentGig!.location_destination.lat,
									longitude: ride.currentGig!.location_destination.lng,
							  }
					}>
					<Callout>
						<View>
							<Text style={styles.marker}>
								{ride.rideState === RideStateEnum.Accepted
									? ride.currentGig?.location_pickup.formatted_address
									: ride.currentGig?.location_destination.formatted_address}
							</Text>
						</View>
					</Callout>
				</Marker>
				{location && ride.currentGig ? (
					<MapViewDirections
						origin={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
						destination={
							ride.rideState === RideStateEnum.Accepted
								? {
										latitude: ride.currentGig.location_pickup.lat,
										longitude: ride.currentGig.location_pickup.lng,
								  }
								: {
										latitude: ride.currentGig.location_destination.lat,
										longitude: ride.currentGig.location_destination.lng,
								  }
						}
						apikey={GOOGLE_MAPS_APIKEY}
						lineDashPattern={[0]}
						strokeWidth={4}
					/>
				) : null}
			</MapView>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Button
					wrapperStyle={styles.buttonWrapper}
					textStyle={styles.buttonText}
					action={
						ride.rideState === RideStateEnum.Driving
							? () => {
									store.dispatch(chargeRide());
									navigation.dispatch(StackActions.pop(1));
									navigation.navigate('Payment');
							  }
							: () => store.dispatch(startRide())
					}
					text={ride.rideState === RideStateEnum.Driving ? 'Naplati vožnju' : 'Pokupio putnike'}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	map: {
		width: Dimensions.get('window').width,
		height: 450,
		alignSelf: 'center',
		marginTop: 30,
	},
	buttonWrapper: {
		borderRadius: 150 / 2,
		width: 150,
		height: 150,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	buttonText: {
		color: 'white',
	},
	title: {
		fontSize: 24,
		textAlign: 'center',
	},
	timer: {
		fontSize: 20,
		textAlign: 'center',
		marginTop: 8,
	},
	marker: {
		fontWeight: 'bold',
	},
});

export function timeFromUnixToStringFormat(timer: number) {
	const minutes = Math.floor((timer / 60) % 60);
	const seconds = Math.floor((timer % 60) % 60);
	return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
}

export default RideScreen;

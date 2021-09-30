import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useLoadingContext } from '../context/loading/LoadingContext';
import { setGigs } from '../redux/gigRedux/gigReducer';
import store from '../redux/store';
import { useAppSelector } from '../redux/useAppSelector';
import { service } from '../service';
import AcceptGig, { GigModal } from './AcceptGig';
import * as Location from 'expo-location';
import { setUserLocation } from '../redux/locationRedux/locationReducer';
import { GigResponse } from '../service/responses';

const INITIAL_REGION = { latitude: 45.55111, longitude: 18.69389, latitudeDelta: 0.1, longitudeDelta: 0.1 };

function MapScreen() {
	const gigs = useAppSelector((state) => state.gig.gigs);
	const setLoading = useLoadingContext()[1];
	const gigModalRef = React.useRef<GigModal>(null);
	const mapRef = React.useRef<MapView>(null);

	React.useEffect(() => {
		setLoading(true);
		setInterval(() => {
			service
				.gig()
				.then((res) => {
					setLoading(false);
					store.dispatch(setGigs(res));
				})
				.catch(() => {
					setLoading(false);
				});
		}, 2500);
	}, []);
	React.useEffect(() => {
		(async () => {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					return;
				}

				Location.watchPositionAsync({ accuracy: 1, timeInterval: 1000, distanceInterval: 20 }, (location) => {
					store.dispatch(setUserLocation(location));
				});
			} catch (err) {}
		})();
	}, []);

	const onMarkerPress = React.useCallback((gig: GigResponse) => {
		mapRef.current?.animateToRegion(
			{
				latitude: gig.location_pickup.lat - 0.023,
				longitude: gig.location_pickup.lng,
				latitudeDelta: 0.07,
				longitudeDelta: 0.07,
			},
			290
		);
		setTimeout(() => gigModalRef.current?.open(gig), 300);
	}, []);
	return (
		<View style={styles.container}>
			<AcceptGig ref={gigModalRef} />
			<MapView
				ref={mapRef}
				style={styles.container}
				initialRegion={INITIAL_REGION}
				showsUserLocation
				toolbarEnabled={false}>
				{gigs.map((gig) =>
					!gig.is_taken ? (
						<Marker
							key={`Marker:${gig._id}`}
							coordinate={{
								latitude: gig.location_pickup.lat,
								longitude: gig.location_pickup.lng,
							}}>
							<Callout onPress={() => onMarkerPress(gig)}>
								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									<Text style={styles.title}>{`${gig?.type}`}</Text>
									<View style={{ maxWidth: Dimensions.get('screen').width * 0.5 }}>
										<Text>
											<Text style={styles.title}>{`Polazište: `}</Text>
											<Text>{`${gig?.location_pickup.formatted_address}`}</Text>
										</Text>
										<Text>
											<Text style={styles.title}>{`Odredište: `}</Text>
											<Text>{`${gig?.location_destination.formatted_address}`}</Text>
										</Text>
										<Text>
											<Text style={styles.title}>{`Broj putnika: `}</Text>
											<Text>{`${gig?.num_persons}`}</Text>
										</Text>
									</View>
								</View>
							</Callout>
						</Marker>
					) : null
				)}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	title: {
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default MapScreen;

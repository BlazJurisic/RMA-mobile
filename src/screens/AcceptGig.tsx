import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/core';
import store from '../redux/store';
import { acceptRide } from '../redux/rideRedux/rideReducer';
import { GigResponse } from '../service/responses';
import { service } from '../service';

export interface GigModal {
	open: (gig: GigResponse) => void;
}

const TIME_LIMIT = [5, 10, 15, 20];

function AcceptGig(props: any, ref: React.ForwardedRef<GigModal | null>) {
	const [modal, setModal] = React.useState(false);
	const [active, setActive] = React.useState(TIME_LIMIT[0]);
	const [gig, setGig] = React.useState<GigResponse>();
	const navigation = useNavigation();

	React.useImperativeHandle(ref, () => ({
		open: (gig: GigResponse) => {
			setGig(gig);
			setModal(true);
		},
	}));
	return (
		<Modal animationType="slide" visible={modal} transparent>
			<SafeAreaView
				style={{
					flex: 1,
					paddingTop: Dimensions.get('window').height * 0.3,
					backgroundColor: 'rgba(0,0,0,0.3)',
				}}>
				<View style={styles.container}>
					<View>
						<TouchableOpacity onPress={() => setModal(false)}>
							<Ionicons
								name={'md-close'}
								size={32}
								color={COLORS.primary}
								style={{ alignSelf: 'flex-end' }}
							/>
						</TouchableOpacity>
						<View style={styles.description}>
							<Text>
								<Text style={styles.title}>{`Tip vožnje: `}</Text>
								<Text style={styles.descriptionText}>{`${gig?.type}`}</Text>
							</Text>
							<Text>
								<Text style={styles.title}>{`Polazište: `}</Text>
								<Text
									style={styles.descriptionText}>{`${gig?.location_pickup.formatted_address}`}</Text>
							</Text>
							<Text>
								<Text style={styles.title}>{`Odredište: `}</Text>
								<Text
									style={
										styles.descriptionText
									}>{`${gig?.location_destination.formatted_address}`}</Text>
							</Text>
							<Text>
								<Text style={styles.title}>{`Broj putnika: `}</Text>
								<Text style={styles.descriptionText}>{`${gig?.num_persons}`}</Text>
							</Text>
						</View>
						<View style={styles.buttonRow}>
							{TIME_LIMIT.map((item) => (
								<Button
									key={`Button:${item}`}
									text={`${item} min`}
									action={() => setActive(item)}
									textStyle={styles.buttonText}
									wrapperStyle={[
										styles.buttonWrapper,
										{ backgroundColor: active === item ? 'teal' : 'cornflowerblue' },
									]}
								/>
							))}
						</View>
					</View>
					<View style={styles.bottomButtonRow}>
						<Button
							text={`Prihvati`}
							action={() => {
								if (gig) {
									store.dispatch(acceptRide(gig));
									service.updateGig({ ...gig, is_taken: true });
								}
								navigation.navigate('StackRouter', { screen: 'Ride' });
								setModal(false);
							}}
							textStyle={styles.buttonText}
							wrapperStyle={styles.acceptButton}
						/>
						<Button
							text={`Odustani`}
							action={() => setModal(false)}
							textStyle={styles.buttonText}
							wrapperStyle={styles.declinedButton}
						/>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	description: {
		paddingTop: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 30,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 16,
	},
	descriptionText: {
		fontSize: 14,
	},
	container: {
		flex: 1,
		padding: 16,
		justifyContent: 'space-between',
		backgroundColor: 'white',
	},
	buttonRow: {
		justifyContent: 'center',
		marginHorizontal: 40,
		paddingTop: 20,
	},
	buttonWrapper: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		marginVertical: 4,
		borderRadius: 30,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
	},
	buttonText: {
		color: 'white',
		textAlign: 'center',
	},
	acceptButton: {
		backgroundColor: 'green',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderRadius: 30,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	declinedButton: {
		backgroundColor: 'firebrick',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderRadius: 30,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	bottomButtonRow: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginHorizontal: 40,
		paddingBottom: 30,
	},
});

export default React.forwardRef(AcceptGig);

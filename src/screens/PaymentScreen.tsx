import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useAuth } from '../context/auth/AuthContext';
import { endRide } from '../redux/rideRedux/rideReducer';
import store from '../redux/store';
import { useAppSelector } from '../redux/useAppSelector';
import { service } from '../service';

function PaymentScreen() {
	const { control, watch } = useForm();
	const navigation = useNavigation();
	const ride = useAppSelector((state) => state.ride);
	const ratingRef = React.useRef(0);
	const priceRef = React.useRef(0);
	const auth = useAuth();
	const rating = watch('rating');
	const price = watch('price');

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
			<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
				<View style={{ justifyContent: 'center', alignItems: 'center' }}>
					<Text style={styles.title}>CIJENA</Text>
				</View>
				<View>
					<Controller
						render={({ field }) => (
							<TextInput
								autoCapitalize="none"
								keyboardType="numeric"
								style={{ fontSize: 20, textAlign: 'center' }}
								onChangeText={(e) => {
									field.onChange(e);
								}}
							/>
						)}
						defaultValue={0}
						control={control}
						name={'price'}
					/>
				</View>
				<Controller
					render={({ field }) => (
						<Rating
							type="custom"
							ratingCount={5}
							imageSize={60}
							ratingBackgroundColor="transparent"
							startingValue={0}
							onFinishRating={(e) => {
								field.onChange(e);
							}}
							style={{ marginTop: 70 }}
						/>
					)}
					defaultValue={0}
					control={control}
					name={'rating'}
				/>
				<View style={{ flex: 1, justifyContent: 'flex-end' }}>
					<Button
						wrapperStyle={styles.buttonWrapper}
						textStyle={styles.buttonText}
						disabled={!price || !rating}
						action={() => {
							if (ride.currentGig) {
								service.updateGig({
									...ride.currentGig,
									time_passed: ride.time.toString(),
									rating: ratingRef.current.toString(),
									price_calculated: priceRef.current.toString(),
									driver_id: auth.state.details!.id,
								});
							}
							store.dispatch(endRide());
							navigation.navigate('Map');
						}}
						text={'Zaključi'}
					/>
				</View>
			</SafeAreaView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 28,
	},
	buttonWrapper: {
		backgroundColor: 'firebrick',
		paddingHorizontal: 48,
		paddingVertical: 16,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginBottom: 50,
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
		fontSize: 20,
	},
	price: {
		fontSize: 32,
		marginTop: 30,
	},
});

export default PaymentScreen;

import React from 'react';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useLoadingContext } from '../context/loading/LoadingContext';
import { setGigs } from '../redux/gigRedux/gigReducer';
import store from '../redux/store';
import { useAppSelector } from '../redux/useAppSelector';
import { service } from '../service';
import { GigResponse } from '../service/responses';
import { COLORS } from '../styles/colors';
import AcceptGig, { GigModal } from './AcceptGig';

function ListScreen() {
	const gigs = useAppSelector((state) => state.gig.gigs.filter((gig) => !gig.is_taken));
	const gigModalRef = React.useRef<GigModal>(null);
	return (
		<View style={styles.container}>
			<AcceptGig ref={gigModalRef} />
			<FlatList
				data={gigs}
				keyExtractor={(item) => item._id}
				renderItem={(item: { item: GigResponse }) => (
					<TouchableOpacity onPress={() => gigModalRef.current?.open(item.item)}>
						<View style={styles.cellStyle}>
							<Text style={styles.numOfPersones}>{item.item.num_persons}</Text>
							<View style={{ flexShrink: 1 }}>
								<Text style={styles.textMargin}>{item.item.type}</Text>
								<Text style={styles.textMargin}>
									Polazište: {item.item.location_pickup.formatted_address}
								</Text>
								<Text>Odredište: {item.item.location_destination.formatted_address}</Text>
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
	},
	textMargin: {
		marginBottom: 8,
	},
	cellStyle: {
		alignItems: 'center',
		marginHorizontal: 16,
		marginBottom: 32,
		backgroundColor: COLORS.primary,
		opacity: 0.7,
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		flexDirection: 'row',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	numOfPersones: {
		fontSize: 40,
		marginRight: 40,
	},
});

export default ListScreen;

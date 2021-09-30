import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Modal } from 'react-native';
import { useLoadingContext } from '../context/loading/LoadingContext';
import { COLORS } from '../styles/colors';

function loadingScreen(loading: boolean) {
	return (
		<Modal visible={loading} transparent={true}>
			<View style={style.modalContainer}>
				<ActivityIndicator size='large' color={COLORS.primary} />
			</View>
		</Modal>
	);
}

export function Loading({ children }: { children: JSX.Element }) {
	const [isLoading] = useLoadingContext();
	return (
		<View style={{ flex: 1 }}>
			{loadingScreen(isLoading)}
			{children}
		</View>
	);
}

const style = StyleSheet.create({
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(240,240,240, 0.6)',
		opacity: 0.54,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

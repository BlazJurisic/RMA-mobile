import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { Image, Keyboard, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button, TextInput } from 'react-native-paper';
import { COLORS } from '../styles/colors';

interface Props {
	control: Control<FieldValues, object>;
	onSubmit: (e?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
}

export enum Fields {
	email = 'email',
	password = 'password',
}

function LoginScreen(props: Props) {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<Image
					style={styles.image}
					resizeMode="contain"
					resizeMethod="scale"
					source={require('../../assets/primary.png')}
				/>
				<Controller
					render={({ field }) => (
						<TextInput
							autoCapitalize="none"
							style={styles.marginBottom}
							label="Email"
							onChangeText={field.onChange}
						/>
					)}
					control={props.control}
					name={Fields.email}
				/>
				<Controller
					render={({ field }) => (
						<TextInput
							onChangeText={field.onChange}
							autoCapitalize="none"
							style={styles.marginBottom}
							label="Password"
							secureTextEntry
						/>
					)}
					control={props.control}
					name={Fields.password}
				/>
				<Button style={{ zIndex: 1000 }} color={COLORS.primary} mode="contained" onPress={props.onSubmit}>
					Login
				</Button>
			</View>
		</SafeAreaView>
	);
}

const DismissKeyboard = ({ children }: { children: JSX.Element }) => (
	<TouchableWithoutFeedback style={{ flex: 1 }} containerStyle={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 48,
		paddingHorizontal: 16,
	},
	image: {
		height: 100,
		width: 200,
		alignSelf: 'center',
		marginBottom: 24,
	},
	marginBottom: {
		marginBottom: 16,
	},
});

export default LoginScreen;

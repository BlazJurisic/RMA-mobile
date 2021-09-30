import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Platform } from 'react-native';
import { service } from '../../service';
import { LoginResponse } from '../../service/responses';
import { useLoadingContext } from '../loading/LoadingContext';
import { AuthReducer, INITIAL_STATE, SIGN_IN, SIGN_OUT } from './reducer';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
interface Props {
	children: JSX.Element;
}

export const ASYNC_STORAGE_CREDENTIALS_KEY = 'credentials';

export function Auth(props: Props) {
	const [state, dispatch] = React.useReducer(AuthReducer, INITIAL_STATE);
	const authContext = React.useMemo(
		() => ({
			signIn: async (res: LoginResponse) => {
				dispatch({ type: SIGN_IN, ...res });
			},
			signOut: () => dispatch({ type: SIGN_OUT }),
			state,
		}),
		[state]
	);
	const setLoading = useLoadingContext()[1];
	React.useEffect(() => {
		AsyncStorage.getItem(ASYNC_STORAGE_CREDENTIALS_KEY)
			.then((res) => {
				if (res) {
					setLoading(true);
					try {
						const credentials = JSON.parse(res);
						service.login(credentials.email, credentials.password).then((res) => {
							if (res) {
								setLoading(false);
								registerForPushNotificationsAsync().then((token) => {
									service.registerPushToken(token, res._id);
								});
								dispatch({ type: SIGN_IN, ...res });
							} else {
								setLoading(false);
								dispatch({ type: SIGN_OUT });
							}
						});
					} catch (e) {}
				} else {
					dispatch({ type: SIGN_OUT });
				}
			})
			.catch(() => dispatch({ type: SIGN_OUT }));
	}, []);

	return <AuthContext.Provider value={authContext}>{props.children}</AuthContext.Provider>;
}

const AuthContext = React.createContext({
	state: INITIAL_STATE,
	signIn: (data: LoginResponse) => {},
	signOut: () => {},
});

interface Credentials {
	username: string;
	password: string;
}

export function useAuth() {
	return React.useContext(AuthContext);
}

export async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		alert('Must use physical device for Push Notifications');
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('taxy-notifications', {
			name: 'taxy-notifications',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	return token;
}

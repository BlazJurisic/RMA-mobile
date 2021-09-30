import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Auth } from './src/context/auth/AuthContext';
import { LoadingWrapper } from './src/context/loading/LoadingContext';
import Router from './src/router';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { service } from './src/service';
import * as TaskManager from 'expo-task-manager';
import dayjs from 'dayjs';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
	console.log(data);

	Notifications.scheduleNotificationAsync({
		content: {
			title: data.content.title!,
			body: data.content.body!,
			subtitle: data.content.subtitle!,
		},
		trigger: { date: dayjs().add(2, 's').toDate() },
	});
	// Do something with the notification data
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

export default function App() {
	const notificationListener = React.useRef();
	const responseListener = React.useRef();

	React.useEffect(() => {
		// This listener is fired whenever a notification is received while the app is foregrounded
		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			Notifications.scheduleNotificationAsync({
				content: {
					title: notification.request.content.title!,
					body: notification.request.content.body!,
					subtitle: notification.request.content.subtitle!,
				},
				trigger: { date: dayjs().add(2, 's').toDate() },
			});
		});

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log(response);
		});

		return () => {
			Notifications.removeNotificationSubscription(notificationListener.current);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);
	return (
		<View style={styles.container}>
			<Provider store={store}>
				<LoadingWrapper>
					<Auth>
						<Router />
					</Auth>
				</LoadingWrapper>
			</Provider>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

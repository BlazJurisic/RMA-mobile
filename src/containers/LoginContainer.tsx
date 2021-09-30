import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationOptions } from '@react-navigation/stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ASYNC_STORAGE_CREDENTIALS_KEY, useAuth } from '../context/auth/AuthContext';
import { useLoadingContext } from '../context/loading/LoadingContext';
import LoginScreen, { Fields } from '../screens/LoginScreen';
import { service } from '../service';

function LoginContainer() {
	const { control, handleSubmit } = useForm();
	const setLoading = useLoadingContext()[1];
	const auth = useAuth();
	const onSubmit = handleSubmit((values) => {
		setLoading(true);
		service.login(values[Fields.email], values[Fields.password]).then((res) => {
			setLoading(false);
			if (res) {
				auth.signIn(res);
				AsyncStorage.setItem(
					ASYNC_STORAGE_CREDENTIALS_KEY,
					JSON.stringify({
						email: values[Fields.email],
						password: values[Fields.password],
					})
				);
			}
		});
	});
	return <LoginScreen onSubmit={onSubmit} control={control} />;
}

export const RouteOptions: StackNavigationOptions = {
	headerShown: false,
};

export default LoginContainer;

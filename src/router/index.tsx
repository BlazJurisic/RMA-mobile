import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/auth/AuthContext';
import { RoutesEnum } from './routes';
import { LoadingScreen } from '../screens/LoadingScreen';
import LoginContainer, { RouteOptions } from '../containers/LoginContainer';
import { Loading } from '../components/Loading';
import BottomTabsRouter from './BottomTabsRouter';

const Stack = createStackNavigator();

function Router() {
	const authContext = useAuth();
	return (
		<Loading>
			<NavigationContainer>
				<Stack.Navigator>
					{authContext.state.isLoading ? (
						<Stack.Screen options={{ headerShown: false }} name="loading" component={LoadingScreen} />
					) : authContext.state.userToken ? (
						<Stack.Screen options={{ title: 'Taxy' }} name={RoutesEnum.Home} component={BottomTabsRouter} />
					) : (
						<Stack.Screen options={RouteOptions} name={RoutesEnum.Login} component={LoginContainer} />
					)}
				</Stack.Navigator>
			</NavigationContainer>
		</Loading>
	);
}

export default Router;

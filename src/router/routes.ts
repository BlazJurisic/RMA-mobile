import LoginContainer from '../containers/LoginContainer';

export enum RoutesEnum {
	Login = 'Login',
	Home = 'Home',
	Loading = 'Loading',
}

export const ROUTES = [
	{
		path: RoutesEnum.Login,
		component: LoginContainer,
	},
];

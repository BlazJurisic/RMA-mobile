export const AuthReducer = (prevState: AuthState, action: { type: Actions; [key: string]: any }): AuthState => {
	switch (action.type) {
		case SIGN_IN:
			return {
				...prevState,
				isSignout: false,
				userToken: action.token,
				isLoading: false,
				details: {
					email: action.email,
					first_name: action.first_name,
					last_name: action.last_name,
					id: action._id,
				},
			};
		case SIGN_OUT:
			return {
				isLoading: false,
				isSignout: true,
				userToken: null,
				details: undefined,
			};
	}
};

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

type Actions = typeof SIGN_IN | typeof SIGN_OUT;

export const INITIAL_STATE: AuthState = {
	isLoading: true,
	isSignout: false,
	userToken: null,
};

export interface AuthState {
	isLoading: boolean;
	isSignout: boolean;
	userToken: string | null;
	details?: UserDetails;
}

export interface UserDetails {
	first_name: string;
	last_name: string;
	email: string;
	id: string;
}

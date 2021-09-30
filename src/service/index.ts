import Client from './client';
import { GigResponse, LoginResponse } from './responses';

export interface Service {
	login(email: string, password: string): Promise<LoginResponse | null>;
	gig(): Promise<any>;
	updateGig(gig: GigResponse): Promise<void>;
	registerPushToken(token: string, id: string): Promise<void>;
}

const URL = `https://taxy-backend.herokuapp.com/api/v1`;

export const service = new Client(URL);

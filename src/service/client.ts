import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Service } from '.';
import { GigResponse, LoginResponse } from './responses';

class Client implements Service {
	private axiosClient: AxiosInstance;
	private token: string;

	constructor(url: string) {
		this.axiosClient = axios.create({ baseURL: url });
		this.token = '';
	}

	public async login(email: string, password: string): Promise<LoginResponse | null> {
		try {
			const res: AxiosResponse<LoginResponse> = await this.axiosClient.request({
				method: Methods.POST,
				data: { email, password },
				url: '/login',
			});
			this.token = res.data.token;
			return res.data;
		} catch (e) {
			return null;
		}
	}

	public async gig(): Promise<GigResponse[]> {
		try {
			const res: AxiosResponse<GigResponse[]> = await this.axiosClient.request({
				method: Methods.GET,
				headers: {
					'x-access-token': this.token,
				},
				url: '/gig',
			});
			return res.data;
		} catch (e) {
			return [];
		}
	}
	public async updateGig(gig: GigResponse): Promise<void> {
		try {
			const res: AxiosResponse<void> = await this.axiosClient.request({
				method: Methods.POST,
				headers: {
					'x-access-token': this.token,
				},
				url: '/gig',
				data: { ...gig },
			});
			return res.data;
		} catch (e) {}
	}
	public async registerPushToken(token: string, id: string): Promise<void> {
		try {
			const res: AxiosResponse<void> = await this.axiosClient.request({
				method: Methods.POST,
				headers: {
					'x-access-token': this.token,
				},
				url: '/register_push_token',
				data: { push_notif_token: token, _id: id },
			});
			return res.data;
		} catch (e) {}
	}
}

enum Methods {
	GET = 'GET',
	POST = 'POST',
}

export default Client;

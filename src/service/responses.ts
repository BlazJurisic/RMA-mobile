export interface LoginResponse {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	token: string;
}

export interface GigResponse {
	is_taken: boolean;
	driver_id: string;
	time_passed: string;
	rating: string;
	time_to_pickup: string;
	finished: boolean;
	_id: string;
	type: string;
	price_calculated: string;
	num_persons: string;
	location_pickup: {
		lat: number;
		lng: number;
		formatted_address: string;
	};
	location_destination: {
		formatted_address: string;
		lat: number;
		lng: number;
	};
}

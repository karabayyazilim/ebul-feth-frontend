import Axios from 'axios';

const axios = Axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
	},
});

axios.interceptors.request.use((config) => {
	let token = "";

	if (typeof window !== 'undefined') {
		token = localStorage.getItem("token") || "";
	}

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	} else {
		window.location.href = "/auth";
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});


export default axios;

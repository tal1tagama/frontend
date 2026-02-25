import api from "./api";

const authService = {
	async login(email, password) {
		const response = await api.post("/auth/login", {
			email,
			senha: password,
		});

		return response.data;
	},
};

export default authService;
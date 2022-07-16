import axios from "axios";
import { API } from "../const";
const login = (email, password) => {
	return axios
		.post(API + "admin/auth/login", {
			email,
			password,
		})
		.then((response) => {
			if (response.data.accessToken) {
				localStorage.setItem("user", JSON.stringify(response.data));
			}
			return response.data;
		});
};

export default {
	login,
};

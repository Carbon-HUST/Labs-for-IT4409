import axios from "axios";
import { API } from "../const";

const login = (email, password) => {
	return axios
		.post(API + "auth/login", {
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

const register = (
	username,
	email,
	phone,
	password,
	confirmPassword,
	dob,
	gender
) => {
	return axios.post(API + "auth/register", {
		username,
		email,
		password,
		confirmPassword,
		phone,
		dob,
		gender,
	});
};

export default {
	login,
	register,
};

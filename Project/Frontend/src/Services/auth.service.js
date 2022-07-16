import axios from "axios";
import { API } from "../const";
import authHeader from "./auth-header";

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
const getProfile = () => {
	return axios
		.get(API + "profile", {
			headers: authHeader(),
		})
		.then((response) => {
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

const logout = () => {
	localStorage.removeItem("user");
};
export default {
	login,
	register,
	getProfile,
	logout,
};

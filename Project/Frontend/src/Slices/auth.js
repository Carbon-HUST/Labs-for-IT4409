import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import AuthService from "../Services/auth.service";
import { errorMessage } from "./message";
const user = JSON.parse(localStorage.getItem("user"));

export const login = createAsyncThunk(
	"user/login",
	async ({ email, password }, thunkAPI) => {
		try {
			const data = await AuthService.login(email, password);
			console.log(data);
			return { user: data };
		} catch (error) {
			const message =
				(error.response && error.response.data && error.response.data.msg) ||
				error.message ||
				error.toString();
			thunkAPI.dispatch(errorMessage(message));
			return thunkAPI.rejectWithValue();
		}
	}
);
export const register = createAsyncThunk(
	"user/register",
	async (
		{ username, email, password, confirmPassword, dob, gender, phone },
		thunkAPI
	) => {
		try {
			await AuthService.register(
				username,
				email,
				phone,
				password,
				confirmPassword,
				dob,
				gender
			);
			return {};
		} catch (error) {
			const message =
				(error.response && error.response.data && error.response.data.msg) ||
				error.message ||
				error.toString();
			thunkAPI.dispatch(errorMessage(message));
			return thunkAPI.rejectWithValue();
		}
	}
);

const initialState = user
	? { isLoggedIn: true, user }
	: { isLoggedIn: false, user: null };

const authSlice = createSlice({
	name: "auth",
	initialState,
	extraReducers: {
		[login.fulfilled]: (state, action) => {
			state.isLoggedIn = true;
			state.user = action.payload.user;
		},
		[login.rejected]: (state, action) => {
			state.isLoggedIn = false;
			state.user = null;
		},
	},
});

const { reducer } = authSlice;
export default reducer;

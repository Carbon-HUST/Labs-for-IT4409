import { configureStore } from "@reduxjs/toolkit";

const reducer = {};

const store = configureStore({
	reducer,
	devTools: true,
});

export default store;

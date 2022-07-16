import axios from "axios";
import { API } from "../const";

const getBooks = async (page, limit = 10) => {
	return axios
		.get(API + `books?page=${page}&limit=${limit}`)
		.then((response) => {
			if (response && response.data && response.data.results) {
				return response.data.results;
			}
			return [];
		});
};
const getBookById = async (id) => {
	return axios.get(API + `book/${id}`).then((response) => {
		if (response && response.data && response.data.result) {
			return response.data.result;
		}
		return {};
	});
};
export default {
	getBooks,
	getBookById,
};

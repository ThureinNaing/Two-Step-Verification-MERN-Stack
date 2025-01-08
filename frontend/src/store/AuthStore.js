import { create } from "zustand";
import axios from "axios";

const API_URL =
	import.meta.env.MODE === "development"
		? "http://localhost:5500/api/auth"
		: "/api/auth";
axios.defaults.withCredentials = true; // send cookies

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	loading: false,
	isCheckingAuth: true,
	message: null,

	register: async (name, email, password) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.post(`${API_URL}/register`, {
				name,
				email,
				password,
			});
			set({
				user: res.data.user,
				isAuthenticated: true,
				loading: false,
			});
		} catch (error) {
			set({
				error: error.response.data.message || "Registration Error",
				loading: false,
			});
			throw error;
		}
	},

	login: async (email, password) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, {
				email,
				password,
			});
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				loading: false,
			});
		} catch (error) {
			set({
				error: error.response?.data?.message || "Error logging in",
				loading: false,
			});
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({
				user: null,
				isAuthenticated: false,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	verifyEmail: async (code) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.post(`${API_URL}/verify-email`, {
				code,
			});
			set({
				user: res.data.user,
				isAuthenticated: true,
				loading: false,
			});
			return res.data;
		} catch (error) {
			set({
				error:
					error.response.data.message || "Email Verification Error",
				loading: false,
			});
			throw error;
		}
	},

	forgotPassword: async (email) => {
		set({ loading: true, error: null, message: null });
		try {
			const res = await axios.post(`${API_URL}/forgot-password`, {
				email,
			});
			set({
				message: res.data.message,
				loading: false,
			});
		} catch (error) {
			set({
				error: error.response.data.message || "Password Reset Error",
				loading: false,
			});
			throw error;
		}
	},

	resetPassword: async (token, password) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.post(`${API_URL}/reset-password/${token}`, {
				password,
			});
			set({ message: res.data.message, loading: false });
		} catch (error) {
			set({
				error: error.response.data.message || "Password Reset Error",
				loading: false,
			});
			throw error;
		}
	},

	checkAuth: async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		set({ isCheckingAuth: true, error: null });
		try {
			const res = await axios.get(`${API_URL}/check-auth`);
			set({
				user: res.data.user,
				isAuthenticated: true,
				isCheckingAuth: false,
			});
		} catch (error) {
			set({ error: null, isCheckingAuth: false });
			throw error;
		}
	},
}));

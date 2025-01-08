/* eslint-disable react/prop-types */
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import EmailVerification from "../pages/EmailVerification";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import { useAuthStore } from "../store/AuthStore";
import { useEffect } from "react";

export default function Index() {
	const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);
	console.log("isCheckingAuth", isCheckingAuth);
	console.log("isAuthenticated", isAuthenticated);
	console.log("user", user);

	// protect routes that require authentication
	const ProtectedRoute = ({ children }) => {
		if (!isAuthenticated) {
			return <Navigate to="/login" replace />;
		}

		if (!user?.isVerified) {
			return <Navigate to="/verify-email" replace />;
		}

		return children;
	};

	// redirect authenticated users to the home page
	const RedirectAuthenticatedUser = ({ children }) => {
		if (isAuthenticated && user.isVerified) {
			return <Navigate to="/" replace />;
		}

		return children;
	};

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			children: [
				{
					path: "/",
					element: (
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					),
				},
				{
					path: "/register",
					element: (
						<RedirectAuthenticatedUser>
							<Register />
						</RedirectAuthenticatedUser>
					),
				},
				{
					path: "/login",
					element: (
						<RedirectAuthenticatedUser>
							<Login />
						</RedirectAuthenticatedUser>
					),
				},
				{
					path: "/verify-email",
					element: <EmailVerification />,
				},
				{
					path: "/forgot-password",
					element: <ForgotPassword />,
				},
				{
					path: "/reset-password/:token",
					element: <ResetPassword />,
				},
				{
					path: "*",
					element: <Navigate to="/" replace />,
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}

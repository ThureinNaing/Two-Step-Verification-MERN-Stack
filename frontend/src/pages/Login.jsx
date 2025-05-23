import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/AuthStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading, error } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();
		await login(email, password);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
		>
			<div className="p-8">
				<h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-gray-400 to-blue-500 text-transparent bg-clip-text">
					Welcome Back
				</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type="email"
						placeholder="Email Address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<Input
						icon={Lock}
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<div className="flex items-center mb-6">
						<Link
							to="/forgot-password"
							className="text-sm text-blue-400 hover:underline"
						>
							Forgot password?
						</Link>
					</div>
					{error && (
						<p className="text-red-500 font-semibold mb-2">
							{error}
						</p>
					)}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full py-3 px-4 bg-gradient-to-r from-gray-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-gray-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
						type="submit"
						disabled={loading}
					>
						{loading ? (
							<Loader className="w-6 h-6 animate-spin  mx-auto" />
						) : (
							"Login"
						)}
					</motion.button>
				</form>
			</div>
			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-sm text-gray-400">
					Don&rsquo;t have an account?
					<Link
						to="/register"
						className="text-blue-400 hover:underline"
					>
						Register
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default LoginPage;

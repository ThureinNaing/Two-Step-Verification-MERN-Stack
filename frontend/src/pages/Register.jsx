import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader } from "lucide-react";
import Input from "../components/Input";
import { useState } from "react";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/AuthStore";
export default function Register() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { register, error, loading } = useAuthStore();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			await register(name, email, password);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
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
					Create Account
				</h2>

				<form onSubmit={handleRegister}>
					<Input
						icon={User}
						type="text"
						placeholder="Full Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
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
					{error && (
						<p className="text-red-500 font-semibold mt-2">
							{error}
						</p>
					)}
					<PasswordStrengthMeter password={password} />

					<motion.button
						className="w-full py-3 px-4 bg-gradient-to-r from-gray-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-gray-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
						disabled={loading}
					>
						{loading ? (
							<Loader
								className="animate-spin mx-auto "
								size={24}
							/>
						) : (
							"Register"
						)}
					</motion.button>
				</form>
			</div>
			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-sm text-gray-400">
					Already have an account?{" "}
					<Link
						to={"/login"}
						className="text-blue-400 hover:underline"
					>
						Login
					</Link>
				</p>
			</div>
		</motion.div>
	);
}

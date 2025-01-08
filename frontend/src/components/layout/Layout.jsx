import { Outlet } from "react-router-dom";
import FloatingShape from "../FloatingShape";
import { Toaster } from "react-hot-toast";
import Loading from "../Loading";
import { useAuthStore } from "../../store/AuthStore";

export default function Layout() {
	const { isCheckingAuth } = useAuthStore();
	const CheckingAuth = Boolean(isCheckingAuth);
	return (
		<>
			{CheckingAuth && <Loading />}
			{!CheckingAuth && (
				<div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
					<FloatingShape
						color="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"
						size="h-64 w-64"
						top="-5%"
						left="10%"
						delay={0}
					/>
					<FloatingShape
						color="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-orange-300 to-rose-800"
						size="h-48 w-48"
						top="70%"
						left="70%"
						delay={5}
					/>
					<FloatingShape
						color="bg-blue-600"
						size="h-32 w-32"
						top="40%"
						left="-10%"
						delay={2}
					/>
					<Outlet />
					<Toaster />
				</div>
			)}
		</>
	);
}

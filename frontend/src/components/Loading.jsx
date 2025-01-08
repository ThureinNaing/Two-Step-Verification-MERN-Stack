import { motion } from "framer-motion";
export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
			<motion.div
				className="w-16 h-16 border-4 border-t-4 border-t-gray-500 border-blue-200 rounded-full"
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
}

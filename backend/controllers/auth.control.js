import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mail/email.js";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		if (!name || !email || !password) {
			throw new Error("All fields are required");
		}
		const userAlreadyExists = await User.findOne({ email });
		if (userAlreadyExists) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = Math.floor(
			100000 + Math.random() * 900000
		).toString();
		const user = new User({
			name,
			email,
			password: hashedPassword,
			verificationToken,
			verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// json web token
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	// - - - - - -
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpireAt: {
				$gt: Date.now(),
			},
		});
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid verification code",
			});
		}
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpireAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in verifyEmail", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "User not found" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res
				.status(400)
				.json({ success: false, message: "Incorrect password" });
		}
		generateTokenAndSetCookie(res, user._id);
		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "User not found" });
		}
		//generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpireAt = resetTokenExpireAt;
		await user.save();

		// send email
		await sendPasswordResetEmail(
			user.email,
			`${process.env.CLIENT_URL}/reset-password/${resetToken}`
		);

		res.status(200).json({
			success: true,
			message: "Password reset link sent to your email",
		});
	} catch (error) {
		console.log("Error in forgotPassword", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;
	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpireAt: {
				$gt: Date.now(),
			},
		});
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired , reset token",
			});
		}
		//update password
		const hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpireAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({
			success: true,
			message: "Password reset successfully",
		});
	} catch (error) {
		console.log("Error in resetPassword", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		console.log("Error in checkAuth", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

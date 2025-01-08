import { mailtrapClient, sender } from "./mailtrp.config.js";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];
	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify Your Email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace(
				"{verificationCode}",
				verificationToken
			),
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error("Error sending verification email", error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];
	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "9fde9253-b153-4b04-8a2f-6d383fa1b919",
			template_variables: {
				company_info_name: "Test_Company_Name",
				name: name,
			},
		});
		console.log("Welcome Email sent successfully", response);
	} catch (error) {
		console.error("Error sending welcome email", error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];
	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset Your Password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
				"{resetURL}",
				resetURL
			),
			category: "Password Reset",
		});
		console.log("Password Reset Email sent successfully", response);
	} catch (error) {
		console.error("Error sending password reset email", error);
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];
	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});
		console.log("Password Reset Success Email sent successfully", response);
	} catch (error) {
		console.error("Error sending password reset success email", error);
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};

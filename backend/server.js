import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;
const _dirname = path.resolve();
//handle the cross origin request
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json()); //allow us to access req.body
app.use(cookieParser()); //allow us to parse incoming cookes

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(_dirname, "frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server started on port: http://localhost:" + PORT);
});

// mCX24FLsHaM5Vknj

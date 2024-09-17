import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import "./db";
import { router } from "./routes";

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));

const corsOptions = {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	res.on("finish", () => {
		console.log(
			`${req.method} ${req.path} ${res.statusCode} ${res.statusMessage}; ${res.get("Content-Length") || 0}b sent`
		);
	});
	next();
});

app.use(router);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

import { Router } from "express";

export const statusRouter = Router();

statusRouter.get("/status", (req, res) => {
	res.send({
		status: "ok",
	});
});

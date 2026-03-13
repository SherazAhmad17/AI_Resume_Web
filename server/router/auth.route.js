import { Router } from "express";
import { registerUser } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser)


export default authRouter;
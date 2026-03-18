import { Router } from "express";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { User } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.route("/").get(authMiddleWare, User)

export default userRouter;
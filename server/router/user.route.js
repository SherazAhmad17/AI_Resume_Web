import { Router } from "express";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { User , ChangePassword } from "../controller/user.controller.js";
import validate from "../middleWare/validate.js";
import changePasswordSchema from "../schemas/changePassword.schema.js";

const userRouter = Router();

userRouter.route("/").get(authMiddleWare, User)
userRouter.route("/change-password").post(validate(changePasswordSchema), authMiddleWare, ChangePassword)

export default userRouter;
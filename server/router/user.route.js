import { Router } from "express";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { ChangePassword , forgetPassword, resetPassword } from "../controller/user.controller.js";
import validate from "../middleWare/validate.js";
import changePasswordSchema from "../schemas/changePassword.schema.js";
import forgetPasswordSchema from "../schemas/forgetPassword.schema.js"

const userRouter = Router();

// userRouter.route("/").get(authMiddleWare, User)
userRouter.route("/change-password").post(validate(changePasswordSchema), authMiddleWare, ChangePassword)
userRouter.route("/forget_password").post(validate(forgetPasswordSchema),forgetPassword)
userRouter.route("/resetpassword/:token").post(resetPassword)

export default userRouter;
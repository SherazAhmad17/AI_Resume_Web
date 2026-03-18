import { Router } from "express";
import { RegisterUser, LoginUser ,RefreshToken } from "../controller/auth.controller.js";
import validate from "../middleWare/validate.js";
import registerSchema from "../schemas/registerSchema.schema.js";
import LoginSchema from "../schemas/loginSchema.schema.js";

const authRouter = Router();

authRouter.route("/register").post(validate(registerSchema), RegisterUser)
authRouter.route("/login").post(validate(LoginSchema), LoginUser)
authRouter.route("/refresh-Token").post(RefreshToken)



export default authRouter;
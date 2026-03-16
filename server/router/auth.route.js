import { Router } from "express";
import { RegisterUser, LoginUser } from "../controller/auth.controller.js";
import validate from "../middleWare/validate.js";
import registerSchema from "../schemas/registerSchema.schema.js";
import LoginSchema from "../schemas/loginSchema.schema.js";

const authRouter = Router();

authRouter.route("/register").post(validate(registerSchema), RegisterUser)
authRouter.route("/login").post(validate(LoginSchema), LoginUser)



export default authRouter;
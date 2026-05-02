import { Router } from "express";
import { RegisterUser, LoginUser, RefreshToken, logOut } from "../controller/auth.controller.js";
import validate from "../middleWare/validate.js";
import registerSchema from "../schemas/registerSchema.schema.js";
import LoginSchema from "../schemas/loginSchema.schema.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { imageMulter } from "../middleWare/imageMulter.middleWare.js";

const authRouter = Router();

const uploadProfile = imageMulter(5, ["image/jpeg", "image/png", "image/jpg"])

authRouter.route("/register").post(uploadProfile.single("profilePicture"), validate(registerSchema), RegisterUser)
authRouter.route("/login").post(validate(LoginSchema), LoginUser)
authRouter.route("/refresh-Token").post(RefreshToken)
authRouter.route("/logout").post(authMiddleWare, logOut)



export default authRouter;
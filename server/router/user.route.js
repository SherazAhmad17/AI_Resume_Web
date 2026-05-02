import { Router } from "express";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { updateProfile, ChangePassword, forgetPassword, resetPassword } from "../controller/user.controller.js";
import validate from "../middleWare/validate.js";
import changePasswordSchema from "../schemas/changePassword.schema.js";
import forgetPasswordSchema from "../schemas/forgetPassword.schema.js"
import changeNameSchema from "../schemas/changeName.schema.js";
import { imageMulter } from "../middleWare/imageMulter.middleWare.js";

const userRouter = Router();

const uploadProfile = imageMulter(5, ["image/jpeg", "image/png", "image/jpg"])

// userRouter.route("/").get(authMiddleWare, User)
userRouter.route("/change-password").post(validate(changePasswordSchema), authMiddleWare, ChangePassword)
userRouter.route("/forget_password").post(validate(forgetPasswordSchema), forgetPassword)
userRouter.route("/resetpassword/:token").post(resetPassword)
userRouter.route("/update-profile").put(uploadProfile.single("profilePicture"), validate(changeNameSchema), authMiddleWare, updateProfile)

export default userRouter;
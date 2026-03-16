import { Router } from "express";
import { RegisterUser } from "../controller/auth.controller.js";
import validate from "../middleWare/validate.js";
import registerSchema from "../schemas/registerSchema.schema.js";

const authRouter = Router();

authRouter.route("/register").post(validate(registerSchema), RegisterUser)


export default authRouter;
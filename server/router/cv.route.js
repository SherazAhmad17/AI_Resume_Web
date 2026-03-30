import { Router } from "express";
import { CreateCv, updateCv, getAllCvs,SingleCv } from "../controller/cv.controller.js";
import  validate  from '../middleWare/validate.js'
import  {CvSchema,updateCvSchema} from '../schemas/cv.schema.js'
import authMiddleWare from "../middleWare/authMiddleWare.js";

const cvRouter = Router();

cvRouter.route("/createCv").post(authMiddleWare, validate(CvSchema), CreateCv)
cvRouter.route("/updateCv/:id").put(authMiddleWare, validate(updateCvSchema) , updateCv)
cvRouter.route("/getAllCvs").get(authMiddleWare, getAllCvs)
cvRouter.route("/getSingleCv/:id").get(authMiddleWare, SingleCv)

export default cvRouter
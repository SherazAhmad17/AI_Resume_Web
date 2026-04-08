import { Router } from "express";
import { CreateCv, updateCv, getAllCvs,SingleCv,deleteCv } from "../controller/cv.controller.js";
import  validate  from '../middleWare/validate.js'
import  {CvSchema,updateCvSchema} from '../schemas/cv.schema.js'
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { imageMulter } from "../middleWare/imageMulter.middleWare.js";
import parseJsonFields from "../middleWare/parseJsonFields.js";

const cvRouter = Router();

const uploadProfile = imageMulter(5,["image/jpeg","image/png","image/jpg"])
cvRouter.use(authMiddleWare)

cvRouter.route("/cv").post(uploadProfile.single("profileImage"),parseJsonFields(["education", "skills", "projects", "experience"]),validate(CvSchema), CreateCv).get(getAllCvs)
cvRouter.route("/cv/:id").put(validate(updateCvSchema) , updateCv).get(SingleCv).delete(deleteCv)


export default cvRouter
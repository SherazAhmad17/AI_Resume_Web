import asyncHandler from '../handler/AsyncHandler.js'
import CustomError from '../handler/CustomError.js';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const authMiddleWare = asyncHandler(async(req,res,next)=>{

    const token  = req.header("Authorization")?.replace("Bearer" , "");

    console.log(token ,"token from auth middle ware")

    if(!token){
        return next(new CustomError(401, "Unauthorized, No token provided"))
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userId = decodedToken.userId;

    if(!userId){
        return next(new CustomError(401, "Unauthorized, Invalid token"))
    }

    const user = await User.findById(userId).select("-password","-refreshToken");

    if(!user){
        return next(new CustomError(401, "Unauthorized, User not found"))
    }

    req.user = user;

    next();




}) 

export default authMiddleWare
import AsyncHandler from '../handler/AsyncHandler.js'
import User from '../model/user.model.js'
import CustomError from '../handler/CustomError.js'
import generateAccessToken from "../utils/genrateAccessToken.js"

const RegisterUser = AsyncHandler(async(req,res,next)=>{

    const {name,email,password,gender} = req.body

    console.log(req.body)

    const UserExist = await User.findOne({email})

    if(UserExist){
        return next(new CustomError(400 ,"User already exist"))
    }

    const user = await User.create({
        name,
        email,
        password,
        gender
    })

    if (!user){
        return next(new CustomError(400 ,"User not created"))
    }

    res.status(201).json({
        success:true,
        message:`User created successfully by this email ${email}`,
        user
    })



})

const LoginUser = AsyncHandler(async(req,res,next)=>{
    const {email,password} = req.body

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new CustomError(400 ,"Invalid email or password"))
    }

    const comparePassword = await user.comparePassword(password);

    if(!comparePassword){
        return next(new CustomError(400 ,"Invalid email or password"))
    }

    let token = generateAccessToken(user)

    res.status(200).json({
        success:true,
        message:"User logged in successfully",
        accessToken: token,
        user
    })

})

export {RegisterUser,LoginUser}
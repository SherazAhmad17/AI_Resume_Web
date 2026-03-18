import AsyncHandler from '../handler/AsyncHandler.js'
import User from '../model/user.model.js'
import CustomError from '../handler/CustomError.js'
import {generateAccessToken , generateRefreshToken} from "../utils/genrateAccessToken.js"
import {CookieOptions} from '../utils/cookiesOption.js'
import jwt from 'jsonwebtoken'

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

    let accessToken = generateAccessToken(user)
    let refreshToken = generateRefreshToken(user)

    user.refreshToken =[{token: refreshToken , createdAt: Date.now()}]

    await user.save({validateBeforeSave: false})

    res.cookie("refreshToken" , refreshToken, CookieOptions).status(200).json({
        success:true,
        message:"User logged in successfully",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user
    })

})

const RefreshToken = AsyncHandler(async(req,res,next)=>{
    
    const incomingRefreshToken = req.cookies.refreshToken

    if(!incomingRefreshToken){
        return next(new CustomError(400 ,"Refresh token not found"))
    }

    const decoded = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)

    if(!decoded.userId){
        return next(new CustomError(400 ,"Invalid refresh token"))
    }

    const isTokenValid = await User.findOne({"refreshToken.token": incomingRefreshToken});

    if(!isTokenValid){
        return next(new CustomError(400 ,"Invalid refresh token"))
    }

    const newAccessToken = generateAccessToken(isTokenValid)
    const newRefreshToken = generateRefreshToken(isTokenValid)

    isTokenValid.refreshToken = [{token: newRefreshToken , createdAt: Date.now()}]

    await isTokenValid.save({validateBeforeSave: false})

    res.cookie("refreshToken" , newRefreshToken , CookieOptions).status(200).json({
        success:true,
        message:"Tokens refreshed successfully",
        data:{
            accessToken: newAccessToken,
        }
    })
})

export {RegisterUser,LoginUser,RefreshToken}
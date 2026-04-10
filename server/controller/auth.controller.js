import AsyncHandler from '../handler/AsyncHandler.js'
import User from '../model/user.model.js'
import CustomError from '../handler/CustomError.js'
import { generateAccessToken, generateRefreshToken } from "../utils/genrateAccessToken.js"
import { CookieOptions } from '../utils/cookiesOption.js'
import jwt from 'jsonwebtoken'
import { welcomeEmailTemplate } from "../template/registration.js"
import sendEmail from "../utils/sendMail.js"

const RegisterUser = AsyncHandler(async (req, res, next) => {

    const { name, email, password, gender } = req.body

    console.log(req.body)

    const UserExist = await User.findOne({ email })

    if (UserExist) {
        return next(new CustomError(400, "User already exist"))
    }

    const user = await User.create({
        name,
        email,
        password,
        gender
    })

    if (!user) {
        return next(new CustomError(400, "User not created"))
    }

    const welcomeEmail = welcomeEmailTemplate(user.name, user.email)

    await sendEmail(user.email, "welcome to our application", welcomeEmail)

    res.status(201).json({
        success: true,
        message: `User created successfully by this email ${email}`,
        user
    })



})

const LoginUser = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new CustomError(400, "Invalid email or password"))
    }

    const comparePassword = await user.comparePassword(password);

    if (!comparePassword) {
        return next(new CustomError(400, "Invalid email or password"))
    }

    let accessToken = generateAccessToken(user)
    let refreshToken = generateRefreshToken(user)

    user.refreshToken = [{ token: refreshToken, createdAt: Date.now() }]

    await user.save({ validateBeforeSave: false })

    res.cookie("refreshToken", refreshToken, CookieOptions).status(200).json({
        success: true,
        message: "User logged in successfully",
        accessToken: accessToken,
    })

})

const RefreshToken = AsyncHandler(async (req, res, next) => {

    const incomingRefreshToken = req.cookies.refreshToken

    if (!incomingRefreshToken) {
        return next(new CustomError(400, "Refresh token not found"))
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    if (!decoded.userId) {
        return next(new CustomError(400, "Invalid refresh token"))
    }

    const isTokenValid = await User.findOne({ "refreshToken.token": incomingRefreshToken });

    if (!isTokenValid) {
        return next(new CustomError(400, "Invalid refresh token"))
    }

    const newAccessToken = generateAccessToken(isTokenValid)
    const newRefreshToken = generateRefreshToken(isTokenValid)

    await User.findOneAndUpdate(
        { "refreshToken.token": incomingRefreshToken },
        {
            $set: {
                refreshToken: [{ token: newRefreshToken, createdAt: Date.now() }]
            }
        }
    );

    res.cookie("refreshToken", newRefreshToken, CookieOptions).status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
        accessToken: newAccessToken,
        user: isTokenValid

    })
})

const logOut = AsyncHandler(async (req, res, next) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: []
            }
        }
    )

    res.clearCookie("refreshToken" , CookieOptions).status(200).json({
        success: true,
        message: "User logged out successfully"
    })
})




export { RegisterUser, LoginUser, RefreshToken, logOut }
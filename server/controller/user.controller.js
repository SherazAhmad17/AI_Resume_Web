import { success } from "zod";
import AsyncHandler from "../handler/AsyncHandler.js";
import User from "../model/user.model.js"
import { resetPasswordEmailTemplate } from "../template/resetPassword.js"
import sendEmail from "../utils/sendMail.js"
import crypto from "crypto"
import uploadToCloudinary from "../utils/uploadToCloudinary.js"
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js"

// const User = AsyncHandler(async(req,res,next)=>{
//     res.status(200).json({
//         success:true,
//         message:"User route is working"
//     })
// })

const ChangePassword = AsyncHandler(async (req, res, next) => {

    const user = req.user; //from auth middleware

    console.log(user)

    const { oldPassword, newPassword } = req.body;



    const passwordIsCorrect = await user.comparePassword(oldPassword);



    if (!passwordIsCorrect) {
        return next(new Error("Old password is incorrect", 400));
    }

    if (oldPassword === newPassword) {
        return next(new Error("New password cannot be same as old password", 400));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    })




})



const forgetPassword = AsyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // here we will qurey in db
    const user = await User.findOne({ email })

    if (!user) {
        return next(new Error("not user"))
    }

    const token = crypto.randomBytes(32).toString('hex')
    user.forgetPasswordToken = token
    user.forgetPasswordExpiry = Date.now() + 10 * 60 * 60 * 1000

    await user.save()

    const resetPasswordTemp = resetPasswordEmailTemplate(user.name, token)

    await sendEmail(user.email, "reset_password", resetPasswordTemp)

    res.status(200).json({
        success: true,
        message: "resetpassword is sent to your account"
    })


})

const resetPassword = AsyncHandler(async (req, res, next) => {

    const { token } = req.params;

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return next(new Error("password should be equal to confirm password"))
    }

    const findToken = await User.findOne({ forgetPasswordToken: token, forgetPasswordExpiry: { $gt: Date.now() } }).select("+password")

    if (!findToken) {
        return next(new Error("invalid token"))

    }

    const isPasswordSame = await findToken.comparePassword(password)

    if (isPasswordSame) {
        return next(new Error("New password cannot be same as old password"))
    }

    findToken.password = password;

    findToken.forgetPasswordToken = null,
        findToken.forgetPasswordExpiry = null,


        await findToken.save()

    res.status(200).json({
        success: true,
        message: "password change successfully"
    })


})


const updateProfile = AsyncHandler(async (req, res, next) => {
    const { name, gender } = req.body;
    const user = req.user;

    if (!name) {
        return next(new Error("Name is required"))
    }

    user.name = name;
    if (gender) {
        user.gender = gender;
    }

    if (req.file) {
        try {
            const uploadedImage = await uploadToCloudinary({
                buffer: req.file.buffer,
                folder: "user_profiles"
            });
            
            if (user.profilePicture && user.profilePicture.public_id) {
                await deleteFromCloudinary(user.profilePicture.public_id).catch(console.error);
            }

            user.profilePicture = {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id
            };
        } catch (error) {
            return next(new Error("Image upload failed"));
        }
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    })
})



export { ChangePassword, forgetPassword, resetPassword, updateProfile };
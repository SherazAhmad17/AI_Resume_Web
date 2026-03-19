import AsyncHandler from "../handler/AsyncHandler.js";

const User = AsyncHandler(async(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"User route is working"
    })
})

const ChangePassword = AsyncHandler(async(req,res,next)=>{

    const user = req.user; //from auth middleware

    console.log(user)

    const {oldPassword,newPassword} = req.body;

    

    const passwordIsCorrect = await user.comparePassword(oldPassword);

    

    if(!passwordIsCorrect){
        return next(new Error("Old password is incorrect",400));
    }

    if(oldPassword === newPassword){
        return next(new Error("New password cannot be same as old password",400));
    }

    user.password = newPassword;

    await user.save();
    
    res.status(200).json({
        success:true,
        message:"Password changed successfully"
    })




})

export {User, ChangePassword};
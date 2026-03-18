import AsyncHandler from "../handler/AsyncHandler.js";

const User = AsyncHandler(async(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"User route is working"
    })
})

export {User}
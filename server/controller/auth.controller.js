const registerUser = (req,res,next)=>{
    res.status(200).json({
        message: "User created successfully",
        success: true
    })
}

export { registerUser }
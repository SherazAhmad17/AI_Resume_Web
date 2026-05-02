import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required : true,
        minlength: 6
    },
    gender: {
        type: String,
        enum: ["male","female","other"]
    },
    refreshToken: [
        {
            token: {
                type:String,
                createdAt: Date
            }
        }
    ],
    forgetPasswordToken:{
        type:String,
        default:null
    },
    forgetPasswordExpiry:{
        type:Date,
        default:null
    },
    profilePicture: {
    url: {
        type: String,
        required: true // or false, depending on your business logic
    },
    public_id: {
        type: String,
        required: true
    }
}



})

userSchema.pre("save", async function (){
    if(!this.isModified("password")){
        return
    }
    try {
        this.password = await bcrypt.hash(this.password , 10);

    }
    catch(error){
        console.log("failed to hash the password")
    }
} )

userSchema.methods.comparePassword = async function (password){
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch; 
}

const User = mongoose.model("User" , userSchema);

export default User;
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

const User = mongoose.model("User" , userSchema);

export default User;
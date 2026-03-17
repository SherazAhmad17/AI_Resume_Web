import jwt from 'jsonwebtoken';

function generateAccessToken(user){

    const token = jwt.sign({
        userId: user._id,
    },     process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME || '1d'
    } )

    return token;

}

function generateRefreshToken(user){

    const token = jwt.sign({
        userId: user._id,
    },     process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME || '7d'
    } )

    return token;

}

export { generateAccessToken, generateRefreshToken };
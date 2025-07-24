import jwt from "jsonwebtoken";

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn:"1d"});
}

export default generateRefreshToken;
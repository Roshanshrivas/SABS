import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import generateAccessToken from "../utils/accessToken.js";
import generateRefreshToken from "../utils/refreshToken.js";

//Signup
export const signup = async(req, res) => {
    try {
        //fetch data in request body
        const {firstName, lastName, email, password, contactNumber, role} = req.body;
        //Validations
        if(!firstName || !lastName || !email || !password || !contactNumber || !role) {
            return res.status(400).json({
                success:false,
                message:"All Fields Are Required!"
            });
        };
        //check if existing user!
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Exists!"
            });
        };
        //password hashed
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
       const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            contactNumber,
            role,
        })

        return res.status(201).json({
            success:true,
            message:"User SignUp Successfully.",
            user,
        })

    } catch (error) {
        console.error("SignUp Failed!!, Please Try Again!!");
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!"
        });
    };
};

//Login
export const login = async(req, res) => {
    try {
        //fetch data in request body
        const {email, password} = req.body;
        //Validations
        if(!email || !password) {
            return res.status(400).json({
                message:"All Fields are required!"
            });
        };
        //check if user registerd or not!!
        const userRegisterd = await User.findOne({email});
        if(!userRegisterd){
            return res.status(404).json({
                message:"User Not Found, Please SignUp First!"
            });
        };

        const user = userRegisterd;

        //Password Match
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"invalid credentials!!"
            });
        };

        //Generate token
        const data = {
            userId: user._id,
            role: user.role,
        };

        const accessToken = generateAccessToken(data);
        const refreshToken = generateRefreshToken(data);

        //cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict", // Prevent CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            success:true,
            message: `Welcome Back ${user.firstName}`,
            accessToken,
            user:{
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                role:user.role,
                contactNumber:user.contactNumber,
            }
        });
    } catch (error) {
        console.error("Login Failed!!, Please Try Again");
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!!"
        })
    }
}


//refresh token
export const refreshAccessToken = async(req, res) =>{
    try {
        const {refreshToken} = req.cookies;
        if(!refreshToken){
            return res.status(400).json({
                message:"refreshToken is Not provided"
            });
        };

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err){
                return res.status(403).json({
                    message:"No Refresh token"
                })
            }

            const accessToken = jwt.sign({
                userId:decoded.userId,
                role:decoded.role,
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"});
            res.json({
                success:true,
                message:"Access Token generated successfully",
                accessToken
            })
        });
    } catch (error) {
        console.error("Refresh Token Invalid", error);
        return res.status(500).json({
            message:"Internal server error!!"
        })
    }
}
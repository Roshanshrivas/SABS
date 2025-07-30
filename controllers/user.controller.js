import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import generateAccessToken from "../utils/accessToken.js";
import generateRefreshToken from "../utils/refreshToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


//=================================================
//============== Authentication ====================
//=================================================


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

//forget-password
export const forgetPassword = async(req, res) => {
    try {
        const {email} = req.body;
        //validation
        if(!email){
            return res.status(400).json({
                message:"Email Required!!"
            })
        }
        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"User Not Found!"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
        
        // Save hashed token & expiry in DB
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; //15mint
        await user.save();

        //reset password link
        const resetLink = `http://localhost:3000/reset-password/${resetTokenHash}`;
        const message = `You requested a password reset.\nClick to reset your password: ${resetLink}\nThis link will expire in 15 minutes.`;

        //send Email
        await sendEmail(user.email, "Password Reset Request", message);
        return res.status(200).json({
            success:true,
            message:"Reset Link send to your email.",
            user,
        });
    } catch (error) {
        console.error("Forget Password Failed!!", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!!"
        })
    }
}

//Reset Password Handler
export const resetPassword = async(req, res) => {
    try {
        const {token, newPassword} = req.body;
        //Validation
        if(!token || !newPassword) {
            return res.status(400).json({
                message:"Token and new password are required!"
            });
        }
        //find user by reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()}
        });
        if(!user){
            return res.status(404).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        //Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        //update user password
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({
            success:false,
            message: "Password reset successfully, please login with your new password"
        })

    } catch (error) {
        console.error("Error in resetPassword", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


//=================================================
//============= Profile Handlers ==================
//=================================================


//view profile.
export const profile = async(req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-password -__v -resetPasswordToken -resetPasswordExpires");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found!!"
            })
        }

        res.status(200).json({
            success:true,
            data:user,
        });
    } catch (error) {
        console.error("Profile Failed to Load!!", error);
        return res.status(500).json({
            success:false,
            message:"Internal server Error!!"
        })
    }
}

//Profile update
export const profileUpdate = async (req, res) => {
    try {
        //Fetch userId
       const userId = req.user.userId;
       console.log("userId", userId);
       
       //fetch details from request body.
       const {firstName="", lastName="" } = req.body;
       console.log(firstName, lastName);
       

       //Find User By Id And Update it
       const user = await User.findByIdAndUpdate(
        userId,
        {firstName, lastName},
        {new:true, runValidators: true}
       ).select("-password -__v");
       console.log("user", user);
       

       res.status(200).json({
        success:true,
        message:"Profile updated Successfully",
        user,
       });
    } catch (error) {
        console.error("Profile Update Failed!, Please Try Again!", error);
        return res.status(500).json({
            success:false,
            message:"Internal server Error!!"
        })
    }
}








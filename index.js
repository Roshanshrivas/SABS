import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/database.js";
import userRouter from "./routes/user.route.js";

//Express
const app = express();

//Dotenv
dotenv.config();

//Middlewares
app.use(express.json());
app.use(cookieParser());

//PORT Number
const PORT = process.env.PORT || 4000

//API Mount
app.use("/api/v1/auth", userRouter)

//Database connection
connectDB();

//Server start
app.listen(PORT, ()=> {
    console.log(`Server Run on ${PORT}`);  
});
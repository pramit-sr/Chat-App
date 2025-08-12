import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.models";
import Message from "../models/message.models";

export const protectedRoute = async(req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            res.status(401).json({Message : "UnAuthorized Token"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            res.status(401).json({Message : "Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            res.status(400).json({Message : "User not found"});
        }

        req.user = user;
        next();
    } catch(error){
        console.log("Error in protected Route", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}
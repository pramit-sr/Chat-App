import bcrypt from "bcryptjs";
import jsonwebToken from "jsonwebtoken";
import User from "../models/user.models.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let uploadedPic = "";
    if (profilePic) {
      try {
        const uploadRes = await cloudinary.uploader.upload(profilePic);
        uploadedPic = uploadRes.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err.message);
      }
    }

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic: uploadedPic
    });

    generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      message: "Signup Succesfull",
    });

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
    const { email, password} = req.body;
    try{
      const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({message: "Invalid Credentials"});
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
      }
      generateToken(user._id, res);
        res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "Login Successfull"
       });

    }catch(error){
      console.log("Login Unsuccesfull", error.message);
      res.status(500).json({message: "Internal server Error"});
    }
}
export const logout = async(req, res) => {
    try{
      res.cookie("jwt", "", {maxAge: 0});
      res.status(200).json({message: "Logout Succesfully"});
    } catch(err){
      console.log("Error logging out", err.message);
      res.status(400).json({message: "Error in logging out"});
    }
}

export const updateProfile = async(req, res) => {
  try{
    const {profilePic} = req.body;
  } catch(error){

  }
}
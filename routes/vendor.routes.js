import { Router } from "express";
import jwt from "jsonwebtoken"
import Vendor from "../model/vendor.model.js";

const router = Router()

router.post("/sign-up", async(req, res)=>{
    const{email, password, username} = req.body;
    try{
        const existingUser = await Vendor.findOne({email})
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await Vendor.hashPassword(password);
        const newVendor = await Vendor.create({
        email,
        password: hashedPassword,
        username,
        });

        const token = newVendor.generateJWT();

        res
           .cookie("token", token, {
            secure: false, // Set true in production with HTTPS
            sameSite: "strict",
           })
           .status(201)
           .json({ message: "Vendor registered successfully" });
    } catch(err){
        res.status(500).json({ message: "Error signing up", error: err.message });
    }
})

router.post("/sign-in", async (req, res) => {
    const {password, email} = req.body;
    try {
        const user = await Vendor.findOne({ email }).select("+password");
        if (!user) return res.status(404).json({message: "User not found"})
        
        const isValid = await user.isValidPassword(password)
        if (!isValid) return res.status(401).json({message: "Invalid password"});

        const token = user.generateJWT();

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({ message: "Signed in successfully",
                token,
                user: {
                id: user._id,
                email: user.email,
                username: user.username,
                },
            });


    } catch (error) {
        res.status(500).json({ message: "Error signing in", error: err.message });
    }
})

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

export default router;
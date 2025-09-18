import { Router } from "express";
import Admin from "../model/admin.model.js";
import jwt from "jsonwebtoken"

const router = Router()

router.get("/hi", (req, res)=>{
    res.send("This is HI route and om shimpi is the real don!!!")
})

router.post("/sign-up", async(req, res)=>{
    const{email, password, username} = req.body;
    try{
        const existingUser = await Admin.findOne({email})
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await Admin.hashPassword(password);
        const newUser = await Admin.create({
        email,
        password: hashedPassword,
        username,
        });

        const token = newUser.generateJWT();

        res
           .cookie("token", token, {
            secure: false, // Set true in production with HTTPS
            sameSite: "strict",
           })
           .status(201)
           .json({ message: "User registered successfully" });
    } catch(err){
        res.status(500).json({ message: "Error signing up", error: err.message });
    }
})

router.post("/sign-in", async (req, res) => {
    const {password, email} = req.body;
    try {
        const user = await Admin.findOne({ email }).select("+password");
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
            .json({ message: "Signed in successfully" });


    } catch (error) {
        res.status(500).json({ message: "Error signing in", error: err.message });
    }
})

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

export default router;
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//Signup a new user
export const signup = async (req, res) => {
    let { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "All fields are required" });
        }

        email = email.toLowerCase().trim();

        const user = await User.findOne({ email });

        if (user) {
            return res.json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({ success: true, userData: newUser, token, message: "Account created successfully" })
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.json({ success: false, message: error.message })
    }
}

//Controller to login a user
export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase().trim();

        const userData = await User.findOne({ email })

        if (!userData) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(userData._id)

        res.json({ success: true, userData, token, message: "Logged in successfully" })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.json({ success: false, message: error.message })
    }
}

//Controller to apdate user profile deatils
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updateData = { bio, fullName };

        if (profilePic) {
            const upload = await cloudinary.uploader.upload(profilePic);
            updateData.profilePic = upload.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.json({ success: true, user: updatedUser })
    } catch (error) {
        console.log("Error in updateProfile:", error.message);
        res.json({ success: false, message: error.message })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.json({ success: true, user: req.user });
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.json({ success: false, message: "Internal Server Error" });
    }
};

export const togglePinChat = async (req, res) => {
    try {
        const userIdToPin = req.params.id;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (user.pinnedChats.includes(userIdToPin)) {
            user.pinnedChats = user.pinnedChats.filter(id => id.toString() !== userIdToPin);
        } else {
            if (user.pinnedChats.length >= 3) {
                return res.json({ success: false, message: "You can pin up to 3 chats only." });
            }
            user.pinnedChats.push(userIdToPin);
        }

        await user.save();

        res.json({ success: true, pinnedChats: user.pinnedChats });
    } catch (error) {
        console.log("Error in togglePinChat:", error.message);
        res.json({ success: false, message: error.message });
    }
}
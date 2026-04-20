import express from "express";
import { checkAuth, signup, login, updateProfile, togglePinChat } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.post("/pin/:id", protectRoute, togglePinChat);

export default userRouter;
import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getUserForSidebar, getMessages, markMessageAsSeen, sendMessage, deleteMessage, reactMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.post("/delete/:id", protectRoute, deleteMessage);
messageRouter.post("/react/:id", protectRoute, reactMessage);
export default messageRouter;

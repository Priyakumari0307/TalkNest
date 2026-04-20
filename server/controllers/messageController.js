import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// GEt all users except the logged in user
export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        //Count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ],
            deletedBy: { $ne: myId }
        })
        
        const unreadExists = await Message.exists({ senderId: selectedUserId, receiverId: myId, seen: false });
        if (unreadExists) {
            await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { seen: true, delivered: true });
            
            const senderSocketId = userSocketMap[selectedUserId.toString()];
            if (senderSocketId) io.to(senderSocketId).emit("messagesSeen", { receiverId: myId });
        }

        res.json({ success: true, messages })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// api to mark messages as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndUpdate(id, { seen: true, delivered: true });
        
        if (message) {
            const senderSocketId = userSocketMap[message.senderId.toString()];
            if (senderSocketId) io.to(senderSocketId).emit("messagesSeen", { receiverId: req.user._id });
        }

        res.json({ success: true })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image, audio } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        let audioUrl;
        if (audio) {
            const uploadResponse = await cloudinary.uploader.upload(audio, { resource_type: "video" }); // Cloudinary uses video type for audio
            audioUrl = uploadResponse.secure_url;
        }

        const receiverSocketId = userSocketMap[receiverId];
        const isDelivered = !!receiverSocketId;

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            audio: audioUrl,
            delivered: isDelivered
        })

        //Emit the new message to the receiver's socket
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({ success: true, newMessage });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Delete message api
export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const { type } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.json({ success: false, message: "Message not found" });
        }

        if (type === "everyone") {
            if (message.senderId.toString() !== userId.toString()) {
                return res.json({ success: false, message: "Unauthorized" });
            }
            message.isDeletedForEveryone = true;
            await message.save();

            const receiverId = message.receiverId.toString();
            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("messageDeleted", { messageId, type: "everyone" });
            }
        } else {
            if (!message.deletedBy.includes(userId)) {
                message.deletedBy.push(userId);
                await message.save();
            }
        }
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// React to message api
export const reactMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.json({ success: false, message: "Message not found" });
        }

        // Check if user already reacted
        const existingReactionIndex = message.reactions.findIndex(r => r.user.toString() === userId.toString());
        
        if (existingReactionIndex !== -1) {
            if (message.reactions[existingReactionIndex].emoji === emoji) {
                // Remove reaction if same emoji
                message.reactions.splice(existingReactionIndex, 1);
            } else {
                // Update emoji
                message.reactions[existingReactionIndex].emoji = emoji;
            }
        } else {
            // Add new reaction
            message.reactions.push({ user: userId, emoji });
        }

        await message.save();

        // Emit to the other user
        const otherUserId = message.senderId.toString() === userId.toString() ? message.receiverId.toString() : message.senderId.toString();
        const otherSocketId = userSocketMap[otherUserId];
        if (otherSocketId) {
            io.to(otherSocketId).emit("messageReactionUpdated", { messageId, reactions: message.reactions });
        }

        res.json({ success: true, reactions: message.reactions });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
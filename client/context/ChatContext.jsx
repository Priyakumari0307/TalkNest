import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    //function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/message/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get message from selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/message/${userId}`)
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage])
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to delete message
    const deleteMessage = async (messageId, type) => {
        try {
            const { data } = await axios.post(`/api/message/delete/${messageId}`, { type });
            if (data.success) {
                if (type === "everyone") {
                    setMessages((prev) => prev.map(msg => msg._id === messageId ? { ...msg, isDeletedForEveryone: true } : msg))
                } else {
                    setMessages((prev) => prev.filter(msg => msg._id !== messageId))
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to react to message
    const reactToMessage = async (messageId, emoji) => {
        try {
            const { data } = await axios.post(`/api/message/react/${messageId}`, { emoji });
            if (data.success) {
                setMessages((prev) => prev.map(msg => msg._id === messageId ? { ...msg, reactions: data.reactions } : msg));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/message/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })

        socket.on("messageDeleted", ({ messageId, type }) => {
            if (type === "everyone") {
                setMessages((prev) => prev.map(msg => msg._id === messageId ? { ...msg, isDeletedForEveryone: true } : msg))
            }
        })

        socket.on("messageReactionUpdated", ({ messageId, reactions }) => {
            setMessages((prev) => prev.map(msg => msg._id === messageId ? { ...msg, reactions } : msg))
        })

        socket.on("messagesSeen", ({ receiverId }) => {
            setMessages((prev) => prev.map(msg => 
                (msg.receiverId === receiverId && !msg.seen) 
                ? { ...msg, seen: true, delivered: true } 
                : msg
            ))
        });
    }

    //function to unscribe from message
    const unScribeFromMessages = () => {
        if (socket) {
            socket.off("newMessage");
            socket.off("messageDeleted");
            socket.off("messageReactionUpdated");
            socket.off("messagesSeen");
        }
    }
    useEffect(() => {
        subscribeToMessages();
        return () => {
            unScribeFromMessages();
        }
    }, [socket, selectedUser])


    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        sendMessage,
        deleteMessage,
        reactToMessage,
        setSelectedUser,
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
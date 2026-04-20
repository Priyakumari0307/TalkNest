import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {

    const { messages, getMessages, selectedUser, setSelectedUser, sendMessage, deleteMessage, reactToMessage } = useContext(ChatContext);
    const { authUser, OnlineUsers, socket } = useContext(AuthContext);
    const scrollEnd = useRef(null);

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [showMenu, setShowMenu] = useState(null); // stores messageId
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

    // Voice recording states
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Handle right click
    const handleContextMenu = (e, msg) => {
        if (msg.isDeletedForEveryone) return;
        e.preventDefault();
        e.stopPropagation();
        
        const container = document.getElementById('chat-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            const menuWidth = 160;
            const containerWidth = container.clientWidth;
            
            let finalX = e.clientX - rect.left + container.scrollLeft;
            let finalY = e.clientY - rect.top + container.scrollTop;

            if (e.clientX - rect.left + menuWidth > containerWidth) {
                finalX -= menuWidth;
            }
            
            const menuHeight = 80; // Estimated height for 2 items
            if (e.clientY - rect.top + menuHeight > container.clientHeight) {
                finalY -= menuHeight;
            }

            setShowMenu(msg._id);
            setMenuPos({ x: finalX, y: finalY });
        }
    }

    // Handle sending a message
    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (input.trim() === "" && !isRecording) return;
        await sendMessage({ text: input.trim() });
        setInput("");
        if (socket && selectedUser) {
            socket.emit("stopTyping", { receiverId: selectedUser._id });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (!socket || !selectedUser) return;

        socket.emit("typing", { receiverId: selectedUser._id });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { receiverId: selectedUser._id });
        }, 2000);
    }

    // Voice recording logic
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    await sendMessage({ audio: reader.result });
                };
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            toast.error("Microphone access denied or error occurred");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Handle sending an image
    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("select an image file")
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessage({ image: reader.result })
            e.target.value = ""
        }
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
            setIsTyping(false); // Reset when switching users
        }
    }, [selectedUser])

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])

    useEffect(() => {
        const handleClickOutside = () => setShowMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleTyping = ({ senderId }) => {
            if (selectedUser && senderId === selectedUser._id) {
                setIsTyping(true);
            }
        };

        const handleStopTyping = ({ senderId }) => {
            if (selectedUser && senderId === selectedUser._id) {
                setIsTyping(false);
            }
        };

        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
        };
    }, [socket, selectedUser]);

    return selectedUser ? (
        <div id='chat-container' className='h-full overflow-scroll relative backdrop-blur-lg'>
            {/* Header */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
                <p className='flex-1 text-lg text-white flex items-center gap-2'>
                    {selectedUser.fullName}
                    {OnlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                </p>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='max-md:hidden max-w-7 cursor-pointer hover:opacity-80 transition-opacity' />
            </div>

            {/* Context Menu Tooltip */}
            {showMenu && (
                <div
                    onMouseLeave={() => setShowMenu(null)}
                    style={{ 
                        top: menuPos.y, 
                        left: menuPos.x,
                        padding: '10px',
                        zIndex: 1000
                    }}
                    className={`absolute`}
                >
                    <div className="w-40 bg-[#282142] border border-stone-600 rounded-md shadow-2xl py-1 text-xs text-white">
                        <div className="flex justify-around py-2 border-b border-white/10 mb-1">
                            {['👍', '❤️', '😂'].map(emoji => (
                                <span 
                                    key={emoji} 
                                    className="cursor-pointer text-lg hover:scale-125 transition-transform"
                                    onClick={(e) => { e.stopPropagation(); reactToMessage(showMenu, emoji); setShowMenu(null) }}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteMessage(showMenu, 'me'); setShowMenu(null) }} className='w-full text-left px-3 py-2 hover:bg-white/10'>Delete for me</button>
                        {messages.find(m => m._id === showMenu)?.senderId === authUser?._id && (
                            <button onClick={(e) => { e.stopPropagation(); deleteMessage(showMenu, 'everyone'); setShowMenu(null) }} className='w-full text-left px-3 py-2 hover:bg-white/10 text-red-400 font-medium'>Delete for everyone</button>
                        )}
                    </div>
                </div>
            )}

            {/* ---- chat area ---- */}
            <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
                {messages.map((msg, index) => (
                    <div key={index} className={`relative group flex items-end gap-2 justify-end ${msg.senderId !== authUser?._id ? 'flex-row-reverse' : ''}`}>
                        {msg.isDeletedForEveryone ? (
                            <p className={`p-2 max-w-[200px] text-xs italic font-light rounded-lg mb-8 text-gray-400 border border-gray-700`}>This message was deleted</p>
                        ) : (
                            <>
                                <div className='relative'>
                                    {msg.image && (
                                        <img onContextMenu={(e) => handleContextMenu(e, msg)} src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 cursor-context-menu' />
                                    )}
                                    {msg.audio && (
                                        <div onContextMenu={(e) => handleContextMenu(e, msg)} className='mb-8 cursor-context-menu'>
                                            <audio controls className='w-[240px] h-10 filter outline-none'>
                                                <source src={msg.audio} type="audio/webm" />
                                            </audio>
                                        </div>
                                    )}
                                    {msg.text && (
                                        <p onContextMenu={(e) => handleContextMenu(e, msg)} className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all text-white ${msg.senderId === authUser?._id ? 'rounded-br-none bg-indigo-600/40' : 'rounded-bl-none bg-gray-500/30'} cursor-context-menu`}>{msg.text}</p>
                                    )}
                                    {msg.reactions && msg.reactions.length > 0 && (
                                        <div className={`absolute bottom-3 ${msg.senderId === authUser?._id ? 'right-2' : 'left-2'} flex gap-1.5 bg-[#282142] border border-white/20 rounded-full px-2 py-0.5 shadow-md z-10 hover:scale-105 transition-transform`}>
                                            {[...new Set(msg.reactions.map(r => r.emoji))].map((emoji, i) => (
                                                <span key={i} className="text-xs flex items-center gap-1 cursor-default">
                                                    {emoji} 
                                                    <span className="text-[10px] text-gray-300">{msg.reactions.filter(r => r.emoji === emoji).length}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <div className='text-center text-xs'>
                            <img src={msg.senderId === authUser?._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full mx-auto' />
                            <p className='text-gray-500 mt-2 flex items-center justify-center gap-1'>
                                {formatMessageTime(msg.createdAt)}
                                {msg.senderId === authUser?._id && (
                                    <span className={msg.seen ? "text-blue-500" : "text-gray-400"}>
                                        {msg.seen ? "✔✔" : (msg.delivered ? "✔✔" : "✔")}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}

                <div ref={scrollEnd}></div>

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex items-center gap-3">
                        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className="w-7 rounded-full" />
                        <div className="bg-white/5 border border-white/10 text-white rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 w-fit shadow-md backdrop-blur-md">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
            </div>
            {/* ---- bottom area ----*/}
            <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input onChange={handleInputChange} value={input} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
                        type="text" placeholder="Send a message" className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 ' />
                    <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
                    <label htmlFor='image'>
                        <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
                    </label>
                    <div onClick={isRecording ? stopRecording : startRecording} className={`cursor-pointer transition-all ${isRecording ? 'animate-pulse text-red-500' : 'text-gray-400'}`}>
                        {isRecording ? (
                            <span className='text-sm flex items-center gap-1'>🔴 Recording...</span>
                        ) : (
                            <span className='text-xl mr-2'>🎙️</span>
                        )}
                    </div>
                </div>
                <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />

            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
            <img src={assets.logo_icon} className='max-w-16' alt="" />
            <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
        </div>
    )
}

export default ChatContainer;

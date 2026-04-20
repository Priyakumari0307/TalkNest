import React, { useContext, useState, useEffect } from 'react';
import assets from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = ({ }) => {

    const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const { logout, OnlineUsers, authUser, togglePinChat } = useContext(AuthContext);
    const [input, setInput] = useState("");
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, userId: null });


    const navigate = useNavigate();

    const pinnedChatIds = authUser?.pinnedChats || [];

    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    const pinnedUsers = filteredUsers.filter(u => pinnedChatIds.includes(u._id));
    const otherUsers = filteredUsers.filter(u => !pinnedChatIds.includes(u._id));

    useEffect(() => {
        getUsers();
    }, [OnlineUsers])

    const handleContextMenu = (e, userId) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, userId });
    }

    useEffect(() => {
        const handleClickOutside = () => setContextMenu({ visible: false, x: 0, y: 0, userId: null });
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
            <div className='pb-5'>
                <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-2">
                        <img src={assets.logo_icon || assets.logo} alt="TalkNest Logo" className='max-h-6 cursor-pointer' />
                        <span className="font-semibold text-lg tracking-tight hidden sm:block">TalkNest</span>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <p onClick={() => navigate('/profile')} className='cursor-pointer text-xs hover:text-blue-400 transition-colors'>Profile</p>
                        <p onClick={() => logout()} className='cursor-pointer text-xs hover:text-red-400 transition-colors'>Logout</p>
                    </div>
                </div>

                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                    <img src={assets.search_icon} alt="search" className='w-3' />
                    <input onChange={(e) => setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
                </div>
            </div>

            {contextMenu.visible && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className="fixed bg-[#282142] border border-stone-600 rounded-md shadow-2xl py-1 text-xs text-white z-[100] w-32"
                >
                    <button
                        className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePinChat(contextMenu.userId);
                            setContextMenu({ visible: false, x: 0, y: 0, userId: null });
                        }}
                    >
                        {pinnedChatIds.includes(contextMenu.userId) ? 'Unpin Chat' : 'Pin Chat'} 📌
                    </button>
                </div>
            )}

            <div className='flex flex-col gap-4'>
                {pinnedUsers.length > 0 && (
                    <div className="mb-2">
                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-wider px-2">Pinned</p>
                        {pinnedUsers.map((user, index) => (
                            <div
                                onContextMenu={(e) => handleContextMenu(e, user._id)}
                                onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
                                key={`pinned-${user._id}`}
                                className={`group relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm transition-all duration-300 hover:bg-[#282142]/70 hover:shadow-lg hover:scale-[1.01] ${selectedUser?._id === user._id ? 'bg-[#282142]/80 shadow-md' : ''}`}
                            >
                                <div className="absolute top-1/2 -translate-y-1/2 right-2 text-indigo-400 hover:scale-110 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); togglePinChat(user._id); }}>📌</div>
                                <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
                                <div className='flex flex-col leading-5'>
                                    <p className='text-sm font-medium'>{user.fullName}</p>
                                    {
                                        OnlineUsers.includes(user._id)
                                            ? <span className='text-green-400 text-[10px]'>Online</span>
                                            : <span className='text-red-400 text-[10px]'>Offline</span>
                                    }
                                </div>
                                {unseenMessages[user._id] > 0 && <p className='absolute right-5 bottom-2 text-[10px] h-4 w-4 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold leading-none shadow-md animate-pulse'>{unseenMessages[user._id]}</p>}
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    {pinnedUsers.length > 0 && <p className="text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-wider px-2">All Chats</p>}
                    {otherUsers.map((user, index) => (
                        <div
                            onContextMenu={(e) => handleContextMenu(e, user._id)}
                            onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
                            key={user._id}
                            className={`group relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm transition-all duration-300 hover:bg-[#282142]/70 hover:shadow-lg hover:scale-[1.01] ${selectedUser?._id === user._id ? 'bg-[#282142]/80 shadow-md' : ''}`}
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer" onClick={(e) => { e.stopPropagation(); togglePinChat(user._id); }}>📌</div>
                            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
                            <div className='flex flex-col leading-5'>
                                <p className='text-sm font-medium'>{user.fullName}</p>
                                {
                                    OnlineUsers.includes(user._id)
                                        ? <span className='text-green-400 text-[10px]'>Online</span>
                                        : <span className='text-red-400 text-[10px]'>Offline</span>
                                }
                            </div>
                            {unseenMessages[user._id] > 0 && <p className='absolute right-5 top-1/2 -translate-y-1/2 text-[10px] h-5 w-5 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold leading-none shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse'>{unseenMessages[user._id]}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
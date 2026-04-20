import React from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black/20 backdrop-blur-[40px] text-white selection:bg-indigo-500/30 font-sans z-50 relative overflow-hidden">

            <nav className="border-b border-white/[0.08] bg-black/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={assets.logo_icon || assets.logo_big} alt="TalkNest" className="w-8 h-8" />
                        <span className="font-semibold text-lg tracking-tight">TalkNest</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login', { state: { mode: 'Login' } })}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => navigate('/login', { state: { mode: 'Sign up' } })}
                            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-24 pb-20">
                <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-xs font-medium text-gray-200 shadow-xl">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        Introducing TalkNest
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 pb-2 drop-shadow-lg">
                        Communication, <br /> engineered for teams.
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-light drop-shadow-md">
                        A clean, fast, and secure messaging platform designed to keep your conversations organized and your team connected.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/login', { state: { mode: 'Sign up' } })}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] cursor-pointer"
                        >
                            Get Started for Free
                        </button>
                        <a
                            href="#features"
                            className="px-7 py-3.5 rounded-lg font-medium text-white border border-white/30 bg-black/30 backdrop-blur-md hover:bg-black/50 transition-all shadow-xl"
                        >
                            View Documentation
                        </a>
                    </div>
                </div>

                {/* Clean, Realistic App Mockup with Glassmorphism */}
                <div className="mt-24 border border-white/20 rounded-2xl bg-black/50 backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] relative">
                    {/* Header */}
                    <div className="h-12 border-b border-white/10 flex items-center px-4 bg-black/40">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/50"></div>
                        </div>
                    </div>

                    {/* App Body */}
                    <div className="flex h-[400px] md:h-[600px]">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-white/10 bg-black/20 hidden md:flex flex-col">
                            <div className="p-4 border-b border-white/10">
                                <div className="h-8 bg-white/10 rounded pl-3 flex items-center text-xs text-gray-400 border border-white/5">Search messages...</div>
                            </div>
                            <div className="p-4 flex-1">
                                <div className="text-xs font-semibold text-gray-400 mb-4 px-2 uppercase tracking-wider">Direct Messages</div>
                                <div className="space-y-1">
                                    {[
                                        { name: 'Alice Martin', active: true },
                                        { name: 'Team Engineering', active: false },
                                        { name: 'Design Sync', active: false },
                                    ].map((chat, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-2 py-2 rounded-md ${chat.active ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/30' : 'text-gray-300 hover:bg-white/10'} transition-all cursor-pointer`}>
                                            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white border border-white/10">
                                                {chat.name[0]}
                                            </div>
                                            <span className="text-sm font-medium">{chat.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 border-t border-white/10 flex items-center gap-3 bg-black/30">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-inner"></div>
                                <div className="text-sm font-medium text-white">Your Account</div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 bg-gradient-to-b from-transparent to-black/30 flex flex-col relative">
                            <div className="h-14 border-b border-white/10 flex items-center px-6 bg-black/20 backdrop-blur-sm">
                                <span className="font-semibold text-white"># general</span>
                            </div>
                            <div className="flex-1 p-6 flex flex-col gap-6 justify-end">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/50 border border-indigo-400/50 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg">A</div>
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-sm border border-white/10 shadow-lg">
                                        <div className="flex items-baseline gap-2 mb-1.5">
                                            <span className="font-semibold text-white">Alice Martin</span>
                                            <span className="text-xs text-gray-400">10:42 AM</span>
                                        </div>
                                        <p className="text-sm text-gray-200 leading-relaxed">The new API endpoints are deployed to production. Can you test the integration when you have a moment?</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 flex-row-reverse">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/50 border border-emerald-400/50 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg">Y</div>
                                    <div className="bg-indigo-600/60 backdrop-blur-md p-4 rounded-2xl rounded-tr-sm border border-indigo-400/30 shadow-lg">
                                        <div className="flex items-baseline justify-end gap-2 mb-1.5">
                                            <span className="text-xs text-gray-300">10:45 AM</span>
                                            <span className="font-semibold text-white">You</span>
                                        </div>
                                        <p className="text-sm text-gray-200 leading-relaxed text-right">Looking into it now. The response times have significantly dropped, great job on the optimization!</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-0">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-3 flex items-center shadow-inner">
                                    <span className="text-gray-400 text-sm ml-2">Message #general...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Glassmorphism Features Grid */}
            <section id="features" className="max-w-6xl mx-auto px-6 py-24">
                <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-6 mx-auto md:mx-0">
                            <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Real-time Sync</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">Built on WebSockets for instant message delivery with zero polling. Experience latency-free communication.</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-6 mx-auto md:mx-0">
                            <svg className="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">Your data remains yours. State-of-the-art encryption guarantees that your team's conversations are protected.</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mb-6 mx-auto md:mx-0">
                            <svg className="w-6 h-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Modern Architecture</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">Crafted with React, Node, and Socket.io. Scalable infrastructure designed to grow alongside your organization.</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="max-w-6xl mx-auto px-6 py-24 mb-12">
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 mb-6 shadow-sm">
                            Our chat app
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
                            is built to provide a simple, fast, and reliable way for people to communicate.
                        </h2>
                        <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mb-12 drop-shadow-sm font-light">
                            It focuses on creating a smooth and user-friendly experience, allowing users to stay connected anytime and anywhere.

                            The platform is designed with performance and ease of use in mind, ensuring that conversations feel natural and uninterrupted. Our goal is to make digital communication more accessible, efficient, and enjoyable for everyone.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/10 py-8 text-center bg-black/60 backdrop-blur-xl">
                <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} TalkNest Technologies. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

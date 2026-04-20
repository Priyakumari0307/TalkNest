import React, { useState, useEffect } from 'react';
import assets from '../assets/assets';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {

    const location = useLocation();
    const [currState, setCurrState] = useState(location.state?.mode || "Sign up");
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);
    const { login } = useContext(AuthContext);

    useEffect(() => {
        if (location.state?.mode) {
            setCurrState(location.state.mode);
        }
    }, [location.state?.mode]);

    const onSubmitHandler = (event) => {
        event.preventDefault();

        if (currState === 'Sign up' && !isDataSubmitted) {
            setIsDataSubmitted(true);
            return;
        }

        login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio });
    }
    return (
        <div className='min-h-screen bg-transparent flex items-center justify-center gap-12 sm:justify-evenly max-sm:flex-col backdrop-blur-md px-4'>
            {/* ----- left side: Logo ----- */}
            <div className='flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700'>
                <img src={assets.logo_big} alt="Logo" className='w-[min(40vw,280px)] drop-shadow-2xl' />
                <h1 className='text-white text-4xl font-bold tracking-tight hidden sm:block'>TalkNest</h1>
            </div>

            {/* ----- right side: Form ----- */}
            <form onSubmit={onSubmitHandler} className='w-full max-w-[400px] bg-black/60 backdrop-blur-xl text-white border border-white/20 p-8 flex flex-col gap-6 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-500'>
                <div className='flex flex-col gap-2'>
                    <h2 className='font-semibold text-3xl flex justify-between items-center'>
                        {currState}
                        <img src={assets.arrow_icon} alt="" className='w-6 opacity-80' />
                    </h2>
                    <p className='text-gray-400 text-sm'>
                        {currState === "Sign up" ? "Create your account to get started." : "Welcome back! Please login to your account."}
                    </p>
                </div>

                <div className='flex flex-col gap-4'>
                    {currState === "Sign up" && !isDataSubmitted && (
                        <input 
                            onChange={(e) => setFullName(e.target.value)} 
                            value={fullName} 
                            type="text" 
                            className='w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500' 
                            placeholder="Full Name" 
                            required 
                        />
                    )}

                    {!isDataSubmitted && (
                        <>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                type="email" 
                                placeholder='Email Address' 
                                required 
                                className='w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500' 
                            />
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                type="password" 
                                placeholder='Password' 
                                required 
                                className='w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500' 
                            />
                        </>
                    )}

                    {currState === "Sign up" && isDataSubmitted && (
                        <textarea 
                            onChange={(e) => setBio(e.target.value)} 
                            value={bio} 
                            rows={4} 
                            className='w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500 resize-none' 
                            placeholder='Provide a short bio...' 
                            required
                        ></textarea>
                    )}
                </div>

                <button type='submit' className='w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30'>
                    {currState === "Sign up" ? (isDataSubmitted ? "Create Account" : "Next") : "Login Now"}
                </button>

                <div className='flex items-center gap-3 text-sm text-gray-400'>
                    <input type="checkbox" className='w-4 h-4 rounded border-white/20 bg-white/10 checked:bg-purple-500' id="terms" required />
                    <label htmlFor="terms" className='cursor-pointer'>Agree to the terms of use & privacy policy.</label>
                </div>

                <div className='border-t border-white/10 pt-4 mt-2'>
                    {currState === "Sign up" ? (
                        <p className='text-sm text-gray-400'>Already have an account? <span onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }} className='font-semibold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors'>Login here</span></p>
                    ) : (
                        <p className='text-sm text-gray-400'>New to TalkNest? <span onClick={() => setCurrState("Sign up")} className='font-semibold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors'>Create an account</span></p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPage;

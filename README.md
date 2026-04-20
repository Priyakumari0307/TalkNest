# TalkNest 

Frontend - https://talk-nest-nine.vercel.app/
Backend - https://talknest-i34e.onrender.com/

TalkNest is a modern, real-time messaging platform engineered for seamless communication. It features a beautiful, responsive, and glassmorphic user interface paired with a robust real-time backend. 

## Key Features
- **Real-Time Messaging**: Instant delivery built on `Socket.io`.
- **Typing Indicators**: Live "User is typing..." animations. 
- **Read Receipts**: Dynamic `Sent` → `Delivered` → `Seen` status tracking.
- **Message Reactions**: React to specific communications with standard emojis (👍 ❤️ 😂).
- **Pinned Chats**: Pin up to 3 priority conversations to the top of your sidebar via right-click context menus.
- **Beautiful UI**: Modern glassmorphism design with dynamic blurs, active mesh gradients, and smooth micro-animations.

## Tech Stack
This application is fully full-stack using a standard MERN-variant architecture:
- **Frontend**: React (Vite), Context API for state management, TailwindCSS (for rapid utility and custom animations).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose) to safely persist user schemas, chat history, and platform metrics.
- **Real-Time Subsystem**: `socket.io` for maintaining highly efficient, bi-directional event piping.
- **Media Hosting**: Integrated Cloudinary support for Profile Avatars and Images.

## Getting Started
To get a local copy up and running, follow these simple steps:

### Prerequisites
Make sure you have Node and npm installed.
```sh
npm install npm@latest -g
```

### Installation
1. Clone the repository
2. Install NPM packages for both the server and client:
   ```sh
   cd server
   npm install
   cd ../client
   npm install
   ```
3. Set your environment variables (MongoDB URI, Cloudinary tokens, JWT Secret) in your Server `.env`.
4. Run the development environment:
   ```sh
   # Terminal 1 - Boot the Server
   cd server
   npm run server
   
   # Terminal 2 - Boot the Frontend Client
   cd client
   npm run dev
   ```

## Contributions
Contributions, issues, and feature requests are welcome! Feel free to check out the issues page if you have any exciting ideas to expand TalkNest.



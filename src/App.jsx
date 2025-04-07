import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import frame from "./assets/frame.jpg";

function App() {
  return (
    <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-cyan-500 to-white">
      <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-2xl shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="flex flex-col justify-center p-6 gap-4 flex-1">
          <h1 className="text-2xl font-bold text-center">Silakan Login</h1>

          <div className="flex flex-col text-sm gap-1">
            <label>Username</label>
            <input
              type="text"
              className="rounded-md p-2 border border-gray-300 outline-none focus:border-cyan-400 focus:bg-slate-50"
            />
          </div>
          <div className="flex flex-col text-sm gap-1">
            <label>Password</label>
            <input
              type="password"
              className="rounded-md p-2 border border-gray-300 outline-none focus:border-cyan-400 focus:bg-slate-50"
            />
          </div>
          <div className="flex gap-2 items-center">
            <input type="checkbox" />
            <span className="text-sm">Remember Password</span>
          </div>

          <button className="w-full py-2 rounded-md bg-gradient-to-r from-green-400 to-blue-400 hover:from-pink-500 hover:to-yellow-500 text-white text-sm font-semibold">
            Login
          </button>
        </div>

        <div className="hidden md:block md:w-1/2">
          <img src={frame} alt="Frame" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

export default App;

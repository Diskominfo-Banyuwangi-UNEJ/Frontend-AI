import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/auth-context";
import login5 from "@/assets/login5.png";
import axios from "axios";
import Cookies from "js-cookie";

export default function LoginForm() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3000/api/auth/signin', {
                email: email, 
                password: password
            });

            if (response.data && response.data.token) {
                // Simpan token ke cookies
                Cookies.set('authToken', response.data.token, { 
                    expires: 1, // Kadaluarsa dalam 1 hari
                    secure: process.env.NODE_ENV === 'production', // Hanya HTTPS di production
                    sameSite: 'strict' // Perlindungan CSRF
                });
                
                // Panggil fungsi login dari context dengan data yang diterima
                login(response.data);
                console.log("Login successful", response.data);
                nav("/dashboard", { replace: true });
            } else {
                alert("Invalid credentials - No token received");
            }
        } catch (error) {
            console.error("Login error:", error);
            
            if (error.response) {
                alert(error.response.data.message || "Login failed");
            } else {
                alert("Network error. Please try again.");
            }
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-white to-white font-sans">
            <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border bg-white shadow-lg md:max-w-2xl md:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-4 p-6">
                    <h1 className="text-center text-2xl font-bold">Silakan Login</h1>

                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-1 text-sm">
                            <label>Email</label> {/* Ganti label Username menjadi Email */}
                            <input
                                type="email" // Ganti type menjadi email
                                className="rounded-md border border-gray-300 p-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <label>Password</label>
                            <input
                                type="password"
                                className="rounded-md border border-gray-300 p-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span className="text-sm">Remember Password</span>
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-gradient-to-r from-gray-800 to-gray-800 py-2 text-sm font-semibold text-white hover:from-black hover:to-black"
                        >
                            Login
                        </button>
                    </form>
                </div>

                <div className="hidden md:block md:w-1/2">
                    <img
                        src={login5}
                        alt="login5"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
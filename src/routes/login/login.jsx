import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/auth-context";
import login5 from "@/assets/login5.png";
import axios from "axios";
import Cookies from "js-cookie";

// Fungsi helper untuk mendapatkan user by email
const getUserByEmail = async (email, token) => {
  try {
    const response = await axios.get('http://localhost:3000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        email: email // Filter by email
      }
    });
    
    // Cari user yang sesuai dengan email
    const user = response.data.data.find(u => u.email === email);
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export default function LoginForm() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Login untuk mendapatkan token
            const loginResponse = await axios.post('http://localhost:3000/api/auth/signin', {
                email,
                password
            });

            console.log("Login response:", loginResponse.data);

            if (!loginResponse.data.token) {
                throw new Error("Token tidak ditemukan dalam response");
            }

            const token = loginResponse.data.token;

            // 2. Simpan token ke cookies
            Cookies.set('authToken', token, {
                expires: 1,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            // 3. Ambil data user termasuk role
            const user = await getUserByEmail(email, token);
            
            if (!user) {
                throw new Error("Data user tidak ditemukan");
            }

            if (!user.role) {
                throw new Error("Role user tidak ditemukan");
            }

            const userRole = user.role.toUpperCase();

            // 4. Simpan ke AuthContext
            login(userRole);

            // 5. Redirect berdasarkan role
            switch (userRole) {
                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;
                case "PEMERINTAH":
                    navigate("/pemerintah/dashboard");
                    break;
                case "MASYARAKAT":
                    navigate("/masyarakat/dashboard");
                    break;
                default:
                    navigate("/dashboard");
            }

        } catch (error) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || error.message || "Login gagal. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-white to-white font-sans">
            <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border bg-white shadow-lg md:max-w-2xl md:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-4 p-6">
                    <h1 className="text-center text-2xl font-bold">Silakan Login</h1>

                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-1 text-sm">
                            <label>Email</label>
                            <input
                                type="email"
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
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember" className="text-sm">Remember Password</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full rounded-md bg-gradient-to-r from-gray-800 to-gray-800 py-2 text-sm font-semibold text-white hover:from-black hover:to-black ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : 'Login'}
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
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/auth-context";
import login5 from "@/assets/login5.png"; // pastikan path-nya benar

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const nav = useNavigate();

    // src/routes/login/login.jsx
    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "admin123") {
            login();
            console.log("Login successful"); // Menambahkan log untuk memastikan login berhasil
            nav("/dashboard", { replace: true });
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-white to-white font-sans">
            <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border bg-white shadow-lg md:max-w-2xl md:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-4 p-6">
                    <h1 className="text-center text-2xl font-bold">Silakan Login</h1>

                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-1 text-sm">
                            <label>Username</label>
                            <input
                                type="text"
                                className="rounded-md border border-gray-300 p-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <label>Password</label>
                            <input
                                type="password"
                                className="rounded-md border border-gray-300 p-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import DashboardPage from "@/routes/dashboard/page"; // ganti dengan path sebenarnya
// import Layout from "@/routes/layout";
// // import AkunPage from "./routes/dashboard/akun";
// import AnalitikKeramaianPage from "@/routes/dashboard/analitikkeramaian";
// import AnalitikSampahPage from "@/routes/dashboard/analitiksampah";
// import AkunPage from "@/routes/dashboard/akun";

// export default function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route
//                     path="/"
//                     element={
//                         <Navigate
//                             to="/dashboard"
//                             replace
//                         />
//                     }
//                 />
//                 <Route
//                     path="/dashboard"
//                     element={<DashboardPage />}
//                 />
//                 <Route
//                     path="/keramaian"
//                     element={<AnalitikKeramaianPage />}
//                 />
//                 <Route
//                     path="/sampah"
//                     element={<AnalitikSampahPage />}
//                 />
//                 <Route
//                     path="/akun"
//                     element={<AkunPage />}
//                 />
//                 {/* Hapus atau jangan daftarkan route login di sini */}
//             </Routes>
//         </Router>
//     );
// }

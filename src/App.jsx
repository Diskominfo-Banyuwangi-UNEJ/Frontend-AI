// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import { ThemeProvider } from "@/contexts/theme-context";

// import Layout from "@/routes/layout";
// import DashboardPage from "@/routes/dashboard/page";
// // import AccountPage from "@/routes/";

// function App() {
//     const router = createBrowserRouter([
//         {
//             path: "/",
//             element: <Layout />,
//             children: [
//                 {
//                     index: true,
//                     element: <DashboardPage />,
//                 },
//                 // {
//                 //     index: true,
//                 //     element: <AccountPage />,
//                 // },
//                 {
//                     path: "analytics",
//                     element: <h1 className="title">Analytics Keramaiaan</h1>,
//                 },
//                 {
//                     path: "reports",
//                     element: <h1 className="title">Analytics Tumpukan Sampah</h1>,
//                 },
//                 {
//                     path: "customers",
//                     element: <h1 className="title">Akun Admin dan Pemerintah</h1>,
//                 },
//                 {
//                     path: "new-customer",
//                     element: <h1 className="title">New Customer</h1>,
//                 },
//                 {
//                     path: "verified-customers",
//                     element: <h1 className="title">Verified Customers</h1>,
//                 },
//                 {
//                     path: "products",
//                     element: <h1 className="title">Products</h1>,
//                 },
//                 {
//                     path: "new-product",
//                     element: <h1 className="title">New Product</h1>,
//                 },
//                 {
//                     path: "inventory",
//                     element: <h1 className="title">Inventory</h1>,
//                 },
//                 {
//                     path: "settings",
//                     element: <h1 className="title">Settings</h1>,
//                 },
//             ],
//         },
//     ]);

//     return (
//         <ThemeProvider storageKey="theme">
//             <RouterProvider router={router} />
//         </ThemeProvider>
//     );
// }

// export default App;

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
import login5 from "./assets/login5.png"; // atau sesuaikan path-nya
import frame from "./assets/frame.jpg";

function App() {
    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-white to-white font-mono font-sans">
            <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border bg-white shadow-lg md:max-w-2xl md:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-4 p-6">
                    <h1 className="text-center text-2xl font-bold">Silakan Login</h1>

                    <div className="flex flex-col gap-1 text-sm">
                        <label>Username</label>
                        <input
                            type="text"
                            className="rounded-md border border-gray-300 p-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                        />
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <label>Password</label>
                        <input
                            type="password"
                            className="rounded-md border border-gray-300 p-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">Remember Password</span>
                    </div>

                    <button className="w-full rounded-md bg-gradient-to-r from-gray-800 to-gray-800 py-2 text-sm font-semibold text-white hover:from-black hover:to-black">
                        Login
                    </button>
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

export default App;

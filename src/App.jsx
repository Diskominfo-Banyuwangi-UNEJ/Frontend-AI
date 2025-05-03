// import React from "react";
// import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
// import LoginForm from "./routes/login/login";
// import Layout from "@/routes/layout";
// import DashboardPage from "@/routes/dashboard/page";
// import AkunPage from "./routes/dashboard/akun";
// import AnalitikKeramaianPage from "./routes/dashboard/analitikkeramaian";
// import AnalitikSampahPage from "./routes/dashboard/analitiksampah";
// import ProtectedRoute from "./contexts/ProtectedRoute";

// function App() {
//     const router = createBrowserRouter([
//         { path: "/", element: <LoginForm /> },
//         {
//             path: "/dashboard",
//             element: (
//                 <ProtectedRoute>
//                     <Layout />
//                 </ProtectedRoute>
//             ),
//             children: [
//                 { index: true, element: <DashboardPage /> },
//                 { path: "akun", element: <AkunPage /> },
//                 { path: "analytics", element: <AnalitikKeramaianPage /> },
//                 { path: "reports", element: <AnalitikSampahPage /> },
//             ],
//         },
//         {
//             path: "*",
//             element: (
//                 <Navigate
//                     to="/"
//                     replace
//                 />
//             ),
//         },
//     ]);

//     return <RouterProvider router={router} />;
// }

// export default App;

import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
// import LoginForm from "./routes/login/login";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import AkunPage from "./routes/dashboard/akun";
import AnalitikKeramaianPage from "./routes/dashboard/analitikkeramaian";
import AnalitikSampahPage from "./routes/dashboard/analitiksampah";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />, // langsung ke layout dashboard
            children: [
                { index: true, element: <DashboardPage /> },
                { path: "akun", element: <AkunPage /> },
                { path: "analytics", element: <AnalitikKeramaianPage /> },
                { path: "reports", element: <AnalitikSampahPage /> },
            ],
        },
        {
            path: "*",
            element: (
                <Navigate
                    to="/"
                    replace
                />
            ),
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;

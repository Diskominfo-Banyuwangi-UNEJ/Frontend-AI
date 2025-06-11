import React from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import LoginForm from "./routes/login/login";
import Layout from "@/routes/layout";
import ProtectedRoute from "./contexts/ProtectedRoute";
import { useAuth } from "./contexts/auth-context";

// Admin
import DashboardPage from "@/routes/admin/page";
import AkunPage from "./routes/admin/akun";
import AnalitikKeramaianPage from "./routes/admin/analitikkeramaian";
import AnalitikSampahPage from "./routes/admin/analitiksampah";
import Notifikasi from "./routes/admin/notifikasi";
import LaporanPage from "./routes/admin/laporan";
import PengaduanPage from "./routes/admin/pengaduan";

// Pemerintah
import PemerintahAnalitikKeramaianPage from "./routes/pemerintah/pemerintahanalitikkeramaian";
import PemerintahAnalitikSampahPage from "./routes/pemerintah/analitiksampah";
import PemerintahNotifikasi from "./routes/pemerintah/notifikasi";
import PemerintahLaporanPage from "./routes/pemerintah/laporan";
import PemerintahDashboardPage from "./routes/pemerintah/page";

// Masyarakat
import MasyarakatAnalitikKeramaianPage from "./routes/masyarakat/analitikkeramaian";
import MasyarakatAnalitikSampahPage from "./routes/masyarakat/analitiksampah";
import MasyarakatDashboardPage from "./routes/masyarakat/page";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginForm />,
    },

    // Admin routes
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <Layout />
          <Outlet />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "akun", element: <AkunPage /> },
        { path: "analytics", element: <AnalitikKeramaianPage /> },
        { path: "reports", element: <AnalitikSampahPage /> },
        { path: "laporan", element: <LaporanPage /> },
        { path: "notifikasi", element: <Notifikasi /> },
        { path: "pengaduan", element: <PengaduanPage /> },
      ],
    },

    // Pemerintah routes
    {
      path: "/pemerintah",
      element: (
        <ProtectedRoute>
          <Layout />
          <Outlet />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <PemerintahDashboardPage /> },
        { path: "dashboard", element: <PemerintahDashboardPage /> },
        { path: "analytics", element: <PemerintahAnalitikKeramaianPage /> },
        { path: "reports", element: <PemerintahAnalitikSampahPage /> },
        { path: "laporan", element: <PemerintahLaporanPage /> },
        { path: "notifikasi", element: <PemerintahNotifikasi /> },
      ],
    },

    // Masyarakat routes (tanpa login, tapi tetap pakai Layout)
    {
      path: "/masyarakat",
      element: (
        <Layout />
      ),
      children: [
        { index: true, element: <MasyarakatDashboardPage /> },
        { path: "dashboard", element: <MasyarakatDashboardPage /> },
        { path: "analytics", element: <MasyarakatAnalitikKeramaianPage /> },
        { path: "reports", element: <MasyarakatAnalitikSampahPage /> },
      ],
    },

    // Default route: redirect ke login
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;





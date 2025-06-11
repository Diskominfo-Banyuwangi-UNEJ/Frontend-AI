import { Bell,FileText, ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";
import ProfileImage from "@/assets/profile-image.jpg";
import ProductImage from "@/assets/product-image.jpg";
import "leaflet/dist/leaflet.css";
import { UserRoles } from "./userRoles";

// Jika kamu ingin centralized role

export const navbarLinks = {
  [UserRoles.ADMIN]: [
    {
      title: "Dashboard",
      links: [
        { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
        { label: "Analytics Keramaian", icon: ChartColumn, path: "/admin/analytics" },
        { label: "Analytics Sampah", icon: ChartColumn, path: "/admin/reports" },
      ],
    },
    {
      title: "Manajemen Akun",
      links: [{ label: "Akun", icon: Users, path: "/admin/akun" }],
    },
    {
      title: "Laporan dan Pengaduan",
      links: [
        { label: "Pelaporan", icon: FileText, path: "/admin/laporan" },
        { label: "Pengaduan", icon: NotepadText, path: "/admin/pengaduan" },
      ],
    },
    {
      title: "Notifikasi",
      links: [{ label: "Notifikasi", icon: Bell, path: "/admin/notifikasi" }],
    },
  ],

  [UserRoles.PEMERINTAH]: [
    {
      title: "Dashboard",
      links: [
        { label: "Dashboard", icon: Home, path: "/pemerintah/dashboard" },
        { label: "Analytics Keramaian", icon: ChartColumn, path: "/pemerintah/analytics" },
        { label: "Analytics Sampah", icon: ChartColumn, path: "/pemerintah/reports" },
      ],
    },
    {
      title: "Laporan",
      links: [{ label: "Pelaporan", icon: FileText, path: "/pemerintah/laporan" }],
    },
    {
      title: "Notifikasi",
      links: [{ label: "Notifikasi", icon: Bell, path: "/pemerintah/notifikasi" }],
    },
  ],

  [UserRoles.MASYARAKAT]: [
    {
      title: "Dashboard",
      links: [
        { label: "Dashboard", icon: Home, path: "/masyarakat/dashboard" },
        { label: "Analytics Keramaian", icon: ChartColumn, path: "/masyarakat/analytics" },
        { label: "Analytics Sampah", icon: ChartColumn, path: "/masyarakat/reports" },
      ],
    },
  ],
};
export { UserRoles };


export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];




// constants/navbarLinks.js
import {
  FiHome as DashboardIcon,
  FiUsers as AccountIcon,
  FiBarChart2 as AnalyticsIcon,
  FiTrash2 as WasteIcon,
  FiBell as NotificationIcon,
  FiFileText as ReportIcon,
  FiAlertCircle as ComplaintIcon
} from 'react-icons/fi';

export const navbarLinks = {
  admin: [
    {
      title: "Menu Utama",
      links: [
        { path: "/admin", label: "Dashboard", icon: DashboardIcon },
        { path: "/admin/akun", label: "Kelola Akun", icon: AccountIcon },
        { path: "/admin/analytics", label: "Analitik Keramaian", icon: AnalyticsIcon },
        { path: "/admin/reports", label: "Analitik Sampah", icon: WasteIcon },
        { path: "/admin/laporan", label: "Laporan", icon: ReportIcon },
        { path: "/admin/notifikasi", label: "Notifikasi", icon: NotificationIcon },
        { path: "/admin/pengaduan", label: "Pengaduan", icon: ComplaintIcon }
      ]
    }
  ],
  pemerintah: [
    {
      title: "Menu Pemerintah",
      links: [
        { path: "/pemerintah", label: "Dashboard", icon: DashboardIcon },
        { path: "/pemerintah/analytics", label: "Analitik Keramaian", icon: AnalyticsIcon },
        { path: "/pemerintah/reports", label: "Analitik Sampah", icon: WasteIcon },
        { path: "/pemerintah/laporan", label: "Laporan", icon: ReportIcon },
        { path: "/pemerintah/notifikasi", label: "Notifikasi", icon: NotificationIcon }
      ]
    }
  ],
  masyarakat: [
    {
      title: "Menu Masyarakat",
      links: [
        { path: "/masyarakat", label: "Dashboard", icon: DashboardIcon },
        { path: "/masyarakat/analytics", label: "Analitik Keramaian", icon: AnalyticsIcon },
        { path: "/masyarakat/reports", label: "Analitik Sampah", icon: WasteIcon }
      ]
    }
  ]
};


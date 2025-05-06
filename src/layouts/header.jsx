import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";
import profileImg from "@/assets/profile-image.jpg";
import PropTypes from "prop-types";
import { useState } from "react";
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Header = ({ collapsed, setCollapsed }) => {
    const profileRef = useRef(null);

    const { theme, setTheme } = useTheme();
    const [showCard, setShowCard] = useState(false);

    const toggleCard = () => setShowCard(!showCard);
    const [editData, setEditData] = useState({
        pimpinan: "Pak Aziz M.Pd.",
        instansi: "Diskominfo",
        status: "Admin",
        username: "admin1234",
        email: "admintampan@mail.com",
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();
    const handleBellClick = () => {
        navigate("/notifikasi");
    };

    const handleSave = () => {
        // Simpan data ke backend kalau ada
        setShowEditForm(false);
    };
    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowCard(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            {showEditForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[400px] rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">Mengubah Data Akun</h2>
                        <div className="space-y-4">
                            {/* Nama Pimpinan */}
                            <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Masukkan nama pimpinan lengkap, termasuk gelar.</p>
                                <input
                                    id="pimpinan"
                                    name="pimpinan"
                                    value={editData.pimpinan}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Pak Aziz M.Pd."
                                    className="input-field w-full rounded border p-2 text-sm dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Nama Instansi */}
                            <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Tulis nama instansi sesuai dokumen resmi.</p>
                                <input
                                    id="instansi"
                                    name="instansi"
                                    value={editData.instansi}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Diskominfo"
                                    className="input-field w-full rounded border p-2 text-sm dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Pilih status pengguna.</p>
                                <select
                                    id="status"
                                    name="status"
                                    value={editData.status}
                                    onChange={handleInputChange}
                                    className="input-field w-full rounded border p-2 text-sm dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Pemerintah">Pemerintah</option>
                                </select>
                            </div>

                            {/* Username */}
                            <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Buat username unik minimal 6 karakter.</p>
                                <input
                                    id="username"
                                    name="username"
                                    value={editData.username}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: admin1234"
                                    className="input-field w-full rounded border p-2 text-sm dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Masukkan alamat email aktif.</p>
                                <input
                                    id="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: admintampan@mail.com"
                                    className="input-field w-full rounded border p-2 text-sm dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="rounded bg-gray-200 px-4 py-1 text-sm dark:bg-slate-700 dark:text-white"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                    />
                </div>
            </div>

            <div className="relative flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>

                <div className="relative">
                    <button
                        className="btn-ghost size-10"
                        onClick={handleBellClick}
                    >
                        <Bell size={20} />
                    </button>
                    {/* Tanda notifikasi jika ada */}
                    {true && <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>}
                </div>

                {/* Profile button */}
                <div
                    className="relative"
                    ref={profileRef}
                >
                    <button
                        className="size-10 overflow-hidden rounded-full"
                        onClick={toggleCard}
                    >
                        <img
                            src={profileImg}
                            alt="profile image"
                            className="size-full object-cover"
                        />
                    </button>

                    {showCard && (
                        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white p-4 text-left shadow-lg dark:bg-slate-800">
                            <div className="mb-4 space-y-5">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Nama Pimpinan : Pak Aziz M.Pd.</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-300">Nama Instansi : Diskominfo</p>
                                <p className="text-sm font-medium text-green-500">Status: Admin</p>
                                <p className="text-sm font-medium">
                                    Username: <span className="font-medium">admin1234</span>
                                </p>
                                <p className="text-sm font-medium">
                                    Email: <span className="font-medium">admintampan@mail.com</span>
                                </p>
                            </div>
                            <hr className="my-2 border-slate-300 dark:border-slate-600" />
                            <div className="flex flex-col gap-2 space-y-3">
                                <button
                                    className="text-left text-sm font-semibold text-blue-600 hover:underline"
                                    onClick={() => setShowEditForm(true)}
                                >
                                    Ubah Data
                                </button>
                                <button className="text-left text-sm font-semibold text-red-600 hover:underline">Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};

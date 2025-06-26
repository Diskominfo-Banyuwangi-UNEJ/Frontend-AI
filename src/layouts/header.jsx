import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun, Home, Menu, User, Edit, LogOut } from "lucide-react";
import profileImg from "@/assets/saya.jpg";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export const Header = ({ collapsed, setCollapsed }) => {
    const profileRef = useRef(null);
    const { theme, setTheme } = useTheme();
    const [showCard, setShowCard] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const { logout, userRole } = useAuth();
    const navigate = useNavigate();
    const [hasNotification, setHasNotification] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [currentEditId, setCurrentEditId] = useState(null);

    const isPublicUser = !userRole || userRole === 'MASYARAKAT';

    useEffect(() => {
        if (!isPublicUser) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/api/users', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const user = Array.isArray(response.data.data)
                        ? response.data.data[0]
                        : response.data.data;
                    setUserData(user);
                    setCurrentEditId(user.id_user);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    if (error.response?.status === 401) {
                        logout();
                        navigate('/login');
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [logout, navigate, isPublicUser]);

    const toggleCard = () => setShowCard(!showCard);

    const [editData, setEditData] = useState({
        nama_instansi: '',
        name_lengkap: '',
        status: '',
        username: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (userData) {
            setEditData({
                nama_instansi: userData.nama_instansi || '',
                name_lengkap: userData.name_lengkap || '',
                status: userData.status || '',
                username: userData.username || '',
                email: userData.email || '',
                password: userData.password || ''
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBellClick = () => {
        navigate("/notifikasi");
    };

    const validateForm = () => {
        const errors = {};
        if (!editData.name_lengkap) errors.name_lengkap = 'Nama lengkap diperlukan';
        if (!editData.username) errors.username = 'Username diperlukan';
        if (!editData.email) {
            errors.email = 'Email diperlukan';
        } else if (!/^\S+@\S+\.\S+$/.test(editData.email)) {
            errors.email = 'Format email tidak valid';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
            name_lengkap: editData.name_lengkap,
            email: editData.email,
            username: editData.username,
            ...(editData.password && { password: editData.password })
            // Hapus role dan nama_instansi dari payload karena tidak boleh diubah
            };

            await axios.put(
            `http://localhost:3000/api/users/${currentEditId}`,
            payload,
            {
                headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }
            );

            Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data akun berhasil diperbarui',
            timer: 2000,
            showConfirmButton: false,
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1e293b',
            });

            setShowEditForm(false);
            // Refresh user data
            const response = await axios.get('http://localhost:3000/api/users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
            });
            const user = Array.isArray(response.data.data)
            ? response.data.data[0]
            : response.data.data;
            setUserData(user);
        } catch (error) {
            console.error('Gagal memperbarui akun:', error);
            Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.response?.data?.message || 'Gagal memperbarui akun',
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1e293b',
            });
        }
        };

    const handleLogout = () => {
        Swal.fire({
            title: 'Yakin ingin logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, logout',
            cancelButtonText: 'Batal',
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1e293b',
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/login');
            }
        });
    };

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

    if (loading) {
        return (
            <header className="relative z-10 flex h-[70px] items-center justify-between bg-blue-500 px-6 shadow-md transition-colors dark:bg-slate-900">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-400 rounded-full animate-pulse dark:bg-blue-600"></div>
                    <div className="w-32 h-4 bg-blue-400 rounded animate-pulse dark:bg-blue-600"></div>
                </div>
            </header>
        );
    }

    return (
        <header className="relative z-10 flex h-[70px] items-center justify-between bg-white px-6 shadow-sm transition-colors dark:bg-slate-800 dark:shadow-slate-700/50">
            <AnimatePresence>
                {!isPublicUser && showEditForm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl dark:bg-slate-700"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Profil</h2>
                                <button 
                                    onClick={() => setShowEditForm(false)}
                                    className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600"
                                >
                                    <ChevronsLeft size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Nama Pimpinan</label>
                                    <input
                                        id="name_lengkap"
                                        name="name_lengkap"
                                        value={editData.name_lengkap}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Pak Aziz M.Pd."
                                        className={`w-full rounded-lg border p-3 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-600 dark:text-white dark:border-slate-500 ${formErrors.name_lengkap ? 'border-red-500' : 'border-slate-300'}`}
                                    />
                                    {formErrors.name_lengkap && (
                                        <p className="mt-1 text-xs text-red-500">{formErrors.name_lengkap}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                                    <input
                                        id="username"
                                        name="username"
                                        value={editData.username}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: admin1234"
                                        className={`w-full rounded-lg border p-3 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-600 dark:text-white dark:border-slate-500 ${formErrors.username ? 'border-red-500' : 'border-slate-300'}`}
                                    />
                                    {formErrors.username && (
                                        <p className="mt-1 text-xs text-red-500">{formErrors.username}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={editData.email}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: admintampan@mail.com"
                                        className={`w-full rounded-lg border p-3 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-600 dark:text-white dark:border-slate-500 ${formErrors.email ? 'border-red-500' : 'border-slate-300'}`}
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={editData.password}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan password baru"
                                        className={`w-full rounded-lg border p-3 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-600 dark:text-white dark:border-slate-500 ${formErrors.password ? 'border-red-500' : 'border-slate-300'}`}
                                    />
                                    {formErrors.password && (
                                        <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditForm(false)}
                                        className="px-4 py-2 text-sm font-medium transition rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-600"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-x-4">
                {isPublicUser && (
                    <Link 
                        to="/masyarakat/dashboard" 
                        className="flex items-center justify-center text-blue-600 transition rounded-full size-10 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700"
                    >
                        <Home size={20} />
                    </Link>
                )}

                {!isPublicUser && (
                    <button
                        className="flex items-center justify-center transition rounded-full size-10 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <Menu size={20} className={collapsed ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>
                )}
            </div>

            <div className="relative flex items-center gap-x-4">
                {isPublicUser && (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/masyarakat/analytics"
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700"
                        >
                            Analisis Keramaian
                        </Link>
                        <Link
                            to="/masyarakat/reports"
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-50 dark:text-green-400 dark:hover:bg-slate-700"
                        >
                            Analisis Sampah
                        </Link>
                    </div>
                )}

                <button
                    className="flex items-center justify-center transition rounded-full size-10 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    aria-label="Toggle theme"
                >
                    <Sun size={20} className="dark:hidden" />
                    <Moon size={20} className="hidden dark:block" />
                </button>

                {(userRole === "ADMIN" || userRole === "PEMERINTAH") && (
                    <div className="relative">
                        <Link
                            to={`/${userRole.toLowerCase()}/notifikasi`}
                            className="flex items-center justify-center transition rounded-full size-10 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <Bell size={20} />
                            {hasNotification && (
                                <span className="absolute bg-red-500 rounded-full right-1 top-1 size-2 ring-2 ring-white dark:ring-slate-800"></span>
                            )}
                        </Link>
                    </div>
                )}

                {!isPublicUser && (
                    <div className="relative" ref={profileRef}>
                        <button
                            className="flex items-center justify-center overflow-hidden transition border-2 rounded-full size-10 border-slate-200 hover:border-blue-500 dark:border-slate-600"
                            onClick={toggleCard}
                            aria-label="Profile menu"
                        >
                            <img
                                src={profileImg}
                                alt="Profile"
                                className="object-cover size-full"
                            />
                        </button>

                        <AnimatePresence>
                            {showCard && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 z-50 p-4 mt-2 bg-white border shadow-xl w-72 rounded-xl dark:border-slate-600 dark:bg-slate-700"
                                >
                                    <div className="mb-4 space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center overflow-hidden rounded-full size-10">
                                                <img
                                                    src={profileImg}
                                                    alt="Profile"
                                                    className="object-cover size-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {userData?.name_lengkap}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {userData?.nama_instansi}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">Role</span>
                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    {userData?.role}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">Username</span>
                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {userData?.username}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">Email</span>
                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {userData?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <hr className="my-3 border-slate-200 dark:border-slate-600" />
                                    
                                    <div className="space-y-2">
                                        <button
                                            className="flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium transition rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-600"
                                            onClick={() => setShowEditForm(true)}
                                        >
                                            <Edit size={16} />
                                            <span>Edit Profil</span>
                                        </button>
                                        <button
                                            className="flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-red-600 transition rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-600"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
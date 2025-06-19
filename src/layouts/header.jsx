import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun, Menu } from "lucide-react";
import profileImg from "@/assets/saya.jpg";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

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


    // Check if user is public (MASYARAKAT or not logged in)
    const isPublicUser = !userRole || userRole === 'MASYARAKAT';

    // Fetch user data on component mount (only for authenticated users)
    useEffect(() => {
        if (!isPublicUser) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/api/users', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setUserData(response.data.data);
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
        nama_pimpinan: '',
        status: '',
        username: '',
        email: '',
        password: ''
    });

    // Initialize edit data when userData is available
    useEffect(() => {
        if (userData) {
            setEditData({
                nama_instansi: userData.nama_instansi,
                nama_pimpinan: userData.nama_pimpinan,
                status: userData.status,
                username: userData.username,
                email: userData.email,
                password: userData.password
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
    if (!editData.name_lengkap) errors.name_lengkap = 'Leader name is required';
    if (!editData.username) errors.username = 'Username is required';
    if (!editData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(editData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!editData.password) {
      errors.password = 'Password is required';
    } else if (editData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      password: editData.password,
      role: editData.status,
      nama_instansi: editData.nama_instansi,
    };

    await axios.put(`http://localhost:3000/api/users/${currentEditId}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data akun berhasil diperbarui',
      timer: 2000,
      showConfirmButton: false,
      background: '#f8fafc',
    });

    // Reset form & status setelah update
    setIsFormVisible(false);
    setIsEditMode(false);
    setCurrentEditId(null);
    setEditData({
      nama_instansi: '',
      name_lengkap: '',
      status: '',
      username: '',
      email: '',
      password: '',
    });

    fetchAkunList();
  } catch (error) {
    console.error('Gagal memperbarui akun:', error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: error.response?.data?.message || 'Gagal memperbarui akun',
      background: '#f8fafc',
    });
  }
};


    const handleLogout = () => {
        logout();
        navigate('/login');
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

    if (loading) {
        return (
            <header className="relative z-10 flex h-[60px] items-center justify-between bg-blue-500 px-4 shadow-md transition-colors dark:bg-slate-900">
                <div>Loading...</div>
            </header>
        );
    }

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            {!isPublicUser && showEditForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[400px] rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">Mengubah Data Akun</h2>
                        <div className="space-y-4">
                              <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Tulis nama pimpinan instansi.</p>
                                <input
                                    id="name_lengkap"
                                    name="name_lengkap"
                                    value={editData.name_lengkap}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Pak Aziz M.Pd."
                                    className="input-field w-full rounded border p-2 text-sm dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Username</p>
                                <input
                                    id="username"
                                    name="username"
                                    value={editData.username}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: admin1234"
                                    className="input-field w-full rounded border p-2 text-sm dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Alamat email</p>
                                <input
                                    id="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: admintampan@mail.com"
                                    className="input-field w-full rounded border p-2 text-sm dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">Password</p>
                                <input
                                    id="password"
                                    name="password"
                                    value={editData.password}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: admin123"
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
                    <Menu className={collapsed && "rotate-180"} />
                </button>
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

                {!isPublicUser && (
                    <>
                        <div className="relative">
                            <Link 
                                to="/dashboard/notifikasi" 
                                className="btn-ghost size-10 flex items-center justify-center"
                            >
                                <Bell size={20} />
                                {hasNotification && (
                                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                                )}
                            </Link>
                        </div>

                        <div className="relative" ref={profileRef}>
                            <button
                                className="size-10 overflow-hidden rounded-full"
                                onClick={toggleCard}
                            >
                                <img
                                    src={profileImg}
                                    alt="Profile"
                                    className="size-full object-cover"
                                />
                            </button>

                            {showCard && (
                                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white p-4 text-left shadow-lg dark:bg-slate-800">
                                    <div className="mb-4 space-y-5">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            Nama Instansi: {userData?.nama_instansi}
                                        </p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-300">
                                            Nama Pimpinan: {userData?.nama_pimpinan}
                                        </p>
                                        <p className="text-sm font-medium text-green-500">
                                            Status: {userData?.status}
                                        </p>
                                        <p className="text-sm font-medium">
                                            Username: <span className="font-medium">{userData?.username}</span>
                                        </p>
                                        <p className="text-sm font-medium">
                                            Email: <span className="font-medium">{userData?.email}</span>
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
                                        <button 
                                            className="text-left text-sm font-semibold text-red-600 hover:underline"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
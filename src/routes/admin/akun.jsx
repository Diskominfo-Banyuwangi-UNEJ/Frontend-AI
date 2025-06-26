import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, PencilLine, Trash, Loader2, ChevronDown, ChevronUp, Search, X, User, Shield, Building2, Mail, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

const AkunPage = () => {
  // State management
  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState({});
  
  // Form states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  
  // Constants
  const INSTANSI_OPTIONS = [
    { value: 'KOMINFO', label: 'Kementrian Komunikasi dan Informatika' },
    { value: 'DISHUB', label: 'Dinas Perhubungan' },
    { value: 'DLH', label: 'Dinas Lingkungan Hidup' },
    { value: 'SATPOL_PP', label: 'Satpol PP' }
  ];

  // Form data
  const [formData, setFormData] = useState({
    name_lengkap: '',
    username: '',
    email: '',
    password: '',
    role: 'PEMERINTAH',
    nama_instansi: 'KOMINFO'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef(null);
  const token = Cookies.get('authToken');

  // API base URL
  const API_BASE_URL = 'http://localhost:3000/api/users';

  // Fetch data from API
  const fetchAkunList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          per_page: 100
        }
      });
      
      // Ensure consistent ID field
      const mappedData = response.data.data.map(item => ({
        ...item,
        id_user: item.id_user || item.id || item._id // Use id_user, fallback to id or _id
      }));
      
      setAkunList(mappedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat data',
        text: err.response?.data?.message || err.message,
        background: '#f8fafc',
        confirmButtonColor: '#4f46e5',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAkunList();
  }, []);

  // Form handlers
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setFormErrors({});
    setFormData({
      name_lengkap: '',
      username: '',
      email: '',
      password: '',
      role: 'PEMERINTAH',
      nama_instansi: 'KOMINFO'
    });
  };

  const openEditModal = (id_user) => {
    const akunToEdit = akunList.find(akun => akun.id_user === id_user);
    if (akunToEdit) {
      setCurrentEditId(id_user);
      
      // Map nama_instansi to match our options
      let mappedInstansi = akunToEdit.nama_instansi;
      switch (akunToEdit.nama_instansi) {
        case 'Dinas Lingkungan Hidup':
          mappedInstansi = 'DLH';
          break;
        case 'Satpol PP':
          mappedInstansi = 'SATPOL_PP';
          break;
        case 'Kementrian Komunikasi dan Informatika':
          mappedInstansi = 'KOMINFO';
          break;
        case 'Dinas Perhubungan':
          mappedInstansi = 'DISHUB';
          break;
        default:
          mappedInstansi = akunToEdit.nama_instansi;
      }
      
      
      setFormData({
        name_lengkap: akunToEdit.name_lengkap || '',
        username: akunToEdit.username || '',
        email: akunToEdit.email || '',
        password: '',
        role: akunToEdit.role || 'PEMERINTAH',
        nama_instansi: mappedInstansi || 'KOMINFO'
      });
      setIsEditModalOpen(true);
      setFormErrors({});
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentEditId(null);
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name_lengkap) errors.name_lengkap = 'Nama lengkap wajib diisi';
    if (!formData.username) errors.username = 'Username wajib diisi';
    
    if (!formData.email) {
      errors.email = 'Email wajib diisi';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }
    
    if (!isEditModalOpen && !formData.password) {
      errors.password = 'Password wajib diisi';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        name_lengkap: formData.name_lengkap,
        email: formData.email,
        username: formData.username,
        role: formData.role,
        nama_instansi: formData.nama_instansi
      };

      // Only include password if it's provided (for create or update)
      if (formData.password) {
        payload.password = formData.password;
      }

      let response;
      if (isEditModalOpen && currentEditId) {
        response = await axios.put(
          `${API_BASE_URL}/${currentEditId}`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        response = await axios.post(
          API_BASE_URL,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      closeModals();
      await fetchAkunList(); // Refresh the list
      
      Swal.fire({
        icon: 'success',
        title: isEditModalOpen ? 'Akun berhasil diperbarui' : 'Akun berhasil dibuat',
        showConfirmButton: false,
        timer: 1500,
        background: '#f8fafc',
      });
    } catch (error) {
      console.error('Error details:', error);
      let errorMessage = error.response?.data?.message || error.message;
      
      if (error.response?.status === 401) {
        errorMessage = "Anda tidak memiliki akses - Silakan login kembali";
      } else if (error.response?.status === 409) {
        errorMessage = error.response.data.message || "Data sudah ada (konflik)";
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        background: '#f8fafc',
        confirmButtonColor: '#4f46e5',
      });
    }
  };

  // Delete account
  const handleDelete = async (id_user) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: '#f8fafc',
      customClass: {
        popup: 'rounded-xl',
        title: 'text-center'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/${id_user}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setAkunList(prev => prev.filter(akun => akun.id_user !== id_user));

        Swal.fire({
          title: 'Berhasil dihapus!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#f8fafc',
        });
      } catch (error) {
        console.error('Delete error:', error);
        let errorMessage = 'Gagal menghapus akun';
        if (error.response) {
          errorMessage = error.response.data?.message || errorMessage;
        } else if (error.request) {
          errorMessage = 'Tidak ada respon dari server';
        }
        
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Tutup',
          background: '#f8fafc',
          confirmButtonColor: '#4f46e5',
        });
      }
    }
  };

  // Search and filter
  const filteredData = akunList.filter(akun => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (akun.name_lengkap?.toLowerCase().includes(searchLower)) ||
      (akun.username?.toLowerCase().includes(searchLower)) ||
      (akun.email?.toLowerCase().includes(searchLower)) ||
      (akun.role?.toLowerCase().includes(searchLower)) ||
      (akun.nama_instansi?.toLowerCase().includes(searchLower))
    );
  });

  // Sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      // Handle null/undefined values
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Toggle row expansion
  const toggleRowExpand = (id_user) => {
    setExpandedRows(prev => ({
      ...prev,
      [id_user]: !prev[id_user],
    }));
  };

  // Role badge styling
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-indigo-100 text-indigo-800';
      case 'PEMERINTAH':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get instansi label from value
  const getInstansiLabel = (value) => {
    return INSTANSI_OPTIONS.find(opt => opt.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Manajemen Akun</h1>
            <p className="text-sm text-slate-600">Kelola akun admin dan pemerintah</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus size={18} />
            Tambah Akun
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Akun</p>
                <p className="text-2xl font-bold text-slate-800">{akunList.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Admin</p>
                <p className="text-2xl font-bold text-slate-800">
                  {akunList.filter(a => a.role === 'ADMIN').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pemerintah</p>
                <p className="text-2xl font-bold text-slate-800">
                  {akunList.filter(a => a.role === 'PEMERINTAH').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col items-center justify-between gap-4 p-4 mb-6 bg-white shadow-sm rounded-xl sm:flex-row">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari akun..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="hidden sm:inline">Menampilkan</span>
            <span className="font-medium text-indigo-600">{filteredData.length}</span>
            <span>dari</span>
            <span className="font-medium text-slate-800">{akunList.length}</span>
            <span>akun</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64 bg-white shadow-sm rounded-xl">
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="mt-2 text-sm text-slate-600">Memuat data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="max-w-md p-4 mx-auto text-center rounded-lg bg-red-50">
              <h3 className="text-lg font-medium text-red-800">Gagal memuat data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchAkunList}
                className="mt-3 inline-flex items-center rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedData.length === 0 && (
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="max-w-md p-6 mx-auto text-center rounded-lg bg-slate-50">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-full">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-slate-800">Tidak ada akun ditemukan</h3>
              <p className="mt-1 text-sm text-slate-600">
                {searchTerm ? 'Coba dengan kata kunci lain' : 'Buat akun baru untuk memulai'}
              </p>
              {!searchTerm && (
                <button
                  onClick={openCreateModal}
                  className="mt-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Akun
                </button>
              )}
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && sortedData.length > 0 && (
          <div className="overflow-hidden bg-white shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      #
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase transition cursor-pointer text-slate-500 hover:bg-slate-100"
                      onClick={() => requestSort('name_lengkap')}
                    >
                      <div className="flex items-center">
                        Nama
                        {sortConfig.key === 'name_lengkap' && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 ml-1" /> : 
                            <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      Username
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      Email
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase transition cursor-pointer text-slate-500 hover:bg-slate-100"
                      onClick={() => requestSort('role')}
                    >
                      <div className="flex items-center">
                        Role
                        {sortConfig.key === 'role' && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 ml-1" /> : 
                            <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      Institusi
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right uppercase text-slate-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {sortedData.map((akun, index) => (
                    <React.Fragment key={akun.id_user}>
                      <tr 
                        className={`hover:bg-slate-50 transition ${expandedRows[akun.id_user] ? 'bg-slate-50' : ''}`}
                      >
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                          {index + 1}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm font-medium cursor-pointer whitespace-nowrap text-slate-900"
                          onClick={() => toggleRowExpand(akun.id_user)}
                        >
                          <div className="flex items-center">
                            {expandedRows[akun.id_user] ? (
                              <ChevronUp className="w-4 h-4 mr-2 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 mr-2 text-slate-400" />
                            )}
                            {akun.name_lengkap || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                          {akun.username || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-slate-400" />
                            {akun.email || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeStyle(akun.role)}`}>
                            {akun.role === 'ADMIN' ? (
                              <Shield className="w-3 h-3 mr-1" />
                            ) : (
                              <Building2 className="w-3 h-3 mr-1" />
                            )}
                            {akun.role || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                          {akun.nama_instansi || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div className="flex justify-end space-x-2">
                            <button 
                              className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(akun.id_user);
                              }}
                              title="Edit"
                            >
                              <PencilLine size={16} />
                            </button>
                            <button
                              className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(akun.id_user);
                              }}
                              title="Hapus"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {expandedRows[akun.id_user] && (
                          <motion.tr
                            key={`expanded-${akun.id_user}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-50"
                          >
                            <td colSpan="7" className="px-6 py-4">
                              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                <div className="space-y-2">
                                  <p className="font-medium text-slate-700">Dibuat Pada:</p>
                                  <p className="text-slate-600">
                                    {akun.created_at ? new Date(akun.created_at).toLocaleString('id-ID') : '-'}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p className="font-medium text-slate-700">Terakhir Diperbarui:</p>
                                  <p className="text-slate-600">
                                    {akun.updated_at ? new Date(akun.updated_at).toLocaleString('id-ID') : 'Belum pernah diperbarui'}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p className="font-medium text-slate-700">Status:</p>
                                  <p className="text-slate-600">
                                    {akun.status || 'Aktif'}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Account Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-xl"
                ref={formRef}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">Tambah Akun Baru</h2>
                    <p className="text-sm text-slate-500">Isi form berikut untuk menambahkan akun</p>
                  </div>
                  <button
                    onClick={closeModals}
                    className="p-1 transition rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 mr-2" />
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name_lengkap"
                      value={formData.name_lengkap}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.name_lengkap ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'}`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {formErrors.name_lengkap && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name_lengkap}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 mr-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.username ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'}`}
                      placeholder="Masukkan username"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'}`}
                      placeholder="Masukkan email"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                      <KeyRound className="w-4 h-4 mr-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.password ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'}`}
                      placeholder="Masukkan password"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                        <Shield className="w-4 h-4 mr-2" />
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="PEMERINTAH">Pemerintah</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                        <Building2 className="w-4 h-4 mr-2" />
                        Institusi
                      </label>
                      <select
                        name="nama_instansi"
                        value={formData.nama_instansi}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {INSTANSI_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Simpan Akun
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Account Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-xl"
                ref={formRef}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">Edit Akun</h2>
                    <p className="text-sm text-slate-500">Perbarui informasi akun</p>
                  </div>
                  <button
                    onClick={closeModals}
                    className="p-1 transition rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 mr-2" />
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name_lengkap"
                      value={formData.name_lengkap}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.name_lengkap ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'}`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {formErrors.name_lengkap && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name_lengkap}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 mr-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.username ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'}`}
                      placeholder="Masukkan username"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'}`}
                      placeholder="Masukkan email"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                      <KeyRound className="w-4 h-4 mr-2" />
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.password ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'}`}
                      placeholder="Kosongkan jika tidak ingin mengubah"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                        <Shield className="w-4 h-4 mr-2" />
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="PEMERINTAH">Pemerintah</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center block mb-1 text-sm font-medium text-slate-700">
                        <Building2 className="w-4 h-4 mr-2" />
                        Institusi
                      </label>
                      <select
                        name="nama_instansi"
                        value={formData.nama_instansi}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {INSTANSI_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AkunPage;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, PencilLine, Trash, Loader2, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
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
  

  // Fetch data from API
  const fetchAkunList = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAkunList(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch data:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load data',
        text: err.response?.data?.message || err.message,
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

  const openEditModal = (id) => {
    const akunToEdit = akunList.find(akun => akun.id === id);
    if (akunToEdit) {
      setCurrentEditId(id);
      setFormData({
        name_lengkap: akunToEdit.name_lengkap || '',
        username: akunToEdit.username || '',
        email: akunToEdit.email || '',
        password: '',
        role: akunToEdit.role || '',
        nama_instansi: akunToEdit.nama_instansi || ''
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
    
    if (!formData.name_lengkap) errors.name_lengkap = 'Full name is required';
    if (!formData.username) errors.username = 'Username is required';
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!isEditModalOpen && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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

    // Tambahkan password hanya jika ada
    if (formData.password) {
      payload.password = formData.password;
    }

   

    let response;
    if (isEditModalOpen && currentEditId) { // Pastikan currentEditId ada
      response = await axios.put(
        `http://localhost:3000/api/users/${currentEditId}`, 
        payload,
        
      );
    } else {
      response = await axios.post(
        'http://localhost:3000/api/users',
        payload,
        
      );
    }

    // Handle success
    closeModals();
    fetchAkunList();
    
  } catch (error) {
    console.error('Error details:', error);
    let errorMessage = error.response?.data?.message || error.message;
    
    if (error.response?.status === 401) {
      errorMessage = "Unauthorized - Please login again";
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: errorMessage,
      background: '#f8fafc',
    });
  }
};
  // Delete account
  const handleDelete = async (id) => {
  // Validasi ID
  if (!id) {
    console.error('Invalid ID for deletion');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Invalid account ID',
    });
    return;
  }

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
      // Gunakan endpoint yang sama dengan notifikasi (dengan query parameter)
      await axios.delete(`http://localhost:3000/api/users/${id}?user_id=2`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update state seperti di notifikasi
      setAkunList(prev => prev.filter(akun => akun.id !== id));

      // Notifikasi sukses seperti di komponen Notifikasi
      Swal.fire({
        title: 'Berhasil dihapus!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top'
      });
    } catch (error) {
      console.error('Delete error:', error);
      
      // Error handling seperti di notifikasi
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
        confirmButtonText: 'Tutup'
      });
    }
  }
};

  // Search and filter
  const filteredData = akunList.filter(akun => {
    const searchLower = searchTerm.toLowerCase();
    return (
      akun.name_lengkap?.toLowerCase().includes(searchLower) ||
      akun.username?.toLowerCase().includes(searchLower) ||
      akun.email?.toLowerCase().includes(searchLower) ||
      akun.role?.toLowerCase().includes(searchLower) ||
      akun.nama_instansi?.toLowerCase().includes(searchLower)
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
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Manajemen Akun Admin dan Pemerintah</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus size={18} />
            Tambah Akun
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-md sm:flex-row">
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="cari akun..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
          <div className="text-sm text-slate-600">
            Menampilkan {filteredData.length} dari {akunList.length} akun
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-md">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mx-auto max-w-md rounded-lg bg-red-50 p-4 text-center">
              <h3 className="text-lg font-medium text-red-800">Failed to load data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchAkunList}
                className="mt-3 inline-flex items-center rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedData.length === 0 && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mx-auto max-w-md rounded-lg bg-slate-50 p-6 text-center">
              <h3 className="text-lg font-medium text-slate-800">No accounts found</h3>
              <p className="mt-1 text-sm text-slate-600">
                {searchTerm ? 'Try a different search term' : 'Create a new account to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={openCreateModal}
                  className="mt-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Tambah Akun
                </button>
              )}
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && sortedData.length > 0 && (
          <div className="overflow-x-auto rounded-xl bg-white shadow-md">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    #
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => requestSort('name_lengkap')}
                  >
                    <div className="flex items-center">
                      Nama Pimpinan
                      {sortConfig.key === 'name_lengkap' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Email
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => requestSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      {sortConfig.key === 'role' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => requestSort('nama_instansi')}
                  >
                    <div className="flex items-center">
                      Institusi
                      {sortConfig.key === 'nama_instansi' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {sortedData.map((akun, index) => (
                  <React.Fragment key={akun.id}>
                    <tr 
                      className={`hover:bg-slate-50 ${expandedRows[akun.id] ? 'bg-slate-50' : ''}`}
                      onClick={() => toggleRowExpand(akun.id)}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {akun.name_lengkap || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {akun.username || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {akun.email || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          akun.role === 'ADMIN' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {akun.role || '-'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {akun.nama_instansi || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        <div className="flex space-x-2">
                          <button 
                            className="rounded p-1 text-indigo-600 hover:bg-indigo-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(akun.id);
                            }}
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            className="rounded p-1 text-red-600 hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(akun.id);
                            }}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRows[akun.id] && (
                        <motion.tr
                          key={`expanded-${akun.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-slate-50"
                        >
                          <td colSpan="7" className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-slate-700">Created At:</p>
                                <p className="text-slate-600">
                                  {akun.created_at ? new Date(akun.created_at).toLocaleString() : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">Last Updated:</p>
                                <p className="text-slate-600">
                                  {akun.updated_at ? new Date(akun.updated_at).toLocaleString() : 'Never updated'}
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
        )}

        {/* Create Account Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <motion.div

              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                ref={formRef}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">Menambah Data Akun</h2>
                  <button
                    onClick={closeModals}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Nama Pimpinan
                    </label>
                    <input
                      type="text"
                      name="name_lengkap"
                      value={formData.name_lengkap}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.name_lengkap ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                      placeholder="Masukkan nama pimpinan"
                    />
                    {formErrors.name_lengkap && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name_lengkap}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.username ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                      placeholder="Enter username"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                      placeholder="Enter email"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.password ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                      placeholder="Enter password"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="PEMERINTAH">Pemerintah</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Institusi
                      </label>
                      <select
                        name="nama_instansi"
                        value={formData.nama_instansi}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
                      >
                        <option value="KOMINFO">Kominfo</option>
                        <option value="DISHUB">Dishub</option>
                        <option value="DLH">DLH</option>
                        <option value="SATPOL_PP">Satpol PP</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                ref={formRef}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">Mengubah Data Akun</h2>
                  <button
                    onClick={closeModals}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Nama Pimpinan
                    </label>
                    <input
                      type="text"
                      name="name_lengkap"
                      value={formData.name_lengkap}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.name_lengkap ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                      placeholder="Masukkan nama pimpinan"
                    />
                    {formErrors.name_lengkap && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name_lengkap}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.username ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                      placeholder="Enter username"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                      placeholder="Enter email"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-2.5 text-sm ${formErrors.password ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                      placeholder="Enter new password"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="PEMERINTAH">Pemerintah</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Institusi
                      </label>
                      <select
                        name="nama_instansi"
                        value={formData.nama_instansi}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
                      >
                        <option value="KOMINFO">Kominfo</option>
                        <option value="DISHUB">Dishub</option>
                        <option value="DLH">DLH</option>
                        <option value="SATPOL_PP">Satpol PP</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
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
                      Ubah Akun
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
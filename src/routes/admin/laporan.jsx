import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "js-cookie";
import axios from "axios";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  X, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  FileText,
  File
} from "lucide-react";

const MySwal = withReactContent(Swal);

const LaporanPage = () => {
  const [laporanList, setLaporanList] = useState([]);
  const [filter, setFilter] = useState({ 
    created_at: "", 
    status_pengerjaan: "", 
    kategori: "" 
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminList, setAdminList] = useState([]);
  const [formData, setFormData] = useState({
    judul_laporan: "",
    deskripsi: "",
    kategori: "",
    status_pengerjaan: "DITERIMA",
    created_at: "",
    estimasi: 0,
    filePdf: "",
    id_user: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = Cookies.get("authToken");

  const handleOpenFile = (fileData) => {
    if (fileData && fileData.data) {
      window.open(fileData.data, "_blank");
    } else {
      Swal.fire({
        icon: "info",
        title: "Tidak Ada File",
        text: "File laporan belum tersedia.",
        background: "#f8fafc",
      });
    }
  };

  const fetchAdminList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const admins = response.data.data.filter(user => 
        user.role.toUpperCase() === 'ADMIN'
      );
      setAdminList(admins);
    } catch (error) {
      console.error("Error fetching admin list:", error);
    }
  };

  const fetchLaporan = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/laporan/getAllLaporan`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          status_pengerjaan: filter.status_pengerjaan,
          kategori: filter.kategori
        }
      });
      setLaporanList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal memuat data",
        text: error.response?.data?.message || "Terjadi kesalahan saat memuat data",
        background: "#f8fafc",
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
    fetchAdminList();
  }, [filter.status_pengerjaan, filter.kategori]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          filePdf: {
            name: file.name,
            data: reader.result
          }
        }));
        setShowPreview(false);
      };
      reader.readAsDataURL(file);
    } else {
      MySwal.fire({
        icon: "error",
        title: "Format file tidak valid",
        text: "Mohon unggah file PDF saja",
        timer: 2000,
        showConfirmButton: false,
        background: "#f8fafc"
      });
    }
  };

  const handleSimpan = async () => {
    const { judul_laporan, deskripsi, kategori, status_pengerjaan, created_at, estimasi, filePdf } = formData;

    // Jangan validasi id_user
    if (!judul_laporan || !deskripsi || !kategori || !created_at) {
      MySwal.fire({
        icon: "error",
        title: "Data tidak lengkap",
        text: "Semua field wajib diisi kecuali file PDF dan estimasi!",
        timer: 3000,
        showConfirmButton: false,
        position: "top",
        toast: true,
        background: "#f8fafc"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        judul_laporan,
        deskripsi,
        kategori,
        status_pengerjaan,
        created_at,
      };
      if (estimasi) payload.estimasi = estimasi;
      if (filePdf) payload.filePdf = filePdf;

      console.log('Payload:', payload); // Debug

      // Hapus token dari headers
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      let response;
      if (isEditing) {
        response = await axios.put(
          `http://localhost:3000/api/laporan/updateLaporan/${selectedLaporan.id}`,
          payload,
          config
        );
      } else {
        response = await axios.post(
          `http://localhost:3000/api/laporan/createLaporan`,
          payload,
          config
        );
      }

      await MySwal.fire({
        icon: "success",
        title: isEditing ? "Berhasil diperbarui" : "Berhasil dibuat",
        text: `Laporan ${isEditing ? "berhasil diperbarui" : "berhasil dibuat"}`,
        timer: 2000,
        showConfirmButton: false,
        background: "#f8fafc"
      });

      resetForm();
      fetchLaporan();
    } catch (error) {
      console.error("Error menyimpan laporan:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan laporan",
        timer: 3000,
        showConfirmButton: false,
        background: "#f8fafc"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      judul_laporan: "",
      deskripsi: "",
      kategori: "",
      status_pengerjaan: "DITERIMA",
      created_at: "",
      estimasi: 0,
      filePdf: null,
      id_user: ""
    });
    setShowForm(false);
    setIsEditing(false);
    setSelectedLaporan(null);
    setShowPreview(false);
  };

  const handleEdit = (laporan) => {
    setIsEditing(true);
    setSelectedLaporan(laporan);
    setFormData({
      judul_laporan: laporan.judul_laporan,
      deskripsi: laporan.deskripsi,
      kategori: laporan.kategori,
      status_pengerjaan: laporan.status_pengerjaan,
      created_at: laporan.created_at.split('T')[0],
      estimasi: laporan.estimasi || 0,
      filePdf: laporan.filePdf || null,
      id_user: laporan.id_user || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Hapus laporan?",
      text: "Anda tidak dapat mengembalikan data yang sudah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: "#f8fafc"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/laporan/deleteLaporan/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLaporanList(prev => prev.filter(laporan => laporan.id !== id));
        MySwal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Laporan berhasil dihapus",
          timer: 2000,
          showConfirmButton: false,
          background: "#f8fafc"
        });
      } catch (error) {
        console.error("Error deleting:", error);
        MySwal.fire({
          icon: "error",
          title: "Gagal",
          text: error.response?.data?.message || "Gagal menghapus laporan",
          timer: 3000,
          showConfirmButton: false,
          background: "#f8fafc"
        });
      }
    }
  };

  const handleDetail = (laporan) => {
    MySwal.fire({
      title: laporan.judul_laporan,
      html: `
        <div class="text-left space-y-2">
          <p><strong>Deskripsi:</strong> ${laporan.deskripsi}</p>
          <p><strong>Jenis:</strong> ${laporan.kategori}</p>
          <p><strong>Status:</strong> <span class="capitalize">${laporan.status_pengerjaan.toLowerCase()}</span></p>
          <p><strong>Tanggal:</strong> ${new Date(laporan.created_at).toLocaleDateString("id-ID")}</p>
          ${laporan.filePdf ? `<p><strong>File:</strong> ${laporan.filePdf.name}</p>` : ''}
        </div>
      `,
      background: "#f8fafc",
      showConfirmButton: true,
      confirmButtonColor: "#3b82f6"
    });
  };

  const handleStatusChange = async (e, laporanId) => {
    const newStatus = e.target.value;
    
    try {
      setIsLoading(true);
      await axios.patch(
        `http://localhost:3000/api/laporan/updateStatusLaporan/${laporanId}`,
        { status_pengerjaan: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update the local state optimistically
      setLaporanList(prev => 
        prev.map(lap => 
          lap.id === laporanId ? { ...lap, status_pengerjaan: newStatus } : lap
        )
      );
      
      MySwal.fire({
        icon: "success",
        title: "Status Diperbarui",
        text: "Status laporan berhasil diubah",
        timer: 2000,
        showConfirmButton: false,
        background: "#f8fafc"
      });
    } catch (error) {
      console.error("Error updating status:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengupdate status",
        timer: 3000,
        showConfirmButton: false,
        background: "#f8fafc"
      });
      
      // Revert the change if the request fails
      setLaporanList(prev => 
        prev.map(lap => 
          lap.id === laporanId ? { ...lap, status_pengerjaan: laporanList.find(l => l.id === laporanId).status_pengerjaan } : lap
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id, format) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/laporan/downloadLaporan/${id}/${format}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan_${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengunduh laporan",
        timer: 3000,
        showConfirmButton: false,
        background: "#f8fafc"
      });
    }
  };

  const getStatusColor = (status_pengerjaan) => {
    switch (status_pengerjaan) {
      case "DITERIMA":
        return "bg-blue-100 text-blue-800";
      case "DALAM PENGERJAAN":
        return "bg-yellow-100 text-yellow-800";
      case "SELESAI":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatKategori = (kategori) => {
    return kategori === "KERAMAIAN" ? "Keramaian" : 
           kategori === "TUMPUKAN_SAMPAH" ? "Tumpukan Sampah" : 
           kategori;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-4 bg-slate-50 md:p-6"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Fitur Manajemen Laporan</h1>
            <p className="text-slate-600">Daftar Pelaporan Tumpukan Sampah dan Keramaian</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setFormData({
                judul_laporan: "",
                deskripsi: "",
                kategori: "",
                status_pengerjaan: "DITERIMA",
                created_at: new Date().toISOString().split('T')[0],
                estimasi: 0,
                filePdf: null,
                id_user: ""
              });
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
          >
            <Plus size={18} />
            Buat Laporan
          </motion.button>
        </div>

        {/* Filter Section */}
        <motion.div 
          className="p-4 mb-6 bg-white rounded-lg shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-slate-700"
          >
            <Filter size={18} />
            <span>Filter Laporan</span>
            {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid gap-4 mt-4 md:grid-cols-3"
              >
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">Tanggal</label>
                  <input
                    type="date"
                    name="created_at"
                    value={filter.created_at}
                    onChange={handleFilterChange}
                    className="w-full p-2 text-sm border rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">Status</label>
                  <select
                    name="status_pengerjaan"
                    value={filter.status_pengerjaan}
                    onChange={handleFilterChange}
                    className="w-full p-2 text-sm border rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Semua Status</option>
                    <option value="DITERIMA">Diterima</option>
                    <option value="DALAM PENGERJAAN">Dalam Pengerjaan</option>
                    <option value="SELESAI">Selesai</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">Jenis</label>
                  <select
                    name="kategori"
                    value={filter.kategori}
                    onChange={handleFilterChange}
                    className="w-full p-2 text-sm border rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Semua Jenis</option>
                    <option value="KERAMAIAN">Keramaian</option>
                    <option value="TUMPUKAN_SAMPAH">Tumpukan Sampah</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : laporanList.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-slate-400" />
              <h3 className="mt-2 text-lg font-medium text-slate-800">
                {filter.created_at || filter.status_pengerjaan || filter.kategori 
                  ? "Laporan tidak ditemukan" 
                  : "Belum ada laporan"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {filter.created_at || filter.status_pengerjaan || filter.kategori
                  ? "Coba ubah filter pencarian Anda" 
                  : "Buat laporan baru untuk memulai"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">No</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">Judul</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">Deskripsi</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">Jenis</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">Status</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">Tanggal</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">Estimasi</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">File</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {laporanList.map((laporan, index) => (
                    <tr key={laporan.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                        {laporan.judul_laporan}
                      </td>
                      <td className="max-w-xs px-6 py-4 text-sm truncate text-slate-500">
                        {laporan.deskripsi || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                        {formatKategori(laporan.kategori)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <select
                          value={laporan.status_pengerjaan}
                          onChange={(e) => handleStatusChange(e, laporan.id)}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(laporan.status_pengerjaan)}`}
                        >
                          <option value="DITERIMA">Diterima</option>
                          <option value="DALAM PENGERJAAN">Dalam Pengerjaan</option>
                          <option value="SELESAI">Selesai</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                        {new Date(laporan.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                        {laporan.estimasi ? `${laporan.estimasi} hari` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenFile(laporan.filePdf)}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                            title={laporan.filePdf ? "Lihat File" : "Tidak ada file"}
                          >
                            {laporan.filePdf ? (
                              <>
                                <FileText className="w-5 h-5 mr-1" />
                                <span>Lihat</span>
                              </>
                            ) : (
                              <>
                                <FileText className="w-5 h-5 mr-1 text-gray-400" />
                                <span className="text-gray-500"></span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDownload(laporan.id, 'pdf')}
                            className="inline-flex items-center text-green-600 hover:text-green-900"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDetail(laporan)}
                            className="p-1 rounded text-slate-600 hover:bg-slate-100"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(laporan)}
                            className="p-1 text-indigo-600 rounded hover:bg-indigo-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(laporan.id)}
                            className="p-1 text-red-600 rounded hover:bg-red-100"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={resetForm}
              />
              
              <motion.div
                className="relative w-full max-w-2xl mx-auto my-8 bg-white shadow-xl rounded-xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
              >
                <div className="sticky top-0 z-10 p-6 bg-white border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {isEditing ? "Edit Laporan" : "Buat Laporan Baru"}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="max-h-[80vh] overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Judul Laporan */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-slate-700">
                        Judul Laporan
                      </label>
                      <input
                        type="text"
                        name="judul_laporan"
                        value={formData.judul_laporan}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Deskripsi */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-slate-700">
                        Deskripsi
                      </label>
                      <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Jenis dan Status */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">
                          Jenis Laporan
                        </label>
                        <select
                          name="kategori"
                          value={formData.kategori}
                          onChange={handleFormChange}
                          className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        >
                          <option value="">Pilih Jenis</option>
                          <option value="KERAMAIAN">Keramaian</option>
                          <option value="TUMPUKAN_SAMPAH">Tumpukan Sampah</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">
                          Status
                        </label>
                        <select
                          name="status_pengerjaan"
                          value={formData.status_pengerjaan}
                          onChange={handleFormChange}
                          className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        >
                          <option value="DITERIMA">Diterima</option>
                          <option value="DALAM PENGERJAAN">Dalam Pengerjaan</option>
                          <option value="SELESAI">Selesai</option>
                        </select>
                      </div>
                    </div>

                    {/* Tanggal dan Estimasi */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          name="created_at"
                          value={formData.created_at}
                          onChange={handleFormChange}
                          className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">
                          Estimasi (hari)
                        </label>
                        <input
                          type="number"
                          name="estimasi"
                          value={formData.estimasi}
                          onChange={handleFormChange}
                          min="0"
                          className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* File PDF */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-slate-700">
                        File PDF (Opsional)
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full p-2 text-sm border rounded-lg border-slate-300 file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {formData.filePdf && (
                        <div className="flex items-center justify-between p-2 mt-2 rounded-lg bg-slate-50">
                          <span className="flex items-center text-sm text-slate-700">
                            <File className="w-4 h-4 mr-2" />
                            {formData.filePdf.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            {showPreview ? "Sembunyikan" : "Lihat"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* PDF Preview */}
                    {showPreview && formData.filePdf && (
                      <div className="mt-4 border rounded-lg border-slate-200">
                        <iframe
                          src={formData.filePdf.data}
                          className="w-full h-96"
                          title="PDF Preview"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-sm font-medium border rounded-lg shadow-sm border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSimpan}
                      disabled={isSubmitting}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : isEditing ? (
                        "Update Laporan"
                      ) : (
                        "Simpan Laporan"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LaporanPage;

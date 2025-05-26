import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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
  CheckCircle,
  AlertCircle,
  FileText
} from "lucide-react";

const MySwal = withReactContent(Swal);

const LaporanPage = () => {
  const [laporanList, setLaporanList] = useState([]);
  const [filter, setFilter] = useState({ 
    created_at: "", 
    status: "", 
    kategori: "" 
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    judul_laporan: "",
    deskripsi: "",
    kategori: "",
    status: "",
    created_at: "",
    estimasi: 0,
    filePdf: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  // Fetch data
  const fetchLaporan = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/laporan/getAllLaporan`);
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
  }, []);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredLaporan = laporanList.filter((laporan) => {
    return (
      (!filter.created_at || laporan.created_at.includes(filter.created_at)) &&
      (!filter.status || laporan.status === filter.status) &&
      (!filter.kategori || laporan.kategori === filter.kategori)
    );
  });

  useEffect(() => {
    if ((filter.created_at || filter.status || filter.kategori) && filteredLaporan.length === 0) {
      MySwal.fire({
        icon: "info",
        title: "Laporan tidak ditemukan",
        toast: true,
        position: "top",
        timer: 2500,
        showConfirmButton: false,
        background: "#f8fafc"
      });
    }
  }, [filteredLaporan, filter]);

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
    const { judul_laporan, deskripsi, kategori, status, created_at } = formData;

    if (!judul_laporan || !deskripsi || !kategori || !status || !created_at) {
      MySwal.fire({
        icon: "error",
        title: "Data tidak lengkap",
        text: "Semua field wajib diisi!",
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
        judul_laporan: formData.judul_laporan,
        deskripsi: formData.deskripsi,
        kategori: formData.kategori,
        status: formData.status,
        created_at: formData.created_at,
        estimasi: formData.estimasi, // Tambahkan ini
        filePdf: formData.filePdf
      };

      let response;
      if (isEditing) {
        response = await axios.put(
          `http://localhost:3000/api/laporan/updateLaporan/${selectedLaporan.id}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        response = await axios.post(
          `http://localhost:3000/api/laporan/createLaporan`,
          payload,
          { headers: { "Content-Type": "application/json" } }
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
      status: "",
      created_at: "",
      estimasi: 0, 
      filePdf: null
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
      status: laporan.status,
      created_at: laporan.created_at,
      estimasi: laporan.estimasi || 0, 
      filePdf: laporan.filePdf || null
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
        await axios.delete(`http://localhost:3000/api/laporan/deleteLaporan/${id}`);
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
          <p><strong>Isi:</strong> ${laporan.deskripsi}</p>
          <p><strong>Jenis:</strong> ${laporan.kategori}</p>
          <p><strong>Status:</strong> <span class="capitalize">${laporan.status}</span></p>
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
      await axios.patch(`${BASEURL}${API}laporan/updateStatus/${laporanId}`, {
        status: newStatus
      });
      setLaporanList(prev => 
        prev.map(lap => 
          lap.id === laporanId ? { ...lap, status: newStatus } : lap
        )
      );
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
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "diterima":
        return "bg-blue-100 text-blue-800";
      case "dalam pengerjaan":
        return "bg-yellow-100 text-yellow-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-50 p-4 md:p-6"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Manajemen Laporan</h1>
            <p className="text-slate-600">Kelola laporan dengan mudah</p>
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
                status: "",
                created_at: "",
                estimasi: "",
                filePdf: null
              });
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Buat Laporan
          </motion.button>
        </div>

        {/* Filter Section */}
        <motion.div 
          className="mb-6 rounded-lg bg-white p-4 shadow-sm"
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
                className="mt-4 grid gap-4 md:grid-cols-3"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Tanggal</label>
                  <input
                    type="date"
                    name="created_at"
                    value={filter.created_at}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    name="status"
                    value={filter.status}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Semua Status</option>
                    <option value="diterima">Diterima</option>
                    <option value="dalam pengerjaan">Dalam Pengerjaan</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Jenis</label>
                  <select
                    name="kategori"
                    value={filter.kategori}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Semua Jenis</option>
                    <option value="keramaian">Keramaian</option>
                    <option value="tumpukan sampah">Tumpukan Sampah</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Data Table */}
        <motion.div
          className="rounded-lg bg-white shadow-sm"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredLaporan.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-lg font-medium text-slate-800">
                {filter.created_at || filter.status || filter.kategori 
                  ? "Laporan tidak ditemukan" 
                  : "Belum ada laporan"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {filter.created_at || filter.status || filter.kategori
                  ? "Coba ubah filter pencarian Anda" 
                  : "Buat laporan baru untuk memulai"}
              </p>
              {!(filter.created_at || filter.status || filter.kategori) && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Buat Laporan
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Estimasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredLaporan.map((laporan, index) => (
                    <motion.tr
                      key={laporan.id}
                      variants={itemVariants}
                      className="hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                        {laporan.judul_laporan}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs overflow-hidden text-ellipsis">
  {laporan.deskripsi || '-'}
</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-slate-500">
                        {laporan.kategori}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <select
                          value={laporan.status}
                          onChange={(e) => handleStatusChange(e, laporan.id)}
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(laporan.status)}`}
                        >
                          <option value="diterima">Diterima</option>
                          <option value="dalam pengerjaan">Dalam Pengerjaan</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {new Date(laporan.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
  {laporan.estimasi ? `${laporan.estimasi} hari` : '-'}
</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {laporan.filePdf ? (
                          <a
                            href={laporan.filePdf.data}
                            download={laporan.filePdf.name}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                          >
                            <Download className="mr-1 h-4 w-4" />
                            {laporan.filePdf.name}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDetail(laporan)}
                            className="rounded p-1 text-slate-600 hover:bg-slate-100"
                            title="Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(laporan)}
                            className="rounded p-1 text-indigo-600 hover:bg-indigo-100"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(laporan.id)}
                            className="rounded p-1 text-red-600 hover:bg-red-100"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Form Modal */}
      {/* Form Modal */}
<AnimatePresence>
  {showForm && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl rounded-xl bg-white shadow-xl"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              {isEditing ? "Edit Laporan" : "Buat Laporan Baru"}
            </h2>
            <button
              onClick={resetForm}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Judul Laporan
              </label>
              <input
                type="text"
                name="judul_laporan"
                value={formData.judul_laporan}
                onChange={handleFormChange}
                placeholder="Masukkan judul laporan"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Isi Laporan
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleFormChange}
                rows={4}
                placeholder="Tulis isi laporan secara detail"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Jenis Laporan
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Pilih Kategori Laporan</option>
                  <option value="keramaian">Keramaian</option>
                  <option value="tumpukan sampah">Tumpukan Sampah</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Pilih Status</option>
                  <option value="diterima">Diterima</option>
                  <option value="dalam pengerjaan">Dalam Pengerjaan</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="created_at"
                  value={formData.created_at}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Estimasi Penyelesaian
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

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                File PDF (Opsional)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
              />
              {formData.filePdf && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 p-2">
                  <span className="truncate text-sm text-slate-700">
                    {formData.filePdf.name}
                  </span>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="ml-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    {showPreview ? "Sembunyikan" : "Lihat"}
                  </button>
                </div>
              )}
            </div>

            {showPreview && formData.filePdf && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden rounded-lg border border-slate-200"
              >
                <iframe
                  src={formData.filePdf.data}
                  title="PDF Preview"
                  className="h-96 w-full"
                />
              </motion.div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Batal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSimpan}
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : isEditing ? (
                  "Update Laporan"
                ) : (
                  "Simpan Laporan"
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.div>
  );
};

export default LaporanPage;
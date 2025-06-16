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
  ChevronDown, 
  ChevronUp,
  Loader2,
  FileText,
  Filter,
  MapPin,
  User,
  Camera,
  Calendar
} from "lucide-react";

const MySwal = withReactContent(Swal);

const PengaduanPage = () => {
  const [pengaduanList, setPengaduanList] = useState([]);
  const [filter, setFilter] = useState({ 
      created_at: "", 
      kategori: "" 
    });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    nama_pelapor: "",
    lokasi_kejadian: "",
    jenis_pengaduan: "",
    deskripsi_pengaduan: "",
    created_at: new Date().toISOString().slice(0, 10),
    foto: null
  });
  const [isEditing, setIsEditing] = useState(false);  
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useGPS, setUseGPS] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

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
  const fetchPengaduan = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/pengaduan/getAll`);
      setPengaduanList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal memuat data",
        text: error.response?.data?.message || "Terjadi kesalahan saat memuat data",
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const handleFilterChange = (e) => {
      setFilter({ ...filter, [e.target.name]: e.target.value });
    };
  
    const filteredPengaduan = pengaduanList.filter((pengaduan) => {
      return (
        (!filter.created_at || pengaduan.created_at.includes(filter.created_at)) &&
        (!filter.kategori || pengaduan.kategori === filter.kategori)
      );
    });
  
    useEffect(() => {
      if ((filter.created_at || filter.kategori) && filteredPengaduan.length === 0) {
        MySwal.fire({
          icon: "info",
          title: "Pengaduan tidak ditemukan",
          toast: true,
          position: "top",
          timer: 2500,
          showConfirmButton: false,
          background: "#f8fafc"
        });
      }
    }, [filteredPengaduan, filter]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          foto: {
            name: file.name,
            data: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      MySwal.fire({
        icon: "error",
        title: "Format file tidak valid",
        text: "Mohon unggah file gambar (JPG, PNG)",
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleSimpan = async () => {
      const { nama_pelapor, lokasi_kejadian, jenis_pengaduan, deskripsi_pengaduan, foto,created_at } = formData;
  
      if (!nama_pelapor || !lokasi_kejadian || !jenis_pengaduan || !deskripsi_pengaduan   || !foto  ||!status || !created_at) {
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
          deskripsi_pengaduan: formData.deskripsi_pengaduan,
          kategori: formData.kategori,
          status: formData.status,
          created_at: formData.created_at,
          estimasi: formData.estimasi, // Tambahkan ini
          filePdf: formData.filePdf
        };
  
        let response;
        if (isEditing) {
          response = await axios.put(
            `http://localhost:3000/api/laporan/updatePengaduan/${selectedLaporan.id}`,
            payload,
            { headers: { "Content-Type": "application/json" } }
          );
        } else {
          response = await axios.post(
            `http://localhost:3000/api/pengaduan/createPengaduan`,
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
        deskripsi_pengaduan: "",
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

  const getCurrentLocation = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lokasi_kejadian: `${position.coords.latitude}, ${position.coords.longitude}`
          }));
          setGpsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          MySwal.fire({
            icon: "error",
            title: "Gagal mendapatkan lokasi",
            text: "Pastikan izin lokasi telah diberikan",
            timer: 3000
          });
          setGpsLoading(false);
        }
      );
    } else {
      MySwal.fire({
        icon: "error",
        title: "Browser tidak mendukung GPS",
        text: "Silakan masukkan lokasi manual",
        timer: 3000
      });
      setGpsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const { nama_pelapor, lokasi_kejadian, jenis_pengaduan, deskripsi_pengaduan } = formData;

    if (!nama_pelapor || !lokasi_kejadian || !jenis_pengaduan || !deskripsi_pengaduan) {
      MySwal.fire({
        icon: "error",
        title: "Data tidak lengkap",
        text: "Harap isi semua field wajib",
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        // Jika foto tidak diupload, hapus field foto dari payload
        ...(formData.foto ? { foto: formData.foto } : {})
      };

      const response = await axios.post(
        `http://localhost:3000/api/pengaduan/createPengaduan`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      await MySwal.fire({
        icon: "success",
        title: "Pengaduan Tersimpan",
        text: "Terima kasih telah melaporkan pengaduan",
        timer: 2000,
        showConfirmButton: false
      });

      setFormData({
        nama_pelapor: "",
        lokasi_kejadian: "",
        jenis_pengaduan: "",
        deskripsi_pengaduan: "",
        created_at: new Date().toISOString().slice(0, 10),
        foto: null
      });
      setShowForm(false);
      fetchPengaduan();
    } catch (error) {
      console.error("Error submitting pengaduan:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan saat mengirim pengaduan",
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="mx-auto max-w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Fitur Layanan Pengaduan </h1>
            <p className="text-gray-600">Daftar Pengaduan Tumpukan Sampah dan Keramaian Masyarakat</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Buat Pengaduan
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
                    <span>Filter Pengaduan</span>
                    {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 grid gap-4 md:grid-cols-2"
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
                          <label className="mb-1 block text-sm font-medium text-slate-700">Jenis</label>
                          <select
                            name="kategori"
                            value={filter.kategori}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
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

        {/* Pengaduan Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={resetForm}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className="relative mx-auto my-8 w-full max-w-md rounded-xl bg-white shadow-xl"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", damping: 25 }}
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 border-b bg-white p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Formulir Pengaduan
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Scrollable Form Content */}
                <div className="max-h-[70vh] overflow-y-auto p-4">
                  <div className="space-y-3">
                    {/* Nama Pelapor */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Nama Pelapor <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="nama_pelapor"
                          value={formData.nama_pelapor}
                          onChange={handleFormChange}
                          placeholder="Nama lengkap Anda"
                          className="block w-full rounded-lg border border-gray-300 p-2 pl-9 text-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Lokasi Kejadian */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Lokasi Kejadian <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="lokasi_kejadian"
                            value={formData.lokasi_kejadian}
                            onChange={handleFormChange}
                            placeholder="Alamat atau titik koordinat"
                            className="block w-full rounded-lg border border-gray-300 p-2 pl-9 text-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            disabled={useGPS}
                          />
                        </div>
                        {/* <button
                          type="button"
                          onClick={() => {
                            setUseGPS(!useGPS);
                            if (!useGPS) {
                              getCurrentLocation();
                            } else {
                              setFormData(prev => ({ ...prev, lokasi_kejadian: "" }));
                            }
                          }}
                          className="flex items-center justify-center rounded-lg bg-gray-100 px-3 text-xs font-medium text-gray-700 hover:bg-gray-200"
                        >
                          {gpsLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <MapPin className="mr-1 h-3 w-3" />
                              {useGPS ? "Manual" : "GPS"}
                            </>
                          )}
                        </button> */}
                      </div>
                      {useGPS && formData.lokasi_kejadian && (
                        <p className="mt-1 text-xs text-gray-500">
                          Lokasi GPS: {formData.lokasi_kejadian}
                        </p>
                      )}
                    </div>

                    {/* Jenis Pengaduan */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Jenis Pengaduan <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="jenis_pengaduan"
                        value={formData.jenis_pengaduan}
                        onChange={handleFormChange}
                        className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="">Pilih Jenis Pengaduan</option>
                        <option value="KERAMAIAN">Keramaian</option>
                        <option value="TUMPUKAN_SAMPAH">Tumpukan Sampah</option>
                      </select>
                    </div>

                    {/* Deskripsi */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Deskripsi Pengaduan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="deskripsi_pengaduan"
                        value={formData.deskripsi_pengaduan}
                        onChange={handleFormChange}
                        rows={3}
                        placeholder="Jelaskan kejadian secara singkat dan jelas"
                        className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      ></textarea>
                    </div>

                    {/* Tanggal Kejadian */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tanggal Kejadian
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="created_at"
                          value={formData.created_at}
                          onChange={handleFormChange}
                          className="block w-full rounded-lg border border-gray-300 p-2 pl-9 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Upload Foto */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Upload Bukti Foto
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex cursor-pointer items-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100">
                          <Camera className="mr-1.5 h-3.5 w-3.5" />
                          Pilih File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            capture="environment"
                          />
                        </label>
                        {formData.foto && (
                          <span className="text-xs text-gray-600">
                            {formData.foto.name}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Unggah foto bukti kejadian (maks. 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer with Submit Button */}
                <div className="sticky bottom-0 border-t bg-white p-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Pengaduan"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daftar Pengaduan */}
        <div className="rounded-lg bg-white shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : pengaduanList.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-800">
                Belum ada pengaduan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Silakan buat pengaduan baru untuk memulai
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Nama Pelapor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {pengaduanList.map((pengaduan, index) => (
                    <tr key={pengaduan.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {pengaduan.nama_pelapor}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          pengaduan.jenis_pengaduan === 'KERAMAIAN' 
                            ? 'bg-green-100 text-green-800'
                            : pengaduan.jenis_pengaduan === 'TUMPUKAN_SAMPAH'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {pengaduan.jenis_pengaduan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {pengaduan.deskripsi_pengaduan || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {pengaduan.lokasi_kejadian}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(pengaduan.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => {
                            MySwal.fire({
                              title: `Pengaduan dari ${pengaduan.nama_pelapor}`,
                              html: `
                                <div class="text-left space-y-2">
                                  <p><strong>Jenis:</strong> ${pengaduan.jenis_pengaduan}</p>
                                  <p><strong>Lokasi:</strong> ${pengaduan.lokasi_kejadian}</p>
                                  <p><strong>Tanggal:</strong> ${new Date(pengaduan.created_at).toLocaleDateString('id-ID')}</p>
                                  <p><strong>Deskripsi:</strong> ${pengaduan.deskripsi_pengaduan}</p>
                                  ${pengaduan.foto ? `<img src="${pengaduan.foto.data}" alt="Bukti Foto" class="mt-2 rounded-lg border border-gray-200" />` : ''}
                                </div>
                              `,
                              showConfirmButton: true,
                              confirmButtonColor: "#3b82f6"
                            });
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PengaduanPage;
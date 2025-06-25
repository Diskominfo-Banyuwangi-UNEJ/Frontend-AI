import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";
import { Footer } from "@/layouts/footer";
import * as XLSX from "xlsx";
import { Activity,Clock,Bed,TrendingUp,Video, CheckCircle2, AlertTriangle, Download, Plus, X, Users, User, PencilLine, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Select } from "antd";
import Hls from "hls.js";

const { Option } = Select;

// Custom marker icon menggunakan SVG Lucide Video (ikon CCTV)
const createCustomMarker = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: #2563eb22;
        border-radius: 50%;
        box-shadow: 0 2px 8px #2563eb33;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" 
          fill="none" stroke="#2563eb" stroke-width="2" 
          stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="10" x="2" y="7" rx="2" />
          <polygon points="22 7 16 12 22 17 22 7" />
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

const centerBanyuwangi = { lat: -8.2192, lng: 114.3691 };
const COLORS = ["#10b981", "#f59e0b", "#ef4444"]; // green (low), yellow (normal), red (high)

const AnalitikSampahPage = () => {
    const { theme } = useTheme();
    const [showTable, setShowTable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [wasteList, setWasteList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [perPage] = useState(10);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [wasteAnalytics, setWasteAnalytics] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    
    const [formData, setFormData] = useState({
        nama_lokasi: "",
        alamat: "",
        latitude: "",
        longitude: "",
        url_cctv: "",
    });

    // LiveCCTVPlayer component (inline, not outside)
    const LiveCCTVPlayer = ({ src, title }) => {
      const [isFullscreen, setIsFullscreen] = useState(false);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);
      const videoRef = useRef(null);

      useEffect(() => {
        if (!src) {
          setError("URL CCTV tidak tersedia");
          setIsLoading(false);
          return;
        }

        let hls;
        setIsLoading(true);
        setError(null);

        if (Hls.isSupported() && videoRef.current) {
          hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
          });

          hls.loadSource(src);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setIsLoading(false);
              setError("Gagal memuat stream CCTV");
              console.error("HLS Error:", data);
            }
          });
        } else if (videoRef.current && videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
          // Safari native HLS support
          videoRef.current.src = src;
          videoRef.current.addEventListener("loadedmetadata", () => {
            setIsLoading(false);
          });
          videoRef.current.addEventListener("error", () => {
            setIsLoading(false);
            setError("Gagal memuat stream CCTV");
          });
        } else {
          setIsLoading(false);
          setError("Browser tidak mendukung pemutaran stream ini");
        }

        return () => {
          if (hls) {
            hls.destroy();
          }
        };
      }, [src]);

      const toggleFullscreen = () => {
        if (!isFullscreen && videoRef.current) {
          videoRef.current.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen:", err);
          });
        } else {
          document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
      };

      return (
        <div className={`bg-gray-900 rounded-lg overflow-hidden shadow-lg ${isFullscreen ? "fixed inset-0 z-50" : "relative"}`}>
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
            <h3 className="text-white font-medium truncate">{title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={toggleFullscreen}
                className="text-gray-300 hover:text-white"
                title={isFullscreen ? "Keluar dari layar penuh" : "Layar penuh"}
              >
                {isFullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 16h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3v-3a1 1 0 10-2 0v3H5a1 1 0 100 2zm7-13H9V0a1 1 0 10-2 0v3H4a1 1 0 100 2h3v3a1 1 0 102 0V5h3a1 1 0 100-2z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="relative pt-[56.25%]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-white mt-2">Memuat stream...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-white mt-2">{error}</p>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              controls
              autoPlay
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>

          <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400">
            {new Date().toLocaleString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      );
    };

    // Fetch waste analytics data
    const fetchAnalyticsData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await axios.get(`http://localhost:3000/api/analytics/sampah/status-per-2jam?tanggal=${today}`);
            setWasteAnalytics(res.data.tps);
            if (res.data.tps.length > 0) {
                setSelectedLocation(res.data.tps[0].nama_lokasi);
            }
            
            // Pie chart: null/undefined status dianggap LOW
            const statusCounts = res.data.tps.reduce((acc, location) => {
                location.ranges.forEach(range => {
                    const status = range.modus_status || "LOW";
                    acc[status] = (acc[status] || 0) + 1;
                });
                return acc;
            }, {});
            
            setPieData(Object.entries(statusCounts).map(([name, value]) => ({ 
                name, 
                value,
                color: getStatusColor(name)
            })));
            
        } catch (error) {
            console.error("Error fetching analytics data:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal memuat data analitik",
                text: error.response?.data?.message || "Terjadi kesalahan saat memuat data analitik",
            });
        }
    };

    // Fetch locations data
    const fetchLocations = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/tumpukan_sampah');
            setLocations(res.data.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    // Fetch table data
    const fetchTableData = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `http://localhost:3000/api/tumpukan_sampah?page=${page}&per_page=${perPage}`
            );
            
            setWasteList(response.data.data || []);
            setTotalPages(response.data.pagination.total_pages || 1);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching table data:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal memuat data",
                text: error.response?.data?.message || "Terjadi kesalahan saat memuat data",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
        fetchLocations();
        fetchTableData(currentPage);
    }, [currentPage]);

    const getStatusColor = (status) => {
        switch(status) {
            case 'LOW': return COLORS[0];
            case 'NORMAL': return COLORS[1];
            case 'HIGH': return COLORS[2];
            default: return '#8884d8';
        }
    };

    const getSelectedLocationData = () => {
        return wasteAnalytics.find(item => item.nama_lokasi === selectedLocation)?.ranges || [];
    };

    const calculateStatistics = () => {
        const data = getSelectedLocationData();
        const peakHour = data.reduce((prev, current) => 
            (prev.count > current.count ? prev : current), 
            { range: "N/A", count: 0 }
        );
        
        const lowHour = data.reduce((prev, current) => 
            (prev.count < current.count ? prev : current), 
            { range: "N/A", count: Infinity }
        );

        const totalDetections = data.reduce((sum, item) => sum + item.count, 0);

        return { peakHour, lowHour, totalDetections };
    };

    const { peakHour, lowHour, totalDetections } = calculateStatistics();

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleViewCCTV = (url) => {
        if (!url) {
            Swal.fire({
                icon: 'warning',
                title: 'Stream Tidak Tersedia',
                text: 'Link CCTV belum terkonfigurasi'
            });
            return;
        }
        window.open(url, '_blank');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSimpan = async () => {
        const { nama_lokasi, alamat, latitude, longitude, url_cctv } = formData;

        if (!nama_lokasi || !alamat || !latitude || !longitude || !url_cctv) {
            Swal.fire({
                icon: 'warning',
                title: 'Form Belum Lengkap',
                text: 'Semua field wajib diisi!',
            });
            return;
        }

        try {
            if (isEditing && editData) {
                await axios.put(`http://localhost:3000/api/tumpukan_sampah/${editData.id}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data CCTV sampah berhasil diperbarui!',
                });
            } else {
                await axios.post('http://localhost:3000/api/tumpukan_sampah', formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data CCTV sampah berhasil ditambahkan!',
                });
            }

            setFormData({
                nama_lokasi: '',
                alamat: '',
                latitude: '',
                longitude: '',
                url_cctv: '',
            });

            setShowForm(false);
            setIsEditing(false);
            setEditData(null);
            fetchTableData(currentPage);
            fetchLocations();
            fetchAnalyticsData();

        } catch (error) {
            console.error('Error saving data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal menyimpan data',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data',
            });
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setIsEditing(true);
        setFormData({
            nama_lokasi: item.nama_lokasi || '',
            alamat: item.alamat || '',
            latitude: item.latitude || '',
            longitude: item.longitude || '',
            url_cctv: item.url_cctv || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Apakah Anda yakin?',
                text: "Data yang dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3000/api/tumpukan_sampah/${id}`);
                Swal.fire(
                    'Terhapus!',
                    'Data CCTV sampah telah dihapus.',
                    'success'
                );
                fetchTableData(currentPage);
                fetchLocations();
                fetchAnalyticsData();
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal menghapus data',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menghapus data',
            });
        }
    };

    const handleDownload = () => {
        const worksheetData = wasteList.map((item, index) => ({
            No: index + 1,
            Timestamp: item.created_at || '-',
            Nama_lokasi: item.nama_lokasi,
            Alamat: item.alamat,
            Latitude: item.latitude || '-',
            Longitude: item.longitude || '-',
            Presentase_Sampah: item.presentase ? `${item.presentase}%` : '-',
            Status_Sampah: item.status || '-',
            Live_CCTV: item.url_cctv || '-',
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data CCTV Sampah");
        XLSX.writeFile(workbook, "data_cctv_sampah.xlsx");
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Analisis Tumpukan Sampah</h1>
            <h1 className="mt-3 text-center font-bold">CCTV Tumpukan Sampah</h1>
                                    <div className="grid grid-cols-1 mb-4 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <motion.div
                                            whileHover={{ y: -10, opacity: 1 }} // Card bergerak naik dan mengubah opacity saat hover
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="card"
                                        >
                                            <div className="card-header">
                                                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                                    <Video size={26} />
                                                </div>
                                                <p className="card-title">Jumlah CCTV</p>
                                            </div>
                        
                                            <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                                                <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">70</p>
                                                <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                                    
                                                    seluruh unit terpasang
                                                </span>
                                            </div>
                                        </motion.div>
                        
                                        <motion.div
                                            whileHover={{ y: -10, opacity: 1 }} // Card bergerak naik dan mengubah opacity saat hover
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="card"
                                        >
                                            <div className="card-header">
                                                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                                    <CheckCircle2 size={26} />
                                                </div>
                                                <p className="card-title">CCTV Berfungsi</p>
                                            </div>
                        
                                            <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                                                <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">65</p>
                                                <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                                    Beroperasi dengan baik
                                                </span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ y: -10, opacity: 1 }} // Card bergerak naik dan mengubah opacity saat hover
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="card"
                                        >
                                            <div className="card-header">
                                                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                                    <AlertTriangle size={26} />
                                                </div>
                                                <p className="card-title">CCTV Rusak</p>
                                            </div>
                        
                                            <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                                                <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">5</p>
                                                <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                                    Perlu perbaikan
                                                </span>
                                            </div>
                                        </motion.div>
                        
                                    </div>
            
            {/* Location Selector */}
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Pilih Lokasi TPS</p>
                </div>
                <div className="card-body">
                    <Select
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                        className="w-full"
                        loading={!wasteAnalytics.length}
                    >
                        {wasteAnalytics.map((item) => (
                            <Option key={item.nama_lokasi} value={item.nama_lokasi}>
                                {item.nama_lokasi}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Waste Summary Cards */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
  {/* Total CCTV Card */}
  <motion.div 
    whileHover={{ y: -5, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg overflow-hidden border border-blue-100"
  >
    <div className="p-5">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-100/80 shadow-inner">
          <CheckCircle2 size={24} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Total CCTV</h3>
      </div>
      <div className="mt-6 text-center">
        <p className="text-4xl font-bold text-blue-600">{wasteList.length}</p>
        <p className="mt-2 text-sm text-gray-500 font-medium">unit terpasang</p>
      </div>
    </div>
    <div className="bg-blue-50/50 px-5 py-3 border-t border-blue-100">
      <p className="text-xs text-blue-500 flex items-center gap-1">
        <Activity size={14} /> 
        <span>Monitoring aktif</span>
      </p>
    </div>
  </motion.div>

  {/* Peak Hour Card */}
  <motion.div 
    whileHover={{ y: -5, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-lg overflow-hidden border border-red-100"
  >
    <div className="p-5">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-red-100/80 shadow-inner">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Jam Puncak</h3>
      </div>
      <div className="mt-6 text-center">
        <p className="text-4xl font-bold text-red-600">{peakHour.range}</p>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          {peakHour.count} deteksi
        </p>
      </div>
    </div>
    <div className="bg-red-50/50 px-5 py-3 border-t border-red-100">
      <p className="text-xs text-red-500 flex items-center gap-1">
        <Clock size={14} />
        <span>Tingkat keramaian tertinggi</span>
      </p>
    </div>
  </motion.div>

  {/* Low Hour Card */}
  <motion.div 
    whileHover={{ y: -5, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg overflow-hidden border border-green-100"
  >
    <div className="p-5">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-green-100/80 shadow-inner">
          <Clock size={24} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Jam Sepi</h3>
      </div>
      <div className="mt-6 text-center">
        <p className="text-4xl font-bold text-green-600">{lowHour.range}</p>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          {lowHour.count} deteksi
        </p>
      </div>
    </div>
    <div className="bg-green-50/50 px-5 py-3 border-t border-green-100">
      <p className="text-xs text-green-500 flex items-center gap-1">
        <Clock size={14} className="text-green-600" />
        <span>Waktu terbaik untuk maintenance</span>
      </p>
    </div>
  </motion.div>
</div>
            {/* Waste Status Indicators */}
            <h1 className="mt-4 font-bold text-center">Status Tumpukan Sampah</h1>
            <div className="grid grid-cols-1 gap-4 mt-1 text-center md:grid-cols-3">
                <motion.div className="p-4 bg-green-100 border-l-4 border-r-4 border-green-500 shadow-lg rounded-xl">
                    <h3 className="text-lg font-semibold text-green-600">🟢 Status Low</h3>
                </motion.div>

                <motion.div className="p-4 bg-yellow-100 border-l-4 border-r-4 border-yellow-500 shadow-lg rounded-xl">
                    <h3 className="text-lg font-semibold text-yellow-600">🟡 Status Normal</h3>
                </motion.div>

                <motion.div className="p-4 bg-red-100 border-l-4 border-r-4 border-red-500 shadow-lg rounded-xl">
                    <h3 className="text-lg font-semibold text-red-600">🔴 Status High</h3>
                </motion.div>
            </div>

            {/* Peak Hour Chart */}
            <h1 className="mt-8 mb-2 font-bold text-center">Grafik Tumpukan Sampah per 2 Jam</h1>
            <div className="card">
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getSelectedLocationData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis label={{ value: "Jumlah Deteksi", angle: -90, position: "insideLeft" }} />
                            <Tooltip 
                                formatter={(value) => [`${value} deteksi`, "Jumlah"]}
                                labelFormatter={(label) => `Waktu: ${label}`}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Jumlah Deteksi"
                                stroke="#2563eb"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

           {/* Judul atas */}

            {/* Container Flex untuk BarChart dan PieChart */}
            <div className="flex flex-col lg:flex-row gap-4 mt-4">
              {/* Bar Chart */}
              <div className="card w-full lg:w-1/2">
                <h2 className="font-semibold text-center mt-2">Distribusi Status Tumpukan</h2>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getSelectedLocationData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name="Jumlah Deteksi"
                        fill="#8884d8"
                      >
                        {getSelectedLocationData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getStatusColor(entry.modus_status)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="card w-full lg:w-1/2">
                <h2 className="font-semibold text-center mt-2">Persentase Status Tumpukan</h2>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Map Section */}
<h1 className="mt-8 mb-2 font-bold text-center">Sebaran CCTV Kabupaten Banyuwangi</h1>
<div className="card">
  <div className="h-[400px] w-full relative">
    {locations.length === 0 && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-10">
        <p className="text-gray-500">Memuat data lokasi...</p>
      </div>
    )}
    
    <MapContainer
      center={centerBanyuwangi}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Marker CCTV Tumpukan Sampah */}
      {locations
        .filter(location => {
          const lat = Number(location.latitude);
          const lng = Number(location.longitude);
          return !isNaN(lat) && !isNaN(lng);
        })
        .map((location, index) => {
          const lat = Number(location.latitude);
          const lng = Number(location.longitude);
          return (
            <Marker
              key={`marker-${location.id || index}`}
              position={[lat, lng]}
              icon={createCustomMarker()}
            >
              <Popup>
                <div className="w-80">
                  <LiveCCTVPlayer
                    src={location.url_cctv}
                    title={location.nama_lokasi}
                  />
                  <div className="mt-2 text-sm">
                    <p><span className="font-medium">Alamat:</span> {location.alamat}</p>
                    <p><span className="font-medium">Koordinat:</span> {lat.toFixed(4)}, {lng.toFixed(4)}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  </div>
</div>
           
            {/* Show/Hide Table Button */}
            {!showTable && (
                <div className="flex justify-center">
                    <div className="p-6 text-center bg-white card">
                        <p className="mb-4 text-lg font-medium text-gray-700">Klik tombol di bawah ini untuk melihat detail informasi CCTV Tumpukan Sampah</p>
                        <button
                            onClick={() => setShowTable(true)}
                            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
                        >
                            Informasi CCTV
                        </button>
                    </div>
                </div>
            )}

            {/* Data Table */}
            {showTable && (
                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Daftar CCTV Tumpukan Sampah</p>
                        
                    </div>

                    {/* Form Modal */}
                    {showForm && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                                onClick={() => {
                                    setShowForm(false);
                                    setIsEditing(false);
                                    setEditData(null);
                                }}
                            />
                            
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                    className="w-full max-w-md overflow-y-auto bg-white rounded-xl shadow-2xl max-h-[90vh]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-semibold text-slate-800">
                                                {isEditing ? 'Edit Data CCTV' : 'Tambah Data CCTV'}
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    setShowForm(false);
                                                    setIsEditing(false);
                                                    setEditData(null);
                                                }}
                                                className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSimpan();
                                        }}>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-slate-700">
                                                        Nama Lokasi TPS
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="nama_lokasi"
                                                        value={formData.nama_lokasi}
                                                        onChange={handleFormChange}
                                                        placeholder="Contoh: TPS Rawasari"
                                                        className="w-full p-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-slate-700">
                                                        Alamat
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="alamat"
                                                        value={formData.alamat}
                                                        onChange={handleFormChange}
                                                        placeholder="Contoh: Jl. Rawasari Selatan No. 10"
                                                        className="w-full p-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-slate-700">
                                                            Latitude
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            name="latitude"
                                                            value={formData.latitude}
                                                            onChange={handleFormChange}
                                                            placeholder="Contoh: -8.2192"
                                                            className="w-full p-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-slate-700">
                                                            Longitude
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            name="longitude"
                                                            value={formData.longitude}
                                                            onChange={handleFormChange}
                                                            placeholder="Contoh: 114.3691"
                                                            className="w-full p-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-slate-700">
                                                        URL CCTV
                                                    </label>
                                                    <input
                                                        type="url"
                                                        name="url_cctv"
                                                        value={formData.url_cctv}
                                                        onChange={handleFormChange}
                                                        placeholder="https://example.com/live-cctv"
                                                        className="w-full p-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4">
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowForm(false);
                                                            setIsEditing(false);
                                                            setEditData(null);
                                                        }}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50"
                                                    >
                                                        Batal
                                                    </motion.button>
                                                    <motion.button
                                                        type="submit"
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {isLoading ? (
                                                            <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
                                                        ) : isEditing ? 'Update' : 'Simpan'}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            </div>
                        </>
                    )}
                    
                    {/* Waste Data Table */}
                    <div className="p-0 card-body">
                      <div className="relative w-full h-[500px] overflow-auto rounded-xl shadow border border-gray-200">
                        <table className="min-w-full bg-white text-sm">
                          <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama TPS</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">Alamat</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">Koordinat</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">Presentase</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">Live CCTV</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {wasteList.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                                  Tidak ada data CCTV.
                                </td>
                              </tr>
                            ) : (
                              wasteList.map((item, index) => (
                                <tr
                                  key={index}
                                  className="hover:bg-blue-50 transition group"
                                >
                                  <td className="px-4 py-2">{(currentPage - 1) * perPage + index + 1}</td>
                                  <td className="px-4 py-2 font-medium text-gray-900">{item.nama_lokasi || '-'}</td>
                                  <td className="px-4 py-2">{item.alamat || '-'}</td>
                                  <td className="px-4 py-2">
                                    {item.latitude && item.longitude
                                      ? `${parseFloat(item.latitude).toFixed(4)}, ${parseFloat(item.longitude).toFixed(4)}`
                                      : '-'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {item.presentase ? (
                                      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                                        {item.presentase}%
                                      </span>
                                    ) : '-'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {item.status ? (
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full
                                        ${item.status === 'HIGH'
                                          ? 'bg-red-100 text-red-800'
                                          : item.status === 'NORMAL'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                        {item.status}
                                      </span>
                                    ) : '-'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {item.url_cctv ? (
                                      <button
                                        onClick={() => handleViewCCTV(item.url_cctv)}
                                        className="text-blue-600 underline hover:text-blue-800 font-medium"
                                      >
                                        Lihat Live
                                      </button>
                                    ) : (
                                      <span className="text-gray-400">Tidak Ada</span>
                                    )}
                                  </td>
                                  
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* Pagination */}
                      <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="flex justify-between flex-1 sm:hidden">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </div>
                        
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to{' '}
                              <span className="font-medium">{Math.min(currentPage * perPage, wasteList.length)}</span> of{' '}
                              <span className="font-medium">{totalPages * perPage}</span> results
                            </p>
                          </div>
                          <div>
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return pageNum;
                                }).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
};

export default AnalitikSampahPage;
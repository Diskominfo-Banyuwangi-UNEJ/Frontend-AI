import { Area, LineChart, Bar, BarChart, Line, CartesianGrid, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";
import { Footer } from "@/layouts/footer";
import * as XLSX from "xlsx";
import {
    ArrowLeftRight,
    ArrowBigUp,
    PencilLine,
    Star,
    Trash,
    TrendingUp,
    Download,
    ArrowBigDown,
    CctvIcon,
    Clock,
    AlertTriangle,
    Calendar,
    Video,
    CheckCircle2,
    Plus,
    ChevronLeft,
    ChevronRight,
    X,
    Loader2

} from "lucide-react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useState,useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import { overviewData } from "../../constants";
import { UserRoles } from "../../constants";

const pieData = [
    { name: "Low", value: 200 },
    { name: "Normal", value: 750 },
    { name: "High", value: 50 },
];
const centerBanyuwangi = {
    lat: -8.2192,
    lng: 114.3691,
};
// Optional: custom icon marker
const customMarker = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Data sample untuk chart
const trafficData = [
    { time: "08:00", visitors: 120 },
    { time: "10:00", visitors: 350 },
    { time: "12:00", visitors: 420 },
    { time: "14:00", visitors: 380 },
    { time: "16:00", visitors: 200 },
    { time: "18:00", visitors: 150 },
    { time: "22:00", visitors: 150 },
    { time: "24:00", visitors: 150 },
    { time: "02:00", visitors: 150 },
    { time: "04:00", visitors: 150 },
    { time: "06:00", visitors: 150 },
];

const lokasiPentings = [
    {
        name: "Kantor Pemerintah",
        lat: -8.2121,
        lng: 114.3752,
    },
    {
        name: "Ladang Smart Farming",
        lat: -8.25,
        lng: 114.37,
    },
];

const COLORS = ["#2563eb", "#10b981", "#f59e0b"]; // biru, hijau, kuning

const PemerintahAnalitikKeramaianPage = () => {
    const { theme } = useTheme();
    const handleDownload = () => {
        const worksheetData = topProducts.map((item) => ({
            No: item.number,
            Timestamp: item.time,
            Nama_lokasi: item.nama_lokasi,
            Alamat: item.alamat,
            Latitude: "-", // Asumsikan ini latitude (bisa disesuaikan)
            Longitude: "-", // Tambahkan jika ada data longitude
            Presentase: "-", // Tambahkan jika ada data
            Status_Sampah: item.status,
            Live_CCTV: "URL / Embed", // Tambahkan info jika tersedia
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data CCTV");
        XLSX.writeFile(workbook, "data_cctv.xlsx");
    };
    const handleDownload1 = () => {
        const worksheetData = dataSampahLain.map((item, index) => ({
            No: index + 1,
            Bulan: item.name, // name dari X-axis (misalnya bulan)
            Total_Tumpukan: item.total, // total dari Y-axis (jumlah tumpukan)
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data 2");
        XLSX.writeFile(workbook, "Grafik Per Bulan Tumpukan Sampah.xlsx");
    };

    const handleDownload2 = () => {
        const worksheetData = dataStatistik.map((item, index) => ({
            No: index + 1,
            Status: item.name,
            Jumlah: item.value,
            Persentase: `${((item.value / pieData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(2)}%`,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data 3");
        XLSX.writeFile(workbook, "Presentase Status Tumpukan Sampah.xlsx");
        };

        const [topProducts, setTopProducts] = useState([]);
        const [showForm, setShowForm] = useState(false);
        const [dataList, setDataList] = useState([]);

        const [formData, setFormData] = useState({
  number: "",
  timestamp: "",
  nama_lokasi: "",
  alamat: "",
  latitude: "",
  longitude: "",
  presentase: "",
  status: "",
  live: "",
});

const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [perPage] = useState(10);
  const [cctvData, setCctvData] = useState([]); 
  

const fetchData = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/tumpukan_sampah?page=${page}&per_page=${perPage}`
      );
      
      console.log("API Response:", response.data); // Debug response
      
      setDataList(response.data.data || []);
      setTotalPages(response.data.total_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

const handleFormChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

        const handleSimpan = async () => {
        const { nama_lokasi, alamat, latitude, longitude, presentase, live, status } = formData;

        // Validasi field wajib
        if (!nama_lokasi || !alamat || !latitude || !longitude || !presentase || !live || !status) {
            Swal.fire({
            icon: 'warning',
            title: 'Form Belum Lengkap',
            text: 'Semua field wajib diisi!',
            });
            return;
        }


        try {
            // Kirim data ke backend
            const response = await axios.post('http://localhost:3000/api/tumpukan_sampah', {
            nama_lokasi,
            alamat,
            latitude,
            longitude,
            presentase,
            status,
            live: live
            });

            // Jika sukses
            Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data CCTV berhasil ditambahkan!',
            });

            // Reset form
            setFormData({
            nama_lokasi: '',
            alamat: '',
            latitude: '',
            longitude: '',
            presentase: '',
            status: '',
            live: '',
            });

            setShowForm(false);
            
            // Refresh data tabel
            fetchData(currentPage);

        } catch (error) {
            console.error('Error saving data:', error);
            Swal.fire({
            icon: 'error',
            title: 'Gagal menyimpan data',
            text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data',
            });
        }
        };




    const [showJavanaTable, setShowJavanaTable] = useState(false);
    const peakHour = trafficData.reduce((prev, current) => (prev.visitors > current.visitors ? prev : current));
    // Data sample untuk chart sampah saja
    const wasteData = [
        { time: "08:00", waste: 30 },
        { time: "10:00", waste: 75 },
        { time: "12:00", waste: 90 },
        { time: "14:00", waste: 80 },
        { time: "16:00", waste: 50 },
        { time: "18:00", waste: 40 },
        { time: "20:00", waste: 30 },
        { time: "22:00", waste: 75 },
        { time: "24:00", waste: 90 },
        { time: "02:00", waste: 80 },
        { time: "04:00", waste: 50 },
        { time: "06:00", waste: 40 },
    ];
    // Data statistik teks
    // Data statistik teks
    const wasteStats = wasteData.reduce((stats, current) => {
    if (current.waste > stats.maxWaste) {
        stats.maxWaste = current.waste;
        stats.peakWasteTime = current.time;
    }
    if (current.waste < stats.minWaste) {
        stats.minWaste = current.waste;
        stats.lowWasteTime = current.time;
    }
    return stats;
}, { 
    maxWaste: -Infinity, 
    minWaste: Infinity, 
    peakWasteTime: '', 
    lowWasteTime: '' 
});
  const peakWasteTime = wasteStats.peakWasteTime;
  const maxWaste = wasteStats.maxWaste + " orang";
  const lowWasteTime = wasteStats.lowWasteTime;
  const minWaste = wasteStats.minWaste + " orang";


    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Analytics Keramaian</h1>
            <h1 className="mt-3 font-extrabold text-center">CCTV Keramaian</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Card Status Low */}
            <motion.div
                whileHover={{ y: -10, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="card"
            >
                <div className="card-header">
                <div className="p-2 text-blue-500 rounded-lg w-fit bg-blue-500/20">
                    <Video size={26} />
                </div>
                <p className="card-title">Jumlah CCTV</p>
                </div>

                <div className="card-body bg-slate-100">
                <div className="flex justify-between gap-4">
                    <div className="text-center">
                    <p className="text-xl font-bold text-slate-900">120</p>
                    <p className="text-sm font-semibold text-blue-500">Indoor</p>
                    <p className="text-xs text-gray-500">seluruh unit terpasang</p>
                    </div>
                    <div className="text-center">
                    <p className="text-xl font-bold text-slate-900">150</p>
                    <p className="text-sm font-semibold text-blue-500">Outdoor</p>
                    <p className="text-xs text-gray-500">seluruh unit terpasang</p>
                    </div>
                </div>
                </div>
            </motion.div>

            {/* Card Status Normal */}
            <motion.div
                whileHover={{ y: -10, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="card"
            >
                <div className="card-header">
                <div className="p-2 text-blue-500 rounded-lg w-fit bg-blue-500/20">
                    <CheckCircle2 size={26} />
                </div>
                <p className="card-title">CCTV Berfungsi</p>
                </div>

                <div className="card-body bg-slate-100">
                <div className="flex justify-between gap-4">
                    <div className="text-center">
                    <p className="text-xl font-bold text-slate-900">105</p>
                    <p className="text-sm font-semibold text-blue-500">Indoor</p>
                    <p className="text-xs text-gray-500">Beroperasi dengan baik</p>
                    </div>
                    <div className="text-center">
                    <p className="text-xl font-bold text-slate-900">140</p>
                    <p className="text-sm font-semibold text-blue-500">Outdoor</p>
                    <p className="text-xs text-gray-500">Beroperasi dengan baik</p>
                    </div>
                </div>
                </div>
            </motion.div>

            {/* Card Status Over */}
            <motion.div
                whileHover={{ y: -10, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="card"
            >
                <div className="card-header">
                <div className="p-2 text-blue-500 rounded-lg w-fit bg-blue-500/20">
                    <AlertTriangle size={26} />
                </div>
                <p className="card-title">CCTV Rusak</p>
                </div>

                <div className="card-body bg-slate-100">
                <div className="flex justify-between gap-4">
                    <div className="text-center">
                    <p className="text-xl font-bold text-slate-900">15</p>
                    <p className="text-sm font-semibold text-blue-500">Indoor</p>
                    <p className="text-xs text-gray-500">Perlu perbaikan</p>
                    </div>
                    <div className="text-center">
                    <p className="text-xl font-bold text-slate-900">10</p>
                    <p className="text-sm font-semibold text-blue-500">Outdoor</p>
                    <p className="text-xs text-gray-500">Perlu perbaikan</p>
                    </div>
                </div>
                </div>
            </motion.div>
            </div>

                                                  <h1 className="mt-4 font-bold text-center">Status Keramaian</h1>
            <div className="grid grid-cols-1 gap-4 mt-1 text-center md:grid-cols-3">

            {/* Status Low (Merah) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="p-4 bg-green-100 border-l-4 border-r-4 border-green-500 shadow-lg rounded-xl"
      >
        <h3 className="text-lg font-semibold text-green-600">🟢 Status Sepi</h3>
        <p className="mt-1 text-gray-700">Rentang: 1-20 orang</p>
      </motion.div>

      {/* Status Normal (Kuning) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="p-4 bg-yellow-100 border-l-4 border-r-4 border-yellow-500 shadow-lg rounded-xl"
      >
        <h3 className="text-lg font-semibold text-yellow-600">🟡 Status Normal</h3>
        <p className="mt-1 text-gray-700">Rentang: 21-50 orang</p>
      </motion.div>

      {/* Status High (Hijau) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="p-4 bg-red-100 border-l-4 border-r-4 border-red-500 shadow-lg rounded-xl"
      >
        <h3 className="text-lg font-semibold text-red-600">🔴 Status Padat</h3>
        <p className="mt-1 text-gray-700">Rentang: &gt; 51 orang</p>
      </motion.div>
    </div>
    

            


            

          

            <h1 className="mt-4 font-bold text-center">Analisis Keramaian Harian dan Bulanan</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-1 card md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Grafik Per Bulan Keramaian</p>
                        
                    </div>
                    <div className="p-0 card-body">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart
                                data={overviewData}
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTotal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#22c55e"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#22c55e"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `$${value}`}
                                />

                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis
                                    dataKey="total"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => `$${value}`}
                                    tickMargin={6}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#22c55e"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-span-1 card md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Presentase Status Per Hari</p>
                       
                    </div>
                    <div className="card-body h-[300px] p-0">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>
                                <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <h1 className="mt-8 mb-2 font-bold text-center">
                Sebaran CCTV Keramaian Kabupaten Banyuwangi
                </h1>
                <div className="card col-span-full">
                {/* Kalau kamu punya header, pastikan z-index-nya lebih tinggi */}
                {/* <div className="relative z-50 card-header">
                    <p className="card-title">Sebaran CCTV Tumpukan Sampah Kabupaten Banyuwangi</p>
                </div> */}
                <div className="card-body h-[400px] overflow-hidden p-0 relative z-0">
                    <MapContainer
                    center={[centerBanyuwangi.lat, centerBanyuwangi.lng]}
                    zoom={11}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%", position: "relative", zIndex: 0 }}
                    >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />

                    {lokasiPentings.map((nama_lokasi, index) => (
                        <Marker
                        key={index}
                        position={[nama_lokasi.lat, nama_lokasi.lng]}
                        icon={customMarker}
                        >
                        <Popup>{nama_lokasi.name}</Popup>
                        </Marker>
                    ))}
                    </MapContainer>
                </div>
                </div>

        {!showJavanaTable && (
                        <div className="flex justify-center">
                            <div className="p-6 text-center bg-white card">
                                <p className="mb-4 text-lg font-medium text-gray-700">Klik tombol di bawah ini untuk melihat detail informasi dari CCTV</p>
                                <button
                                    onClick={() => setShowJavanaTable(true)}
                                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
                                >
                                    Informasi CCTV
                                </button>
                            </div>
                        </div>
                    )}
                    {showJavanaTable && (
                    <div className="card">
                      <div className="card-header">
                        <p className="card-title">Informasi CCTV</p>
                        
                      </div>
        
                      {/* Add Data Form Modal */}
                    {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800 max-h-[80vh] overflow-y-auto"

                    >
                        <motion.div
                        initial={{ y: -20, scale: 0.98 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 20, scale: 0.98 }}
                        className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl dark:bg-slate-800"
                        >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                            Tambah Data CCTV
                            </h3>
                            <button
                            onClick={() => setShowForm(false)}
                            className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                            >
                            <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSimpan();
                        }}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                <div>
                                {/* <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Nomor
                                </label>
                                <input
                                    type="text"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleFormChange}
                                    placeholder="Nomor CCTV"
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                /> */}
                                </div> 

                                <div>
                                {/* <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Timestamp
                                </label>
                                <input
                                    type="datetime-local"
                                    name="timestamp"
                                    value={formData.timestamp}
                                    onChange={handleFormChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                /> */}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Lokasi CCTV
                                </label>
                                <input
                                type="text"
                                name="nama_lokasi"
                                value={formData.nama_lokasi}
                                onChange={handleFormChange}
                                placeholder="Contoh: CCTV Jalan Sudirman"
                                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                                <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Alamat
                                </label>
                                <input
                                    type="text"
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleFormChange}
                                    placeholder="Contoh: Jl. Rawasari Selatan"
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleFormChange}
                                    placeholder="Contoh: -6.2088"
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                </div>

                                <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleFormChange}
                                    placeholder="Contoh: 106.8456"
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Presentase Sampah (%)
                                </label>
                                <input
                                type="number"
                                name="presentase"
                                value={formData.presentase}
                                onChange={handleFormChange}
                                min="0"
                                max="100"
                                placeholder="0-100"
                                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Status Sampah
                                </label>
                                <select
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                >
                                <option value="">Pilih Status Sampah</option>
                                <option value="sedikit">Sedikit (0-25%)</option>
                                <option value="sedang">Sedang (26-50%)</option>
                                <option value="banyak">Banyak (51-75%)</option>
                                <option value="penuh">Penuh (76-100%)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Live CCTV URL
                                </label>
                                <input
                                type="url"
                                name="live"
                                value={formData.live}
                                onChange={handleFormChange}
                                placeholder="https://example.com/live-cctv"
                                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <motion.button
                                type="button"
                                onClick={() => setShowForm(false)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                Batal
                                </motion.button>
                                <motion.button
                                type="submit"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                                >
                                Simpan
                                </motion.button>
                            </div>
                            </div>
                        </form>
                        </motion.div>
                    </motion.div>
                    )}
        
                      {/* CCTV Data Table */}
                      <div className="p-0 card-body">
                        <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                          <table className="table">
                                <thead className="text-xs uppercase bg-gray-100 dark:bg-slate-700">
                                <tr>
                                <th scope="col" className="px-4 py-3">No</th>
                                <th scope="col" className="px-4 py-3">Timestamp</th>
                                <th scope="col" className="px-4 py-3">Nama Lokasi</th>
                                <th scope="col" className="px-4 py-3">Alamat</th>
                                <th scope="col" className="px-4 py-3">Latitude</th>
                                <th scope="col" className="px-4 py-3">Longitude</th>
                                <th scope="col" className="px-4 py-3">Presentase Sampah</th>
                                <th scope="col" className="px-4 py-3">Status Sampah</th>
                                <th scope="col" className="px-4 py-3">Live CCTV</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataList.map((item, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                                    <td className="px-4 py-2">{item.number || index + 1}</td>
                                    <td className="px-4 py-2">{item.timestamp || '-'}</td>
                                    <td className="px-4 py-2">{item.nama_lokasi || '-'}</td>
                                    <td className="px-4 py-2">{item.alamat || '-'}</td>
                                    <td className="px-4 py-2">{item.latitude || '-'}</td>
                                    <td className="px-4 py-2">{item.longitude || '-'}</td>
                                    <td className="px-4 py-2">{item.presentase ? `${item.presentase}%` : '-'}</td>
                                    <td className="px-4 py-2">{item.status || '-'}</td>
                                    <td className="px-4 py-2">
                                    {item.live ? (
                                        <a href={item.live} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        Lihat Live
                                        </a>
                                    ) : 'Tidak Ada'}
                                    </td>
                                </tr>
                                ))}
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
                                <span className="font-medium">{Math.min(currentPage * perPage, cctvData.length)}</span> of{' '}
                                <span className="font-medium">{cctvData.length}</span> results
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
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

export default PemerintahAnalitikKeramaianPage;

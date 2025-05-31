import { Area, LineChart, Bar, BarChart, Line, CartesianGrid, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { overviewData, recentSalesData, topProducts } from "@/constants";
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

const AnalitikKeramaianPage = () => {
    const { theme } = useTheme();
    const handleDownload = () => {
        const worksheetData = topProducts.map((item) => ({
            No: item.number,
            Timestamp: item.name,
            Nama_CCTV: item.price,
            Jenis_Deteksi: item.status,
            Latitude: item.rating, // Asumsikan ini latitude (bisa disesuaikan)
            Longitude: "-", // Tambahkan jika ada data longitude
            Presentase_Sampah: "-", // Tambahkan jika ada data
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
        const [formData, setFormData] = useState({
  number: "",
  timestamp: "",
  namaCctv: "",
  jenisDeteksi: "",
  latitude: "",
  longitude: "",
  presentaseSampah: "",
  statusSampah: "",
  liveCctv: "",
});

const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Definisikan currentPage di sini
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
      
      setData(response.data.data || []);
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

const handleSimpan = () => {
  const { number, name, price, status, rating, longitude, percentage, live } = formData;

  // Cek apakah semua field terisi
  if (!number || !name || !price || !status || !rating || !longitude || !percentage || !live) {
    Swal.fire({
      icon: 'warning',
      title: 'Form Belum Lengkap',
      text: 'Semua field wajib diisi!',
    });
    return;
  }

  // Validasi tipe data angka
  if (
    isNaN(Number(number)) ||
    isNaN(Number(price)) ||
    isNaN(Number(rating)) ||
    isNaN(Number(longitude)) ||
    isNaN(Number(percentage))
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Data tidak valid',
      text: 'Pastikan field angka berisi angka yang benar (No, Harga, Rating, Longitude, Presentase).',
    });
    return;
  }

  // Jika valid, simpan data
  setTopProducts([...topProducts, formData]);
  setFormData({
    number: '',
    name: '',
    price: '',
    status: '',
    rating: '',
    longitude: '',
    percentage: '',
    live: '',
  });
  setShowForm(false);

  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: 'Data CCTV berhasil ditambahkan!',
  });
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
            <h1 className="mt-3 text-center font-extrabold">CCTV Keramaian</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Card Status Low */}
            <motion.div
                whileHover={{ y: -10, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="card"
            >
                <div className="card-header">
                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500">
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
                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500">
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
                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500">
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

                                                  <h1 className="font-bold text-center mt-4">Status Keramaian</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-1">

            {/* Status Low (Merah) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-green-100 border-l-4 border-r-4 border-green-500 rounded-xl p-4 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-green-600">🟢 Status Sepi</h3>
        <p className="text-gray-700 mt-1">Rentang: 1-20 orang</p>
      </motion.div>

      {/* Status Normal (Kuning) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-yellow-100 border-l-4 border-r-4 border-yellow-500 rounded-xl p-4 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-yellow-600">🟡 Status Normal</h3>
        <p className="text-gray-700 mt-1">Rentang: 21-50 orang</p>
      </motion.div>

      {/* Status High (Hijau) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-red-100 border-l-4 border-r-4 border-red-500 rounded-xl p-4 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-red-600">🔴 Status Padat</h3>
        <p className="text-gray-700 mt-1">Rentang: &gt; 51 orang</p>
      </motion.div>
    </div>
    

            


            

            {/* Section 1: Grafik Volume Sampah */}
            <h1 className="mb-2 mt-8 text-center font-bold">Waktu Puncak Keramaian</h1>

            <div className="card">
                <div className="h-80 w-full">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart data={wasteData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis label={{ value: "Jumlah Orang", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="waste"
                                name="Jumlah Orang"
                                stroke="#ef4444"
                                strokeWidth={3}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Section 3: Statistik Teks */}
            <h1 className="text-center font-semibold">Statistik</h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Card Jam Puncak */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="flex items-center gap-4 rounded-lg border bg-blue-50 p-4 dark:bg-blue-900/20"
                >
                    <div className="rounded-lg bg-red-500/20 p-3 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-500 dark:text-slate-400">Jam Puncak</p>
                        <p className="text-2xl font-bold">{peakWasteTime}</p>
                        <p className="text-sm text-slate-500">Volume: {maxWaste}</p>
                    </div>
                </motion.div>
            
                {/* Card Jam Sepi */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="flex items-center gap-4 rounded-lg border bg-blue-50 p-4 dark:bg-green-900/20"
                >
                    <div className="rounded-lg bg-green-500/20 p-3 text-green-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-500 dark:text-slate-400">Jam Sepi</p>
                        <p className="text-2xl font-bold">{lowWasteTime}</p>
                        <p className="text-sm text-slate-500">Volume: {minWaste}</p>
                    </div>
                </motion.div>
            </div>

            <h1 className="mt-4 text-center font-bold">Analisis Keramaian Harian dan Bulanan</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Grafik Per Bulan Keramaian</p>
                        <button
                            onClick={handleDownload1}
                            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </button>
                    </div>
                    <div className="card-body p-0">
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
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Presentase Status Per Hari</p>
                        <button
                            onClick={handleDownload2}
                            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </button>
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
            <h1 className="mb-2 mt-8 text-center font-bold">
  Sebaran CCTV Keramaian Kabupaten Banyuwangi
</h1>
<div className="card col-span-full">
  {/* Kalau kamu punya header, pastikan z-index-nya lebih tinggi */}
  {/* <div className="card-header z-50 relative">
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

      {lokasiPentings.map((lokasi, index) => (
        <Marker
          key={index}
          position={[lokasi.lat, lokasi.lng]}
          icon={customMarker}
        >
          <Popup>{lokasi.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
</div>

        {!showJavanaTable && (
                        <div className="flex justify-center">
                            <div className="card p-6 text-center bg-white">
                                <p className="mb-4 text-lg font-medium text-gray-700">Klik tombol di bawah ini untuk melihat detail informasi dari CCTV</p>
                                <button
                                    onClick={() => setShowJavanaTable(true)}
                                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
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
                        <div className="flex gap-2">
                          <button
                            onClick={handleDownload}
                            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                          <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4" />
                            Tambah Data
                          </button>
                        </div>
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
      className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
          Tambah Data CCTV
        </h3>
        <button
          onClick={() => setShowForm(false)}
          className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
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
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nomor
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleFormChange}
                placeholder="Nomor CCTV"
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Timestamp
              </label>
              <input
                type="datetime-local"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nama CCTV
            </label>
            <input
              type="text"
              name="namaCctv"
              value={formData.namaCctv}
              onChange={handleFormChange}
              placeholder="Contoh: CCTV Jalan Sudirman"
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Jenis Deteksi
            </label>
            <select
              name="jenisDeteksi"
              value={formData.jenisDeteksi}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Pilih Jenis Deteksi</option>
              <option value="sampah">Deteksi Sampah</option>
              <option value="keramaian">Deteksi Keramaian</option>
              <option value="kendaraan">Deteksi Kendaraan</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Presentase Sampah (%)
            </label>
            <input
              type="number"
              name="presentaseSampah"
              value={formData.presentaseSampah}
              onChange={handleFormChange}
              min="0"
              max="100"
              placeholder="0-100"
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Status Sampah
            </label>
            <select
              name="statusSampah"
              value={formData.statusSampah}
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
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Live CCTV URL
            </label>
            <input
              type="url"
              name="liveCctv"
              value={formData.liveCctv}
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
                      <div className="card-body p-0">
                        <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                          <table className="table">
                            {/* Table header and body remain the same as previous implementation */}
                            {/* ... */}
                          </table>
                        </div>
        
                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                          <div className="flex-1 flex justify-between sm:hidden">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
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
                              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                >
                                  <span className="sr-only">Previous</span>
                                  <ChevronLeft className="h-5 w-5" />
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
                                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                >
                                  <span className="sr-only">Next</span>
                                  <ChevronRight className="h-5 w-5" />
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

export default AnalitikKeramaianPage;

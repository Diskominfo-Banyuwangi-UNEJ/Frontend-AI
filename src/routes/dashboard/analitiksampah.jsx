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
} from "lucide-react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";

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

const AnalitikSampahPage = () => {
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
    ];
    // Data statistik teks
    const peakWasteTime = wasteData.reduce((prev, current) => (prev.waste > current.waste ? prev : current)).time;
    const maxWaste = wasteData.reduce((prev, current) => (prev.waste > current.waste ? prev : current)).waste + "kg";

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Analytics Tumpukan Sampah</h1>
            <h1 className="mt-3 text-center font-bold">Status Tumpukan Sampah</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <motion.div
                    whileHover={{ y: -10, opacity: 1 }} // Card bergerak naik dan mengubah opacity saat hover
                    transition={{ type: "spring", stiffness: 300 }}
                    className="card"
                >
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <ArrowBigDown size={26} />
                        </div>
                        <p className="card-title">Status Low</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-xl font-semibold text-slate-900 transition-colors dark:text-slate-50"> Tingkat penumpukan sampah berada di bawah 50% kapasitas, menunjukkan kondisi yang baik dan memerlukan pemantauan rutin.</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <Trash size={18} />
                            50-100% kapasitas
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
                            <ArrowLeftRight size={26} />
                        </div>
                        <p className="card-title">Status Normal</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">270</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <Trash size={18} />
                            50-100% kapasitas
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
                            <ArrowBigUp size={26} />
                        </div>
                        <p className="card-title">Status Normal</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">270</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <Trash size={18} />
                            over kapasitas
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Section 1: Grafik Volume Sampah */}
            <h1 className="mb-2 mt-8 text-center font-bold">Puncak Tumpukan Sampah</h1>

            <div className="card">
                <h2 className="mb-4 font-semibold">Trend Volume Sampah</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart data={wasteData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis label={{ value: "Volume Sampah (kg)", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="waste"
                                name="Volume Sampah"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="flex items-center gap-4 rounded-lg border bg-red-50 p-4 dark:bg-red-900/20"
                >
                    <div className="rounded-lg bg-red-500/20 p-3 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-500 dark:text-slate-400">Puncak Volume Sampah</p>
                        <p className="text-2xl font-bold">{peakWasteTime}</p>
                        <p className="text-sm text-red-500">{maxWaste}</p>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="flex items-center gap-4 rounded-lg border bg-orange-50 p-4 dark:bg-orange-900/20"
                >
                    <div className="rounded-lg bg-orange-500/20 p-3 text-orange-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-500 dark:text-slate-400">Rata-rata Per Jam</p>
                        <p className="text-2xl font-bold">{Math.round(wasteData.reduce((acc, curr) => acc + curr.waste, 0) / wasteData.length)}kg</p>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="flex items-center gap-4 rounded-lg border bg-green-50 p-4 dark:bg-green-900/20"
                >
                    <div className="rounded-lg bg-green-500/20 p-3 text-green-500">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-500 dark:text-slate-400">Rekomendasi</p>
                        <p className="text-lg font-semibold">Pengangkutan sampah jam {peakWasteTime}</p>
                    </div>
                </motion.div>
            </div>

            <h1 className="mt-4 text-center font-bold">Analisis Volume Sampah Harian dan Bulanan</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Grafik Per Bulan Tumpukan</p>
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
                    <div className="card p-6 text-center bg-blue-100">
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
                        <p className="card-title"> Informasi CCTV</p>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </button>
                    </div>
                    <div className="card-body p-0">
                        <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                            <table className="table">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-head">No</th>
                                        <th className="table-head">Timestamp</th>
                                        <th className="table-head">Nama CCTV</th>
                                        <th className="table-head">Jenis Deteksi</th>
                                        <th className="table-head">Latitude</th>
                                        <th className="table-head">Longitude</th>
                                        <th className="table-head">Presentase Sampah</th>
                                        <th className="table-head">Status Sampah</th>
                                        <th className="table-head">Live CCTV</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {topProducts.map((product) => (
                                        <tr
                                            key={product.number}
                                            className="table-row"
                                        >
                                            <td className="table-cell">{product.number}</td>
                                            <td className="table-cell">{product.name}</td>
                                            <td className="table-cell">${product.price}</td>
                                            <td className="table-cell">{product.status}</td>
                                            <td className="table-cell">{product.rating}</td>
                                            <td className="table-cell">-</td>
                                            <td className="table-cell">-</td>
                                            <td className="table-cell">{product.status}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-x-4">
                                                    <button className="text-blue-500 dark:text-blue-600">
                                                        <CctvIcon size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default AnalitikSampahPage;

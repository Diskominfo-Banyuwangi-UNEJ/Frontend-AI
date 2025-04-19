import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";
import * as XLSX from "xlsx";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ArrowLeftRight, DollarSign, ArrowBigUp, PencilLine, Star, Trash, TrendingUp, Users, ArrowBigDown, CctvIcon, Download } from "lucide-react";
import L from "leaflet";

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

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Analytics Keramaian</h1>
            <h2 className="font-semibold">Status Keramaian</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <ArrowBigDown size={26} />
                        </div>
                        <p className="card-title">Sepi</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">90 titik</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <Users size={18} />
                            1-20 orang
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <ArrowLeftRight size={26} />
                        </div>
                        <p className="card-title">Normal</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">70 titik</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <Users size={18} />
                            21-50 orang
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <ArrowBigUp size={26} />
                        </div>
                        <p className="card-title">Padat</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">25 titik</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <Users size={18} />
                            diatas 50 orang
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Grafik Keramaian</p>
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
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
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
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Presentase Status</p>
                        {/* <button
                            onClick={handleDownload2}
                            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </button> */}
                    </div>
                    <div className="card-body h-[300px] p-0">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>
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
            <div className="card col-span-full">
                <div className="card-header">
                    <p className="card-title">Sebaran CCTV Tumpukan Sampah Kabupaten Banyuwangi</p>
                </div>
                <div className="card-body h-[400px] overflow-hidden p-0">
                    <MapContainer
                        center={[centerBanyuwangi.lat, centerBanyuwangi.lng]}
                        zoom={11}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
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
            <Footer />
        </div>
    );
};

// const AccountPage = () => {
//     return (
//         <div className="card">
//             <div className="card-header">
//                 <p className="card-title">Data Akun</p>
//             </div>
//             <div className="card-body p-0">
//                 <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
//                     <table className="table">
//                         <thead className="table-header">
//                             <tr className="table-row">
//                                 <th className="table-head">#</th>
//                                 <th className="table-head">Nama Instansi</th>
//                                 <th className="table-head">Nama Pimpinan</th>
//                                 <th className="table-head">Status</th>
//                                 <th className="table-head">Username</th>
//                                 <th className="table-head">Email</th>
//                                 <th className="table-head">Password</th>
//                                 <th className="table-head">Akses</th>
//                                 <th className="table-head">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="table-body">
//                             {accountData.map((akun) => (
//                                 <tr
//                                     key={akun.id}
//                                     className="table-row"
//                                 >
//                                     <td className="table-cell">{akun.id}</td>
//                                     <td className="table-cell">{akun.namaInstansi}</td>
//                                     <td className="table-cell">{akun.namaPimpinan}</td>
//                                     <td className="table-cell">{akun.status}</td>
//                                     <td className="table-cell">{akun.username}</td>
//                                     <td className="table-cell">{akun.email}</td>
//                                     <td className="table-cell">{akun.password}</td>
//                                     <td className="table-cell">{akun.akses}</td>
//                                     <td className="table-cell">
//                                         <div className="flex items-center gap-x-4">
//                                             <button className="text-blue-500 dark:text-blue-600">
//                                                 <PencilLine size={20} />
//                                             </button>
//                                             <button className="text-red-500">
//                                                 <Trash size={20} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AccountPage;
export default AnalitikKeramaianPage;

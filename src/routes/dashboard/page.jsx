import { motion } from "framer-motion";
import { CctvIcon, Bell, Users, BarChart, Trash, Eye, CameraOff, MapIcon } from "lucide-react";
import { Footer } from "@/layouts/footer";
import { useEffect, useState } from "react";
import { FaVideo, FaSearch, FaMapMarkedAlt, FaBell, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";
import AnalitikKeramaianPage from "./analitikkeramaian";
import AnalitikSampahPage from "./analitiksampah";

const LandingPage = () => {
    const [currentImage, setCurrentImage] = useState(0);

    // Mengubah path gambar agar mengarah ke folder public/images
    const imagePaths = ["/image/page2.jpg", "/image/kantor.jpg"];
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % imagePaths.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    // State untuk pop-up
    const [showPopup, setShowPopup] = useState(false);

    const handleButtonClick = () => {
        setShowPopup(true); // Menampilkan pop-up
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Menutup pop-up
    };

    // pengaduan
    const [formData, setFormData] = useState({
        judul: "",
        kategori: "keramaian",
        isi: "",
        tanggal: new Date().toISOString().slice(0, 16), // default ke sekarang
        status: "terkirim",
        lokasi: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleKirim = () => {
        const nomorAdmin = "6285930088301";
        const pesan = `
          *Pengaduan Baru*
          📌 *Judul:* ${formData.judul}
          📂 *Kategori:* ${formData.kategori}
          📝 *Isi:* ${formData.isi}
          🗓️ *Tanggal:* ${formData.tanggal}
          📍 *Lokasi:* ${formData.lokasi}
          🚦 *Status:* ${formData.status}
        `.replace(/\n\s+/g, "\n"); // remove extra spaces

        const linkWA = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
        window.open(linkWA, "_blank");
    };

    return (
        <div className="flex flex-col gap-y-8">
            {/* Hero Section */}
            <section
                className="relative flex h-[80vh] flex-col items-center justify-center text-center text-white"
                style={{
                    backgroundImage: `url(${imagePaths[currentImage]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "background-image 1s ease-in-out",
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 px-4">
                    <h1 className="mb-4 text-5xl font-extrabold leading-tight text-white">
                        Transformasi Pengawasan Publik Banyuwangi dengan Analitik CCTV Berbasis AI
                    </h1>
                    <p className="mx-auto mb-6 max-w-2xl text-xl md:text-2xl">
                        Meningkatkan efisiensi,mempercepat respons,dan layanan publik berbasis data
                    </p>
                </div>
            </section>
            <motion.section
                className="p-6"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Flexbox untuk menyandingkan Tentang Sistem dan Fitur Utama */}
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Tentang Sistem */}
                    <div className="flex-1">
                        <p className="mb-6 text-left text-2xl font-medium text-blue-500">Tentang Sistem</p>
                        <p className="mt-2 text-justify text-lg text-gray-700">
                            Sistem ini adalah sistem berbasis AI yang dirancang untuk mendukung pemerintah dan masyarakat dalam meningkatkan
                            pengawasan publik, efisiensi layanan, serta mitigasi risiko lingkungan. Dengan memanfaatkan teknologi analitik video
                            berbasis kecerdasan buatan (AI), sistem ini memungkinkan pemantauan real-time dan analisis data secara otomatis dari
                            rekaman CCTV di berbagai lokasi publik.
                        </p>
                    </div>

                    {/* Tujuan Dashboard */}
                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.2 }}
                    >
                        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Tujuan Dashboard</h2>
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-1">
                            {[
                                {
                                    icon: <Users size={26} />,
                                    title: "Mempercepat respons terhadap insiden, meningkatkan kewaspadaan, dan mengurangi kemungkinan terlewatnya kejadian penting",
                                },
                                {
                                    icon: <Trash size={26} />,
                                    title: "Memudahkan pengambilan keputusan terkait pengelolaan ruang, misalnya untuk keamanan publik, pengaturan lalu lintas, atau pengendalian akses.",
                                },
                                {
                                    icon: <BarChart size={26} />,
                                    title: "Mengurangi ketergantungan pada pemantauan manual dan memberikan peringatan dini tentang kejadian-kejadian yang memerlukan tindakan segera.",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start justify-start p-4 md:flex-row md:space-x-4"
                                >
                                    {/* Icon with Border */}
                                    <div className="mr-4 rounded-full border-2 border-blue-500 p-4 text-blue-500">{item.icon}</div>
                                    {/* Keterangan */}
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <section className="p-6">
                <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">Fitur Utama</h2>
                <div className="grid grid-cols-1 gap-6 p-6 text-center md:grid-cols-2 lg:grid-cols-3">
                    {/* Container untuk memusatkan card */}
                    <div className="col-span-1 flex items-center justify-center gap-6 md:col-span-2 lg:col-span-3">
                        <div className="flex flex-col items-center justify-between rounded-lg bg-white p-4 shadow-lg">
                            <Link
                                to="analytics"
                                className="w-full"
                            >
                                <img
                                    src="/image/keramaian.jpeg" // Ganti dengan path gambar yang sesuai
                                    alt="Fitur 1"
                                    className="h-48 w-full rounded-t-lg object-cover"
                                />
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Analisis Keramaian Otomatis</h3>
                                    <p className="mt-1 text-xl text-gray-700">Keterangan singkat tentang fitur ini.</p>
                                </div>
                            </Link>
                        </div>
                        {/* Card Kedua */}
                        <div className="flex flex-col items-center justify-between rounded-lg bg-white p-4 shadow-lg">
                            <Link
                                to="reports"
                                className="w-full"
                            >
                                <img
                                    src="/image/sampah.jpg" // Ganti dengan path gambar yang sesuai
                                    alt="Fitur 2"
                                    className="h-48 w-full rounded-t-lg object-cover"
                                />
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Pemantauan Tumpukan Sampah</h3>
                                    <p className="mt-1 text-xl text-gray-700">Keterangan singkat tentang fitur ini.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Statistik Section */}
            {/* Statistik Section Tanpa Card */}
            {/* <section className="p-6">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Fitur Utama</h2>
                <div className="grid grid-cols-1 gap-6 p-6 text-center md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: <Users size={26} />, title: "Analisis Keramaian Otomatis" },
                        { icon: <Trash size={26} />, title: "Pemantauan Tumpukan Sampah" },
                        { icon: <Bell size={26} />, title: "Notifikasi Otomatis" },
                        { icon: <BarChart size={26} />, title: "Laporan Analitik Data Real-Time" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center p-4"
                        >
                            <div className="text-blue-500">{item.icon}</div>
                            <h3 className="mt-2 text-lg font-semibold text-gray-800">{item.title}</h3>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{item.value}</p>
                        </div>
                    ))}
                </div>
            </section> */}

            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-800">Form Pengaduan Keramaian / Sampah</h2>

                    <div className="mb-4">
                        <label className="block font-semibold">Nama</label>
                        <input
                            type="text"
                            name="judul"
                            value={formData.nama}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 p-2"
                            placeholder="Nama"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Kategori</label>
                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 p-2"
                        >
                            <option value="keramaian">Keramaian</option>
                            <option value="sampah">Sampah</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Isi Pengaduan</label>
                        <textarea
                            name="isi"
                            value={formData.isi}
                            onChange={handleChange}
                            rows={4}
                            className="w-full rounded border border-gray-300 p-2"
                            placeholder="Deskripsikan pengaduan Anda"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Tanggal Kejadian</label>
                        <input
                            type="datetime-local"
                            name="tanggal"
                            value={formData.tanggal}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 p-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Lokasi</label>
                        <input
                            type="text"
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 p-2"
                            placeholder="Lokasi "
                        />
                    </div>

                    {/* <div className="mb-6">
                        <label className="block font-semibold">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 p-2"
                        >
                            <option value="terkirim">Terkirim</option>
                            <option value="diproses">Diproses</option>
                            <option value="selesai">Selesai</option>
                        </select>
                    </div> */}

                    <div className="mb-6">
                        <label className="block font-semibold">Bukti Pengajuan</label>
                        <input
                            type="file"
                            name="bukti"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 p-2"
                        />
                    </div>

                    <button
                        onClick={handleKirim}
                        className="w-full rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                    >
                        Kirim ke WhatsApp
                    </button>
                </div>
            </div>
            <motion.section
                className="p-6"
                initial={{ opacity: 0, y: -100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.2 }}
            >
                <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">Dinas Komunikasi, Informatika dan Persandian Banyuwangi</h2>

                <div className="flex flex-col items-center gap-6 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <img
                            src="/image/diskominfo.jpg"
                            alt="Dinas Kominfo"
                            className="w-full rounded-lg object-cover shadow-md"
                        />
                    </div>

                    <div className="w-full text-left md:w-1/2">
                        <h3 className="text-xl font-semibold text-gray-800">Tentang kami</h3>
                        <p className="mt-2 text-gray-600">
                            Dinas Komunikasi, Informatika dan Persandian Banyuwangi memiliki peran penting dalam pengelolaan teknologi informasi dan
                            komunikasi di tingkat daerah. Sebagai lembaga yang mengatur infrastruktur digital dan penyebaran informasi publik, Kominfo
                            juga bertanggung jawab dalam peningkatan kualitas layanan publik melalui teknologi.
                        </p>
                        <p className="mt-2 text-gray-600">
                            Dinas Kominfo berperan penting dalam mendukung implementasi kebijakan pemerintah daerah yang berbasis digital. Dengan
                            adanya dukungan infrastruktur digital yang baik, diharapkan dapat meningkatkan efisiensi dalam pelayanan publik dan
                            membuka akses yang lebih luas bagi masyarakat terhadap berbagai informasi dan layanan.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Dinas Terkait */}
            {/* Dinas Terkait */}
            <div className="mt-10">
                <h2 className="mb-4 text-center text-2xl font-bold text-blue-600">DINAS TERKAIT DASHBOARD CCTV</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                        {
                            title: "Dinas Perhubungan",
                            desc: "Mengatur lalu lintas dan fasilitas transportasi kota untuk kenyamanan warga.",
                            img: "/image/kantor.jpeg",
                        },
                        {
                            title: "Dinas Lingkungan Hidup",
                            desc: "Menerapkan kebijakan pelestarian lingkungan dan pengelolaan sampah kota.",
                            img: "/image/banyuwangi_1.jpg",
                        },
                        {
                            title: "Satuan Polisi Pamong Praja",
                            desc: "Mengelola infrastruktur dan pembangunan kota untuk peningkatan kualitas hidup.",
                            img: "/image/satpolpp.jpeg", // Gambar untuk kartu ketiga
                        },
                    ].map((dinas, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col overflow-hidden rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
                            initial={{ y: 0 }} // Initial position
                            whileHover={{ y: -10 }} // Move up when hovered
                            transition={{ type: "spring", stiffness: 300 }} // Smooth spring transition
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{dinas.title}</h3>
                            <p className="mt-2 text-gray-600">{dinas.desc}</p>
                            <div className="mt-4 h-48 w-full overflow-hidden rounded-lg">
                                <img
                                    src={dinas.img}
                                    alt={`Gambar ${dinas.title}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* <section className="px-6 py-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Berita Insight</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[
                        {
                            img: "/image/insight1.jpg",
                            title: "Transformasi Digital di Sektor Publik: Meningkatkan Efisiensi dan Akses Layanan",
                            date: "20 April 2025",
                        },
                        {
                            img: "/image/insight2.jpg",
                            title: "Peran Teknologi dalam Pengelolaan Sampah untuk Kota yang Lebih Bersih",
                            date: "18 April 2025",
                        },
                        {
                            img: "/image/insight3.jpeg",
                            title: "Mengoptimalkan Infrastruktur Kota dengan Pemantauan CCTV Berbasis AI",
                            date: "15 April 2025",
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col"
                        >
                            <img
                                src={item.img}
                                className="h-56 w-full rounded-xl object-cover shadow-md"
                                alt={`Berita Insight ${idx + 1}`}
                            />
                            <div className="mt-2 text-left">
                                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section> */}

            <section className="p-6">
                <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">GALERI KAMI</h2>
                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-2">
                    {/* Foto besar di kiri */}
                    <div className="flex justify-center">
                        <motion.img
                            src="/image/galeri1.jpg" // Ganti dengan path gambar besar
                            alt="Foto Besar"
                            className="h-full w-full object-cover shadow-lg"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }} // Zoom in saat hover
                            transition={{ type: "spring", stiffness: 300 }}
                        />
                    </div>

                    {/* Foto kecil di kanan (2 atas, 2 bawah) */}
                    <div className="grid grid-cols-2 gap-6">
                        <motion.div
                            className="flex justify-center"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }} // Zoom in saat hover
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img
                                src="/image/galeri2.jpg" // Ganti dengan path gambar kecil 1
                                alt="Foto Kecil 1"
                                className="h-48 w-full object-cover shadow-lg"
                            />
                        </motion.div>

                        <motion.div
                            className="flex justify-center"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }} // Zoom in saat hover
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img
                                src="/image/galeri3.jpg" // Ganti dengan path gambar kecil 2
                                alt="Foto Kecil 2"
                                className="h-48 w-full object-cover shadow-lg"
                            />
                        </motion.div>

                        <motion.div
                            className="flex justify-center"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }} // Zoom in saat hover
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img
                                src="/image/galeri4.jpg" // Ganti dengan path gambar kecil 3
                                alt="Foto Kecil 3"
                                className="h-48 w-full object-cover shadow-lg"
                            />
                        </motion.div>

                        <motion.div
                            className="flex justify-center"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }} // Zoom in saat hover
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img
                                src="/image/galeri5.jpg" // Ganti dengan path gambar kecil 4
                                alt="Foto Kecil 4"
                                className="h-48 w-full object-cover shadow-lg"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
            <section className="bg-white px-6 py-10 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-blue-800">Hubungi Kami</h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Info Kontak */}
                    <div className="flex flex-col justify-center space-y-4">
                        <p className="text-sm text-gray-800">
                            📍 <strong>Alamat:</strong> Jl. K.H. Agus Salim No.85, Lingkungan Cuking Rw., Mojopanggung, Kec. Giri, Kabupaten
                            Banyuwangi, Jawa Timur 68425
                        </p>
                        <p className="text-sm text-gray-800">
                            ☎️ <strong>Telepon:</strong> (0333) 123456
                        </p>
                        <p className="text-sm text-gray-800">
                            📧 <strong>Email:</strong> diskominfo@banyuwangikab.go.id
                        </p>
                        <p className="text-sm text-gray-800">
                            📸 <strong>Instagram:</strong>{" "}
                            <a
                                href="https://www.instagram.com/kominfobanyuwangi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                @kominfobanyuwangi
                            </a>
                        </p>
                    </div>

                    {/* Peta Lokasi */}
                    <div className="h-auto overflow-hidden rounded-lg shadow-md">
                        <img
                            src="/image/petakom.png"
                            alt="Peta Lokasi Dinas Kominfo Banyuwangi"
                            className="w-full object-cover"
                        />
                    </div>
                </div>

                {/* Optional: Styling to simulate footer-like positioning */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>&copy; 2025 Dinas Komunikasi dan Informatika Kabupaten Banyuwangi. All rights reserved.</p>
                </div>
            </section>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;

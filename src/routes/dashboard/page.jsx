import { motion } from "framer-motion";
import { CctvIcon, Bell, Users, BarChart, Trash, Eye, CameraOff, MapIcon } from "lucide-react";
import { Footer } from "@/layouts/footer";
import { useEffect, useState } from "react";
import { FaVideo, FaSearch, FaMapMarkedAlt, FaBell, FaChartLine } from "react-icons/fa"; // Mengimport ikon yang diperlukan

const LandingPage = () => {
    const [currentImage, setCurrentImage] = useState(0);

    // Mengubah path gambar agar mengarah ke folder public/images
    const imagePaths = ["/image/banyuwangi_1.jpg", "/image/kantor.jpeg"];
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

            {/* Dinas Kominfo Section */}
            <section className="p-6">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Dinas Komunikasi dan Informatika</h2>
                <div className="flex flex-col items-center gap-6 md:flex-row">
                    {/* Gambar Dinas Kominfo */}
                    <div className="w-full md:w-1/2">
                        <img
                            src="/image/diskominfo.jpg" // Ganti dengan path gambar Dinas Kominfo
                            alt="Dinas Kominfo"
                            className="w-full rounded-lg object-cover shadow-md"
                        />
                    </div>

                    {/* Informasi Dinas */}
                    <div className="w-full text-left md:w-1/2">
                        <h3 className="text-xl font-semibold text-gray-800">Tentang Dinas Komunikasi, Informatika dan Persandian Banyuwangi</h3>
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
            </section>

            <section className="p-6">
                {/* Flexbox untuk menyandingkan Tentang Sistem dan Fitur Utama */}
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Tentang Sistem */}
                    <div className="flex-1">
                        <p className="mb-6 text-left text-2xl font-medium text-blue-500">Tentang Sistem</p>
                        <p className="mb-6 text-left text-2xl font-bold text-gray-900">Fitur Unggulan CCTV Analytics</p>
                        <p className="mt-2 text-lg text-gray-700">
                            Sistem berbasis AI yang mendukung pemerintah dan masyarakat dalam meningkatkan pengawasan publik, efisiensi layanan, dan
                            mitigasi resiko lingkungan.
                        </p>
                    </div>

                    <div className="flex-1">
                        <h2 className="mb-6 text-left text-2xl font-bold text-gray-800">Fitur Utama</h2>
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-1">
                            {[
                                { icon: <Users size={26} />, title: "Analisis Keramaian Otomatis" },
                                { icon: <Trash size={26} />, title: "Pemantauan Tumpukan Sampah" },
                                { icon: <Bell size={26} />, title: "Notifikasi Otomatis" },
                                { icon: <BarChart size={26} />, title: "Laporan Analitik Data Real-Time" },
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
                    </div>
                </div>
            </section>

            {/* Dinas Terkait */}
            <div className="mt-10">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">DINAS TERKAIT DASHBOARD CCTV</h2>
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
                        <div
                            key={index}
                            className="flex flex-col overflow-hidden rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
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
                        </div>
                    ))}
                </div>
            </div>

            <section className="px-6 py-10">
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

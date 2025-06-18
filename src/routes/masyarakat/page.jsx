import { motion } from "framer-motion";
import { CctvIcon, Bell, Users, BarChart, Trash, Eye, CameraOff, MapIcon } from "lucide-react";
import { Footer } from "@/layouts/footer";
import { useEffect, useState,useCallback } from "react";
import { FaVideo, FaSearch, FaMapMarkedAlt, FaBell, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";
import MasyarakatAnalitikKeramaianPage from "./analitikkeramaian";
import MasyarakatAnalitikSampahPage from "./analitiksampah";
import { GoogleMap,Marker, useJsApiLoader  } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { FaWhatsapp } from "react-icons/fa";




const MasyarakatDashboardPage = () => {
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

    

    // Peta Lokasi
    const containerStyle = {
    width: '100%',
    height: '400px',
    };

    const [mapCenter, setMapCenter] = useState({
    lat: -8.2192,
    lng: 114.3692,
    });

    // Bounding box Kabupaten Banyuwangi (kira-kira)
    const BANYUWANGI_BOUNDS = {
    north: -7.9,
    south: -8.6,
    east: 114.6,
    west: 113.8,
    };

    const { isLoaded,loadError  } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBP1AngIK-e-F3YN1INaeDKGtH9waiGHvA', // ganti dengan API key kamu
    libraries: ['places'],
    });
    if (loadError) {
  return <div>Error loading maps</div>;
}

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [address, setAddress] = useState('');

    const isWithinBanyuwangi = (lat, lng) => {
        return (
        lat <= BANYUWANGI_BOUNDS.north &&
        lat >= BANYUWANGI_BOUNDS.south &&
        lng <= BANYUWANGI_BOUNDS.east &&
        lng >= BANYUWANGI_BOUNDS.west
        );
    };

  const reverseGeocode = (lat, lng) => {
  if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
    console.error('Google Maps belum siap');
    setAddress('Google Maps belum siap, coba lagi.');
    return;
  }

  const geocoder = new window.google.maps.Geocoder();
  const latlng = { lat, lng };

  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === 'OK') {
      if (results && results.length > 0) {
        setAddress(results[0].formatted_address);
        console.log('Hasil alamat:', results[0]);
      } else {
        setAddress('Alamat tidak ditemukan (hasil kosong)');
      }
    } else {
      console.error('Geocoder gagal:', status);
      setAddress(`Gagal mendapatkan alamat: ${status}`);
    }
  });
};


  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (isWithinBanyuwangi(lat, lng)) {
      setSelectedLocation({ lat, lng });
      reverseGeocode(lat, lng);
    } else {
      alert('Lokasi di luar Kabupaten Banyuwangi!');
    }
  }, []);



    // pengaduan
    const [formData, setFormData] = useState({
        judul: "",
        kategori: "keramaian",
        isi: "",
        tanggal: new Date().toISOString().slice(0, 16), // default ke sekarang
        status: "terkirim",
        lokasi: "",
        bukti: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "bukti") {
            setFormData({
                ...formData,
                [name]: files[0], // ambil file pertama
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
   // Nomor WhatsApp tujuan (admin atau layanan)
  const waNumber = "6285930088301"; // ganti sesuai nomor tujuan

  // Pesan WA default, kamu bisa sesuaikan
  const waMessage = encodeURIComponent(
    `Halo, saya ingin melaporkan pengaduan mengenai keramaian/tumpukan sampah.\nMohon tindak lanjut.\nTerima kasih.`
  );


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
                        <p className="mb-6 text-left text-2xl font-bold text-blue-500">Tentang Sistem</p>
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
                        <h2 className="mb-6 text-center text-2xl font-bold text-blue-500">Tujuan Dashboard</h2>
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-1">
                            {[
                            {
                            icon: <Users size={26} />,
                            title: "Analitik sampah untuk respons cepat dan pencegahan penumpukan.",
                            },
                            {
                            icon: <Trash size={26} />,
                            title: "Pantau keramaian demi keamanan dan pengaturan ruang publik.",
                            },
                            {
                            icon: <BarChart size={26} />,
                            title: "Pelaporan otomatis untuk deteksi dini dan tindak lanjut insiden.",
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
          

    

            <section className="pb-2">
                <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">Fitur Utama</h2>
                <div className="grid grid-cols-1 gap-6 p-6 text-center md:grid-cols-2 lg:grid-cols-3">
                    {/* Container untuk memusatkan card */}
                    <div className="col-span-1 flex items-center justify-center gap-6 md:col-span-2 lg:col-span-3">
                         <motion.div
                        whileHover={{ scale: 1.05 }} // Zoom out sedikit saat hover
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex flex-col justify-between rounded-lg bg-white p-4 shadow-lg h-full min-h-[350px]"
                        >
                        <Link to="/masyarakat/analytics" className="flex flex-col h-full">
                            <img
                            src="/image/keramaian.jpeg"
                            alt="Fitur 1"
                            className="h-48 w-full rounded-t-lg object-cover"
                            />
                            <div className="mt-4 flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">Pemantauan Keramaian</h3>
                            </div>
                        </Link>
                        </motion.div>
                        {/* Card Kedua */}
                        <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex flex-col justify-between rounded-lg bg-white p-4 shadow-lg h-full min-h-[350px]"
                        >
                        <Link to="/masyarakat/reports" className="flex flex-col h-full">
                            <img
                            src="/image/sampah.jpg"
                            alt="Fitur 2"
                            className="h-48 w-full rounded-t-lg object-cover"
                            />
                            <div className="mt-4 flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">Pemantauan Tumpukan Sampah</h3>
                            </div>
                        </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

             <div className="flex min-h-screen items-center justify-center p-4 md:p-16 text-gray-800">
  <div className="flex w-full max-w-7xl flex-wrap justify-center gap-6 lg:gap-12">
    {/* Kiri: Tata Cara */}
    <div className="w-full lg:flex-1  rounded-2xl p-6 md:p-10 lg:min-w-[400px] max-w-[600px]">
      <h1 className="mb-6 text-2xl md:text-3xl font-extrabold text-green-800 drop-shadow-md">
        Pengaduan Masyarakat
      </h1>
      <h2 className="mb-2 text-base md:text-lg">
        Silakan lengkapi data pada langkah-langkah berikut untuk menyelesaikan pengaduan Anda.
      </h2>
      <ol className="list-decimal list-inside space-y-2 text-base md:text-lg leading-relaxed">
        <li>Nama pelapor.</li>
        <li>Lokasi kejadian (manual melalui GPS)</li>
        <li>Jenis pengaduan: pilih salah satu keramaian atau sampah.</li>
        <li>Deskripsi pengaduan secara singkat dan jelas.</li>
        <li>Upload bukti foto jika tersedia.</li>
        <li>Sertakan tanggal kejadian.</li>
        <li>SELESAI.</li>
      </ol>
    </div>

    {/* Kanan: Card WA */}
    <div className="w-full lg:flex-1 bg-white rounded-3xl p-6 md:p-12 shadow-2xl border border-green-300 lg:min-w-[400px] max-w-[600px] flex flex-col items-center justify-center hover:shadow-green-400 transition-shadow duration-300">
      <FaWhatsapp className="mb-4 md:mb-6 text-5xl md:text-6xl text-green-600 drop-shadow-md" />
      <h2 className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold text-green-700 text-center">
        Kirim Pengaduan Sekarang
      </h2>
      <p className="mb-6 md:mb-8 text-center text-green-800 max-w-sm text-sm md:text-base">
        Klik tombol untuk kirim pengaduan cepat via WhatsApp.
      </p>
      <a
        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
          "══════[ PENGADUAN ]══════\n" +
          "\n*📅 Tanggal Kejadian: " +
          "\n*👤 Nama Lengkap: " +
          "\n*📍 Link Lokasi: " +
          "\n*📌 Jenis Pengaduan: " +
          "\n*📝 Deskripsi Lengkap: " +
          "\n\n══════[ BUKTI FOTO ]══════" +
          "\nSilakan UNGGAH FOTO setelah mengirim pesan ini" +
          "\n\n*Petunjuk:*" +
          "\n1. Isi semua data di atas" +
          "\n2. Kirim pesan ini" +
          "\n3. Setelah itu, kirim foto bukti sebagai balasan" +
          "\n\nTerima kasih atas laporan Anda"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-full bg-green-600 px-8 py-3 md:px-12 md:py-4 text-white text-lg md:text-xl text-center font-semibold shadow-lg hover:bg-green-700 active:scale-95 transition-transform"
      >
        <FaWhatsapp className="text-xl md:text-2xl" />
        Kirim Pengaduan
      </a>
    </div>
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

                    <div className="w-full md:w-1/2">
                        <h3 className="text-center text-xl font-bold text-gray-800">Tentang Kami</h3>
                        <p className="mt-2 text-justify text-gray-600">
                            Dinas Komunikasi, Informatika, dan Persandian Kabupaten Banyuwangi merupakan garda terdepan dalam transformasi digital di
                            tingkat daerah. Kami berperan strategis dalam merancang, mengelola, dan mengembangkan infrastruktur teknologi informasi
                            dan komunikasi (TIK) guna mendukung terciptanya pemerintahan yang efisien, transparan, dan responsif
                        </p>
                        <p className="mt-2 text-justify text-gray-600">
                            Sebagai penghubung antara pemerintah dan masyarakat, Dinas Kominfo tidak hanya memastikan tersedianya akses informasi
                            publik yang akurat dan terpercaya, tetapi juga mendorong pemanfaatan teknologi digital dalam berbagai aspek pelayanan
                            publik. Melalui digitalisasi layanan dan peningkatan literasi digital, kami berkomitmen untuk menciptakan sistem
                            pemerintahan yang adaptif terhadap perkembangan zaman dan mampu memenuhi kebutuhan masyarakat.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Dinas Terkait */}
            <div className="mt-10">
                <h2 className="mb-4 text-center text-2xl font-bold text-blue-600">DINAS TERKAIT DASHBOARD CCTV</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                        {
                            title: "Dinas Perhubungan",
                            desc: "Mengatur lalu lintas dan fasilitas transportasi kota untuk kenyamanan warga.",
                            img: "/image/perhubungan.png",
                            link: "https://dishub.banyuwangikab.go.id/",
                        },
                        {
                            title: "Dinas Lingkungan Hidup",
                            desc: "Menerapkan kebijakan pelestarian lingkungan dan pengelolaan sampah kota.",
                            img: "/image/dlh.png",
                            link: "https://dlh.banyuwangikab.go.id/",
                        },
                        {
                            title: "Satuan Polisi Pamong Praja",
                            desc: "Mengelola infrastruktur dan pembangunan kota untuk peningkatan kualitas hidup.",
                            img: "/image/satpol1.jpg",
                            link: "https://satpolpp.banyuwangikab.go.id/#",
                        },
                    ].map((dinas, index) => (
                        <a
                            key={index}
                            href={dinas.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-underline"
                        >
                            <motion.div
                                className="flex flex-col overflow-hidden rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
                                initial={{ y: 0 }}
                                whileHover={{ y: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <h3 className="text-xl font-semibold text-gray-800">{dinas.title}</h3>
                                <p className="mt-2 text-gray-600">{dinas.desc}</p>
                                <div className="mt-4 h-48 w-full overflow-hidden rounded-lg">
                                    <img
                                        src={dinas.img}
                                        alt={`Gambar ${dinas.title}`}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </motion.div>
                        </a>
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
                    <a
                    href="https://maps.app.goo.gl/x6aax6xXQ8PLeQej9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    >
                    <div className="h-auto overflow-hidden rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200">
                        <img
                        src="/image/petakom.png"
                        alt="Peta Lokasi Dinas Kominfo Banyuwangi"
                        className="w-full object-cover"
                        />
                    </div>
                    </a>
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

export default MasyarakatDashboardPage;

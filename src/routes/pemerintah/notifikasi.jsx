import React, { useState,useEffect} from "react";
import Swal from "sweetalert2";

const PemerintahNotifikasi = () => {
    // Contoh data notifikasi (bisa diambil dari API atau state global)
    const [notifikasi, setNotifikasi] = useState([
        { id: 1, message: "Pemberitahuan: Sistem akan diperbarui malam ini.", read: false },
        { id: 2, message: "Pengingat: Laporan bulanan harus diserahkan besok.", read: false },
        { id: 3, message: "Info: Anda memiliki tugas baru yang perlu diselesaikan.", read: true },
    ]);

    // Tampilkan SweetAlert jika tidak ada notifikasi
    useEffect(() => {
        if (notifikasi.length === 0) {
            Swal.fire({
                title: "Tidak ada notifikasi baru saat ini.",
                icon: "info",
                confirmButtonText: "Tutup",
            });
        }
    }, [notifikasi]);

    // Fungsi untuk menandai notifikasi sebagai dibaca
    const tandaiDibaca = (id) => {
        setNotifikasi(notifikasi.map((item) => (item.id === id ? { ...item, read: true } : item)));
    };

    // Fungsi untuk menghapus notifikasi
    const hapusNotifikasi = (id) => {
        const target = notifikasi.find((n) => n.id === id);

        Swal.fire({
            title: "Apakah Anda yakin ingin menghapus notifikasi ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
            position: "top",
            toast: "true",
             customClass: {
    popup: "rounded-xl",
    title: "text-center" // ✅ rata tengah
  }     
           
        })
        .then((result) => {
            if (result.isConfirmed) {
                // Simulasi penghapusan dari database
                setNotifikasi(notifikasi.filter((item) => item.id !== id));

                // Tampilkan pesan berhasil
                Swal.fire({
                    title: "Notifikasi berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    toast: "true",
                    position : "top"
                });
            }
            // Jika dibatalkan, tidak melakukan apa-apa (otomatis kembali ke daftar)
        });
    };

    

    return (
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Notifikasi </h2>
            <div className="space-y-4">
                {notifikasi.length > 0 ? (
                    notifikasi.map((notif) => (
                        <div
                            key={notif.id}
                            className={`rounded-lg p-4 shadow-md ${notif.read ? "bg-gray-200" : "bg-yellow-100"}`}
                        >
                            <p>{notif.message}</p>
                            <div className="mt-2 flex items-center justify-between">
                                <button
                                    onClick={() => tandaiDibaca(notif.id)}
                                    className={`text-sm font-medium ${notif.read ? "text-gray-500" : "text-blue-600"}`}
                                    disabled={notif.read}
                                >
                                    {notif.read ? "Sudah dibaca" : "Tandai sebagai dibaca"}
                                </button>
                                <button
                                    onClick={() => hapusNotifikasi(notif.id)}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Tidak ada notifikasi saat ini.</p>
                )}
            </div>
        </div>
    );
};

export default PemerintahNotifikasi;

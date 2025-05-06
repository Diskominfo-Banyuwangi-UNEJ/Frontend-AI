import React, { useState } from "react";

const Notifikasi = () => {
    // Contoh data notifikasi (bisa diambil dari API atau state global)
    const [notifikasi, setNotifikasi] = useState([
        { id: 1, message: "Pemberitahuan: Sistem akan diperbarui malam ini.", read: false },
        { id: 2, message: "Pengingat: Laporan bulanan harus diserahkan besok.", read: false },
        { id: 3, message: "Info: Anda memiliki tugas baru yang perlu diselesaikan.", read: true },
    ]);

    // Fungsi untuk menandai notifikasi sebagai dibaca
    const tandaiDibaca = (id) => {
        setNotifikasi(notifikasi.map((item) => (item.id === id ? { ...item, read: true } : item)));
    };

    // Fungsi untuk menghapus notifikasi
    const hapusNotifikasi = (id) => {
        setNotifikasi(notifikasi.filter((item) => item.id !== id));
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

export default Notifikasi;

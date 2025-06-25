import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Notifikasi = ({ userId }) => {
    const [notifikasi, setNotifikasi] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);

    // Fetch notifications from API
    const fetchNotifikasi = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/notifikasi?user_id=2`);
            setNotifikasi(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            Swal.fire({
                title: "Gagal memuat notifikasi",
                text: "Terjadi kesalahan saat mengambil data notifikasi",
                icon: "error",
                confirmButtonText: "Tutup",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifikasi();
    }, [userId]);

    // Tampilkan SweetAlert jika tidak ada notifikasi
    useEffect(() => {
        if (!loading && notifikasi.data && notifikasi.data.length === 0) {
            Swal.fire({
                title: "Tidak ada notifikasi baru saat ini.",
                icon: "info",
                confirmButtonText: "Tutup",
            });
        }
    }, [notifikasi, loading]);

    // Fungsi untuk menandai notifikasi sebagai dibaca
    const tandaiDibaca = async (id) => {
        try {
            await axios.patch(`http://localhost:3000/api/notifikasi/${id}/status`, {
                status: "DIBACA",
                user_id: 2 // tambahkan ini
            });
            
            // Update local state
            setNotifikasi(prev => ({
                ...prev,
                data: prev.data.map(item => 
                    item.id === id ? { ...item, status: "DIBACA" } : item
                ),
                meta: {
                    ...prev.meta,
                    unread_count: prev.meta.unread_count - 1
                }
            }));
            
            Swal.fire({
                title: "Notifikasi ditandai sebagai dibaca",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: "top"
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            Swal.fire({
                title: "Gagal memperbarui status notifikasi",
                text: "Terjadi kesalahan saat menandai notifikasi sebagai dibaca",
                icon: "error",
                confirmButtonText: "Tutup",
            });
        }
    };

    // Fungsi untuk menghapus notifikasi
    const hapusNotifikasi = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin ingin menghapus notifikasi ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
            position: "top",
            toast: true,
            customClass: {
                popup: "rounded-xl",
                title: "text-center"
            }     
        });
        
        if (result.isConfirmed) {
    try {
        // Menggunakan endpoint baru dengan format yang benar
        await axios.delete(`http://localhost:3000/api/notifikasi/${id}?user_id=2`, {
            
        });
        
        // Update local state
        const isUnread = notifikasi.data.find(item => item.id === id)?.status === "BARU";
        setNotifikasi(prev => ({
            ...prev,
            data: prev.data.filter(item => item.id !== id),
            meta: {
                ...prev.meta,
                unread_count: isUnread ? prev.meta.unread_count - 1 : prev.meta.unread_count,
                total: prev.meta.total - 1
            }
        }));
        
        Swal.fire({
            title: "Notifikasi berhasil dihapus.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top"
        });
    } catch (error) {
        console.error('Delete error:', error);
        Swal.fire({
            title: "Gagal menghapus notifikasi",
            text: error.response?.data?.message || "Terjadi kesalahan pada server",
            icon: "error"
        });
    }
}
    };

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Notifikasi</h2>
                <p>Memuat notifikasi...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Notifikasi</h2>
                {notifikasi.meta.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {notifikasi.meta.unread_count} belum dibaca
                    </span>
                )}
            </div>
            <div className="space-y-4">
                {notifikasi.data && notifikasi.data.length > 0 ? (
                    [...notifikasi.data]
                        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                        .map((notif) => (
                        <div
                            key={notif.id}
                            className={`rounded-lg p-4 shadow-md ${notif.status === "DIBACA" ? "bg-gray-100" : "bg-yellow-100 border-l-4 border-yellow-500"}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{notif.judul}</h3>
                                    <p className="text-gray-700">{notif.isi}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(notif.tanggal).toLocaleString()}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {notif.terkait.map((item, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {item.jenis.replace("_", " ")}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {notif.pengirim.instansi}
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <button
                                    onClick={() => tandaiDibaca(notif.id)}
                                    className={`text-sm font-medium ${notif.status === "DIBACA" ? "text-gray-500" : "text-blue-600"}`}
                                    disabled={notif.status === "DIBACA"}
                                >
                                    {notif.status === "DIBACA" ? "Sudah dibaca" : "Tandai sebagai dibaca"}
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

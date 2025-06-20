import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const PemerintahNotifikasi = ({ userId }) => {
    const [notifikasi, setNotifikasi] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch notifications from API
    const fetchNotifikasi = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/notifikasi?user_id=${userId}`);
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
        if (!loading && notifikasi.length === 0) {
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
                status: "read"
            });
            
            // Update local state
            setNotifikasi(notifikasi.map((item) => 
                item.id === id ? { ...item, read: true } : item
            ));
            
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
                await axios.delete(`http://localhost:3000/api/notifikasi?user_id=${userId}&notifikasi_id=${id}`);
                
                // Update local state
                setNotifikasi(notifikasi.filter((item) => item.id !== id));
                
                Swal.fire({
                    title: "Notifikasi berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: "top"
                });
            } catch (error) {
                console.error("Error deleting notification:", error);
                Swal.fire({
                    title: "Gagal menghapus notifikasi",
                    text: "Terjadi kesalahan saat menghapus notifikasi",
                    icon: "error",
                    confirmButtonText: "Tutup",
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
            <h2 className="mb-4 text-2xl font-semibold">Notifikasi</h2>
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
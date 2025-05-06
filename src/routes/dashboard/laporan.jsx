import React, { useState } from "react";

const LaporanPage = () => {
    const [laporanList, setLaporanList] = useState([]);
    const [filter, setFilter] = useState({ tanggal: "", status: "", jenis: "" });
    const [formData, setFormData] = useState({
        judul: "",
        isi: "",
        jenis: "",
        status: "",
        tanggal: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedLaporan, setSelectedLaporan] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const filteredLaporan = laporanList.filter((laporan) => {
        return (
            (!filter.tanggal || laporan.tanggal.includes(filter.tanggal)) &&
            (!filter.status || laporan.status === filter.status) &&
            (!filter.jenis || laporan.jenis === filter.jenis)
        );
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSimpan = () => {
        const { judul, isi, jenis, status, tanggal } = formData;
        if (!judul || !isi || !jenis || !status || !tanggal) {
            alert("Semua field wajib diisi!");
            return;
        }

        if (isEditing) {
            setLaporanList((prev) => prev.map((lap) => (lap.id === selectedLaporan.id ? { ...formData, id: lap.id } : lap)));
            alert("Laporan berhasil diperbarui.");
        } else {
            const newLaporan = {
                ...formData,
                id: Date.now(),
            };
            setLaporanList([newLaporan, ...laporanList]);
            alert("Laporan berhasil dibuat.");
        }

        setFormData({
            judul: "",
            isi: "",
            jenis: "",
            status: "",
            tanggal: "",
        });
        setShowForm(false);
        setIsEditing(false);
    };

    const handleEdit = (laporan) => {
        setIsEditing(true);
        setFormData(laporan);
        setSelectedLaporan(laporan);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus laporan ini?");
        if (confirmDelete) {
            setLaporanList((prev) => prev.filter((lap) => lap.id !== id));
            alert("Laporan berhasil dihapus.");
        }
    };

    const handleDetail = (laporan) => {
        alert(`
      Judul: ${laporan.judul}
      Isi: ${laporan.isi}
      Jenis: ${laporan.jenis}
      Status: ${laporan.status}
      Tanggal: ${laporan.tanggal}
    `);
    };

    return (
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Daftar Laporan</h2>

            {/* Filter */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <input
                    type="date"
                    name="tanggal"
                    value={filter.tanggal}
                    onChange={handleFilterChange}
                    className="w-full rounded border p-2"
                />
                <select
                    name="status"
                    value={filter.status}
                    onChange={handleFilterChange}
                    className="w-full rounded border p-2"
                >
                    <option value="">Semua Status</option>
                    <option value="diterima">Diterima</option>
                    <option value="dalam pengerjaan">Dalam Pengerjaan</option>
                    <option value="selesai">Selesai</option>
                </select>
                <select
                    name="jenis"
                    value={filter.jenis}
                    onChange={handleFilterChange}
                    className="w-full rounded border p-2"
                >
                    <option value="">Semua Jenis</option>
                    <option value="keramaian">Keramaian</option>
                    <option value="tumpukan sampah">Tumpukan Sampah</option>
                </select>
            </div>

            <button
                onClick={() => {
                    setShowForm(true);
                    setIsEditing(false);
                    setFormData({
                        judul: "",
                        isi: "",
                        jenis: "",
                        status: "",
                        tanggal: "",
                    });
                }}
                className="mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
                Buat Laporan
            </button>

            {filteredLaporan.length === 0 ? (
                <p className="text-gray-500">Laporan tidak ditemukan.</p>
            ) : (
                <div className="space-y-4">
                    {filteredLaporan.map((laporan) => (
                        <div
                            key={laporan.id}
                            className="rounded border bg-white p-4 shadow-md"
                        >
                            <h3 className="font-semibold">{laporan.judul}</h3>
                            <p className="truncate text-sm text-gray-600">{laporan.isi}</p>
                            <p className="text-sm">Status: {laporan.status}</p>
                            <p className="text-sm">Tanggal: {laporan.tanggal}</p>
                            <p className="text-sm">Jenis: {laporan.jenis}</p>
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => handleDetail(laporan)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Detail
                                </button>
                                <button
                                    onClick={() => handleEdit(laporan)}
                                    className="text-yellow-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(laporan.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="mt-6 rounded border bg-gray-100 p-4">
                    <h3 className="mb-2 text-lg font-semibold">{isEditing ? "Edit Laporan" : "Buat Laporan Baru"}</h3>
                    <div className="grid gap-4">
                        <input
                            type="text"
                            name="judul"
                            value={formData.judul}
                            onChange={handleFormChange}
                            placeholder="Judul laporan"
                            className="rounded border p-2"
                        />
                        <textarea
                            name="isi"
                            value={formData.isi}
                            onChange={handleFormChange}
                            placeholder="Isi laporan"
                            className="rounded border p-2"
                            rows={3}
                        />
                        <select
                            name="jenis"
                            value={formData.jenis}
                            onChange={handleFormChange}
                            className="rounded border p-2"
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="keramaian">Keramaian</option>
                            <option value="tumpukan sampah">Tumpukan Sampah</option>
                        </select>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            className="rounded border p-2"
                        >
                            <option value="">Pilih Status</option>
                            <option value="diterima">Diterima</option>
                            <option value="dalam pengerjaan">Dalam Pengerjaan</option>
                            <option value="selesai">Selesai</option>
                        </select>
                        <input
                            type="datetime-local"
                            name="tanggal"
                            value={formData.tanggal}
                            onChange={handleFormChange}
                            className="rounded border p-2"
                        />
                        <button
                            onClick={handleSimpan}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaporanPage;

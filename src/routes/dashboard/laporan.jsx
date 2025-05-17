import React, { useState,useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';




const LaporanPage = () => {
    const [laporanList, setLaporanList] = useState([]);
    const [filter, setFilter] = useState({ tanggal: "", status: "", jenis: "" });
    const [showPreview, setShowPreview] = React.useState(false);

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

    // ✅ SweetAlert jika data tidak ditemukan
    useEffect(() => {
        if (
            (filter.tanggal || filter.status || filter.jenis) &&
            filteredLaporan.length === 0
        ) {
            Swal.fire({
                icon: "info",
                title: "Laporan tidak ditemukan.",
                toast: true,
                position: "top",
                timer: 2500,
                showConfirmButton: false,
            });
        }
    }, [filteredLaporan, filter]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const MySwal = withReactContent(Swal);
 
const handleSimpan = () => {
  const { judul, isi, jenis, status, tanggal } = formData;

  // Cek field kosong
  if (!judul || !isi || !jenis || !status || !tanggal) {
    MySwal.fire({
      icon: 'error',
      title: 'Data tidak lengkap',
      text: 'Semua field wajib diisi!',
      timer: 3000,
      showConfirmButton: false,
      position: 'top',
      toast: true,
    });
    return;
  }

  if (isEditing) {
    setLaporanList((prev) =>
      prev.map((lap) =>
        lap.id === selectedLaporan.id ? { ...formData, id: lap.id } : lap
      )
    );
    MySwal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Laporan berhasil diperbarui.',
      timer: 3000,
      showConfirmButton: false,
      position: 'top',
      toast: true,
    });
  } else {
    const newLaporan = {
      ...formData,
      id: Date.now(),
    };
    setLaporanList([newLaporan, ...laporanList]);
    MySwal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Laporan berhasil dibuat.',
      timer: 3000,
      showConfirmButton: false,
      position: 'top',
      toast: true,
    });
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
        Swal.fire({
            title: "Apakah Anda yakin ingin menghapus laporan ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
          }).then((result) => {
            if (result.isConfirmed) {
              setLaporanList(laporanList.filter((laporan) => laporan.id !== id));
              Swal.fire({
                icon: "success",
                title: "Terhapus!",
                text: "Laporan berhasil dihapus.",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          });
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

   

    const handleStatus = (laporan) => {
        setSelectedLaporan(laporan);
        setShowForm(true);
        setIsEditing(false); // Menampilkan modal untuk memilih status
    };

    const handleStatusChange = (e, laporanId) => {
        const newStatus = e.target.value;
        setLaporanList((prev) => prev.map((lap) => (lap.id === laporanId ? { ...lap, status: newStatus } : lap)));
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

            {/* admin */}
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
            <div className="overflow-auto rounded border">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">No.</th>
                            <th className="px-4 py-2">Judul</th>
                            <th className="px-4 py-2">Isi</th>
                            <th className="px-4 py-2">File</th>
                            <th className="px-4 py-2">Jenis</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Tanggal</th>
                            <th className="px-4 py-2">Detail</th>
                            <th className="px-4 py-2">Akses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLaporan.map((laporan, index) => (
                            <tr key={laporan.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="border px-4 py-2 text-center">{index + 1}</td>
                                <td className="border px-4 py-2">{laporan.judul}</td>
                                <td className="border px-4 py-2 whitespace-pre-wrap">{laporan.isi}</td>
                                <td className="border px-4 py-2 text-center">
                                    {laporan.filePdf ? (
                                        <a
                                            href={laporan.filePdf.data}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            {laporan.filePdf.name}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="border px-4 py-2 text-center capitalize">{laporan.jenis}</td>
                                <td className="border px-4 py-2 text-center capitalize">
                                    <select
                                        value={laporan.status}
                                        onChange={(e) => handleStatusChange(e, laporan.id)}
                                        className="rounded border p-1"
                                    >
                                        <option value="diterima">Diterima</option>
                                        <option value="dalam pengerjaan">Dalam Pengerjaan</option>
                                        <option value="selesai">Selesai</option>
                                    </select>
                                </td>
                                <td className="border px-4 py-2">
                                {new Date(laporan.tanggal).toLocaleDateString("id-ID")}
                                </td>

                                
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleDetail(laporan)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Detail
                                    </button>
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(laporan)}
                                        className="text-yellow-600 hover:underline mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(laporan.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}


            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-lg font-semibold">{isEditing ? "Edit Laporan" : "Buat Laporan Baru"}</h3>
                        <div className="grid gap-4">
                            <input
                                type="text"
                                name="judul"
                                value={formData.judul}
                                onChange={handleFormChange}
                                placeholder="Judul laporan"
                                className="rounded border p-2"
                            />
                            <div className="grid gap-4">
                                {/* Input untuk keterangan laporan */}
                                <textarea
                                    name="isi"
                                    value={formData.isi}
                                    onChange={handleFormChange}
                                    placeholder="Tulis keterangan laporan di sini"
                                    className="rounded border p-2"
                                    rows={3}
                                />

                                {/* Input untuk unggah file PDF */}
                                {/* Input untuk unggah file PDF */}
<input
  type="file"
  accept="application/pdf"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          filePdf: {
            name: file.name,
            data: reader.result,
          },
        }));
        setShowPreview(false); // reset preview saat ganti file baru
      };
      reader.readAsDataURL(file);
    } else {
      alert("Mohon unggah file PDF saja.");
    }
  }}
  className="rounded border p-2"
/>

{/* Nama file jadi clickable toggle preview */}
{formData.filePdf && (
  <p
    className="mt-4 text-blue-600 underline cursor-pointer"
    onClick={() => setShowPreview((prev) => !prev)}
    title="Klik untuk lihat preview"
  >
    {formData.filePdf.name}
  </p>
)}

{/* Preview PDF dan tombol unduh */}
{showPreview && formData.filePdf?.data && (
  <div className="mt-4">
    <iframe
      src={formData.filePdf.data}
      title="Preview PDF"
      width="100%"
      height="500px"
      className="rounded border"
    />
    <a
      href={formData.filePdf.data}
      download={formData.filePdf.name}
      className="inline-block mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Unduh File
    </a>
  </div>
)}




                            </div>
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
                            type="date"
                            name="tanggal"
                            value={formData.tanggal}
                            onChange={handleFormChange}
                            className="rounded border p-2"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSimpan}
                                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LaporanPage;

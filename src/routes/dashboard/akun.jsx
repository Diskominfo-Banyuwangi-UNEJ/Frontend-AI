import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";

import { CreditCard, DollarSign, Plus, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const AkunPage = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        nama_instansi: "",
        nama_pimpinan: "",
        status: "",
        username: "",
        email: "",
        password: "",
    });

    const [akunList, setAkunList] = useState([]); // State untuk menyimpan daftar akun

    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi untuk memastikan semua field diisi
        if (!formData.nama_instansi || !formData.nama_pimpinan || !formData.status || !formData.username || !formData.email || !formData.password) {
            alert("Semua data harus diisi");
            return;
        }

        // Validasi format email (sederhana)
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(formData.email)) {
            alert("Terdapat kesalahan dalam pengisian data");
            return;
        }

        // Menambahkan akun baru ke dalam daftar akun
        setAkunList([
            ...akunList,
            { ...formData, id: Date.now() }, // Menggunakan timestamp sebagai ID unik
        ]);

        // Reset form
        setFormData({
            nama_instansi: "",
            nama_pimpinan: "",
            status: "",
            username: "",
            email: "",
            password: "",
        });

        setIsFormVisible(false);

        // Menampilkan pesan sukses
        alert("Registrasi berhasil, silakan login");
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="card-header mb-4 flex items-center justify-between">
                <p className="card-title text-2xl font-semibold">Data Akun Admin dan Pemerintah</p>
                <button
                    onClick={toggleForm}
                    className="flex items-center gap-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" /> Tambah Akun
                </button>
            </div>

            {isFormVisible && (
                <div className="mt-4 rounded-lg bg-white p-6 text-black shadow-lg">
                    <h2 className="mb-4 text-2xl font-semibold">Tambah Akun</h2>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label className="block font-medium">Nama Instansi</label>
                            <select
                                name="nama_instansi"
                                value={formData.nama_instansi}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2"
                            >
                                <option value="">Pilih Instansi</option>
                                <option value="Kominfo">Kominfo</option>
                                <option value="Dishub">Dishub</option>
                                <option value="DLH">DLH</option>
                                <option value="Satpol PP">Satpol PP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium">Nama Pimpinan</label>
                            <input
                                type="text"
                                name="nama_pimpinan"
                                value={formData.nama_pimpinan}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2"
                            >
                                <option value="">Pilih Status</option>
                                <option value="ADMIN">Admin</option>
                                <option value="PEMERINTAH">Pemerintah</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}

            <div className="relative h-[500px] w-full overflow-auto rounded border border-gray-200">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">No.</th>
                            <th className="px-4 py-2">Nama Instansi</th>
                            <th className="px-4 py-2">Nama Pimpinan</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Username</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {akunList.map((akun, index) => (
                            <tr
                                key={akun.id}
                                className={`border-t ${index % 2 === 0 ? "bg-blue-100" : ""}`} // Menambahkan kelas bg-blue-100 untuk baris genap
                            >
                                <td className="px-4 py-2 text-center">{index + 1}</td>
                                <td className="px-4 py-2 text-center">{akun.nama_instansi}</td>
                                <td className="px-4 py-2 text-center">{akun.nama_pimpinan}</td>
                                <td className="px-4 py-2 text-center">{akun.status}</td>
                                <td className="px-4 py-2 text-center">{akun.username}</td>
                                <td className="px-4 py-2 text-center">{akun.email}</td>
                                <td className="px-4 py-2 text-center">
                                    <button className="text-blue-500">
                                        <PencilLine size={20} />
                                    </button>
                                    <button className="ml-2 text-red-500">
                                        <Trash size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AkunPage;

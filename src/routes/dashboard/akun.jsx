import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";

import { CreditCard, DollarSign, Plus, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const AkunPage = () => {
    const { theme } = useTheme();
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [formData, setFormData] = useState({
        nama_instansi: "",
        nama_pimpinan: "",
        status: "",
        username: "",
        email: "",
        password: "",
    });

    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/akun", formData);
            alert("Akun berhasil ditambahkan!");
            setFormData({
                nama_instansi: "",
                nama_pimpinan: "",
                status: "",
                username: "",
                email: "",
                password: "",
            });
            setIsFormVisible(false);
        } catch (err) {
            console.error("Gagal menambahkan akun:", err);
            alert("Terjadi kesalahan saat menambahkan akun.");
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-4">
                {/* Header dengan tombol Tambah Akun */}
                <div className="card-header mb-4 flex items-center justify-between">
                    <p className="card-title text-2xl font-semibold">Data Akun Admin dan Pemerintah</p>
                    <button
                        onClick={toggleForm} // Toggle form visibility ketika tombol diklik
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

                {/* TABEL ISIAN DATA AKUN */}
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">No.</th>
                                    <th className="table-head">Nama Instansi</th>
                                    <th className="table-head">Nama Pimpinan</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Username</th>
                                    <th className="table-head">Email</th>
                                    <th className="table-head">Password</th>
                                    <th className="table-head">Akses</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {topProducts.map((product) => (
                                    <tr
                                        key={product.number}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{product.number}</td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                {/* <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                /> */}
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                {/* <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                /> */}
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                {/* <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                /> */}
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                {/* <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                /> */}
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                {/* <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                /> */}
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                {/* <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                /> */}
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button className="text-blue-500 dark:text-blue-600">
                                                    <PencilLine size={20} />
                                                </button>
                                                <button className="text-red-500">
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// const AccountPage = () => {
//     return (
//         <div className="card">
//             <div className="card-header">
//                 <p className="card-title">Data Akun</p>
//             </div>
//             <div className="card-body p-0">
//                 <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
//                     <table className="table">
//                         <thead className="table-header">
//                             <tr className="table-row">
//                                 <th className="table-head">#</th>
//                                 <th className="table-head">Nama Instansi</th>
//                                 <th className="table-head">Nama Pimpinan</th>
//                                 <th className="table-head">Status</th>
//                                 <th className="table-head">Username</th>
//                                 <th className="table-head">Email</th>
//                                 <th className="table-head">Password</th>
//                                 <th className="table-head">Akses</th>
//                                 <th className="table-head">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="table-body">
//                             {accountData.map((akun) => (
//                                 <tr
//                                     key={akun.id}
//                                     className="table-row"
//                                 >
//                                     <td className="table-cell">{akun.id}</td>
//                                     <td className="table-cell">{akun.namaInstansi}</td>
//                                     <td className="table-cell">{akun.namaPimpinan}</td>
//                                     <td className="table-cell">{akun.status}</td>
//                                     <td className="table-cell">{akun.username}</td>
//                                     <td className="table-cell">{akun.email}</td>
//                                     <td className="table-cell">{akun.password}</td>
//                                     <td className="table-cell">{akun.akses}</td>
//                                     <td className="table-cell">
//                                         <div className="flex items-center gap-x-4">
//                                             <button className="text-blue-500 dark:text-blue-600">
//                                                 <PencilLine size={20} />
//                                             </button>
//                                             <button className="text-red-500">
//                                                 <Trash size={20} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AccountPage;
export default AkunPage;

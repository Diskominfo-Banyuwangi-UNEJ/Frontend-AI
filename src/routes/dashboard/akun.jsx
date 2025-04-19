import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";

import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

const AkunPage = () => {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Akun Admin dan Pemerintah</h1>
            <div className="card">
                <div className="card-header">
                    <p className="card-title"></p>
                </div>
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

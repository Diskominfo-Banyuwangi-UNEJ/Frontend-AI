import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";
import profileImg from "@/assets/profile-image.jpg";
import PropTypes from "prop-types";
import { useState } from "react";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const [showCard, setShowCard] = useState(false);

    const toggleCard = () => setShowCard(!showCard);

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                    />
                </div>
            </div>

            <div className="relative flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>

                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>

                {/* Profile button */}
                <div className="relative">
                    <button
                        className="size-10 overflow-hidden rounded-full"
                        onClick={toggleCard}
                    >
                        <img
                            src={profileImg}
                            alt="profile image"
                            className="size-full object-cover"
                        />
                    </button>

                    {showCard && (
                        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white p-4 text-left shadow-lg dark:bg-slate-800">
                            <div className="mb-4 space-y-5">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Nama Pimpinan : Pak Aziz M.Pd.</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-300">Nama Instansi : Diskominfo</p>
                                <p className="text-sm font-medium text-green-500">Status: Admin</p>
                                {/* </div>
                            <div className="mb-4 text-slate-800 dark:text-slate-200"> */}
                                <p className="text-sm font-medium">
                                    Username: <span className="font-medium">admin1234</span>
                                </p>
                                <p className="text-sm font-medium">
                                    Email: <span className="font-medium">admintampan@mail.com</span>
                                </p>
                            </div>
                            <hr className="my-2 border-slate-300 dark:border-slate-600" />
                            <div className="flex flex-col gap-2 space-y-3">
                                <button className="text-left text-sm font-semibold text-blue-600 hover:underline">Ubah Data</button>
                                <button className="text-left text-sm font-semibold text-red-600 hover:underline">Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};

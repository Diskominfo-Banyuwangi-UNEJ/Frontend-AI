import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

import { navbarLinks } from "@/constants";
import logo from "@/assets/bwi-remove.png";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const { userRole } = useAuth();

  // Jangan tampilkan sidebar sama sekali untuk aktor masyarakat
  if ((userRole || "").toUpperCase() === "MASYARAKAT") return null;

  // Pastikan role selalu uppercase agar cocok dengan key di navbarLinks
  const normalizedRole = (userRole || "").toUpperCase();

  const roleMenus = navbarLinks[normalizedRole] || [];

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0",
      )}
    >
      <div className="flex gap-x-3 p-3 items-center">
        <img src={logo} alt="Logo BWI" className="h-8 w-auto" />
        {!collapsed && (
          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
            DISKOMINFO BANYUWANGI
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-y-4 overflow-y-auto p-3 [scrollbar-width:_thin]">
        {roleMenus.map((navbarGroup) => (
          <nav
            key={navbarGroup.title}
            className={cn("sidebar-group", collapsed && "md:items-center")}
          >
            <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>
              {navbarGroup.title}
            </p>
            {navbarGroup.links.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
              >
                <link.icon size={22} className="flex-shrink-0" />
                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
              </NavLink>
            ))}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};

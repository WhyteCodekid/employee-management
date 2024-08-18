import { Button, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { MenuOpen } from "../icons/menu";
import { adminNavLinks } from "~/data/navlinks";
import { NavLink } from "@remix-run/react";
import { DashboardBox } from "../icons/box";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`h-screen dark:bg-slate-900/10 border-r dark:border-white/5 ${
        open ? "w-[17%]" : "w-20"
      } relative transition-all duration-400 flex flex-col justify-between`}
    >
      <Button
        className="absolute top-2 -right-4"
        isIconOnly
        onClick={() => setOpen(!open)}
      >
        <MenuOpen className="size-6" />
      </Button>

      {/* header */}
      <DashboardBox className="size-10" />

      {/* admin nav links */}
      <div>
        {adminNavLinks.map((link, index) => (
          <div key={index}>
            {!open ? (
              <Tooltip key={index} content={link.label} placement="right">
                <NavLink
                  to={link.path}
                  key={index}
                  end={true}
                  className={({ isActive }) =>
                    `${
                      isActive ? "bg-blue-800" : ""
                    } flex items-center gap-2 px-4 py-2 hover:bg-blue-800 transition-all duration-300 rounded-md ${
                      open ? "" : "justify-center"
                    }`
                  }
                >
                  {link.icon}
                  {!open && <Tooltip></Tooltip>}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink
                to={link.path}
                key={index}
                end={true}
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-blue-800" : ""
                  } flex items-center gap-2 px-4 py-2 hover:bg-blue-800 transition-all duration-300 rounded-md ${
                    open ? "" : "justify-center"
                  }`
                }
              >
                {link.icon} <span> {link.label} </span>
              </NavLink>
            )}
          </div>
        ))}
      </div>

      {/* sidebar footer */}
      <div></div>
    </aside>
  );
}

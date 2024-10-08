import { Button, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { adminNavLinks, staffNavLinks } from "~/data/navlinks";
import { NavLink } from "@remix-run/react";
import { DashboardBox } from "../icons/box";
import { MenuOpen } from "../icons/menu";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`h-screen dark:bg-content2 bg-white border-r dark:border-white/5 ${
        open ? "w-[17%]" : "w-20"
      } relative transition-all duration-400 flex flex-col`}
    >
      <Button
        className="absolute top-4 -right-4"
        isIconOnly
        onClick={() => setOpen(!open)}
        size="sm"
        variant="light"
        color="success"
      >
        <MenuOpen className="size-6" />
      </Button>

      {/* header */}
      <div className="h-28">
        <DashboardBox className="size-10" />
      </div>

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
                    } font-montserrat text-sm font-medium mx-2`
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
                    isActive ? "bg-blue-800 text-white" : ""
                  } flex items-center gap-2 px-4 py-2 hover:bg-blue-800 hover:text-white transition-all duration-300 rounded-lg ${
                    open ? "" : "justify-center"
                  } font-montserrat text-sm font-medium mx-2`
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

export const StaffSidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`h-screen dark:bg-content2 bg-white border-r dark:border-white/5 ${
        open ? "w-[17%]" : "w-20"
      } relative transition-all duration-400 flex flex-col justify-between`}
    >
      <Button
        className="absolute top-4 -right-4"
        isIconOnly
        onClick={() => setOpen(!open)}
        size="sm"
        variant="light"
        color="success"
      >
        <MenuOpen className="size-6" />
      </Button>

      {/* header */}
      <DashboardBox className="size-10" />

      {/* admin nav links */}
      <div>
        {staffNavLinks.map((link, index) => (
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
                    } font-montserrat text-sm font-medium`
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
                  } font-montserrat text-sm font-medium`
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
};

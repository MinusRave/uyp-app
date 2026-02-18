import {
  Calendar,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LayoutTemplate,
  Settings,
  Sheet,
  X,
  PieChart,
  BarChart,
  List,
  SidebarClose,
  SidebarOpen,
  Sliders
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../../client/static/logo.png";
import { cn } from "../../client/utils";
import SidebarLinkGroup from "./SidebarLinkGroup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={cn(
        "z-9999 absolute left-0 top-0 flex h-screen flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 border-r border-gray-200 dark:border-strokedark",
        {
          "translate-x-0": sidebarOpen,
          "-translate-x-full": !sidebarOpen,
        },
        sidebarExpanded ? "w-72.5" : "w-20 hidden lg:flex"
      )}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="py-5.5 lg:py-6.5 flex items-center justify-between gap-2 px-6">
        <NavLink to="/">
          <img src={Logo} alt="Logo" width={50} />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <X />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className={cn("text-muted-foreground mb-4 ml-4 text-sm font-semibold", !sidebarExpanded && "lg:hidden")}>
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  cn(
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                    {
                      "bg-accent text-accent-foreground": isActive,
                    },
                  )
                }
              >
                <LayoutDashboard />
                <span className={cn(!sidebarExpanded && "lg:hidden")}>Dashboard</span>
              </NavLink>

              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Users --> */}
              <li>
                <NavLink
                  to="/admin/users"
                  end
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                      {
                        "bg-accent text-accent-foreground": isActive,
                      },
                    )
                  }
                >
                  <Sheet />
                  <span className={cn(!sidebarExpanded && "lg:hidden")}>Users</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Users --> */}

              {/* <!-- Menu Item Sessions --> */}
              <li>
                <NavLink
                  to="/admin/sessions"
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                      {
                        "bg-accent text-accent-foreground": isActive || pathname.includes("sessions"),
                      },
                    )
                  }
                >
                  <List />
                  <span className={cn(!sidebarExpanded && "lg:hidden")}>Sessions</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Sessions --> */}

              {/* <!-- Menu Item Analytics Group --> */}
              <SidebarLinkGroup
                activeCondition={pathname.includes("analytics")}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={cn(
                          "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                          {
                            "bg-accent text-accent-foreground":
                              pathname.includes("analytics"),
                          },
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <PieChart />
                        <span className={cn(!sidebarExpanded && "lg:hidden")}>Analytics</span>
                        <div className={cn(!sidebarExpanded && "lg:hidden")}>
                          {open ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={cn("translate transform overflow-hidden", {
                          hidden: !open,
                        })}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          {/* Analytics sub-items would be hidden if sidebar is collapsed, but the group itself is hidden or handled above */}
                          <li>
                            <NavLink
                              to="/admin/analytics/funnel"
                              end
                              className={({ isActive }) =>
                                cn(
                                  "text-muted-foreground hover:text-accent group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out",
                                  { "!text-accent": isActive },
                                )
                              }
                            >
                              Funnel Analysis
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/admin/analytics/demographics"
                              end
                              className={({ isActive }) =>
                                cn(
                                  "text-muted-foreground hover:text-accent group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out",
                                  { "!text-accent": isActive },
                                )
                              }
                            >
                              Demographics
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/admin/ai"
                              end
                              className={({ isActive }) =>
                                cn(
                                  "text-muted-foreground hover:text-accent group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out",
                                  { "!text-accent": isActive },
                                )
                              }
                            >
                              AI Logs
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Analytics Group --> */}

              {/* <!-- Menu Item System Config --> */}
              <li>
                <NavLink
                  to="/admin/config"
                  end
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                      {
                        "bg-accent text-accent-foreground": isActive,
                      },
                    )
                  }
                >
                  <Sliders />
                  <span className={cn(!sidebarExpanded && "lg:hidden")}>System Config</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item System Config --> */}

              {/* <!-- Menu Item Settings --> */}
              <li>
                <NavLink
                  to="/admin/settings"
                  end
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                      {
                        "bg-accent text-accent-foreground": isActive,
                      },
                    )
                  }
                >
                  <Settings />
                  <span className={cn(!sidebarExpanded && "lg:hidden")}>Settings</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Settings --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className={cn("text-muted-foreground mb-4 ml-4 text-sm font-semibold", !sidebarExpanded && "lg:hidden")}>
              Extra Components
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Calendar --> */}
              <li>
                <NavLink
                  to="/admin/calendar"
                  end
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                      {
                        "bg-accent text-accent-foreground": isActive,
                      },
                    )
                  }
                >
                  <Calendar />
                  <span className={cn(!sidebarExpanded && "lg:hidden")}>Calendar</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Calendar --> */}

              {/* <!-- Menu Item Ui Elements --> */}
              <SidebarLinkGroup
                activeCondition={pathname === "/ui" || pathname.includes("ui")}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={cn(
                          "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                          {
                            "bg-accent text-accent-foreground":
                              pathname.includes("ui"),
                          },
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <LayoutTemplate />
                        <span className={cn(!sidebarExpanded && "lg:hidden")}>UI Elements</span>
                        <div className={cn(!sidebarExpanded && "lg:hidden")}>
                          {open ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={cn("translate transform overflow-hidden", {
                          hidden: !open,
                        })}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/admin/ui/buttons"
                              end
                              className={({ isActive }) =>
                                cn(
                                  "text-muted-foreground hover:text-accent group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out",
                                  { "!text-accent": isActive },
                                )
                              }
                            >
                              Buttons
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Ui Elements --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>

      {/* Sidebar Expander Button */}
      <div className="hidden lg:flex justify-end mt-auto p-4">
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors text-gray-500"
        >
          {sidebarExpanded ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

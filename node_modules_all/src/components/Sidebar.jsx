import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Licenses", to: "/licenses" },
  { label: "Vendors", to: "/vendors" },
  { label: "Contracts", to: "/contracts" },
  { label: "Users", to: "/users" }
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          LicenseOps
        </p>
        <h1 className="mt-2 text-xl font-semibold text-ink-900">Control Hub</h1>
      </div>
      <nav className="space-y-2 text-sm font-medium">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2 transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span>{item.label}</span>
            <span className="text-xs opacity-70">*</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-10 rounded-2xl bg-slate-900 px-4 py-4 text-white">
        <p className="text-xs uppercase tracking-wide text-slate-300">
          Renewal pulse
        </p>
        <p className="mt-2 text-lg font-semibold">12 alerts pending</p>
        <button className="mt-3 w-full rounded-full bg-white/10 px-3 py-2 text-xs font-semibold">
          Review alerts
        </button>
      </div>
    </aside>
  );
}


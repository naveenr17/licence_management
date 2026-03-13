import { useEffect, useMemo, useState } from "react";

const svgCard = ({ accent, highlight }) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='${accent}'/>
          <stop offset='1' stop-color='${highlight}'/>
        </linearGradient>
      </defs>
      <rect width='400' height='260' rx='28' fill='url(#g)'/>
      <circle cx='305' cy='78' r='62' fill='#ffffff' opacity='0.18'/>
      <rect x='44' y='150' width='220' height='16' rx='8' fill='#ffffff' opacity='0.85'/>
      <rect x='44' y='176' width='160' height='10' rx='5' fill='#ffffff' opacity='0.6'/>
      <rect x='44' y='198' width='110' height='10' rx='5' fill='#ffffff' opacity='0.4'/>
    </svg>`
  )}`;

const svgAvatar = (accent) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='${accent}'/>
          <stop offset='1' stop-color='#0f172a'/>
        </linearGradient>
      </defs>
      <rect width='80' height='80' rx='24' fill='url(#g)'/>
      <circle cx='40' cy='32' r='14' fill='#ffffff' opacity='0.9'/>
      <rect x='20' y='48' width='40' height='18' rx='9' fill='#ffffff' opacity='0.8'/>
    </svg>`
  )}`;

const forecastRanges = {
  "30": {
    label: "Next 30 days",
    value: "74",
    bars: [22, 48, 64, 38, 56, 70, 52, 61, 44, 30]
  },
  "60": {
    label: "Next 60 days",
    value: "128",
    bars: [28, 54, 72, 46, 63, 82, 66, 74, 58, 40]
  },
  "90": {
    label: "Next 90 days",
    value: "212",
    bars: [36, 62, 78, 54, 71, 90, 73, 85, 68, 50]
  }
};

const vendorData = [
  { vendor: "Atlassian", percent: 28, trend: "+6%" },
  { vendor: "Microsoft", percent: 22, trend: "+3%" },
  { vendor: "Adobe", percent: 14, trend: "-2%" },
  { vendor: "Slack", percent: 9, trend: "+1%" }
];

const activityData = [
  {
    title: "Renewal reminder sent for Adobe Creative Cloud",
    time: "1 hour ago",
    detail: "Team owners pinged with a renewal checklist and spend snapshot.",
    accent: "#22c55e",
    type: "Renewal"
  },
  {
    title: "12 seats assigned to Engineering in Atlassian",
    time: "2 hours ago",
    detail: "Auto-provisioned seats from the growth pool for Q2 hires.",
    accent: "#38bdf8",
    type: "Seats"
  },
  {
    title: "New contract added: Microsoft Azure",
    time: "3 hours ago",
    detail: "Term updated to 24 months with a usage-based rider.",
    accent: "#f97316",
    type: "Contracts"
  },
  {
    title: "License expired: Zoom Pro",
    time: "4 hours ago",
    detail: "Policy flagged unused seats across two business units.",
    accent: "#a855f7",
    type: "Alerts"
  }
];

const initialTiles = [
  {
    title: "Engineering Pod",
    subtitle: "Seat utilization 88%",
    tag: "High demand",
    img: svgCard({ accent: "#0f172a", highlight: "#38bdf8" })
  },
  {
    title: "Design Studio",
    subtitle: "License health 92%",
    tag: "Optimized",
    img: svgCard({ accent: "#1e293b", highlight: "#f97316" })
  },
  {
    title: "Revenue Ops",
    subtitle: "Renewals due in 14d",
    tag: "Action needed",
    img: svgCard({ accent: "#0f172a", highlight: "#22c55e" })
  }
];

const STORAGE_KEY = "licenseops.dashboard.prefs.v1";

const loadPrefs = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const savePrefs = (prefs) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};

export default function Dashboard() {
  const prefs = loadPrefs();
  const [activeRange, setActiveRange] = useState(prefs?.activeRange ?? "30");
  const [selectedVendor, setSelectedVendor] = useState(
    prefs?.selectedVendor ?? "Atlassian"
  );
  const [openActivity, setOpenActivity] = useState(prefs?.openActivity ?? 0);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [department, setDepartment] = useState(
    prefs?.department ?? "All teams"
  );
  const [search, setSearch] = useState(prefs?.search ?? "");
  const [activityFilter, setActivityFilter] = useState(
    prefs?.activityFilter ?? "All"
  );
  const [autoRenew, setAutoRenew] = useState(prefs?.autoRenew ?? true);
  const [showSavings, setShowSavings] = useState(prefs?.showSavings ?? false);
  const [tiles, setTiles] = useState(prefs?.tiles ?? initialTiles);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    savePrefs({
      activeRange,
      selectedVendor,
      openActivity,
      department,
      search,
      activityFilter,
      autoRenew,
      showSavings,
      tiles
    });
  }, [
    activeRange,
    selectedVendor,
    openActivity,
    department,
    search,
    activityFilter,
    autoRenew,
    showSavings,
    tiles
  ]);

  const imageTiles = useMemo(() => tiles, [tiles]);

  const activeForecast = forecastRanges[activeRange];

  const filteredActivities = activityData.filter((activity) => {
    const matchesType =
      activityFilter === "All" || activity.type === activityFilter;
    const matchesSearch = activity.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...tiles];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setTiles(updated);
    setDragIndex(null);
  };

  return (
    <div className="space-y-6">
      <section className="card flex flex-wrap items-center gap-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Filters
          </p>
          <h2 className="text-lg font-semibold">Focus your view</h2>
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveRange("30")}
            className={`chip transition ${
              activeRange === "30"
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-200"
            }`}
          >
            Last 30d
          </button>
          <button
            type="button"
            onClick={() => setActiveRange("60")}
            className={`chip transition ${
              activeRange === "60"
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-200"
            }`}
          >
            Last 60d
          </button>
          <button
            type="button"
            onClick={() => setActiveRange("90")}
            className={`chip transition ${
              activeRange === "90"
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-200"
            }`}
          >
            Last 90d
          </button>
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
          >
            <option>All teams</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>Revenue Ops</option>
            <option>Security</option>
          </select>
          <div className="relative">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search activity"
              className="w-48 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
            />
          </div>
          <button
            type="button"
            onClick={() => setAutoRenew((value) => !value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              autoRenew
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Auto-renew: {autoRenew ? "On" : "Off"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Licenses", value: "1,284" },
          { label: "Active", value: "1,010" },
          { label: "Expiring < 30d", value: "74" },
          { label: "Monthly Spend", value: "$96.4k" }
        ].map((card) => (
          <div
            key={card.label}
            className="card p-4 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            <p className="mt-3 text-xs text-slate-400">
              Filter: {department}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Expiration Forecast</h2>
              <p className="text-xs text-slate-500">
                Hover a bar to see projected renewals.
              </p>
            </div>
            <div className="flex gap-2 text-xs font-medium text-slate-500">
              {Object.keys(forecastRanges).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setActiveRange(range)}
                  className={`chip transition ${
                    activeRange === range
                      ? "bg-slate-900 text-white"
                      : "hover:bg-slate-200"
                  }`}
                  aria-pressed={activeRange === range}
                >
                  {range}d
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 h-48 rounded-xl bg-gradient-to-br from-slate-100 via-white to-slate-100 p-4">
            <div className="flex h-full items-end gap-2">
              {activeForecast.bars.map((value, index) => (
                <button
                  key={`${activeRange}-${index}`}
                  type="button"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="group relative flex-1"
                >
                  <div
                    className={`w-full rounded-full transition-all duration-500 ${
                      hoveredBar === index
                        ? "bg-slate-900"
                        : "bg-slate-900/70"
                    }`}
                    style={{ height: `${value}%` }}
                  />
                  {hoveredBar === index && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                      {value}%
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {Object.entries(forecastRanges).map(([range, item]) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={`rounded-xl p-3 text-left transition ${
                  activeRange === range
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <p className="text-xs uppercase tracking-wide opacity-70">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-semibold">{item.value}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Vendor Mix</h2>
            <span className="text-xs font-semibold text-slate-400">
              Click to focus
            </span>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {vendorData.map((vendor) => (
              <li key={vendor.vendor}>
                <button
                  type="button"
                  onClick={() => setSelectedVendor(vendor.vendor)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                    selectedVendor === vendor.vendor
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-medium">{vendor.vendor}</span>
                  <span className="text-xs opacity-80">{vendor.trend}</span>
                </button>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      selectedVendor === vendor.vendor
                        ? "bg-slate-900"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${vendor.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cost Summary</h2>
            <button
              type="button"
              onClick={() => setShowSavings((value) => !value)}
              className="chip"
            >
              {showSavings ? "Hide" : "Show"} savings
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { label: "Annual Contract Value", value: "$1.12M" },
              { label: "Projected Renewals", value: "$420k" },
              { label: "Unused Seats", value: "$64k" }
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
          {showSavings && (
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              Estimated savings for {department}: $82k based on current seat
              utilization.
            </div>
          )}
          <button className="mt-5 w-full rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">
            Schedule cost review
          </button>
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div className="flex flex-wrap gap-2">
              {["All", "Renewal", "Seats", "Contracts", "Alerts"].map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActivityFilter(filter)}
                    className={`chip transition ${
                      activityFilter === filter
                        ? "bg-slate-900 text-white"
                        : "hover:bg-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {filteredActivities.map((activity, index) => (
              <li key={activity.title}>
                <button
                  type="button"
                  onClick={() => setOpenActivity(index)}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                    openActivity === index
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <img
                    src={svgAvatar(activity.accent)}
                    alt=""
                    className="h-10 w-10 rounded-2xl"
                  />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-xs opacity-70">{activity.time}</p>
                    {openActivity === index && (
                      <p className="mt-2 text-xs opacity-80">
                        {activity.detail}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
            {filteredActivities.length === 0 && (
              <li className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-500">
                No activity matches this filter.
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Team Snapshots</h2>
              <p className="text-xs text-slate-500">
                Drag cards to reorder your focus.
              </p>
            </div>
            <button className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
              View gallery
            </button>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {imageTiles.map((tile, index) => (
              <article
                key={tile.title}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="group cursor-grab overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={tile.img}
                  alt={`${tile.title} status`}
                  className="h-36 w-full object-cover"
                />
                <div className="space-y-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {tile.tag}
                  </p>
                  <h3 className="text-lg font-semibold">{tile.title}</h3>
                  <p className="text-sm text-slate-500">{tile.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

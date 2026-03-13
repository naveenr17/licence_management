import { Fragment, useMemo, useState } from "react";

const initialVendors = [
  {
    id: "VEN-1001",
    name: "Atlassian",
    status: "Active",
    contracts: 6,
    spend: 280000,
    renewal: "2026-05-14",
    tier: "Strategic",
    risk: "Low",
    owner: "Ava Patel",
    country: "Australia",
    email: "procurement@atlassian.com",
    phone: "+61 2 8880 3000",
    notes: "Strong adoption in Engineering and Service Management."
  },
  {
    id: "VEN-1002",
    name: "Microsoft",
    status: "Active",
    contracts: 4,
    spend: 420000,
    renewal: "2026-04-02",
    tier: "Strategic",
    risk: "Medium",
    owner: "Miguel Santos",
    country: "United States",
    email: "vendorops@microsoft.com",
    phone: "+1 425 555 0102",
    notes: "Includes M365 E5 and Azure EA."
  },
  {
    id: "VEN-1003",
    name: "Adobe",
    status: "At Risk",
    contracts: 2,
    spend: 150000,
    renewal: "2026-06-01",
    tier: "Preferred",
    risk: "High",
    owner: "Nora Kim",
    country: "United States",
    email: "renewals@adobe.com",
    phone: "+1 408 555 0118",
    notes: "Pending consolidation of legacy plans."
  },
  {
    id: "VEN-1004",
    name: "Slack",
    status: "Active",
    contracts: 3,
    spend: 286000,
    renewal: "2026-07-11",
    tier: "Preferred",
    risk: "Low",
    owner: "Sasha Ivanov",
    country: "United States",
    email: "success@slack.com",
    phone: "+1 415 555 0174",
    notes: "Enterprise Grid support included."
  },
  {
    id: "VEN-1005",
    name: "Zoom",
    status: "At Risk",
    contracts: 1,
    spend: 72000,
    renewal: "2026-03-20",
    tier: "Standard",
    risk: "High",
    owner: "Liam Carter",
    country: "United States",
    email: "account@zoom.us",
    phone: "+1 888 555 0135",
    notes: "Usage dips during summer."
  },
  {
    id: "VEN-1006",
    name: "Figma",
    status: "Inactive",
    contracts: 1,
    spend: 132000,
    renewal: "2026-03-10",
    tier: "Standard",
    risk: "Medium",
    owner: "Priya Shah",
    country: "United States",
    email: "support@figma.com",
    phone: "+1 650 555 0122",
    notes: "Reviewing renewal with procurement."
  }
];

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  "At Risk": "bg-amber-50 text-amber-700",
  Inactive: "bg-slate-100 text-slate-600"
};

const riskStyles = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700"
};

const formatCurrency = (value) =>
  `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const daysUntil = (dateString) => {
  const today = new Date();
  const target = new Date(dateString);
  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [renewalFilter, setRenewalFilter] = useState("Any Renewal");
  const [sortBy, setSortBy] = useState("spend");
  const [sortDir, setSortDir] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const [form, setForm] = useState({
    name: "",
    status: "Active",
    contracts: "",
    spend: "",
    renewal: "",
    tier: "Standard",
    risk: "Low",
    owner: "",
    country: "United States",
    email: "",
    phone: "",
    notes: ""
  });

  const countries = useMemo(() => {
    const list = Array.from(new Set(vendors.map((item) => item.country)));
    return ["All", ...list];
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vendors
      .filter((vendor) => {
        const matchesSearch =
          vendor.name.toLowerCase().includes(query) ||
          vendor.owner.toLowerCase().includes(query) ||
          vendor.id.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "All" || vendor.status === statusFilter;
        const matchesTier = tierFilter === "All" || vendor.tier === tierFilter;
        const matchesRisk = riskFilter === "All" || vendor.risk === riskFilter;
        const matchesCountry =
          countryFilter === "All" || vendor.country === countryFilter;
        const days = daysUntil(vendor.renewal);
        const matchesRenewal =
          renewalFilter === "Any Renewal" ||
          (renewalFilter === "30 days" && days <= 30 && days >= 0) ||
          (renewalFilter === "60 days" && days <= 60 && days >= 0) ||
          (renewalFilter === "90 days" && days <= 90 && days >= 0) ||
          (renewalFilter === "Overdue" && days < 0);
        return (
          matchesSearch &&
          matchesStatus &&
          matchesTier &&
          matchesRisk &&
          matchesCountry &&
          matchesRenewal
        );
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
        if (sortBy === "spend") return (a.spend - b.spend) * dir;
        if (sortBy === "contracts") return (a.contracts - b.contracts) * dir;
        if (sortBy === "renewal")
          return (new Date(a.renewal) - new Date(b.renewal)) * dir;
        return 0;
      });
  }, [
    vendors,
    search,
    statusFilter,
    tierFilter,
    riskFilter,
    countryFilter,
    renewalFilter,
    sortBy,
    sortDir
  ]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddVendor = (event) => {
    event.preventDefault();
    const newVendor = {
      id: `VEN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name.trim() || "Untitled Vendor",
      status: form.status,
      contracts: Number(form.contracts || 0),
      spend: Number(form.spend || 0),
      renewal: form.renewal || "2026-12-31",
      tier: form.tier,
      risk: form.risk,
      owner: form.owner.trim() || "Unassigned",
      country: form.country,
      email: form.email.trim() || "vendor@company.com",
      phone: form.phone.trim() || "",
      notes: form.notes.trim() || "No notes yet."
    };
    setVendors((prev) => [newVendor, ...prev]);
    setIsModalOpen(false);
    setForm({
      name: "",
      status: "Active",
      contracts: "",
      spend: "",
      renewal: "",
      tier: "Standard",
      risk: "Low",
      owner: "",
      country: "United States",
      email: "",
      phone: "",
      notes: ""
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTierFilter("All");
    setRiskFilter("All");
    setCountryFilter("All");
    setRenewalFilter("Any Renewal");
    setSortBy("spend");
    setSortDir("desc");
  };

  const renderEmptyState = () => (
    <div className="card p-6 text-sm text-slate-500">
      No vendors match these filters.
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="w-full min-w-[200px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            placeholder="Search vendor, owner, ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="w-full min-w-[160px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {["All", "Active", "At Risk", "Inactive"].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select
            className="w-full min-w-[160px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={tierFilter}
            onChange={(event) => setTierFilter(event.target.value)}
          >
            {["All", "Strategic", "Preferred", "Standard"].map((tier) => (
              <option key={tier}>{tier}</option>
            ))}
          </select>
          <select
            className="w-full min-w-[160px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
          >
            {["All", "Low", "Medium", "High"].map((risk) => (
              <option key={risk}>{risk}</option>
            ))}
          </select>
          <select
            className="w-full min-w-[180px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
          >
            {countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
          <select
            className="w-full min-w-[180px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={renewalFilter}
            onChange={(event) => setRenewalFilter(event.target.value)}
          >
            <option>Any Renewal</option>
            <option>30 days</option>
            <option>60 days</option>
            <option>90 days</option>
            <option>Overdue</option>
          </select>
          <select
            className="w-full min-w-[160px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="spend">Sort by spend</option>
            <option value="name">Sort by name</option>
            <option value="contracts">Sort by contracts</option>
            <option value="renewal">Sort by renewal</option>
          </select>
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            {sortDir === "asc" ? "Ascending" : "Descending"}
          </button>
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={resetFilters}
          >
            Reset filters
          </button>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
            <button
              className={`rounded-full px-3 py-1 ${
                viewMode === "cards"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600"
              }`}
              onClick={() => setViewMode("cards")}
            >
              Cards
            </button>
            <button
              className={`rounded-full px-3 py-1 ${
                viewMode === "table"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600"
              }`}
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
          </div>
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Add new vendor
          </button>
        </div>
      </section>

      {viewMode === "cards" ? (
        <section className="grid gap-4 lg:grid-cols-3">
          {filteredVendors.map((vendor) => {
            const isExpanded = expandedId === vendor.id;
            return (
              <div
                key={vendor.id}
                className="card p-5 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : vendor.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {vendor.id}
                    </p>
                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                  </div>
                  <span className={`chip ${statusStyles[vendor.status] || ""}`}>
                    {vendor.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    Contracts: <span className="font-semibold">{vendor.contracts}</span>
                  </p>
                  <p>
                    Annual spend: <span className="font-semibold">{formatCurrency(vendor.spend)}</span>
                  </p>
                  <p>
                    Renewal: <span className="font-semibold">{vendor.renewal}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskStyles[vendor.risk] || ""}`}>
                      Risk: {vendor.risk}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      Tier: {vendor.tier}
                    </span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-2">
                    <p>
                      Owner: <span className="font-semibold">{vendor.owner}</span>
                    </p>
                    <p>
                      Country: <span className="font-semibold">{vendor.country}</span>
                    </p>
                    <p>
                      Contact: <span className="font-semibold">{vendor.email}</span>
                    </p>
                    <p>
                      Phone: <span className="font-semibold">{vendor.phone}</span>
                    </p>
                    <p className="text-slate-500">{vendor.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
          {filteredVendors.length === 0 && renderEmptyState()}
        </section>
      ) : (
        <section className="card overflow-hidden">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-5 py-3 w-[28%]">Vendor</th>
                <th className="px-5 py-3 w-[12%]">Status</th>
                <th className="px-5 py-3 w-[12%]">Tier</th>
                <th className="px-5 py-3 w-[10%]">Risk</th>
                <th className="px-5 py-3 w-[10%]">Contracts</th>
                <th className="px-5 py-3 w-[14%]">Renewal</th>
                <th className="px-5 py-3 w-[14%] text-right">Spend</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => {
                const isExpanded = expandedId === vendor.id;
                return (
                  <Fragment key={vendor.id}>
                    <tr
                      className="border-t border-slate-100 cursor-pointer align-middle"
                      onClick={() => setExpandedId(isExpanded ? null : vendor.id)}
                    >
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <div className="space-y-1">
                          <p>{vendor.name}</p>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            {vendor.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[vendor.status] || ""}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">{vendor.tier}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskStyles[vendor.risk] || ""}`}>
                          {vendor.risk}
                        </span>
                      </td>
                      <td className="px-5 py-4">{vendor.contracts}</td>
                      <td className="px-5 py-4">{vendor.renewal}</td>
                      <td className="px-5 py-4 text-right font-semibold">
                        {formatCurrency(vendor.spend)}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-t border-slate-100 bg-slate-50">
                        <td className="px-5 py-4" colSpan={7}>
                          <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                            <div>
                              <p className="font-semibold text-slate-700">Owner</p>
                              <p>{vendor.owner}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700">Country</p>
                              <p>{vendor.country}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700">Contact</p>
                              <p>{vendor.email}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700">Phone</p>
                              <p>{vendor.phone}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="font-semibold text-slate-700">Notes</p>
                              <p>{vendor.notes}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filteredVendors.length === 0 && (
                <tr>
                  <td className="px-5 py-6" colSpan={7}>
                    <div className="text-sm text-slate-500">
                      No vendors match these filters.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add New Vendor</h2>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleAddVendor}>
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Vendor name"
                required
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Account owner"
                value={form.owner}
                onChange={(event) => handleFormChange("owner", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Contact email"
                value={form.email}
                onChange={(event) => handleFormChange("email", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Phone"
                value={form.phone}
                onChange={(event) => handleFormChange("phone", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Contracts"
                type="number"
                min="0"
                value={form.contracts}
                onChange={(event) => handleFormChange("contracts", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Annual spend (USD)"
                type="number"
                min="0"
                value={form.spend}
                onChange={(event) => handleFormChange("spend", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                type="date"
                value={form.renewal}
                onChange={(event) => handleFormChange("renewal", event.target.value)}
              />
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.status}
                onChange={(event) => handleFormChange("status", event.target.value)}
              >
                {["Active", "At Risk", "Inactive"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.tier}
                onChange={(event) => handleFormChange("tier", event.target.value)}
              >
                {["Strategic", "Preferred", "Standard"].map((tier) => (
                  <option key={tier}>{tier}</option>
                ))}
              </select>
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.risk}
                onChange={(event) => handleFormChange("risk", event.target.value)}
              >
                {["Low", "Medium", "High"].map((risk) => (
                  <option key={risk}>{risk}</option>
                ))}
              </select>
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.country}
                onChange={(event) => handleFormChange("country", event.target.value)}
              >
                {[
                  "United States",
                  "Australia",
                  "India",
                  "United Kingdom",
                  "Germany"
                ].map((country) => (
                  <option key={country}>{country}</option>
                ))}
              </select>
              <textarea
                className="sm:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Notes"
                rows="3"
                value={form.notes}
                onChange={(event) => handleFormChange("notes", event.target.value)}
              />
              <div className="sm:col-span-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Save vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";

const initialLicenses = [
  {
    id: "LIC-2041",
    product: "Atlassian Suite",
    vendor: "Atlassian",
    seatsUsed: 120,
    seatsTotal: 140,
    expires: "2026-05-14",
    cost: 18400,
    status: "Active",
    department: "Engineering",
    owner: "Ava Patel",
    type: "Subscription",
    renewal: "Annual",
    autoRenew: true,
    notes: "Includes Jira, Confluence, and Jira Service Management."
  },
  {
    id: "LIC-1183",
    product: "Microsoft 365 E5",
    vendor: "Microsoft",
    seatsUsed: 260,
    seatsTotal: 300,
    expires: "2026-04-02",
    cost: 41200,
    status: "Active",
    department: "Operations",
    owner: "Miguel Santos",
    type: "Enterprise",
    renewal: "Annual",
    autoRenew: true,
    notes: "Security add-ons enabled for finance."
  },
  {
    id: "LIC-0933",
    product: "Adobe Creative Cloud",
    vendor: "Adobe",
    seatsUsed: 68,
    seatsTotal: 80,
    expires: "2026-06-01",
    cost: 21900,
    status: "Active",
    department: "Design",
    owner: "Nora Kim",
    type: "Subscription",
    renewal: "Annual",
    autoRenew: false,
    notes: "Shared license pool for freelancers."
  },
  {
    id: "LIC-3120",
    product: "Zoom Pro",
    vendor: "Zoom",
    seatsUsed: 42,
    seatsTotal: 60,
    expires: "2026-03-20",
    cost: 7200,
    status: "Expiring",
    department: "People",
    owner: "Liam Carter",
    type: "Subscription",
    renewal: "Monthly",
    autoRenew: false,
    notes: "Usage drops during summer season."
  },
  {
    id: "LIC-2217",
    product: "Slack Business+",
    vendor: "Slack",
    seatsUsed: 310,
    seatsTotal: 340,
    expires: "2026-07-11",
    cost: 28600,
    status: "Active",
    department: "Company",
    owner: "Sasha Ivanov",
    type: "Enterprise",
    renewal: "Annual",
    autoRenew: true,
    notes: "Includes Enterprise Grid support."
  },
  {
    id: "LIC-1448",
    product: "Figma Organization",
    vendor: "Figma",
    seatsUsed: 88,
    seatsTotal: 110,
    expires: "2026-03-10",
    cost: 13200,
    status: "Overdue",
    department: "Design",
    owner: "Priya Shah",
    type: "Subscription",
    renewal: "Annual",
    autoRenew: false,
    notes: "Awaiting renewal approval."
  }
];

const formatCurrency = (value) =>
  `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const daysUntil = (dateString) => {
  const today = new Date();
  const target = new Date(dateString);
  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Expiring: "bg-amber-50 text-amber-700",
  Overdue: "bg-rose-50 text-rose-700"
};

export default function LicensesPage() {
  const [licenses, setLicenses] = useState(initialLicenses);
  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [expirationFilter, setExpirationFilter] = useState("Any Expiration");
  const [sortBy, setSortBy] = useState("expires");
  const [sortDir, setSortDir] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({
    id: "",
    product: "",
    vendor: "",
    seatsUsed: "",
    seatsTotal: "",
    expires: "",
    cost: "",
    status: "Active",
    department: "Engineering",
    owner: "",
    type: "Subscription",
    renewal: "Annual",
    autoRenew: true,
    notes: ""
  });

  const vendors = useMemo(() => {
    const list = Array.from(new Set(licenses.map((item) => item.vendor)));
    return ["All", ...list];
  }, [licenses]);

  const departments = useMemo(() => {
    const list = Array.from(new Set(licenses.map((item) => item.department)));
    return ["All", ...list];
  }, [licenses]);

  const filteredLicenses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return licenses
      .filter((item) => {
        const matchesSearch =
          item.product.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.owner.toLowerCase().includes(query);
        const matchesVendor =
          vendorFilter === "All" || item.vendor === vendorFilter;
        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;
        const matchesDepartment =
          departmentFilter === "All" || item.department === departmentFilter;
        const days = daysUntil(item.expires);
        const matchesExpiration =
          expirationFilter === "Any Expiration" ||
          (expirationFilter === "30 days" && days <= 30 && days >= 0) ||
          (expirationFilter === "60 days" && days <= 60 && days >= 0) ||
          (expirationFilter === "90 days" && days <= 90 && days >= 0) ||
          (expirationFilter === "Overdue" && days < 0);
        return (
          matchesSearch &&
          matchesVendor &&
          matchesStatus &&
          matchesDepartment &&
          matchesExpiration
        );
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortBy === "product") return a.product.localeCompare(b.product) * dir;
        if (sortBy === "vendor") return a.vendor.localeCompare(b.vendor) * dir;
        if (sortBy === "expires")
          return (new Date(a.expires) - new Date(b.expires)) * dir;
        if (sortBy === "cost") return (a.cost - b.cost) * dir;
        if (sortBy === "usage")
          return (a.seatsUsed / a.seatsTotal - b.seatsUsed / b.seatsTotal) * dir;
        return 0;
      });
  }, [
    licenses,
    search,
    vendorFilter,
    statusFilter,
    departmentFilter,
    expirationFilter,
    sortBy,
    sortDir
  ]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLicense = (event) => {
    event.preventDefault();
    const id = form.id.trim() || `LIC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLicense = {
      id,
      product: form.product.trim() || "Untitled License",
      vendor: form.vendor.trim() || "Unknown",
      seatsUsed: Number(form.seatsUsed || 0),
      seatsTotal: Number(form.seatsTotal || 0),
      expires: form.expires || "2026-12-31",
      cost: Number(form.cost || 0),
      status: form.status,
      department: form.department,
      owner: form.owner.trim() || "Unassigned",
      type: form.type,
      renewal: form.renewal,
      autoRenew: form.autoRenew,
      notes: form.notes.trim() || "No notes yet."
    };
    setLicenses((prev) => [newLicense, ...prev]);
    setIsModalOpen(false);
    setForm({
      id: "",
      product: "",
      vendor: "",
      seatsUsed: "",
      seatsTotal: "",
      expires: "",
      cost: "",
      status: "Active",
      department: "Engineering",
      owner: "",
      type: "Subscription",
      renewal: "Annual",
      autoRenew: true,
      notes: ""
    });
  };

  const resetFilters = () => {
    setSearch("");
    setVendorFilter("All");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setExpirationFilter("Any Expiration");
    setSortBy("expires");
    setSortDir("asc");
  };

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="w-full min-w-[180px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            placeholder="Search product, ID, owner"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="w-full min-w-[160px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={vendorFilter}
            onChange={(event) => setVendorFilter(event.target.value)}
          >
            {vendors.map((vendor) => (
              <option key={vendor}>{vendor}</option>
            ))}
          </select>
          <select
            className="w-full min-w-[160px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {["All", "Active", "Expiring", "Overdue"].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select
            className="w-full min-w-[180px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="w-full min-w-[180px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={expirationFilter}
            onChange={(event) => setExpirationFilter(event.target.value)}
          >
            <option>Any Expiration</option>
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
            <option value="expires">Sort by expiry</option>
            <option value="product">Sort by product</option>
            <option value="vendor">Sort by vendor</option>
            <option value="cost">Sort by cost</option>
            <option value="usage">Sort by usage</option>
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
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Add license
          </button>
        </div>
      </section>

      <section className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-5 py-3">License</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Vendor</th>
              <th className="px-5 py-3">Usage</th>
              <th className="px-5 py-3">Expires</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicenses.map((license) => {
              const usagePercent = Math.round(
                (license.seatsUsed / Math.max(license.seatsTotal, 1)) * 100
              );
              const isExpanded = expandedId === license.id;
              return (
                <>
                  <tr
                    key={license.id}
                    className="border-t border-slate-100 cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : license.id)
                    }
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {license.id}
                    </td>
                    <td className="px-5 py-4">{license.product}</td>
                    <td className="px-5 py-4">{license.vendor}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span>{license.seatsUsed}</span>
                        <span className="text-slate-400">/</span>
                        <span>{license.seatsTotal}</span>
                        <span className="text-xs text-slate-400">
                          ({usagePercent}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">{license.expires}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[license.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {license.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">
                      {formatCurrency(license.cost)}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td className="px-5 py-4" colSpan={7}>
                        <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                          <div>
                            <p className="font-semibold text-slate-700">Owner</p>
                            <p>{license.owner}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">Department</p>
                            <p>{license.department}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">Plan</p>
                            <p>
                              {license.type} · {license.renewal}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">Auto renew</p>
                            <p>{license.autoRenew ? "Enabled" : "Disabled"}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="font-semibold text-slate-700">Notes</p>
                            <p>{license.notes}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add License</h2>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleAddLicense}>
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="License ID"
                value={form.id}
                onChange={(event) => handleFormChange("id", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Product name"
                required
                value={form.product}
                onChange={(event) => handleFormChange("product", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Vendor"
                required
                value={form.vendor}
                onChange={(event) => handleFormChange("vendor", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Owner"
                value={form.owner}
                onChange={(event) => handleFormChange("owner", event.target.value)}
              />
              <div className="flex gap-3">
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Seats used"
                  type="number"
                  min="0"
                  value={form.seatsUsed}
                  onChange={(event) => handleFormChange("seatsUsed", event.target.value)}
                />
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Seats total"
                  type="number"
                  min="0"
                  value={form.seatsTotal}
                  onChange={(event) => handleFormChange("seatsTotal", event.target.value)}
                />
              </div>
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                type="date"
                value={form.expires}
                onChange={(event) => handleFormChange("expires", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Cost (USD)"
                type="number"
                min="0"
                value={form.cost}
                onChange={(event) => handleFormChange("cost", event.target.value)}
              />
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.status}
                onChange={(event) => handleFormChange("status", event.target.value)}
              >
                {["Active", "Expiring", "Overdue"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.department}
                onChange={(event) => handleFormChange("department", event.target.value)}
              >
                {["Engineering", "Design", "Operations", "People", "Company"].map(
                  (dept) => (
                    <option key={dept}>{dept}</option>
                  )
                )}
              </select>
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.type}
                onChange={(event) => handleFormChange("type", event.target.value)}
              >
                {["Subscription", "Enterprise", "Perpetual"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.renewal}
                onChange={(event) => handleFormChange("renewal", event.target.value)}
              >
                {["Monthly", "Annual", "Bi-Annual"].map((renewal) => (
                  <option key={renewal}>{renewal}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.autoRenew}
                  onChange={(event) =>
                    handleFormChange("autoRenew", event.target.checked)
                  }
                />
                Auto renew
              </label>
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
                  Save license
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

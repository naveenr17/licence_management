import { Fragment, useMemo, useState } from "react";

const initialContracts = [
  {
    id: "CON-3001",
    name: "Microsoft Azure Enterprise",
    vendor: "Microsoft",
    renews: "2026-04-20",
    value: 320000,
    status: "Renewal due",
    owner: "Miguel Santos",
    term: "24 months",
    type: "Enterprise",
    autoRenew: true,
    notes: "Includes Azure EA and security add-ons."
  },
  {
    id: "CON-3002",
    name: "Atlassian Cloud",
    vendor: "Atlassian",
    renews: "2026-06-10",
    value: 180000,
    status: "Active",
    owner: "Ava Patel",
    term: "12 months",
    type: "Subscription",
    autoRenew: true,
    notes: "Jira + Confluence bundle for Engineering."
  },
  {
    id: "CON-3003",
    name: "Adobe Creative Cloud",
    vendor: "Adobe",
    renews: "2026-03-30",
    value: 90000,
    status: "Renewal due",
    owner: "Nora Kim",
    term: "12 months",
    type: "Subscription",
    autoRenew: false,
    notes: "Design team licenses with shared pools."
  },
  {
    id: "CON-3004",
    name: "Slack Enterprise Grid",
    vendor: "Slack",
    renews: "2026-07-11",
    value: 250000,
    status: "Active",
    owner: "Sasha Ivanov",
    term: "24 months",
    type: "Enterprise",
    autoRenew: true,
    notes: "Company-wide messaging platform."
  },
  {
    id: "CON-3005",
    name: "Zoom Pro",
    vendor: "Zoom",
    renews: "2026-03-20",
    value: 72000,
    status: "Expired",
    owner: "Liam Carter",
    term: "12 months",
    type: "Subscription",
    autoRenew: false,
    notes: "Usage dropped; renewal paused."
  }
];

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  "Renewal due": "bg-amber-50 text-amber-700",
  Expired: "bg-rose-50 text-rose-700"
};

const formatCurrency = (value) =>
  `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function ContractsPage() {
  const [contracts, setContracts] = useState(initialContracts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    vendor: "",
    renews: "",
    value: "",
    status: "Active",
    owner: "",
    term: "12 months",
    type: "Subscription",
    autoRenew: true,
    notes: ""
  });

  const filteredContracts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return contracts.filter((contract) => {
      const matchesSearch =
        contract.name.toLowerCase().includes(query) ||
        contract.vendor.toLowerCase().includes(query) ||
        contract.id.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All statuses" || contract.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contracts, search, statusFilter]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddContract = (event) => {
    event.preventDefault();
    const newContract = {
      id: `CON-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name.trim() || "Untitled Contract",
      vendor: form.vendor.trim() || "Unknown",
      renews: form.renews || "2026-12-31",
      value: Number(form.value || 0),
      status: form.status,
      owner: form.owner.trim() || "Unassigned",
      term: form.term,
      type: form.type,
      autoRenew: form.autoRenew,
      notes: form.notes.trim() || "No notes yet."
    };
    setContracts((prev) => [newContract, ...prev]);
    setIsModalOpen(false);
    setForm({
      name: "",
      vendor: "",
      renews: "",
      value: "",
      status: "Active",
      owner: "",
      term: "12 months",
      type: "Subscription",
      autoRenew: true,
      notes: ""
    });
  };

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="w-full min-w-[200px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            placeholder="Search contract, vendor, ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="w-full min-w-[180px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Renewal due</option>
            <option>Expired</option>
          </select>
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setIsModalOpen(true)}
          >
            New contract
          </button>
        </div>
      </section>

      <section className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-5 py-3">Contract</th>
              <th className="px-5 py-3">Vendor</th>
              <th className="px-5 py-3">Renewal</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map((contract) => {
              const isExpanded = expandedId === contract.id;
              return (
                <Fragment key={contract.id}>
                  <tr
                    className="border-t border-slate-100 cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : contract.id)
                    }
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      <div className="space-y-1">
                        <p>{contract.name}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {contract.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">{contract.vendor}</td>
                    <td className="px-5 py-4">{contract.renews}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[contract.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">
                      {formatCurrency(contract.value)}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td className="px-5 py-4" colSpan={5}>
                        <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                          <div>
                            <p className="font-semibold text-slate-700">Owner</p>
                            <p>{contract.owner}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">Type</p>
                            <p>{contract.type}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">Term</p>
                            <p>{contract.term}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">Auto renew</p>
                            <p>{contract.autoRenew ? "Enabled" : "Disabled"}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="font-semibold text-slate-700">Notes</p>
                            <p>{contract.notes}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {filteredContracts.length === 0 && (
              <tr>
                <td className="px-5 py-6" colSpan={5}>
                  <div className="text-sm text-slate-500">
                    No contracts match these filters.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Contract</h2>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleAddContract}>
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Contract name"
                required
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
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
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                type="date"
                value={form.renews}
                onChange={(event) => handleFormChange("renews", event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Contract value (USD)"
                type="number"
                min="0"
                value={form.value}
                onChange={(event) => handleFormChange("value", event.target.value)}
              />
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.status}
                onChange={(event) => handleFormChange("status", event.target.value)}
              >
                {["Active", "Renewal due", "Expired"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
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
                value={form.term}
                onChange={(event) => handleFormChange("term", event.target.value)}
              >
                {["6 months", "12 months", "24 months", "36 months"].map(
                  (term) => (
                    <option key={term}>{term}</option>
                  )
                )}
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
                  Save contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const users = [
  { name: "Ava Patel", role: "Admin", status: "Active", lastActive: "2h ago" },
  { name: "Samir Khan", role: "Manager", status: "Active", lastActive: "1d ago" },
  { name: "Lena Hoff", role: "Viewer", status: "Inactive", lastActive: "7d ago" }
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="w-full min-w-[200px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto"
            placeholder="Search user"
          />
          <select className="w-full min-w-[180px] rounded-full border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-0 sm:w-auto">
            <option>All roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Viewer</option>
          </select>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Invite user
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <div key={user.name} className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <span className="chip">{user.role}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Status: {user.status}</p>
              <p>Last active: {user.lastActive}</p>
              <p>Team: IT Operations</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

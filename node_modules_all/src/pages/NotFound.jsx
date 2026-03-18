import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-slate-500">
        The page you requested does not exist. Head back to the dashboard.
      </p>
      <Link
        className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        to="/"
      >
        Go to dashboard
      </Link>
    </div>
  );
}

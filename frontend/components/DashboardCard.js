export default function DashboardCard({ title, description, link }) {
  return (
    <a
      href={link}
      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-500 hover:bg-white"
    >
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </a>
  );
}

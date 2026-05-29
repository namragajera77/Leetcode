import { Edit, Home, Plus, ShieldCheck, Trash2, Video, Zap } from 'lucide-react';
import { NavLink } from 'react-router';

const adminOptions = [
  {
    id: 'create',
    title: 'Create Problem',
    description: 'Add a new coding challenge with starter code, tests, and reference solutions.',
    icon: Plus,
    route: '/admin/create',
    tone: 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10',
  },
  {
    id: 'update',
    title: 'Update Problem',
    description: 'Edit statements, metadata, test cases, and language templates.',
    icon: Edit,
    route: '/admin/update',
    tone: 'text-amber-300 border-amber-400/20 bg-amber-400/10',
  },
  {
    id: 'delete',
    title: 'Delete Problem',
    description: 'Remove outdated or duplicate problems from the platform.',
    icon: Trash2,
    route: '/admin/delete',
    tone: 'text-red-300 border-red-400/20 bg-red-400/10',
  },
  {
    id: 'video',
    title: 'Video Management',
    description: 'Upload, review, and remove editorial solution videos.',
    icon: Video,
    route: '/admin/video',
    tone: 'text-cyan-300 border-cyan-400/20 bg-cyan-400/10',
  },
];

function Admin() {
  return (
    <main className="app-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-bold text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              Admin command center
            </div>
            <h1 className="text-5xl font-black leading-tight text-white lg:text-7xl">Manage the platform with clarity.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Create problems, maintain content quality, and manage learning videos from one focused workspace.
            </p>
          </div>
          <NavLink to="/" className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black">
            <Home className="h-4 w-4" />
            Dashboard
          </NavLink>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {adminOptions.map(({ id, title, description, icon: Icon, route, tone }) => (
            <NavLink key={id} to={route} className="premium-card group flex min-h-72 flex-col p-6">
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg border ${tone}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-white group-hover:text-cyan-200">{title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-cyan-300">
                Open tool
                <Zap className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </NavLink>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <AdminMetric label="Content Tools" value="4" />
          <AdminMetric label="Workspace" value="Live" />
          <AdminMetric label="Access" value="Admin" />
        </section>
      </div>
    </main>
  );
}

const AdminMetric = ({ label, value }) => (
  <div className="surface rounded-lg p-5">
    <div className="text-3xl font-black text-white">{value}</div>
    <div className="mt-1 text-xs font-black uppercase text-slate-500">{label}</div>
  </div>
);

export default Admin;

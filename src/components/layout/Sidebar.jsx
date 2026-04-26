import { NavLink } from 'react-router-dom';
import { GridIcon, PlusIcon, UsersIcon } from '../ui/Icons';

const NAV = [
  { to: '/', label: 'Dashboard', icon: GridIcon },
  { to: '/jobs/new', label: 'New job', icon: PlusIcon },
  { to: '/candidates', label: 'Candidates', icon: UsersIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-[236px] h-full shrink-0 border-r border-white/20 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/90 text-white shadow-2xl">
      <div className="px-5 py-6 border-b border-white/10">
        <span className="text-white font-display font-semibold text-base tracking-tight">
          Talent Agent
        </span>
        <span className="ml-2 rounded-md border border-white/20 px-1.5 py-0.5 text-[10px] text-white/80 font-mono">
          AI
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
              ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/35 to-emerald-500/30 text-white font-medium shadow-lg'
                  : 'text-white/65 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

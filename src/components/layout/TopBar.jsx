import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ChevronRightIcon, LogoutIcon } from '../ui/Icons';

export default function TopBar({ title, back }) {
  const { user, logout } = useAuthStore();

  return (
    <header
      className="sticky top-0 z-10 mx-6 mt-4 flex h-14 items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md"
    >
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {back && (
          <>
            <Link
              to={back}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ←
            </Link>
            <ChevronRightIcon className="w-3 h-3 text-text-tertiary" />
          </>
        )}
        <h1 className="font-display text-base font-semibold text-slate-800">
          {title}
        </h1>
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600 font-mono">
            {user.email}
          </span>
        )}
        <button
          onClick={logout}
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          <LogoutIcon className="w-3.5 h-3.5" />
          Log out
        </button>
      </div>
    </header>
  );
}

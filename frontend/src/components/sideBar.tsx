import { icons } from '../assets/icons.tsx';
import SideNavIcons from './sideNavIcons.tsx';
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from '../supabase-client.ts';
import { LogoLockup, LogoMark } from "../assets/logo";
import { useContext, useState } from 'react';
import { UserContext } from './userContext.ts';
import { useModalBehavior } from '../hooks/useModalBehavior';

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useContext(UserContext);
  const isAdmin = user?.role === 'admin';
  const [drawerOpen, setDrawerOpen] = useState(false);

  useModalBehavior(() => setDrawerOpen(false), drawerOpen);

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch {
      // Already signed out locally, or offline. Either way, leave the app.
    }
    // These outlive the session on a shared device otherwise.
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('draft_') || key.startsWith('timerRemaining_')) {
        localStorage.removeItem(key);
      }
    }
    navigate("/");
  }

  function go(path: string) {
    setDrawerOpen(false);
    navigate(path);
  }

  function navItems(showLabel: boolean) {
    return (
      <>
        <SideNavIcons
          icon={icons.home}
          label="Home"
          showLabel={showLabel}
          onClick={() => go("/home")}
          active={location.pathname === "/home"}
        />
        <SideNavIcons
          icon={icons.performance}
          label="Performance"
          showLabel={showLabel}
          onClick={() => go("/performance")}
          active={location.pathname === "/performance"}
        />
        {isAdmin && (
          <SideNavIcons
            icon={icons.table}
            label="Admin"
            showLabel={showLabel}
            onClick={() => go("/admin")}
            active={location.pathname === "/admin"}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* Phone: a top bar with a real menu button. The rail below is hidden at
          this width because a 56px strip of unlabelled icons is not navigation. */}
      <header className="sm:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <button
          type="button"
          onClick={() => navigate("/home")}
          aria-label="TestQueens home"
          className="flex items-center"
        >
          <LogoLockup className="h-7 w-auto" />
        </button>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {icons.hamburger}
        </button>
      </header>

      {drawerOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/40"
          onMouseDown={e => { if (e.target === e.currentTarget) setDrawerOpen(false); }}
        >
          <nav
            aria-label="Main"
            className="absolute inset-y-0 left-0 w-64 max-w-[85vw] bg-white flex flex-col justify-between py-4 overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-4 pb-4 mb-2 border-b border-slate-100">
                <LogoLockup className="h-8 w-auto" />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  {icons.exit}
                </button>
              </div>
              <div className="flex flex-col gap-0.5 px-2">{navItems(true)}</div>
            </div>
            <div className="px-2">
              <SideNavIcons icon={icons.logout} label="Sign Out" showLabel onClick={signOut} />
            </div>
          </nav>
        </div>
      )}

      {/* Tablet and up: the persistent rail. overflow-y-auto because 100vh exceeds
          the visible viewport on mobile browsers, which used to push Sign Out
          below the fold with no way to reach it. */}
      <nav
        aria-label="Main"
        className="hidden sm:flex flex-col justify-between py-4 h-screen overflow-y-auto md:w-56 w-14 bg-white border-r border-slate-200 shrink-0"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center px-2 md:px-4 pb-5 mb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/home")}
              aria-label="TestQueens home"
              className="flex items-center justify-center"
            >
              {/* Collapsed rail: crown only. Expanded: full lockup. */}
              <LogoMark className="h-5 w-auto shrink-0 md:hidden" />
              <LogoLockup className="hidden md:block h-10 w-auto" />
            </button>
          </div>

          <div className="flex flex-col gap-0.5 px-2">{navItems(false)}</div>
        </div>

        <div className="px-2">
          <SideNavIcons icon={icons.logout} label="Sign Out" onClick={signOut} />
        </div>
      </nav>
    </>
  );
}

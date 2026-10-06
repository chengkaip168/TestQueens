import { ReactNode } from "react";
import { LogoMark } from "./logo";

// Inline SVG rather than an icon package: the rest of the app already draws its
// icons this way, and it keeps us clear of the attribution terms that come with
// Font Awesome's free set.
function svg(children: ReactNode, className = "w-4 h-4"): ReactNode {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const icons: Record<string, ReactNode> = {
  hamburger: (
    svg(<><path d="M4 7h16M4 12h16M4 17h16" /></>, "w-5 h-5")
  ),
  practice: (
    svg(<><path d="M12 6.5C10.5 5.2 8.6 4.5 6.5 4.5H4v13h2.5c2.1 0 4 .7 5.5 2 1.5-1.3 3.4-2 5.5-2H20v-13h-2.5c-2.1 0-4 .7-5.5 2zM12 6.5v13" /></>)
  ),
  test: (
    svg(<><path d="M5 4.5h11a3 3 0 013 3v12H8a3 3 0 01-3-3z" />
      <path d="M5 16.5h14" /></>)
  ),
  performance: (
    svg(<><path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7.5 15l3.5-4 3 2.5 4.5-5.5" /></>)
  ),
  home: (
    svg(<><path d="M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-4v-5.5H9V20H5a1 1 0 01-1-1z" /></>)
  ),
  clock: (
    svg(<><circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" /></>, "w-5 h-5")
  ),
  logo: <LogoMark className="h-6 w-auto" />,
  user: (
    svg(<><circle cx="12" cy="9" r="3.5" />
      <path d="M5 19.5a7 7 0 0114 0" />
      <circle cx="12" cy="12" r="9" /></>)
  ),
  logout: (
    svg(<><path d="M14 4.5h3.5a2 2 0 012 2v11a2 2 0 01-2 2H14" />
      <path d="M9.5 15.5L13 12 9.5 8.5" />
      <path d="M13 12H3.5" /></>)
  ),
  arrowRight: (
    svg(<><path d="M5 12h14M13 6l6 6-6 6" /></>, "w-3.5 h-3.5")
  ),
  arrowLeft: (
    svg(<><path d="M19 12H5M11 6l-6 6 6 6" /></>, "w-3.5 h-3.5")
  ),
  exit: (
    svg(<><path d="M6 6l12 12M18 6L6 18" /></>)
  ),
  table: (
    svg(<><rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M9 9.5v10" /></>)
  ),
};

import { ReactNode } from "react";

interface SideNavIconsProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  /** Drawer and wide-screen rails show the label; the collapsed rail does not. */
  showLabel?: boolean;
}

export default function SideNavIcons({
  icon, label, onClick, active = false, showLabel = false,
}: SideNavIconsProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      // The label is visually hidden on the collapsed rail, so the button needs a
      // name of its own or it reads as nothing at all.
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left border-l-2 ${
        active
          ? "bg-blue-50 text-blue-700 border-blue-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
      }`}
    >
      <span className="w-4 flex items-center justify-center shrink-0">{icon}</span>
      <span className={showLabel ? "inline" : "md:inline hidden"}>{label}</span>
    </button>
  );
}

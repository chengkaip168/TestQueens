import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogoLockup } from "../assets/logo";

// Shared shell for the privacy and terms pages. Public, no auth required.
export function LegalLayout({ title, updated, children }: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f3ee] text-[#1b2a44]">
      <header className="border-b border-[#1b2a44]/10">
        <div className="max-w-3xl mx-auto px-5 py-5 flex items-center justify-between gap-4">
          <Link to="/" aria-label="TestQueens home">
            <LogoLockup className="h-8 w-auto" />
          </Link>
          <Link to="/" className="text-sm font-medium underline underline-offset-4 hover:no-underline">
            Back to sign in
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-[#1b2a44]/60 mb-8">Last updated {updated}</p>
        <div className="flex flex-col gap-6 text-[15px] leading-relaxed">{children}</div>
      </main>

      <LegalFooter />
    </div>
  );
}

export function LegalFooter() {
  return (
    <footer className="border-t border-[#1b2a44]/10 mt-8">
      <div className="max-w-3xl mx-auto px-5 py-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="text-[#1b2a44]/60">&copy; {new Date().getFullYear()} TestQueens</span>
        <Link to="/privacy" className="underline underline-offset-4 hover:no-underline">Privacy</Link>
        <Link to="/terms" className="underline underline-offset-4 hover:no-underline">Terms</Link>
        <p className="w-full m-0 text-[#1b2a44]/60">
          Chan Tutoring Center, 6012b 18th Ave, Brooklyn, NY 11204{" · "}
          <a href="mailto:info@chantutoringcenter.com" className="underline underline-offset-4 hover:no-underline">
            info@chantutoringcenter.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">{heading}</h2>
      {children}
    </section>
  );
}

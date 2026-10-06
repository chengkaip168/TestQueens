import lockupSrc from "./logo-lockup.png";
import markSrc from "./logo-mark.png";

/**
 * Full TestQueens lockup, crown above the small-caps wordmark.
 * The wordmark is navy, so this variant is for light backgrounds only.
 */
export function LogoLockup({ className = "" }: { className?: string }) {
  return <img src={lockupSrc} alt="TestQueens" className={className} />;
}

/**
 * Crown mark alone, in brand gold. Reads on both light and dark surfaces,
 * so it is the variant used wherever a text wordmark already sits beside it.
 * Decorative by definition there, the adjacent text carries the name.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return <img src={markSrc} alt="" aria-hidden="true" className={className} />;
}

import { useEffect } from "react";

// Shared behaviour every overlay in the app needs: Escape closes it, the page
// behind it stops scrolling, and focus goes back where it was on close.
//
// Pass `enabled: false` for a modal that is always mounted and toggles its own
// visibility, so it only takes over the page while it is actually open.
export function useModalBehavior(onClose?: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) {
        e.stopPropagation();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose, enabled]);
}

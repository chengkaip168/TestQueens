import { useRef } from "react";

interface Props {
  maskY: number;          // top of the transparent window, px from container top
  onMove: (y: number) => void;
}

const WINDOW_HEIGHT = 72; // ~3 lines of text

export default function ELALineMask({ maskY, onMove }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; initMaskY: number } | null>(null);

  function startDrag(e: React.PointerEvent) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, initMaskY: maskY };
  }

  function onDrag(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const delta = e.clientY - dragRef.current.startY;
    // Clamp to the panel. Without an upper bound the window could be dragged past
    // the bottom, leaving the passage fully dimmed with no way to read it.
    const limit = Math.max(0, (rootRef.current?.clientHeight ?? 0) - WINDOW_HEIGHT);
    onMove(Math.min(limit, Math.max(0, dragRef.current.initMaskY + delta)));
  }

  function endDrag(e: React.PointerEvent) {
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {/* Top dark band */}
      <div
        className="absolute left-0 right-0 top-0 bg-slate-900/40"
        style={{ height: maskY }}
      />
      {/* Transparent window, drag handle */}
      <div
        className="absolute left-0 right-0 border-y-2 border-amber-400/60 pointer-events-auto cursor-ns-resize"
        style={{ top: maskY, height: WINDOW_HEIGHT, touchAction: "none" }}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        title="Drag to move the line guide"
      />
      {/* Bottom dark band */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-slate-900/40"
        style={{ top: maskY + WINDOW_HEIGHT }}
      />
    </div>
  );
}

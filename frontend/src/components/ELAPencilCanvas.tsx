import { useRef, useState, useCallback, useEffect } from "react";
import type { PencilStroke, PencilPoint } from "../hooks/useELATools";

interface Props {
  active: boolean;
  strokes: PencilStroke[];
  onAddStroke: (stroke: PencilStroke) => void;
}

function pointsToPath(pts: PencilPoint[]): string {
  if (pts.length < 2) return "";
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    // Quadratic bezier control point = midpoint of prev + current
    const cx = (prev.x + p.x) / 2;
    const cy = (prev.y + p.y) / 2;
    return `${acc} Q ${prev.x} ${prev.y} ${cx} ${cy}`;
  }, "");
  return d;
}

export default function ELAPencilCanvas({ active, strokes, onAddStroke }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentPoints, setCurrentPoints] = useState<PencilPoint[]>([]);
  const [height, setHeight] = useState<number | null>(null);
  const drawing = useRef(false);

  // The canvas sits inside a scrollable panel. An absolutely positioned child only
  // spans the visible height there, so without this strokes drawn after scrolling
  // land outside the box and get clipped. Track the full scroll height instead.
  useEffect(() => {
    const parent = svgRef.current?.parentElement;
    if (!parent) return;
    const measure = () => setHeight(parent.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    for (const child of Array.from(parent.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [strokes.length]);

  const getPoint = useCallback((e: React.PointerEvent): PencilPoint => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  function commit(points: PencilPoint[]) {
    if (points.length > 1) {
      onAddStroke({
        id: `s${Date.now()}${Math.random().toString(36).slice(2)}`,
        points,
      });
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!active || (e.pointerType === "mouse" && e.button !== 0)) return;
    drawing.current = true;
    // Capture so a stroke that leaves the canvas still ends cleanly.
    e.currentTarget.setPointerCapture(e.pointerId);
    setCurrentPoints([getPoint(e)]);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drawing.current || !active) return;
    const pt = getPoint(e);
    setCurrentPoints(prev => [...prev, pt]);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!drawing.current) return;
    drawing.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const last = getPoint(e);
    setCurrentPoints(prev => {
      commit([...prev, last]);
      return [];
    });
  }

  return (
    <svg
      ref={svgRef}
      className="absolute inset-x-0 top-0 w-full"
      style={{
        height: height ?? "100%",
        pointerEvents: active ? "all" : "none",
        cursor: active ? "crosshair" : "default",
        touchAction: active ? "none" : "auto",
        zIndex: 20,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Committed strokes */}
      {strokes.map(stroke => (
        <path
          key={stroke.id}
          d={pointsToPath(stroke.points)}
          stroke="#1e3a8a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
      ))}
      {/* In-progress stroke */}
      {currentPoints.length > 1 && (
        <path
          d={pointsToPath(currentPoints)}
          stroke="#1e3a8a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
      )}
    </svg>
  );
}

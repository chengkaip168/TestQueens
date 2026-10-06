import { ReactNode, useCallback } from "react";
import { icons } from "../assets/icons";
import { useModalBehavior } from "../hooks/useModalBehavior";

export default function MockTextPopUp(props: {
  appear: boolean;
  children: ReactNode;
  setAppear: (appear: boolean) => void;
}) {
  const { setAppear } = props;
  const close = useCallback(() => setAppear(false), [setAppear]);
  useModalBehavior(close, props.appear);

  if (!props.appear) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onMouseDown={e => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col gap-5 sm:gap-6 p-6 sm:p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
          onClick={close}
        >
          {icons.exit}
        </button>
        {props.children}
      </div>
    </div>
  );
}

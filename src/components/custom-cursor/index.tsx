"use client";

import useCustomCursor from "./use-custom-cursor";

export default function CustomCursor() {
  const { rootRef, dotRef, ringRef } = useCustomCursor();

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="cursor fixed inset-0 z-9000 pointer-events-none"
    >
      <div
        ref={ringRef}
        className="cursor__ring fixed top-0 left-0 size-8 -m-4.25 border-[1.5px] border-white/85 opacity-0 will-change-[transform,opacity,border-radius]"
      />
      <div
        ref={dotRef}
        className="cursor__dot fixed top-0 left-0 size-1.5 -m-0.75 rounded-full bg-white opacity-0 will-change-[transform,opacity]"
      />
    </div>
  );
}

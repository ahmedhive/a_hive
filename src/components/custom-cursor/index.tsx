"use client";

import useCustomCursor from "./use-custom-cursor";

export default function CustomCursor() {
  const { rootRef, dotRef, ringRef, lensRef, stageRef } = useCustomCursor();

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="cursor fixed inset-0 z-9000 pointer-events-none"
    >
      <div
        ref={lensRef}
        className="cursor__lens fixed inset-0 opacity-0 bg-jet-black will-change-[clip-path,opacity]"
      >
        <div
          ref={stageRef}
          className="cursor__stage absolute top-0 left-0 origin-top-left will-change-transform"
        />
      </div>
      <div
        ref={ringRef}
        className="cursor__ring fixed top-0 left-0 size-8.5 -m-4.25 rounded-full border-[1.5px] border-white/85 opacity-0 will-change-[transform,opacity]"
      />
      <div
        ref={dotRef}
        className="cursor__dot fixed top-0 left-0 size-1.5 -m-0.75 rounded-full bg-white opacity-0 will-change-[transform,opacity]"
      />
    </div>
  );
}

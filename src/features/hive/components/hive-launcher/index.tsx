"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { LAUNCHER_ARIA, LAUNCHER_LABEL } from "./hive-launcher.data";

// three.js, the shaders and the HUD load only when the visitor opens Hive.
const loadModal = () => import("../hive-modal");
const HiveModal = dynamic(loadModal, { ssr: false });

export default function HiveLauncher() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        onPointerEnter={() => void loadModal()}
        onFocus={() => void loadModal()}
        aria-label={LAUNCHER_ARIA}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-bg-luma="dark"
        className="fixed right-4 bottom-4 z-90 flex h-12 cursor-pointer items-center gap-2.5 rounded-full border border-[#19ddff]/35 bg-[rgba(0,8,12,0.88)] pr-4 pl-2 text-xs font-medium tracking-[0.14em] text-[#19ddff] uppercase shadow-[0_0_24px_rgba(25,221,255,0.22)] backdrop-blur-[6px] transition-[box-shadow,border-color] hover:border-[#19ddff]/70 hover:shadow-[0_0_32px_rgba(25,221,255,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19ddff] max-sm:pr-2 sm:right-6 sm:bottom-6"
      >
        <span
          aria-hidden
          className="relative grid size-8 place-items-center rounded-full border border-[#19ddff]/50 bg-[radial-gradient(circle,#ebd9da_0%,#d48c9e_24%,#7e2f3b_48%,#1c070b_76%)] motion-safe:animate-[hive-orb_2.6s_ease-in-out_infinite]"
        />
        <span className="max-sm:sr-only">{LAUNCHER_LABEL}</span>
      </button>
      {open && <HiveModal onClose={close} />}
    </>
  );
}

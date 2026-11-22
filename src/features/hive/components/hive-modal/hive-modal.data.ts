// HUD styling, measured from the reference: cyan #19ddff controls on a near
// black glass, and quieter #9fd8e8 pills along the bottom.
export const HUD_BUTTON =
  "inline-flex h-11 cursor-pointer items-center rounded-[9px] border border-[#19ddff]/30 bg-[rgba(0,10,14,0.72)] px-3.5 text-xs text-[#19ddff] shadow-[0_0_18px_rgba(25,221,255,0.08)] transition-colors hover:border-[#19ddff]/60 hover:bg-[rgba(0,24,32,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19ddff] disabled:cursor-wait disabled:opacity-60";

export const HUD_PILL =
  "cursor-pointer rounded-md border border-[rgba(34,211,238,0.33)] bg-[#0a0f12] px-[11px] py-[5px] text-[11px] leading-4 text-[#9fd8e8] transition-[color,background-color,border-color,box-shadow] duration-200 enabled:hover:bg-[rgba(34,211,238,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19ddff] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-[rgba(10,15,18,0.55)] disabled:text-[#9fd8e8]/35 disabled:shadow-none";

// Lit glass: a bright edge, a highlight along the top and a soft cyan glow.
export const HUD_PILL_ACTIVE =
  "border-[#7eefff] bg-[rgba(25,221,255,0.28)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-8px_14px_rgba(25,221,255,0.12),0_0_14px_rgba(25,221,255,0.45)] backdrop-blur-md enabled:hover:bg-[rgba(25,221,255,0.34)]";

export const HUD_INPUT =
  "h-9 min-w-0 flex-1 rounded-md border border-[rgba(34,211,238,0.33)] bg-[rgba(0,10,14,0.88)] px-3 text-[12px] text-[#9fd8e8] transition-colors duration-200 placeholder:text-[#9fd8e8]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19ddff] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-[rgba(10,15,18,0.55)] disabled:text-[#9fd8e8]/35 disabled:placeholder:text-[#9fd8e8]/30";

export const LOCKED_PLACEHOLDER = "available once hive is assembled";

export const HUD_CAPTION = "text-[12px] leading-5 text-[#9fd8e8]";

export const NO_WEBGL_TEXT =
  "3d view isn't available on this device. you can still ask hive below.";

// The band of shrinking lines the reference puts under a section (its
// `.border`): 12px down to 3px with 4px gaps. Below 1024px and 768px the
// reference thins them, which the component's inline heights can't express, so
// the classes override the heights per breakpoint.
export const TAPERED_LINE_HEIGHTS_PX = [12, 9, 6, 4, 3];
export const TAPERED_LINE_GAP_PX = 4;
export const TAPERED_LINE_RESPONSIVE_HEIGHTS =
  "max-lg:[&>:nth-child(1)]:h-2! max-lg:[&>:nth-child(2)]:h-1.5! max-md:[&>:nth-child(1)]:h-1.25! max-md:[&>:nth-child(2)]:h-1! max-md:[&>:nth-child(3)]:h-0.75! max-md:[&>:nth-child(4)]:h-0.5! max-md:[&>:nth-child(5)]:h-px!";

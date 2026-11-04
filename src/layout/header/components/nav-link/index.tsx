"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useNavLink from "./use-nav-link";
import { cn } from "@/lib";
import { INavLink } from "@/interfaces";

export default function NavLink(props: INavLink) {
  const { label, href } = props;

  const pathname = usePathname();
  const isActive = pathname === href;

  const { text1Ref, text2Ref, onMouseEnter, onMouseLeave } = useNavLink();
  const textClass = cn(
    "block h-5 text-[16px] leading-5",
    isActive ? "text-sun" : "text-white-secondary",
  );

  return (
    <li
      className={cn(
        "flex flex-1 border-b pb-1.5",
        isActive ? "border-sun" : "border-white-secondary",
      )}
    >
      <Link
        href={href}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onBlur={onMouseLeave}
        aria-current={isActive ? "page" : undefined}
        className="flex flex-1 items-center justify-start gap-4"
      >
        <span
          className={cn(
            "size-3 shrink-0 rounded-full border",
            isActive ? "border-sun" : "border-white-secondary",
          )}
        />
        <span className="relative h-5 overflow-clip" aria-label={label}>
          <span ref={text1Ref} aria-hidden className={textClass}>
            {label}
          </span>
          <span ref={text2Ref} aria-hidden className={textClass}>
            {label}
          </span>
        </span>
      </Link>
    </li>
  );
}

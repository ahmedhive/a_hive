"use client";

import Link from "next/link";
import { BRAND_HREF, NAV_LINKS } from "./header.data";
import { BRAND_TEXT } from "@/constants";
import { Hamburger, NavLink } from "./components";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-99">
      <nav
        aria-label="Primary"
        className="flex items-stretch justify-between
        border-b border-white-secondary lg:border-0
        pt-4 pb-1.5 px-4 md:px-6
        gap-10"
      >
        <Link
          href={BRAND_HREF}
          className="flex max-w-[20%] flex-1 items-end border-0 lg:border-b border-white-secondary pb-2 font-heading text-white-secondary text-(length:--_typography---font-sizes--heading--h5) leading-none whitespace-nowrap"
        >
          {BRAND_TEXT}
        </Link>

        <ul className="hidden flex-1 items-stretch lg:flex gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <NavLink key={label} label={label} href={href} />
          ))}
        </ul>

        <Hamburger />
      </nav>
    </header>
  );
}

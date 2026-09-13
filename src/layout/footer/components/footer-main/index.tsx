import { DecorativeLines, MenuLink } from "@/layout/components";
import { BottomBar, TitleBar } from "./components";
import { FOOTER_LINE_GAP_PX, FOOTER_LINE_HEIGHTS_PX } from "./footer-main.data";
import { MENU_NAV_LINKS } from "@/layout/header/components/menu-overlay/menu-overlay.data";

export default function FooterMain() {
  return (
    <section className="relative">
      <DecorativeLines
        heights={FOOTER_LINE_HEIGHTS_PX}
        gap={FOOTER_LINE_GAP_PX}
        className="w-full"
      />

      <div className="mt-1 bg-jet-black px-[5%] pt-[clamp(4rem,calc(12.8vw-2.140625rem),9.375rem)]">
        <TitleBar />
        <ul className="flex flex-col">
          {MENU_NAV_LINKS.map(({ label, href }, index) => (
            <MenuLink key={label} label={label} href={href} index={index} />
          ))}
        </ul>
        <BottomBar />
      </div>
    </section>
  );
}

import ProjectList from "../../../components/project-list";
import { PRODUCTS_BADGE, PRODUCTS_TITLE } from "./shipped-products.data";
import { IShippedProductsProps } from "./shipped-products.interface";

export default function ShippedProducts(props: IShippedProductsProps) {
  const { works } = props;

  return (
    <section className="overflow-clip px-[5%] py-16 text-black-secondary sm:py-20 md:py-25 lg:py-37.5">
      <div className="mx-auto w-full max-w-420">
        <header className="relative mb-8 text-center sm:mb-11 md:mb-13 lg:mb-20">
          {/* The size cap sits a little under the shared heading size: this title is
              wider than the others and would wrap to two lines on wide screens. */}
          <h2 className="text-[min(var(--_typography---font-sizes--heading--h2),19.5rem)] leading-none font-normal tracking-[-0.03em] uppercase">
            {PRODUCTS_TITLE}
          </h2>
          {/* Sticker: top/right offsets and padding follow the reference's
              breakpoints; hidden below 640px. */}
          <p className="absolute top-4.75 right-52.5 hidden -rotate-15 bg-lime px-5 py-3 font-heading text-[clamp(1.5rem,1.2573rem+1.0356vw,2.5rem)] leading-[0.8] tracking-[-0.01em] sm:block md:top-6 lg:top-11.5 lg:right-51.75 lg:px-9 lg:py-5 2xl:top-20.5 2xl:right-69.25">
            {PRODUCTS_BADGE}
          </p>
        </header>

        <ProjectList works={works} />
      </div>
    </section>
  );
}

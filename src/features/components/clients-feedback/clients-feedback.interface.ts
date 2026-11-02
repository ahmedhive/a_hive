import { StaticImageData } from "next/image";

export interface ITestimonial {
  quote: string;
  name: string;
  role: string;
  // Dark cards swap to the taupe fill, white text and yellow stars.
  dark: boolean;
  image: StaticImageData;
}

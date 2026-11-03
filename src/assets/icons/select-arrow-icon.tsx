import { SVGProps } from "react";

export default function SelectArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="11"
      viewBox="0 0 18 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.707 0.707097L8.70703 8.70703L0.707032 0.707031"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="16"
      />
    </svg>
  );
}

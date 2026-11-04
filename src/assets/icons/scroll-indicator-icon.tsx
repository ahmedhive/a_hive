import { SVGProps } from "react";

export default function ScrollIndicatorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="26"
      viewBox="0 0 16 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.39161 22.5461C9.03634 20.3173 10.0813 18.7392 11.241 17.6581C12.8959 16.1152 14.766 15.6 16 15.6V16.6884C14.9092 16.6884 13.21 17.1528 11.7128 18.5486C10.2306 19.9304 8.78549 22.2406 8.47059 26H7.52941C7.21451 22.2406 5.7694 19.9304 4.28723 18.5486C2.79001 17.1528 1.09077 16.6884 0 16.6884V15.6C1.23405 15.6 3.10409 16.1152 4.75904 17.6581C5.85383 18.6788 6.84641 20.1424 7.4965 22.1782V0H8.39161V22.5461Z"
        fill="currentColor"
      />
    </svg>
  );
}

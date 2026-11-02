"use client";

import { StarIcon } from "@/assets/icons";
import { cn } from "@/lib";
import { IStarRatingProps } from "./star-rating.interface";

// A row of stars that reads as one image ("label") to assistive tech.
export default function StarRating(props: IStarRatingProps) {
  const { count, label, className, starClassName } = props;

  return (
    <div role="img" aria-label={label} className={cn("flex", className)}>
      {Array.from({ length: count }, (_, index) => (
        <StarIcon key={index} aria-hidden className={starClassName} />
      ))}
    </div>
  );
}

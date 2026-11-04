"use client";

import { PauseIcon, PlayIcon } from "@/assets/icons";
import { cn } from "@/lib";
import { IServiceVideoProps } from "./service-video.interface";
import useServiceVideo from "./use-service-video";

export default function ServiceVideo(props: IServiceVideoProps) {
  const { src, poster, label, className, videoClassName, buttonClassName } =
    props;
  const { videoRef, paused, toggle } = useServiceVideo();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        preload="metadata"
        className={cn("size-full object-cover", videoClassName)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? `Play ${label} video` : `Pause ${label} video`}
        className={cn(
          "absolute cursor-pointer rounded-full bg-linen p-3 text-black-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-secondary",
          buttonClassName,
        )}
      >
        {paused ? (
          <PlayIcon className="size-6" />
        ) : (
          <PauseIcon className="size-6" />
        )}
      </button>
    </div>
  );
}

"use client";

import { PauseIcon, PlayIcon } from "@/assets/icons";
import { IServiceVideoProps } from "./service-video.interface";
import useServiceVideo from "./use-service-video";

export default function ServiceVideo(props: IServiceVideoProps) {
  const { src, poster, label } = props;
  const { videoRef, paused, toggle } = useServiceVideo();

  return (
    <div className="relative aspect-4/3 max-w-150 flex-[200px] overflow-hidden rounded-2xl sm:rounded-[20px] md:rounded-3xl lg:rounded-[40px] max-md:max-w-none max-md:basis-80 2xl:basis-150">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        preload="metadata"
        className="size-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? `Play ${label} video` : `Pause ${label} video`}
        className="absolute right-4 bottom-4 cursor-pointer rounded-full bg-linen p-3 text-black-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-secondary"
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

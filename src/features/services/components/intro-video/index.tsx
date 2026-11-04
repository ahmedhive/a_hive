"use client";

import { ServiceVideo } from "@/components";
import {
  INTRO_VIDEO_BUTTON_CLASS,
  INTRO_VIDEO_CLASS,
  INTRO_VIDEO_LABEL,
  INTRO_VIDEO_POSTER,
  INTRO_VIDEO_SRC,
  INTRO_VIDEO_FOOTAGE_CLASS,
} from "./intro-video.data";
import useIntroVideo from "./use-intro-video";

export default function IntroVideo() {
  const { sectionRef, boxRef } = useIntroVideo();

  return (
    <section ref={sectionRef}>
      <div ref={boxRef}>
        <ServiceVideo
          src={INTRO_VIDEO_SRC}
          poster={INTRO_VIDEO_POSTER}
          label={INTRO_VIDEO_LABEL}
          className={INTRO_VIDEO_CLASS}
          videoClassName={INTRO_VIDEO_FOOTAGE_CLASS}
          buttonClassName={INTRO_VIDEO_BUTTON_CLASS}
        />
      </div>
    </section>
  );
}

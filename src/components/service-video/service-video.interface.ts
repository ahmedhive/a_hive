export interface IServiceVideoProps {
  src: string;
  poster: string;
  label: string;
  // Sizing and shape of the box; the video fills it.
  className?: string;
  videoClassName?: string;
  // Where the play/pause button sits (it is absolutely positioned).
  buttonClassName?: string;
}

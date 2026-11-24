import { useEffect, useMemo, useState } from "react";

// Short phrases, like film subtitles: a new line starts at a pause in the
// sentence or once a line is long enough to read at a glance.
const MAX_CHUNK_CHARS = 38;
const MIN_CHUNK_CHARS = 14;

export function subtitleChunks(text: string) {
  const chunks: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && line.length + 1 + word.length > MAX_CHUNK_CHARS) {
      chunks.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
    if (line.length >= MIN_CHUNK_CHARS && /[.,!?;:]$/.test(word)) {
      chunks.push(line);
      line = "";
    }
  }
  if (line) chunks.push(line);
  return chunks;
}

// The phrase being spoken, by its share of the text already read out.
function chunkAt(chunks: string[], progress: number) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  let end = 0;
  for (let i = 0; i < chunks.length; i++) {
    end += chunks[i].length;
    if (end / total > progress) return i;
  }
  return chunks.length - 1;
}

interface ISpokenSubtitleProps {
  text: string;
  // How far through the voice is, from 0 to 1.
  progress: () => number;
}

// Shows the reply a phrase at a time, following the voice. Screen readers get
// the whole reply from the caption instead, so this is hidden from them.
export function SpokenSubtitle(props: ISpokenSubtitleProps) {
  const { text, progress } = props;
  const chunks = useMemo(() => subtitleChunks(text), [text]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setIndex(chunkAt(chunks, progress()));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [chunks, progress]);

  return (
    <span
      key={index}
      aria-hidden
      className="inline-block motion-safe:animate-[hive-fade_0.3s_ease-out]"
    >
      {chunks[index]}
    </span>
  );
}

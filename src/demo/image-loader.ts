/**
 * Image loader for the static demo.
 *
 * `basePath` is applied to links and scripts, but NOT to `next/image` sources
 * when the optimizer is off — every `src` came out as `/images/...` instead of
 * `/sweet-crust/images/...`, so every photo 404'd on GitHub Pages. A custom
 * loader is the one hook that runs for each image URL, so the prefix goes here.
 *
 * Only used in the demo build (see next.config.ts); the real build serves
 * from the domain root and uses the normal optimizer.
 */
const BASE_PATH = "/sweet-crust";

export default function demoImageLoader({ src }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/")) return src;
  return src.startsWith(`${BASE_PATH}/`) ? src : `${BASE_PATH}${src}`;
}

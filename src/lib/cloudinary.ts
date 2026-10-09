export const cl = (url: string, w = 1080, extra = ""): string => {
  if (!url || !url.includes("/upload/")) return url || "";
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${w}${extra ? "," + extra : ""}/`);
};

export const srcSet = (url: string): string => {
  if (!url || !url.includes("/upload/")) return "";
  return [480, 800, 1080, 1600].map((w) => `${cl(url, w)} ${w}w`).join(", ");
};

export const videoSrc = (url: string, w = 720): string => {
  if (!url || !url.includes("/upload/")) return url || "";
  return url.replace("/upload/", `/upload/q_auto,w_${w}/`);
};

export const videoPoster = (url: string, w = 720): string => {
  if (!url || !url.includes("/upload/")) return "";
  return url.replace("/upload/", `/upload/so_0,w_${w},q_auto,f_jpg/`).replace(/\.mp4$/i, ".jpg");
};

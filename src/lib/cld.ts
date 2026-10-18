export function cld(url: string | undefined | null, width?: number): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  const w = width ? `w_${width},` : "";
  const transform = `f_auto,q_auto,${w}c_limit`;
  return url.replace("/upload/", `/upload/${transform}/`);
}

export function cldSrcSet(url: string | undefined | null): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return "";
  }
  const widths = [480, 768, 1080, 1440, 1920, 2560];
  return widths.map((w) => `${cld(url, w)} ${w}w`).join(", ");
}

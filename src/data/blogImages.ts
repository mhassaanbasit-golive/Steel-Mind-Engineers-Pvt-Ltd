export const blogImages = {
  hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015862/Header-blog-cover-image.jpg",
  nextBanner:
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015864/next-page-banner.jpg",
  covers: {
    // 01
    "The Data an Engineer Needs Before Quoting Your Steel Building":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015860/data-an-engineer-needs.jpg",
    "/blog/data-needed-to-quote-steel-building/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015860/data-an-engineer-needs.jpg",

    // 02
    "How to Plan a Dairy Shed for Pakistan's Heat: Roof, Ridge and Airflow":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015862/how-to-plan-a-dairy-shed.jpg",
    "/blog/dairy-shed-design-pakistan-heat/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015862/how-to-plan-a-dairy-shed.jpg",

    // 03
    "Poultry Shed Roofs: Why Insulated Panels Help":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015864/poultry-shed-roofs.jpg",
    "/blog/poultry-shed-roof-insulated-panels/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015864/poultry-shed-roofs.jpg",

    // 04
    "Factory Shed Checklist: Ten Questions to Answer Before You Build":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015862/factory-shed-checklist.jpg",
    "/blog/factory-shed-checklist-pakistan/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015862/factory-shed-checklist.jpg",

    // 05
    "Crane Shed Basics: Capacity, Span and Runway Beams":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015860/crane-shed-basics.jpg",
    "/blog/crane-shed-basics-pakistan/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015860/crane-shed-basics.jpg",

    // 06
    "How to Choose Warehouse Height for Your Racking":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015866/warehouse-height.jpg",
    "/blog/warehouse-height-for-racking-pakistan/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015866/warehouse-height.jpg",

    // 07
    "Loading Dock Design: Dock Height, Canopy and Yard Depth":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015864/Loading-dock-design.jpg",
    "/blog/loading-dock-design-pakistan/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015864/Loading-dock-design.jpg",

    // 08
    "Cold Storage Buildings: What the Steel Frame Must Do":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015860/cold-storage-buildings.jpg",
    "/blog/cold-storage-steel-frame-pakistan/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015860/cold-storage-buildings.jpg",

    // 09
    "Storing Wheat in a Steel Warehouse: Keep It Dry and Ventilated":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015866/storing-wheat.jpg",
    "/blog/wheat-storage-steel-warehouse-pakistan/":
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792015866/storing-wheat.jpg",
  } as Record<string, string>,
};

export function getBlogCover(
  title: string,
  url: string,
  fallback: string
): string {
  if (blogImages.covers[title]) return blogImages.covers[title];
  if (blogImages.covers[url]) return blogImages.covers[url];
  return fallback;
}

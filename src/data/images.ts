const B = "https://res.cloudinary.com/cyfb9slf/image/upload/";
// cl(): inserts Cloudinary params after /upload/. If url is empty, returns "".
export const cl = (url: string, w: number) =>
  url ? url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${w}/`) : "";

export const divisionImages = {
  "pre-engineered-buildings": {
    hero: B + "v1791942854/peb-hero.png",
    next: B + "v1791924839/peb-next-banner-image.jpg",
    list: [
      { number: "01", title: "PEB Overview", image: B + "v1791942268/peb-overview.jpg" },
      { number: "02", title: "Advantages", image: B + "v1791924838/peb-advantage.jpg" },
      { number: "03", title: "3D Concept", image: B + "v1791924837/peb-3d-concept.jpg" },
      { number: "04", title: "One-Step Solution", image: B + "v1791924840/peb-onestopsolution.jpg" },
      { number: "05", title: "Engineering Department", image: B + "v1791924838/peb-engineering-department.jpg" },
      { number: "06", title: "Primary Framing System", image: B + "v1791924841/peb-primary-framing.jpg" },
      { number: "07", title: "Basic Parameters", image: B + "v1791924838/peb-basic-parameters.jpg" },
      { number: "08", title: "Sub Structures", image: B + "v1791924841/peb-sub-structures.jpg" },
      { number: "09", title: "Crane System", image: B + "v1791924839/peb-crane-system.jpg" },
      { number: "10", title: "Mezzanine System", image: B + "v1791924839/peb-mezzanine-system.jpg" },
      { number: "11", title: "Accessories", image: B + "v1791924836/peb-accessories.jpg" },
    ],
  },
  "industrial-sheds": {
    hero: B + "v1791924835/industrialsheds-HD.jpg",
    next: B + "v1791924835/industrial-sheds-next-banner.jpg",
    list: [
      { number: "01", title: "Factory Sheds", image: B + "v1791924834/INDUSTRIAL-SHEDS-FACTORY-SHEDS.jpg" },
      { number: "02", title: "Dairy Farm Sheds", image: B + "v1791924833/INDUSTRIAL-SHEDS-DAIRY-SHEDS.jpg" },
      { number: "03", title: "Poultry Sheds", image: B + "v1791924837/INDUSTRIALSHEDS-POULTRY-FARM.jpg" },
      { number: "04", title: "Workshop Sheds", image: B + "v1791924836/Industrial-sheds-workshops.jpg" },
      { number: "05", title: "Crane Sheds", image: B + "v1791924834/Industrial-sheds-crane-sheds.jpg" },
    ],
  },
  "steel-warehouses": {
    hero: B + "v1791924843/Steel-warehouses-HD.jpg",
    next: B + "v1791924845/steel-warehouses-page-next.jpg",
    list: [
      { number: "01", title: "Storage Warehouses", image: B + "v1791924845/steel-warehouses-storage.jpg" },
      { number: "02", title: "Logistics Warehouses", image: B + "v1791924845/Steel-warehouseslogistics-warehouse.jpg" },
      { number: "03", title: "Cold Storage Warehouses", image: B + "v1791924843/steel-warehouses-cold-storage.jpg" },
      { number: "04", title: "Grain and Wheat Warehouses", image: B + "v1791924843/steel-warehouses-grain-wheat-warehouse.jpg" },
      { number: "05", title: "Warehouses with Loading Docks", image: B + "v1791924843/steel-warehouses-loading-docks.jpg" },
    ],
  },
  "structural-steel-fabrication": {
    hero: B + "v1791924830/SSF-Hd.jpg",
    next: B + "v1791924832/ssf-next-banner.jpg",
    list: [
      { number: "01", title: "Columns and Beams", image: B + "v1791924846/ssf-columns-and-beams.jpg" },
      { number: "02", title: "Trusses", image: B + "v1791924834/SSF-Trusses.jpg" },
      { number: "03", title: "Mezzanine Floors", image: B + "v1791924832/ssf-mezannine-floors.jpg" },
      { number: "04", title: "Steel Bridges", image: B + "v1791924834/ssf-steel-bridges.jpg" },
      { number: "05", title: "Crane Gantry Structures", image: B + "v1791924831/ssf-crane-gantry-structures.jpg" },
    ],
  },
  "custom-steel-fabrication": {
    hero: B + "v1791924831/Csf-HD.jpg",
    next: B + "v1791924832/csf-next-banner.jpg",
    list: [
      { number: "01", title: "Machine Frames", image: B + "v1791924829/csf-machine-frames.jpg" },
      { number: "02", title: "Storage Tanks", image: B + "v1791924832/csf-storage-tanks.jpg" },
      { number: "03", title: "Hoppers and Bins", image: B + "v1791924828/csf-hoppers-and-bins.jpg" },
      { number: "04", title: "Steel Doors and Gates", image: B + "v1791924832/csf-steeldoors-and-gates.jpg" },
      { number: "05", title: "Steel Stairs", image: B + "v1791924831/csf-steel-stairs.jpg" },
    ],
  },
};

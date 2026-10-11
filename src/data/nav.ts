import { SITE } from "./site.ts";
import { A } from "./assets.ts";

export interface NavChild {
  label: string;
  url: string;
  external?: boolean;
}

export interface DivisionGroup {
  label: string;
  url: string;
  image: string;
  children: NavChild[];
}

export interface NavItem {
  label: string;
  url: string;
  external?: boolean;
  children?: NavChild[];
  divisions?: DivisionGroup[];
}

export const NAV: NavItem[] = [
  {
    label: "About Us",
    url: "/about-us/",
  },
  {
    label: "Main Divisions",
    url: "/pre-engineered-buildings-pakistan/",
    divisions: [
      {
        label: "Pre-Engineered Buildings (PEB)",
        url: "/pre-engineered-buildings-pakistan/",
        image: A.division.peb,
        children: [
          { label: "PEB Overview", url: "/pre-engineered-buildings-pakistan/overview/" },
          { label: "Advantages", url: "/pre-engineered-buildings-pakistan/advantages/" },
          { label: "3D Concept", url: "/pre-engineered-buildings-pakistan/3d-concept/" },
          { label: "One-Step Solution", url: "/pre-engineered-buildings-pakistan/one-step-solution/" },
          { label: "Engineering Department", url: "/pre-engineered-buildings-pakistan/engineering-department/" },
          { label: "Primary Framing System", url: "/pre-engineered-buildings-pakistan/primary-framing-system/" },
          { label: "Basic Parameters", url: "/pre-engineered-buildings-pakistan/basic-parameters/" },
          { label: "Sub Structures", url: "/pre-engineered-buildings-pakistan/sub-structures/" },
          { label: "Crane System", url: "/pre-engineered-buildings-pakistan/crane-system/" },
          { label: "Mezzanine System", url: "/pre-engineered-buildings-pakistan/mezzanine-system/" },
          { label: "Accessories", url: "/pre-engineered-buildings-pakistan/accessories/" },
        ],
      },
      {
        label: "Industrial Sheds",
        url: "/industrial-sheds-pakistan/",
        image: A.division.sheds,
        children: [
          { label: "Factory Sheds", url: "/industrial-sheds-pakistan/factory-sheds/" },
          { label: "Dairy Farm Sheds", url: "/industrial-sheds-pakistan/dairy-farm-sheds/" },
          { label: "Poultry Sheds", url: "/industrial-sheds-pakistan/poultry-sheds/" },
          { label: "Workshop Sheds", url: "/industrial-sheds-pakistan/workshop-sheds/" },
          { label: "Crane Sheds", url: "/industrial-sheds-pakistan/crane-sheds/" },
        ],
      },
      {
        label: "Steel Warehouses",
        url: "/steel-warehouses-pakistan/",
        image: A.division.warehouses,
        children: [
          { label: "Storage Warehouses", url: "/steel-warehouses-pakistan/storage-warehouses/" },
          { label: "Logistics Warehouses", url: "/steel-warehouses-pakistan/logistics-warehouses/" },
          { label: "Cold Storage Warehouses", url: "/steel-warehouses-pakistan/cold-storage-warehouses/" },
          { label: "Grain and Wheat Warehouses", url: "/steel-warehouses-pakistan/grain-and-wheat-warehouses/" },
          { label: "Warehouses with Loading Docks", url: "/steel-warehouses-pakistan/warehouses-with-loading-docks/" },
        ],
      },
      {
        label: "Structural Steel Fabrication",
        url: "/structural-steel-fabrication-pakistan/",
        image: A.division.structural,
        children: [
          { label: "Columns and Beams", url: "/structural-steel-fabrication-pakistan/columns-and-beams/" },
          { label: "Trusses", url: "/structural-steel-fabrication-pakistan/trusses/" },
          { label: "Mezzanine Floors", url: "/structural-steel-fabrication-pakistan/mezzanine-floors/" },
          { label: "Steel Bridges", url: "/structural-steel-fabrication-pakistan/steel-bridges/" },
          { label: "Crane Gantry Structures", url: "/structural-steel-fabrication-pakistan/crane-gantry-structures/" },
        ],
      },
      {
        label: "Custom Steel Fabrication",
        url: "/custom-steel-fabrication-pakistan/",
        image: A.division.custom,
        children: [
          { label: "Machine Frames", url: "/custom-steel-fabrication-pakistan/machine-frames/" },
          { label: "Storage Tanks", url: "/custom-steel-fabrication-pakistan/storage-tanks/" },
          { label: "Hoppers and Bins", url: "/custom-steel-fabrication-pakistan/hoppers-and-bins/" },
          { label: "Steel Doors and Gates", url: "/custom-steel-fabrication-pakistan/steel-doors-and-gates/" },
          { label: "Steel Stairs", url: "/custom-steel-fabrication-pakistan/steel-stairs/" },
        ],
      },
    ],
  },
  {
    label: "Services",
    url: "/services/",
    children: [
      { label: "Design", url: "/services/design/" },
      { label: "Detailing", url: "/services/detailing/" },
      { label: "Fabrication", url: "/services/fabrication/" },
      { label: "Cleaning", url: "/services/cleaning/" },
      { label: "Painting", url: "/services/painting/" },
      { label: "Erection", url: "/services/erection/" },
      { label: "After Sale Services", url: "/services/after-sale-services/" },
    ],
  },
  {
    label: "Our Projects",
    url: "/projects/",
  },
  {
    label: "Our Clients",
    url: "/clients/",
  },
  {
    label: "Company Profile",
    url: SITE.profilePdf,
    external: true,
  },
  {
    label: "Blogs",
    url: "/blog/",
  },
];

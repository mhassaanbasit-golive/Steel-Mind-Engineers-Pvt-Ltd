import React, { useState, useMemo } from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import pageData from "../content/generated/page-53.json";
import { PROJECTS, ProjectData } from "../data/projects.ts";
import { Accordion } from "../components/ui/Accordion.tsx";
import {
  Search,
  ChevronDown,
  ArrowRight,
  Warehouse,
  Factory,
  Building2,
} from "lucide-react";

const HERO_IMAGE =
  "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202586/Projects-hero.jpg";

const getProjectIndustry = (p: ProjectData): string => {
  if (p.client === "Haier") return "Distribution and Warehouse";
  if (p.client === "Maria B") return "Apparel & Retail";
  if (p.client === "Dravton Dairy" || p.client === "Latifia Dairy")
    return "Dairy & Agriculture";
  if (p.client === "M/S Yascon") return "Infrastructure & Civil";
  return "Industrial Facility";
};

const getProjectCategory = (p: ProjectData): string => {
  const t = p.type.toLowerCase();
  if (t.includes("crane")) return "Crane Sheds";
  if (t.includes("dairy") || t.includes("milking") || t.includes("exit"))
    return "Agricultural & Dairy";
  if (t.includes("mezzanine")) return "Mezzanine Floors";
  if (t.includes("bridge")) return "Bridges & Civil";
  return "Pre-Engineered Buildings";
};

const getIndustryIcon = (p: ProjectData) => {
  const ind = getProjectIndustry(p);
  if (ind.includes("Warehouse") || ind.includes("Distribution")) {
    return <Warehouse className="w-4 h-4 text-[var(--blue)] shrink-0" />;
  }
  if (ind.includes("Dairy") || ind.includes("Agriculture")) {
    return <Building2 className="w-4 h-4 text-[var(--blue)] shrink-0" />;
  }
  return <Factory className="w-4 h-4 text-[var(--blue)] shrink-0" />;
};

export const ProjectsIndex: React.FC = () => {
  const publishedProjects = useMemo(
    () => PROJECTS.filter((p) => p.published),
    []
  );

  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const allIndustries = useMemo(() => {
    const set = new Set<string>();
    publishedProjects.forEach((p) => set.add(getProjectIndustry(p)));
    return Array.from(set);
  }, [publishedProjects]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    publishedProjects.forEach((p) => set.add(getProjectCategory(p)));
    return Array.from(set);
  }, [publishedProjects]);

  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((p) => {
      if (selectedIndustry && getProjectIndustry(p) !== selectedIndustry)
        return false;
      if (selectedCategory && getProjectCategory(p) !== selectedCategory)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesType = p.type.toLowerCase().includes(q);
        const matchesIndustry = getProjectIndustry(p).toLowerCase().includes(q);
        if (!matchesTitle && !matchesType && !matchesIndustry) {
          return false;
        }
      }
      return true;
    });
  }, [publishedProjects, selectedIndustry, selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* 1. HERO BANNER: Exact image URL with white text over it */}
      <section data-hero className="relative w-full overflow-hidden bg-[#0A0A0A]">
        <div className="relative w-full min-h-[420px] md:min-h-[520px] lg:min-h-[600px] flex flex-col justify-end">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={HERO_IMAGE}
              alt="Pre-Engineered Buildings and Steel Projects by Steel Mind Engineers in Pakistan."
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Dark Scrim Overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.38) 50%, rgba(0,0,0,0.50) 100%)",
            }}
          />

          {/* Content Block */}
          <div className="max-w-[1340px] w-full mx-auto px-[var(--pad-x)] relative z-[2] pb-12 lg:pb-16 text-left">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center space-x-2 text-[12px] text-white/80">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium">Our Projects</li>
              </ol>
            </nav>

            <h1 className="text-[28px] md:text-[44px] lg:text-[54px] font-bold text-white uppercase tracking-[-0.02em] max-w-[860px] leading-[1.12]">
              {pageData.h1}
            </h1>

            {pageData.quickAnswer && (
              <p className="mt-4 text-[14px] md:text-[15px] lg:text-[16px] text-white/90 max-w-[640px] leading-[1.6]">
                {pageData.quickAnswer}
              </p>
            )}

            <div className="mt-7">
              <Link
                to="/contact-us/#quote"
                className="btn btn--light btn-sm inline-flex items-center gap-2"
              >
                <span>Request a Quote</span>
                <span className="btn-arrow inline-block" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER BAR: Desktop 3 elements in a row, Mobile stacked full width */}
      <section className="w-full bg-[#F9FAFB] border-b border-[#E5E5E5] py-5 lg:py-6">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Dropdown 1: Filter by Industry */}
              <div className="relative w-full sm:w-[220px]">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  aria-label="Filter by Industry"
                  className="w-full h-[42px] px-3.5 pr-9 bg-white border border-[#E5E5E5] text-[13px] text-[#0A0A0A] font-medium appearance-none focus:outline-none focus:border-[var(--blue)] cursor-pointer"
                >
                  <option value="">Filter by Industry</option>
                  {allIndustries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
              </div>

              {/* Dropdown 2: Filter by Project Category */}
              <div className="relative w-full sm:w-[240px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by Project Category"
                  className="w-full h-[42px] px-3.5 pr-9 bg-white border border-[#E5E5E5] text-[13px] text-[#0A0A0A] font-medium appearance-none focus:outline-none focus:border-[var(--blue)] cursor-pointer"
                >
                  <option value="">Filter by Project Category</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-[280px] lg:w-[320px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all projects"
                aria-label="Search all projects"
                className="w-full h-[42px] pl-3.5 pr-10 bg-white border border-[#E5E5E5] text-[13px] text-[#0A0A0A] placeholder:text-[#6B7280] focus:outline-none focus:border-[var(--blue)]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROJECT GRID: Minimalist cards with ONLY industry category & project title below image */}
      <section className="py-12 lg:py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-[22px] lg:text-[36px] font-bold text-[#0A0A0A] tracking-tight">
              Our Latest Projects
            </h2>
            <p className="text-[13px] lg:text-[15px] text-[#4B5563] mt-1.5">
              Verified steel fabrication, crane shed, and industrial facility projects completed across Pakistan.
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#E5E5E5] p-8">
              <p className="text-[15px] font-medium text-[#4B5563]">
                No projects match the selected filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedIndustry("");
                  setSelectedCategory("");
                  setSearchQuery("");
                }}
                className="mt-4 text-[13px] font-semibold text-[var(--blue)] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.slug}/`}
                  className="group flex flex-col bg-white border border-[#E5E5E5] transition-all duration-300 hover:shadow-xl hover:-translate-y-[5px] select-none"
                >
                  {/* Image Container with Solid Blue Box on Hover */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F3F4F6]">
                    <img
                      src={proj.images[0]}
                      alt={proj.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Solid Blue Hover Box: Short clean description & View Project arrow ONLY (No client name or location) */}
                    <div
                      style={{ backgroundColor: "var(--blue)" }}
                      className="absolute inset-0 p-6 flex flex-col justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"
                    >
                      <div>
                        <p className="text-[13px] text-white leading-[1.6] line-clamp-4">
                          {proj.subtitle ||
                            `${proj.type} with ${proj.area.toLocaleString()} sq ft covered area.`}
                        </p>
                      </div>
                      <div className="flex items-center text-[12px] font-semibold uppercase tracking-wider text-white gap-2 pt-3 border-t border-white/20">
                        <span>View Project</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>

                  {/* Minimalist White Section Below Image: ONLY Industry Icon, Industry Category, and Project Title */}
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-[#4B5563] text-[11px] font-semibold uppercase tracking-[0.08em] mb-2.5">
                      {getIndustryIcon(proj)}
                      <span>{getProjectIndustry(proj)}</span>
                    </div>
                    <h3 className="text-[17px] lg:text-[19px] font-bold text-[#0A0A0A] leading-[1.3]">
                      {proj.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. FAQ: Page ends cleanly with Project Grid and FAQ ("What the Projects Show" completely deleted) */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[22px] lg:text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}
    </div>
  );
};

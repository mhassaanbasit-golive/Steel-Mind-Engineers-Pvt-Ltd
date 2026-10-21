import React, { useState, useMemo } from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import pageData from "../content/generated/page-53.json";
import { PROJECTS, ProjectData } from "../data/projects.ts";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
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
    return <Warehouse className="w-4 h-4 text-[#0A0A0A] shrink-0" />;
  }
  if (ind.includes("Dairy") || ind.includes("Agriculture")) {
    return <Building2 className="w-4 h-4 text-[#0A0A0A] shrink-0" />;
  }
  return <Factory className="w-4 h-4 text-[#0A0A0A] shrink-0" />;
};

export const ProjectsIndex: React.FC = () => {
  const publishedProjects = useMemo(() => {
    // 1. All Dairy projects at the top
    const dairyProjects = PROJECTS.filter(
      (p) =>
        p.published &&
        (p.client.toLowerCase().includes("dairy") ||
          p.title.toLowerCase().includes("dairy") ||
          p.type.toLowerCase().includes("dairy") ||
          p.id.toLowerCase().includes("dairy") ||
          p.id.toLowerCase().includes("rapid-exit") ||
          p.id.toLowerCase().includes("milking"))
    );
    // 2. Non-dairy, non-Haier published projects
    const otherProjects = PROJECTS.filter(
      (p) =>
        p.published &&
        !dairyProjects.some((d) => d.id === p.id) &&
        p.client !== "Haier" &&
        !p.id.toLowerCase().includes("haier")
    );
    // 3. Haier project at the very end
    const haierProjects = PROJECTS.filter(
      (p) =>
        p.published &&
        (p.client === "Haier" || p.id.toLowerCase().includes("haier"))
    );
    return [...dairyProjects, ...otherProjects, ...haierProjects];
  }, []);

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
      {/* 1. HERO BANNER: Standard subpage hero matching other pages */}
      <SubpageHero
        title="OUR PROJECTS"
        subtitle="Verified steel fabrication, crane shed, and industrial facility projects completed across Pakistan."
        image={HERO_IMAGE}
        quoteUrl="/contact-us/#quote"
      />

      {/* 2. FILTER BAR: All controls in ONE row on mobile, small buttons & search without overlapping */}
      <section className="w-full bg-[#F9FAFB] border-b border-[#E5E5E5] py-3 sm:py-4 lg:py-5">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-6 lg:px-10">
          <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-3 w-full flex-nowrap">
            {/* Filter by Industry */}
            <div className="relative flex-1 min-w-0 max-w-[125px] sm:max-w-[170px] md:max-w-none md:w-[210px]">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                aria-label="Filter by Industry"
                className="w-full h-[32px] sm:h-[36px] md:h-[40px] pl-2 pr-5 sm:pl-3 sm:pr-7 bg-white border border-[#E5E5E5] text-[11px] sm:text-[12px] md:text-[13px] text-[#0A0A0A] font-medium appearance-none focus:outline-none focus:border-[var(--blue)] cursor-pointer truncate"
              >
                <option value="">Industry</option>
                {allIndustries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6B7280] pointer-events-none" />
            </div>

            {/* Filter by Project Category */}
            <div className="relative flex-1 min-w-0 max-w-[125px] sm:max-w-[180px] md:max-w-none md:w-[230px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Project Category"
                className="w-full h-[32px] sm:h-[36px] md:h-[40px] pl-2 pr-5 sm:pl-3 sm:pr-7 bg-white border border-[#E5E5E5] text-[11px] sm:text-[12px] md:text-[13px] text-[#0A0A0A] font-medium appearance-none focus:outline-none focus:border-[var(--blue)] cursor-pointer truncate"
              >
                <option value="">Category</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6B7280] pointer-events-none" />
            </div>

            {/* Search Input Bar */}
            <div className="relative flex-1 min-w-[95px] sm:min-w-[140px] md:w-[260px] lg:w-[300px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search all projects"
                className="w-full h-[32px] sm:h-[36px] md:h-[40px] pl-2 sm:pl-3 pr-6 sm:pr-8 bg-white border border-[#E5E5E5] text-[11px] sm:text-[12px] md:text-[13px] text-[#0A0A0A] placeholder:text-[#6B7280] focus:outline-none focus:border-[var(--blue)] truncate"
              />
              <Search className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROJECT GRID: Minimalist cards with ONLY industry category & project title below image */}
      <section className="py-12 lg:py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-semibold text-[#0A0A0A] uppercase tracking-tight">
              Our Latest Projects
            </h2>
            <p className="text-[13px] lg:text-[15px] text-[#0A0A0A] mt-1.5">
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
              {filteredProjects.map((proj) => {
                const cardImage =
                  proj.client === "Haier"
                    ? "https://res.cloudinary.com/cyfb9slf/image/upload/v1791401784/Haier-Injection-Modling-Structure-Fabrication-Main-Image.png"
                    : proj.images[0];

                return (
                  <Link
                    key={proj.id}
                    to={`/projects/${proj.slug}/`}
                    className="group flex flex-col bg-white border border-[#E5E5E5] transition-all duration-300 hover:shadow-xl hover:-translate-y-[5px] select-none"
                  >
                    {/* Image Container with Solid Blue Box on Hover */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#F3F4F6]">
                      <img
                        src={cardImage}
                        alt={proj.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Solid Blue Hover Box: Short clean description & View Project arrow ONLY */}
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
                      <div className="flex items-center gap-2 text-[#0A0A0A] text-[11px] font-semibold uppercase tracking-[0.08em] mb-2.5">
                        {getIndustryIcon(proj)}
                        <span>{getProjectIndustry(proj)}</span>
                      </div>
                      <h3 className="text-[14px] sm:text-[15px] lg:text-[17px] font-bold text-[#0A0A0A] uppercase leading-[1.3]">
                        {proj.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. FAQ */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-semibold leading-[1.22] tracking-[-0.01em] uppercase text-[#0A0A0A] mb-6 sm:mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}
    </div>
  );
};

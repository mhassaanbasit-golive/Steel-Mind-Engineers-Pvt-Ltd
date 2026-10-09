import React from "react";
import { Link } from "react-router-dom";
import { NAV } from "../data/nav.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import blogCards from "../content/generated/blog-cards.json";
import { PROJECTS } from "../data/projects.ts";

export const Sitemap: React.FC = () => {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <div className="w-full pt-28 pb-20 max-w-[1340px] mx-auto px-[var(--pad-x)]">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sitemap" },
        ]}
        className="mb-6"
      />

      <h1 className="text-[32px] lg:text-[48px] font-bold text-[var(--ink)] mb-8" data-split="">
        Website Sitemap
      </h1>

      <div className="space-y-12 divide-y divide-[var(--line)]">
        {/* Navigation Sections */}
        {NAV.map((item) => (
          <div key={item.label} className="pt-8">
            <h2 className="text-[22px] font-semibold text-[var(--ink)] mb-4">
              {item.external ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blue)]">
                  {item.label} ↗
                </a>
              ) : (
                <Link to={item.url} className="hover:text-[var(--blue)]">
                  {item.label}
                </Link>
              )}
            </h2>

            {item.children && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-4">
                {item.children.map((c) => (
                  <li key={c.url}>
                    <Link to={c.url} className="text-[15px] text-[var(--grey)] hover:text-[var(--blue)] hover:underline">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {item.divisions && (
              <div className="space-y-6 pl-4">
                {item.divisions.map((div) => (
                  <div key={div.label}>
                    <h3 className="text-[17px] font-medium text-[var(--ink)] mb-2">
                      <Link to={div.url} className="hover:text-[var(--blue)]">
                        {div.label}
                      </Link>
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-4">
                      {div.children.map((c) => (
                        <li key={c.url}>
                          <Link to={c.url} className="text-[14px] text-[var(--grey)] hover:text-[var(--blue)] hover:underline">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Published Projects */}
        <div className="pt-8">
          <h2 className="text-[22px] font-semibold text-[var(--ink)] mb-4">
            <Link to="/projects/" className="hover:text-[var(--blue)]">
              Projects
            </Link>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-4">
            {publishedProjects.map((p) => (
              <li key={p.id}>
                <Link to={`/projects/${p.slug}/`} className="text-[15px] text-[var(--grey)] hover:text-[var(--blue)] hover:underline">
                  {p.title} ({p.client})
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Blog Articles */}
        <div className="pt-8">
          <h2 className="text-[22px] font-semibold text-[var(--ink)] mb-4">
            <Link to="/blog/" className="hover:text-[var(--blue)]">
              Blog Articles
            </Link>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-4">
            {blogCards.map((b) => (
              <li key={b.url}>
                <Link to={b.url} className="text-[15px] text-[var(--grey)] hover:text-[var(--blue)] hover:underline">
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

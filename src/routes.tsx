import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { Hub } from "./pages/Hub.tsx";
import { Info } from "./pages/Info.tsx";
import { DiagramGallery } from "./pages/DiagramGallery.tsx";
import { ProjectsIndex } from "./pages/ProjectsIndex.tsx";
import { Project } from "./pages/Project.tsx";
import { Clients } from "./pages/Clients.tsx";
import { Contact } from "./pages/Contact.tsx";
import { BlogIndex } from "./pages/BlogIndex.tsx";
import { Article } from "./pages/Article.tsx";
import { Profile } from "./pages/Profile.tsx";
import { Sitemap } from "./pages/Sitemap.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { PageShell } from "./components/layout/PageShell.tsx";
import { ALL_PAGES, ALL_ARTICLES, CONTENT_BY_URL } from "./content/index.ts";
import { PROJECTS } from "./data/projects.ts";
import { getTemplateForPage } from "./data/templates.ts";

export const AppRoutes: React.FC = () => {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <Routes>
      {/* 1. Home */}
      <Route
        path="/"
        element={
          <PageShell hasDarkHero={true}>
            <Home />
          </PageShell>
        }
      />

      {/* 2. Projects Hub */}
      <Route
        path="/projects/"
        element={
          <PageShell hasDarkHero={true}>
            <ProjectsIndex />
          </PageShell>
        }
      />

      {/* 3. Published Project Detail Pages (T5) */}
      {publishedProjects.map((proj) => {
        const url = `/projects/${proj.slug}/`;
        const data = CONTENT_BY_URL[url];
        if (!data) return null;

        return (
          <Route
            key={url}
            path={url}
            element={
              <PageShell hasDarkHero={true}>
                <Project data={data} project={proj} />
              </PageShell>
            }
          />
        );
      })}

      {/* 4. Clients Page */}
      <Route
        path="/clients/"
        element={
          <PageShell hasDarkHero={true}>
            <Clients />
          </PageShell>
        }
      />

      {/* 5. Contact Us Page */}
      <Route
        path="/contact-us/"
        element={
          <PageShell hasDarkHero={true}>
            <Contact />
          </PageShell>
        }
      />

      {/* 6. Blog Index Page */}
      <Route
        path="/blog/"
        element={
          <PageShell hasDarkHero={true}>
            <BlogIndex />
          </PageShell>
        }
      />

      {/* 7. Blog Article Detail Pages (T7b) */}
      {ALL_ARTICLES.map((art) => (
        <Route
          key={art.url}
          path={art.url}
          element={
            <PageShell hasDarkHero={true}>
              <Article data={art} />
            </PageShell>
          }
        />
      ))}

      {/* 8. Company Profile Page */}
      <Route
        path="/company-profile/"
        element={
          <PageShell hasDarkHero={false}>
            <Profile />
          </PageShell>
        }
      />

      {/* 9. Sitemap Page */}
      <Route
        path="/sitemap/"
        element={
          <PageShell hasDarkHero={false}>
            <Sitemap />
          </PageShell>
        }
      />

      {/* 10. Content Pages (T1, T2, T2s, T3) */}
      {ALL_PAGES.map((page) => {
        // Skip pages handled specifically above or unpublished
        if (
          page.url === "/" ||
          page.url === "/projects/" ||
          page.url === "/clients/" ||
          page.url === "/contact-us/" ||
          page.url === "/blog/" ||
          page.url === "/company-profile/" ||
          page.url.startsWith("/projects/") // Projects handled above
        ) {
          return null;
        }

        const template = getTemplateForPage(page.page || 2);

        let ComponentToRender = <Info data={page} />;
        if (template === "T1") {
          ComponentToRender = <Hub data={page} />;
        } else if (template === "T2s") {
          ComponentToRender = <Info data={page} isStepsPage={true} />;
        } else if (template === "T3") {
          ComponentToRender = <DiagramGallery data={page} />;
        }

        return (
          <Route
            key={page.url}
            path={page.url}
            element={
              <PageShell hasDarkHero={true}>
                {ComponentToRender}
              </PageShell>
            }
          />
        );
      })}

      {/* 11. 404 Catch-All */}
      <Route
        path="*"
        element={
          <PageShell hasDarkHero={false}>
            <NotFound />
          </PageShell>
        }
      />
    </Routes>
  );
};

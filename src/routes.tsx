import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { PageShell } from "./components/layout/PageShell.tsx";
import { ALL_PAGES, ALL_ARTICLES, CONTENT_BY_URL } from "./content/index.ts";
import { PROJECTS } from "./data/projects.ts";
import { getTemplateForPage } from "./data/templates.ts";

const AboutUs = lazy(() => import("./pages/AboutUs.tsx").then((m) => ({ default: m.AboutUs })));
const Hub = lazy(() => import("./pages/Hub.tsx").then((m) => ({ default: m.Hub })));
const Info = lazy(() => import("./pages/Info.tsx").then((m) => ({ default: m.Info })));
const DiagramGallery = lazy(() => import("./pages/DiagramGallery.tsx").then((m) => ({ default: m.DiagramGallery })));
const ProjectsIndex = lazy(() => import("./pages/ProjectsIndex.tsx").then((m) => ({ default: m.ProjectsIndex })));
const Project = lazy(() => import("./pages/Project.tsx").then((m) => ({ default: m.Project })));
const Clients = lazy(() => import("./pages/Clients.tsx").then((m) => ({ default: m.Clients })));
const Contact = lazy(() => import("./pages/Contact.tsx").then((m) => ({ default: m.Contact })));
const BlogIndex = lazy(() => import("./pages/BlogIndex.tsx").then((m) => ({ default: m.BlogIndex })));
const Article = lazy(() => import("./pages/Article.tsx").then((m) => ({ default: m.Article })));
const Profile = lazy(() => import("./pages/Profile.tsx").then((m) => ({ default: m.Profile })));
const Sitemap = lazy(() => import("./pages/Sitemap.tsx").then((m) => ({ default: m.Sitemap })));
const NotFound = lazy(() => import("./pages/NotFound.tsx").then((m) => ({ default: m.NotFound })));

export const AppRoutes: React.FC = () => {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <Suspense fallback={null}>
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

      {/* About Us (Single merged page) */}
      <Route
        path="/about-us/"
        element={
          <PageShell hasDarkHero={false}>
            <AboutUs />
          </PageShell>
        }
      />
      <Route path="/about-us/introduction/" element={<Navigate to="/about-us/#introduction" replace />} />
      <Route path="/about-us/vision/" element={<Navigate to="/about-us/#vision" replace />} />
      <Route path="/about-us/mission/" element={<Navigate to="/about-us/#mission" replace />} />
      <Route path="/about-us/core-values/" element={<Navigate to="/about-us/#core-values" replace />} />
      <Route path="/about-us/sme-policy/" element={<Navigate to="/about-us/#sme-policy" replace />} />
      <Route path="/about-us/committed-to/" element={<Navigate to="/about-us/#committed-to" replace />} />
      <Route path="/about-us/factory-tour/" element={<Navigate to="/about-us/#factory-tour" replace />} />

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
          page.url.startsWith("/about-us/") ||
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
    </Suspense>
  );
};

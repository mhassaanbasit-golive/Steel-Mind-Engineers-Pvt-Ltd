import React, { Suspense, lazy, useEffect, useRef } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { PageShell } from "./components/layout/PageShell.tsx";
import { ALL_PAGES, ALL_ARTICLES, CONTENT_BY_URL } from "./content/index.ts";
import { PROJECTS } from "./data/projects.ts";
import { getTemplateForPage } from "./data/templates.ts";

import { Home } from "./pages/Home.tsx";

function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(() =>
    factory().catch(() => {
      // Retry once after 250ms if chunk fetch fails (e.g. mobile reconnect)
      return new Promise<{ default: T }>((resolve, reject) => {
        setTimeout(() => {
          factory().then(resolve).catch(reject);
        }, 250);
      });
    })
  );
}

const AboutUs = lazyWithRetry(() => import("./pages/AboutUs.tsx").then((m) => ({ default: m.AboutUs })));
const Hub = lazyWithRetry(() => import("./pages/Hub.tsx").then((m) => ({ default: m.Hub })));
const Info = lazyWithRetry(() => import("./pages/Info.tsx").then((m) => ({ default: m.Info })));
const DiagramGallery = lazyWithRetry(() => import("./pages/DiagramGallery.tsx").then((m) => ({ default: m.DiagramGallery })));
const ProjectsIndex = lazyWithRetry(() => import("./pages/ProjectsIndex.tsx").then((m) => ({ default: m.ProjectsIndex })));
const Project = lazyWithRetry(() => import("./pages/Project.tsx").then((m) => ({ default: m.Project })));
const Clients = lazyWithRetry(() => import("./pages/Clients.tsx").then((m) => ({ default: m.Clients })));
const Contact = lazyWithRetry(() => import("./pages/Contact.tsx").then((m) => ({ default: m.Contact })));
const ContactUs = lazyWithRetry(() => import("./pages/ContactUs.tsx").then((m) => ({ default: m.ContactUs })));
const BlogIndex = lazyWithRetry(() => import("./pages/BlogIndex.tsx").then((m) => ({ default: m.BlogIndex })));
const Article = lazyWithRetry(() => import("./pages/Article.tsx").then((m) => ({ default: m.Article })));
const Profile = lazyWithRetry(() => import("./pages/Profile.tsx").then((m) => ({ default: m.Profile })));
const Sitemap = lazyWithRetry(() => import("./pages/Sitemap.tsx").then((m) => ({ default: m.Sitemap })));
const NotFound = lazyWithRetry(() => import("./pages/NotFound.tsx").then((m) => ({ default: m.NotFound })));
const Advantages = lazyWithRetry(() => import("./pages/Advantages.tsx").then((m) => ({ default: m.Advantages })));
const OneStepSolution = lazyWithRetry(() => import("./pages/OneStepSolution.tsx").then((m) => ({ default: m.OneStepSolution })));
const SmePolicy = lazyWithRetry(() => import("./pages/SmePolicy.tsx").then((m) => ({ default: m.SmePolicy })));
const FactoryTour = lazyWithRetry(() => import("./pages/FactoryTour.tsx").then((m) => ({ default: m.FactoryTour })));
const Concept3D = lazyWithRetry(() => import("./pages/Concept3D.tsx").then((m) => ({ default: m.Concept3D })));

const SuspenseFallback: React.FC = () => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
    style={{ backgroundColor: "var(--blue, #1E3A8A)" }}
  >
    <div
      className="flex items-center justify-center"
      style={{ gap: "clamp(8px, 2vw, 14px)" }}
    >
      <span
        className="rounded-full bg-white block"
        style={{
          width: "clamp(8px, 2.2vw, 14px)",
          height: "clamp(8px, 2.2vw, 14px)",
          animation:
            "pageTransitionWave 1200ms cubic-bezier(0.22, 1, 0.36, 1) infinite 0ms",
        }}
      />
      <span
        className="rounded-full bg-white block"
        style={{
          width: "clamp(8px, 2.2vw, 14px)",
          height: "clamp(8px, 2.2vw, 14px)",
          animation:
            "pageTransitionWave 1200ms cubic-bezier(0.22, 1, 0.36, 1) infinite 160ms",
        }}
      />
      <span
        className="rounded-full bg-white block"
        style={{
          width: "clamp(8px, 2.2vw, 14px)",
          height: "clamp(8px, 2.2vw, 14px)",
          animation:
            "pageTransitionWave 1200ms cubic-bezier(0.22, 1, 0.36, 1) infinite 320ms",
        }}
      />
    </div>
  </div>
);

import { useNavigate, useLocation } from "react-router-dom";
import { ScrollTrigger } from "./lib/gsap.ts";

const TrailingSlashRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, search, hash } = location;
    if (pathname !== "/" && !pathname.endsWith("/") && !pathname.includes(".")) {
      navigate(`${pathname}/${search}${hash}`, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

const RouteScrollTriggerManager: React.FC = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = location.pathname;
    // When returning to the homepage from another page, ensure completely fresh state
    if (location.pathname === "/" && prev !== "/") {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.clearScrollMemory?.();
      ScrollTrigger.refresh(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    // When leaving a page, ensure all ScrollTriggers are killed before initializing them on the new page
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [location.pathname]);

  useEffect(() => {
    // Force ScrollTrigger refresh after the DOM has fully rendered on route change
    let rafId: number;
    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return null;
};

export const AppRoutes: React.FC = () => {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <>
      <TrailingSlashRedirect />
      <RouteScrollTriggerManager />
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

      {/* 1. About Us (3-page split) */}
      <Route
        path="/about"
        element={
          <PageShell hasDarkHero={false}>
            <AboutUs />
          </PageShell>
        }
      />
      <Route
        path="/about/"
        element={
          <PageShell hasDarkHero={false}>
            <AboutUs />
          </PageShell>
        }
      />
      <Route
        path="/about/sme-policy"
        element={
          <PageShell hasDarkHero={false}>
            <SmePolicy />
          </PageShell>
        }
      />
      <Route
        path="/about/sme-policy/"
        element={
          <PageShell hasDarkHero={false}>
            <SmePolicy />
          </PageShell>
        }
      />
      <Route
        path="/about/factory"
        element={
          <PageShell hasDarkHero={false}>
            <FactoryTour />
          </PageShell>
        }
      />
      <Route
        path="/about/factory/"
        element={
          <PageShell hasDarkHero={false}>
            <FactoryTour />
          </PageShell>
        }
      />

      {/* Backward-compatibility redirects for /about-us */}
      <Route path="/about-us" element={<Navigate to="/about" replace />} />
      <Route path="/about-us/" element={<Navigate to="/about" replace />} />
      <Route path="/about-us/sme-policy" element={<Navigate to="/about/sme-policy" replace />} />
      <Route path="/about-us/sme-policy/" element={<Navigate to="/about/sme-policy" replace />} />
      <Route path="/about-us/factory-tour" element={<Navigate to="/about/factory" replace />} />
      <Route path="/about-us/factory-tour/" element={<Navigate to="/about/factory" replace />} />
      <Route path="/about-us/introduction/" element={<Navigate to="/about#introduction" replace />} />
      <Route path="/about-us/vision/" element={<Navigate to="/about#vision" replace />} />
      <Route path="/about-us/mission/" element={<Navigate to="/about#mission" replace />} />
      <Route path="/about-us/core-values/" element={<Navigate to="/about#core-values" replace />} />
      <Route path="/about-us/committed-to/" element={<Navigate to="/about/sme-policy#committed-to" replace />} />

      {/* 2. Projects Hub */}
      <Route
        path="/projects/"
        element={
          <PageShell hasDarkHero={true}>
            <ProjectsIndex />
          </PageShell>
        }
      />

      {/* Project Short Slug Aliases */}
      <Route path="/projects/haier-store-shed/" element={<Navigate to="/projects/haier-peb-crane-and-mezzanine-shed-raiwind/" replace />} />
      <Route path="/projects/dravton-dairy-shed/" element={<Navigate to="/projects/dravton-dairy-peb-dairy-shed-chunian/" replace />} />
      <Route path="/projects/maria-b-mezzanine/" element={<Navigate to="/projects/maria-b-peb-mezzanine-floor-lahore/" replace />} />

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

      {/* 5. Existing Contact Page */}
      <Route
        path="/contact/"
        element={
          <PageShell hasDarkHero={false}>
            <Contact />
          </PageShell>
        }
      />
      <Route
        path="/contact"
        element={
          <PageShell hasDarkHero={false}>
            <Contact />
          </PageShell>
        }
      />

      {/* New Contact Page Route (/contact-us) */}
      <Route
        path="/contact-us/"
        element={
          <PageShell hasDarkHero={false}>
            <ContactUs />
          </PageShell>
        }
      />
      <Route
        path="/contact-us"
        element={
          <PageShell hasDarkHero={false}>
            <ContactUs />
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

      {/* Advantages (PEB Division Subpage) */}
      <Route
        path="/pre-engineered-buildings-pakistan/advantages/"
        element={
          <PageShell hasDarkHero={true}>
            <Advantages
              data={
                CONTENT_BY_URL["/pre-engineered-buildings-pakistan/advantages/"]
              }
            />
          </PageShell>
        }
      />

      {/* One-Step Solution (PEB Division Subpage) */}
      <Route
        path="/pre-engineered-buildings-pakistan/one-step-solution/"
        element={
          <PageShell hasDarkHero={true}>
            <OneStepSolution
              data={
                CONTENT_BY_URL[
                  "/pre-engineered-buildings-pakistan/one-step-solution/"
                ]
              }
            />
          </PageShell>
        }
      />

      {/* 3D Concept (PEB Division Subpage) */}
      <Route
        path="/pre-engineered-buildings-pakistan/3d-concept/"
        element={
          <PageShell hasDarkHero={true}>
            <Concept3D
              data={
                CONTENT_BY_URL[
                  "/pre-engineered-buildings-pakistan/3d-concept/"
                ]
              }
            />
          </PageShell>
        }
      />

      {/* Redirect old overview page to new PEB overview page */}
      <Route
        path="/pre-engineered-buildings-pakistan/overview/"
        element={<Navigate to="/pre-engineered-buildings-pakistan/" replace />}
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
          page.url === "/pre-engineered-buildings-pakistan/advantages/" ||
          page.url === "/pre-engineered-buildings-pakistan/one-step-solution/" ||
          page.url === "/pre-engineered-buildings-pakistan/3d-concept/" ||
          page.url === "/about" ||
          page.url.startsWith("/about/") ||
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
        } else {
          ComponentToRender = <Info data={page} />;
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
    </>
  );
};

import { useEffect, useMemo, useState } from "react";
import SidebarNav from "./components/layout/SidebarNav";
import MobileNav from "./components/layout/MobileNav";
import TopBar from "./components/layout/TopBar";
import HeroSection from "./components/sections/HeroSection";
import DashboardSection from "./components/sections/DashboardSection";
import FeedSection from "./components/sections/FeedSection";
import StatsSection from "./components/sections/StatsSection";
import GallerySection from "./components/sections/GallerySection";
import SettingsSection from "./components/settings/SettingsSection";
import CatchFormModal from "./components/catches/CatchFormModal";
import GalleryModal from "./components/gallery/GalleryModal";
import { useAuth } from "./context/AuthContext";
import { useCatches } from "./hooks/useCatches";
import { useCatchMutations } from "./hooks/useCatchMutations";
import { APP_NAME, TEAM_NAME } from "./lib/config";
import { buildDashboardMetrics, buildStats, getBestAngler, getDerivedCatches, scoreCatch } from "./lib/stats";
import { average, formatNumber, pluralize } from "./lib/format";

const SECTIONS = [
  { id: "hero", label: "Översikt", shortLabel: "Start", description: "Logga och säsong" },
  { id: "feed", label: "Fångster", shortLabel: "Flöde", description: "Turer och minnen" },
  { id: "stats", label: "Statistik", shortLabel: "Stats", description: "Fångster i siffror" },
  { id: "gallery", label: "Galleri", shortLabel: "Galleri", description: "Bilder från turerna" },
  { id: "settings", label: "Inställningar", shortLabel: "Admin", description: "Admin" }
];

const INITIAL_FILTERS = {
  search: "",
  species: "all",
  angler: "all",
  sort: "dateDesc",
  release: "all"
};

export default function App() {
  const { isAdmin, userEmail, user, authEnabled, signInWithMagicLink, signOut } = useAuth();
  const { catches, loading, error, source, usingDemo, refresh } = useCatches();
  const { createCatch, updateCatch, deleteCatch, saving, deletingId } = useCatchMutations({
    user,
    onChanged: refresh
  });

  const [activeSection, setActiveSection] = useState("hero");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [formCatch, setFormCatch] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [galleryItem, setGalleryItem] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onScroll() {
      const threshold = window.innerHeight * 0.28;
      let next = "hero";
      SECTIONS.forEach((section) => {
        const rect = document.getElementById(section.id)?.getBoundingClientRect();
        if (rect && rect.top <= threshold) {
          next = section.id;
        }
      });
      setActiveSection(next);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const derivedCatches = useMemo(() => getDerivedCatches(catches), [catches]);

  const filteredCatches = useMemo(() => {
    const query = filters.search.toLowerCase();
    const items = derivedCatches.filter((item) => {
      const haystack = [
        item.angler,
        item.species,
        item.location,
        item.method,
        item.weather,
        item.note,
        item.tripName,
        item.lure,
        item.mood,
        item.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      const searchMatch = !query || haystack.includes(query);
      const speciesMatch = filters.species === "all" || item.species === filters.species;
      const anglerMatch = filters.angler === "all" || item.angler === filters.angler;
      const releaseMatch =
        filters.release === "all" || (filters.release === "released" ? item.released : !item.released);

      return searchMatch && speciesMatch && anglerMatch && releaseMatch;
    });

    items.sort((a, b) => {
      if (filters.sort === "lengthDesc") return b.lengthCm - a.lengthCm;
      if (filters.sort === "weightDesc") return b.weightKg - a.weightKg;
      return new Date(b.caughtAt) - new Date(a.caughtAt);
    });

    return items;
  }, [derivedCatches, filters]);

  const dashboardMetrics = useMemo(() => buildDashboardMetrics(derivedCatches), [derivedCatches]);
  const stats = useMemo(() => buildStats(derivedCatches), [derivedCatches]);
  const speciesOptions = useMemo(() => [...new Set(derivedCatches.map((item) => item.species))], [derivedCatches]);
  const anglerOptions = useMemo(() => [...new Set(derivedCatches.map((item) => item.angler))], [derivedCatches]);
  const galleryItems = useMemo(() => derivedCatches.filter((item) => item.imageUrl), [derivedCatches]);
  const spotlight = useMemo(() => [...derivedCatches].sort((a, b) => scoreCatch(b) - scoreCatch(a))[0] || null, [derivedCatches]);
  const bestAngler = useMemo(() => getBestAngler(derivedCatches), [derivedCatches]);

  const summaryText = useMemo(() => {
    if (!derivedCatches.length) {
      return "Loggen väntar fortfarande på säsongens första fisk.";
    }

    const avgLength = average(derivedCatches.map((item) => item.lengthCm).filter(Boolean), 1);
    const uniqueSpots = new Set(derivedCatches.map((item) => item.location).filter(Boolean)).size;
    return `${derivedCatches.length} loggade fångster, ${uniqueSpots} platser och ett snitt på ${formatNumber(avgLength, "cm", 1)}. Här samlas turerna, toppfisken och de bästa minnena från säsongen.`;
  }, [derivedCatches]);

  function navigateTo(sectionId) {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function openForm(catchItem = null) {
    setFormCatch(catchItem);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setFormCatch(null);
  }

  async function handleFormSubmit(payload) {
    try {
      if (formCatch) {
        await updateCatch(formCatch, payload);
        setToast("Fångsten uppdaterades.");
      } else {
        await createCatch(payload);
        setToast("Fångsten sparades.");
      }
      closeForm();
    } catch (mutationError) {
      setToast(mutationError.message || "Kunde inte spara fångsten.");
    }
  }

  async function handleDelete(catchItem) {
    const confirmed = window.confirm(`Ta bort ${catchItem.species} från ${catchItem.caughtAt}?`);
    if (!confirmed) return;

    try {
      await deleteCatch(catchItem);
      setToast("Fångsten togs bort.");
    } catch (mutationError) {
      setToast(mutationError.message || "Kunde inte ta bort fångsten.");
    }
  }

  function exportJson() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            source,
            catches: derivedCatches
          },
          null,
          2
        )
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cr-predators-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="app-shell">
        <div className="layout">
          <SidebarNav sections={SECTIONS} activeSection={activeSection} onNavigate={navigateTo} teamName={TEAM_NAME} />

          <main className="main">
            <TopBar
              teamName={TEAM_NAME}
              summary={`${pluralize(derivedCatches.length, "fångst")} loggade · ${APP_NAME}`}
              isAdmin={isAdmin}
              onOpenForm={() => openForm(null)}
              onJumpToFeed={() => navigateTo("feed")}
            />

            {error && isAdmin ? (
              <div className="surface warning-panel">
                <strong>Systemstatus</strong>
                <p>{usingDemo ? `${error} Demo-läge används just nu.` : error}</p>
              </div>
            ) : null}

            <HeroSection
              teamName={TEAM_NAME}
              summaryText={summaryText}
              bestAngler={bestAngler}
              spotlight={spotlight}
              releaseRate={stats.releaseRate}
              totalCount={derivedCatches.length}
              canCreate={isAdmin}
              onOpenForm={() => openForm(null)}
              onNavigateFeed={() => navigateTo("feed")}
            />

            <DashboardSection metrics={dashboardMetrics} />

            <FeedSection
              catches={filteredCatches}
              filters={filters}
              onFilterChange={updateFilter}
              speciesOptions={speciesOptions}
              anglerOptions={anglerOptions}
              canCreate={isAdmin}
              onOpenForm={openForm}
              onEdit={openForm}
              onDelete={handleDelete}
              deletingId={deletingId}
              onOpenGallery={setGalleryItem}
            />

            <StatsSection stats={stats} />
            <GallerySection items={galleryItems} onOpenGallery={setGalleryItem} />

            <SettingsSection
              authEnabled={authEnabled}
              usingDemo={usingDemo}
              userEmail={userEmail}
              isAdmin={isAdmin}
              signInWithMagicLink={signInWithMagicLink}
              signOut={signOut}
              catches={derivedCatches}
              onExport={exportJson}
            />
          </main>
        </div>
      </div>

      <MobileNav sections={SECTIONS} activeSection={activeSection} onNavigate={navigateTo} />
      <CatchFormModal open={formOpen} catchItem={formCatch} onClose={closeForm} onSubmit={handleFormSubmit} saving={saving} />
      <GalleryModal item={galleryItem} onClose={() => setGalleryItem(null)} />

      <div className="toast-layer">
        <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="loading-card">Laddar fångster...</div>
        </div>
      ) : null}
    </>
  );
}

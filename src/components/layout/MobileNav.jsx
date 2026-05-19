export default function MobileNav({ sections, activeSection, onNavigate }) {
  const icons = {
    hero: "◌",
    feed: "≈",
    stats: "◎",
    gallery: "▣",
    settings: "⋯"
  };

  return (
    <nav className="bottom-nav" aria-label="Mobilnavigation">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`bottom-nav-btn ${activeSection === section.id ? "is-active" : ""}`}
          type="button"
          onClick={() => onNavigate(section.id)}
        >
          <span>{icons[section.id] || "•"}</span>
          <span>{section.shortLabel}</span>
        </button>
      ))}
    </nav>
  );
}

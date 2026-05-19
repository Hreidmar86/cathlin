const NAV_ICONS = {
  hero: "◌",
  feed: "≈",
  stats: "◎",
  gallery: "▣",
  settings: "⚙"
};

export default function SidebarNav({ sections, activeSection, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="brand-mark">◌</div>
        <div className="sidebar-copy">
          <strong>C&amp;R</strong>
        </div>
      </div>

      <div className="sidebar-visual" aria-hidden="true">
        <div className="sidebar-visual-glow" />
        <div className="sidebar-visual-ripple ripple-one" />
        <div className="sidebar-visual-ripple ripple-two" />
        <div className="sidebar-visual-ripple ripple-three" />
        <div className="sidebar-fish">
          <span className="fish-body" />
          <span className="fish-tail" />
          <span className="fish-fin" />
          <span className="fish-eye" />
        </div>
      </div>

      <nav className="nav-list" aria-label="Sektioner">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`nav-btn ${activeSection === section.id ? "is-active" : ""}`}
            type="button"
            onClick={() => onNavigate(section.id)}
          >
            <div className="nav-copy">
              <span className="nav-icon" aria-hidden="true">
                {NAV_ICONS[section.id] || "•"}
              </span>
              <strong>{section.label}</strong>
            </div>
            <span>{`0${index + 1}`}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

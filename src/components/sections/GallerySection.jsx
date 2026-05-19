import { formatNumber } from "../../lib/format";

export default function GallerySection({ items, onOpenGallery }) {
  return (
    <section className="section" id="gallery">
      <div className="section-head">
        <div>
          <div className="eyebrow">Galleri</div>
          <h2>Galleri</h2>
        </div>
      </div>
      <div className="gallery-grid">
        {!items.length ? (
          <div className="empty-state">
            <div>
              <strong>Inga bilder i galleriet än</strong>
              <p className="subtle">När fler fångster får bilder dyker de upp här.</p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              className="gallery-card"
              type="button"
              aria-label={`Öppna ${item.species} i galleriet`}
              onClick={() => onOpenGallery(item)}
            >
              <div className="gallery-image">
                <img src={item.imageUrl} alt={item.species} loading="lazy" />
                <div className="gallery-overlay">
                  <span className="badge hot">{item.species}</span>
                  <span className="badge">{formatNumber(item.lengthCm, "cm")}</span>
                  <span className="badge">{formatNumber(item.weightKg, "kg", 1)}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

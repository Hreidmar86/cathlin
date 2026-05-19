import { formatNumber } from "../../lib/format";

export default function GallerySection({ items, totalCatches, onOpenGallery }) {
  const hasCatches = totalCatches > 0;

  return (
    <section className="section" id="gallery">
      <div className="section-head">
        <div>
          <div className="eyebrow">Galleri</div>
          <h2>Galleri</h2>
        </div>
      </div>
      <div className={`gallery-grid-shell ${items.length ? "has-items" : "is-empty"}`}>
        {!items.length ? (
          <div className="empty-state gallery-empty-state">
            <div>
              <strong>{hasCatches ? "Inga bilder ännu" : "Galleriet är tomt än så länge"}</strong>
              <p className="subtle">
                {hasCatches
                  ? "Lägg till foto när du loggar nästa fångst."
                  : "När de första fångsterna får bilder dyker de upp här."}
              </p>
            </div>
          </div>
        ) : (
          <div className="gallery-grid">
            {items.map((item) => (
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

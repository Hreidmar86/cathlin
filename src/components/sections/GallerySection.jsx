import { useEffect, useState } from "react";
import { formatNumber } from "../../lib/format";

function GalleryCardImage({ item }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [item.id, item.imageUrl]);

  if (!item.imageUrl || failed) {
    return (
      <div className="gallery-image-fallback">
        <strong>Bild saknas</strong>
        <span className="subtle">Öppna en annan fångst i galleriet.</span>
      </div>
    );
  }

  return <img src={item.imageUrl} alt={item.species} loading="lazy" onError={() => setFailed(true)} />;
}

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
            {items.map((item, index) => (
              <button
                key={item.id}
                className="gallery-card"
                type="button"
                aria-label={`Öppna ${item.species} i galleriet`}
                onClick={() => onOpenGallery(index)}
              >
                <div className="gallery-image">
                  <GalleryCardImage item={item} />
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

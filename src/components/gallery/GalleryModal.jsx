import { useEffect, useState } from "react";
import { formatDate, formatNumber } from "../../lib/format";

function GalleryImage({ item }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [item?.id, item?.imageUrl]);

  if (!item?.imageUrl || failed) {
    return (
      <div className="gallery-image-fallback gallery-image-fallback-large">
        <strong>Bild saknas</strong>
        <span className="subtle">Den här fångsten har ingen stabil bild att visa.</span>
      </div>
    );
  }

  return <img src={item.imageUrl} alt={item.species} onError={() => setFailed(true)} />;
}

export default function GalleryModal({
  items,
  activeIndex,
  onClose,
  onNavigate,
  canEdit,
  onEdit,
  onDelete
}) {
  const open = activeIndex >= 0 && activeIndex < items.length;
  const item = open ? items[activeIndex] : null;
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < items.length - 1;

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && hasPrevious) {
        onNavigate(activeIndex - 1);
      } else if (event.key === "ArrowRight" && hasNext) {
        onNavigate(activeIndex + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, hasNext, hasPrevious, onClose, onNavigate, open]);

  return (
    <div className={`modal-layer gallery-modal ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="galleryModalTitle">
        {item ? (
          <div className="modal-inner gallery-detail">
            <div className="modal-head">
              <div>
                <div className="eyebrow">Galleri</div>
                <h3 id="galleryModalTitle">
                  {item.species} · {formatNumber(item.lengthCm, "cm")}
                </h3>
                <p className="subtle">
                  {item.angler} · {formatDate(item.caughtAt)}
                </p>
              </div>
              <button className="close-btn" type="button" onClick={onClose} aria-label="Stäng">
                ×
              </button>
            </div>

            <div className="gallery-viewer-shell">
              <button
                className="gallery-nav-btn"
                type="button"
                onClick={() => onNavigate(activeIndex - 1)}
                disabled={!hasPrevious}
                aria-label="Föregående bild"
              >
                ←
              </button>
              <div className="gallery-detail-media">
                <GalleryImage item={item} />
              </div>
              <button
                className="gallery-nav-btn"
                type="button"
                onClick={() => onNavigate(activeIndex + 1)}
                disabled={!hasNext}
                aria-label="Nästa bild"
              >
                →
              </button>
            </div>

            <div className="gallery-detail-copy">
              <div className="spec-line">
                <span className="badge hot">{item.species}</span>
                <span className="badge">{formatNumber(item.lengthCm, "cm")}</span>
                <span className="badge">{formatNumber(item.weightKg, "kg", 1)}</span>
                {item.personalBest ? <span className="badge">PB</span> : null}
                {item.released ? <span className="badge">Återutsatt</span> : null}
              </div>
              <p className="subtle">
                {item.location || "Plats saknas"} · {item.method || "Metod saknas"} ·{" "}
                {item.weather || "Väder saknas"}
              </p>
              {item.note ? <p className="feed-note">{item.note}</p> : null}

              {canEdit ? (
                <div className="catch-admin-actions">
                  <button className="icon-btn primary-action" type="button" onClick={() => onEdit(item)}>
                    Redigera fångst
                  </button>
                  <button className="icon-btn danger" type="button" onClick={() => onDelete(item)}>
                    Ta bort fångst
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

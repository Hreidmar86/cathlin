import { formatDate, formatNumber } from "../../lib/format";

export default function GalleryModal({ item, onClose }) {
  const open = Boolean(item);

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
                  {item.species} · {formatNumber(item.length, "cm")}
                </h3>
                <p className="subtle">
                  {item.angler} · {formatDate(item.date)}
                </p>
              </div>
              <button className="close-btn" type="button" onClick={onClose} aria-label="Stäng">
                ×
              </button>
            </div>
            <div className="gallery-detail-media">
              <img src={item.photoUrl} alt={item.species} />
            </div>
            <div className="gallery-detail-copy">
              <div className="spec-line">
                <span className="badge hot">{item.species}</span>
                <span className="badge">{formatNumber(item.length, "cm")}</span>
                <span className="badge">{formatNumber(item.weight, "kg", 1)}</span>
                {item.personalBest && <span className="badge">PB</span>}
              </div>
              <p className="subtle">
                {item.tripName || item.location || "Ingen tur angiven"} · {item.method || "Metod saknas"} ·{" "}
                {item.weather || "Väder saknas"}
              </p>
              {item.note ? <p className="feed-note">{item.note}</p> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

import { formatDate, formatNumber } from "../../lib/format";

export default function CatchCard({ item, canEdit, deleting, onEdit, onDelete, onOpenGallery }) {
  return (
    <article className="feed-card">
      <div className="feed-media">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={`${item.species} fångad av ${item.angler}`} loading="lazy" />
        ) : (
          <div className="gallery-image-fallback feed-image-fallback">
            <strong>Ingen bild</strong>
            <span className="subtle">Lägg till foto när du redigerar fångsten.</span>
          </div>
        )}
        <div className="feed-badges">
          <span className="badge hot">{item.species}</span>
          <span className="badge">{item.angler}</span>
          {item.personalBest ? <span className="badge">PB</span> : null}
        </div>
      </div>

      <div className="feed-body">
        <div className="feed-head">
          <div>
            <h3>{item.species}</h3>
            <p className="subtle">
              {formatDate(item.caughtAt)} · {item.location || "Plats saknas"}
            </p>
          </div>
          <div className="spec-line">
            <span className="spec-chip">{formatNumber(item.lengthCm, "cm")}</span>
            <span className="spec-chip">{formatNumber(item.weightKg, "kg", 1)}</span>
          </div>
        </div>

        <div className="spec-line">
          {item.method ? <span className="badge">{item.method}</span> : null}
          {item.weather ? <span className="badge">{item.weather}</span> : null}
          {item.lure ? <span className="badge">{item.lure}</span> : null}
          {item.released ? <span className="badge">Återutsatt</span> : null}
        </div>

        {item.note ? <p className="feed-note">{item.note}</p> : null}

        <div className="feed-actions">
          {item.imageUrl ? (
            <button className="icon-btn" type="button" onClick={() => onOpenGallery(item.id)}>
              Visa bild
            </button>
          ) : null}
        </div>

        {canEdit ? (
          <div className="catch-admin-actions">
            <button className="icon-btn primary-action" type="button" onClick={() => onEdit(item)}>
              Redigera fångst
            </button>
            <button className="icon-btn danger" type="button" onClick={() => onDelete(item)} disabled={deleting}>
              {deleting ? "Tar bort..." : "Ta bort fångst"}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

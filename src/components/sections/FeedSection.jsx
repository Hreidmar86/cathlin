import CatchCard from "../catches/CatchCard";

export default function FeedSection({
  catches,
  filters,
  onFilterChange,
  speciesOptions,
  anglerOptions,
  canCreate,
  onOpenForm,
  onEdit,
  onDelete,
  deletingId,
  onOpenGallery
}) {
  return (
    <section className="section" id="feed">
      <div className="section-head">
        <div>
          <div className="eyebrow">Fångstflöde</div>
          <h2>Alla fångster</h2>
        </div>
        {canCreate && (
          <button className="btn soft" type="button" onClick={() => onOpenForm(null)}>
            Ny fångst
          </button>
        )}
      </div>

      <div className="feed-toolbar stack">
        <div className="search-row">
          <input
            className="field"
            type="search"
            placeholder="Sök på art, plats, metod, anteckning eller tur..."
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
          />
        </div>
        <div className="filter-grid">
          <select className="field" value={filters.species} onChange={(event) => onFilterChange("species", event.target.value)}>
            <option value="all">Alla arter</option>
            {speciesOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select className="field" value={filters.angler} onChange={(event) => onFilterChange("angler", event.target.value)}>
            <option value="all">Alla fiskare</option>
            {anglerOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select className="field" value={filters.sort} onChange={(event) => onFilterChange("sort", event.target.value)}>
            <option value="dateDesc">Senaste först</option>
            <option value="lengthDesc">Längd högst först</option>
            <option value="weightDesc">Vikt högst först</option>
          </select>
          <select className="field" value={filters.release} onChange={(event) => onFilterChange("release", event.target.value)}>
            <option value="all">Alla fångster</option>
            <option value="released">Återutsatt</option>
            <option value="kept">Ej återutsatt</option>
          </select>
        </div>
      </div>

      <div className="feed-list">
        {!catches.length ? (
          <div className="empty-state">
            <div>
              <strong>Ingen fångst matchar filtret</strong>
              <p className="subtle">Justera filtren eller invänta nästa fångst i loggen.</p>
            </div>
          </div>
        ) : (
          catches.map((item) => (
            <CatchCard
              key={item.id}
              item={item}
              canEdit={canCreate}
              deleting={deletingId === item.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpenGallery={onOpenGallery}
            />
          ))
        )}
      </div>
    </section>
  );
}

import CatchCard from "../catches/CatchCard";
import CustomSelect from "../ui/CustomSelect";

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
  const speciesFilterOptions = [
    { value: "all", label: "Alla arter" },
    ...speciesOptions.map((option) => ({ value: option, label: option }))
  ];

  const anglerFilterOptions = [
    { value: "all", label: "Alla fiskare" },
    ...anglerOptions.map((option) => ({ value: option, label: option }))
  ];

  const sortFilterOptions = [
    { value: "dateDesc", label: "Senaste först" },
    { value: "lengthDesc", label: "Längd högst först" },
    { value: "weightDesc", label: "Vikt högst först" }
  ];

  const releaseFilterOptions = [
    { value: "all", label: "Alla fångster" },
    { value: "released", label: "Återutsatt" },
    { value: "kept", label: "Ej återutsatt" }
  ];

  return (
    <section className="section" id="feed">
      <div className="section-head">
        <div>
          <div className="eyebrow">Fångstflöde</div>
          <h2>Alla fångster</h2>
        </div>
        {canCreate && (
          <button className="btn primary" type="button" onClick={() => onOpenForm(null)}>
            Logga fångst
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
          <CustomSelect
            value={filters.species}
            options={speciesFilterOptions}
            ariaLabel="Filtrera på art"
            onChange={(nextValue) => onFilterChange("species", nextValue)}
          />
          <CustomSelect
            value={filters.angler}
            options={anglerFilterOptions}
            ariaLabel="Filtrera på fiskare"
            onChange={(nextValue) => onFilterChange("angler", nextValue)}
          />
          <CustomSelect
            value={filters.sort}
            options={sortFilterOptions}
            ariaLabel="Sortera fångster"
            onChange={(nextValue) => onFilterChange("sort", nextValue)}
          />
          <CustomSelect
            value={filters.release}
            options={releaseFilterOptions}
            ariaLabel="Filtrera på återutsättning"
            onChange={(nextValue) => onFilterChange("release", nextValue)}
          />
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

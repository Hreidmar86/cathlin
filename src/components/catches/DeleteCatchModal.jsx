import { formatDate } from "../../lib/format";

export default function DeleteCatchModal({ catchItem, deleting, onCancel, onConfirm }) {
  const open = Boolean(catchItem);

  return (
    <div className={`modal-layer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="modal-backdrop" onClick={deleting ? undefined : onCancel} />
      <aside className="modal modal-confirm" role="dialog" aria-modal="true" aria-labelledby="deleteCatchTitle">
        {catchItem ? (
          <div className="modal-inner">
            <div className="modal-head">
              <div>
                <div className="eyebrow">Bekräfta</div>
                <h3 id="deleteCatchTitle">Ta bort fångst</h3>
              </div>
            </div>

            <p className="feed-note">
              Du håller på att ta bort {catchItem.species} från {formatDate(catchItem.caughtAt)}.
            </p>
            <p className="subtle">Det här går inte att ångra och bilden kopplad till fångsten tas också bort när det går.</p>

            <div className="feed-actions">
              <button className="btn danger" type="button" onClick={onConfirm} disabled={deleting}>
                {deleting ? "Tar bort..." : "Ta bort fångst"}
              </button>
              <button className="btn soft" type="button" onClick={onCancel} disabled={deleting}>
                Avbryt
              </button>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

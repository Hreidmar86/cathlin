import { useEffect, useMemo, useRef, useState } from "react";
import { formatNumber, normalizeDate } from "../../lib/format";

const DEFAULT_SPECIES = ["Gädda", "Abborre", "Gös", "Öring"];
const DEFAULT_ANGLERS = ["Cathlin", "Robin", "Båda"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function buildInitialState(catchItem) {
  return {
    species: catchItem?.species || "",
    angler: catchItem?.angler || "",
    lengthCm: catchItem?.lengthCm || "",
    weightKg: catchItem?.weightKg || "",
    caughtAt: catchItem?.caughtAt || normalizeDate(new Date()),
    location: catchItem?.location || "",
    method: catchItem?.method || "",
    weather: catchItem?.weather || "",
    lure: catchItem?.lure || "",
    note: catchItem?.note || "",
    released: Boolean(catchItem?.released ?? true)
  };
}

function validatePhotoFile(file) {
  if (!file) return "";
  if (!file.type?.startsWith("image/")) return "Bilden måste vara en giltig bildfil.";
  if (file.size > MAX_IMAGE_BYTES) return "Bilden är för stor. Maxstorlek är 10 MB.";
  return "";
}

export default function CatchFormModal({ open, catchItem, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(buildInitialState(catchItem));
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(catchItem?.imageUrl || "");
  const [removePhoto, setRemovePhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const firstInputRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    setForm(buildInitialState(catchItem));
    setPhotoFile(null);
    setPreviewUrl(catchItem?.imageUrl || "");
    setRemovePhoto(false);
    setErrorMessage("");
  }, [catchItem, open]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      firstInputRef.current?.focus();
    }, 20);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      }
    };
  }, [open, onClose]);

  const title = useMemo(() => (catchItem ? "Justera loggen" : "Logga nästa fisk"), [catchItem]);
  const selectedFileInfo = useMemo(() => {
    if (!photoFile) return "";
    return `${photoFile.name} · ${formatNumber(photoFile.size / (1024 * 1024), "MB", 1)}`;
  }, [photoFile]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextError = validatePhotoFile(file);
    if (nextError) {
      setErrorMessage(nextError);
      event.target.value = "";
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setErrorMessage("");
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemovePhoto(false);
  }

  function handleResetPhoto() {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPhotoFile(null);
    setPreviewUrl("");
    setRemovePhoto(true);
    setErrorMessage("");
  }

  async function submit(event) {
    event.preventDefault();
    const nextError = validatePhotoFile(photoFile);
    if (nextError) {
      setErrorMessage(nextError);
      return;
    }

    setErrorMessage("");
    try {
      await onSubmit({
        values: form,
        photoFile,
        removePhoto
      });
    } catch (error) {
      setErrorMessage(error.message || "Kunde inte spara fångsten.");
    }
  }

  return (
    <div className={`modal-layer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="modal-backdrop" onClick={onClose} />
      <aside className="modal" role="dialog" aria-modal="true" aria-labelledby="formModalTitle">
        <div className="modal-inner">
          <div className="modal-head">
            <div>
              <div className="eyebrow">{catchItem ? "Redigera fångst" : "Ny fångst"}</div>
              <h3 id="formModalTitle">{title}</h3>
              <p className="subtle">Sparas i fångstloggen och laddar upp bild när du väljer ett foto.</p>
            </div>
            <button ref={closeButtonRef} className="close-btn" type="button" onClick={onClose} aria-label="Stäng formulär">
              Stäng
            </button>
          </div>

          <form className="form-grid" onSubmit={submit}>
            <div className="field-stack">
              <label>Snabbval art</label>
              <div className="quick-group">
                {DEFAULT_SPECIES.map((species) => (
                  <button
                    key={species}
                    className={`chip ${form.species === species ? "active" : ""}`}
                    type="button"
                    onClick={() => updateField("species", species)}
                  >
                    {species}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-stack">
              <label>Snabbval fiskare</label>
              <div className="quick-group">
                {DEFAULT_ANGLERS.map((angler) => (
                  <button
                    key={angler}
                    className={`chip ${form.angler === angler ? "active" : ""}`}
                    type="button"
                    onClick={() => updateField("angler", angler)}
                  >
                    {angler}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-grid">
              <div className="field-stack">
                <label htmlFor="speciesInput">Art</label>
                <input
                  ref={firstInputRef}
                  id="speciesInput"
                  className="field"
                  value={form.species}
                  onChange={(event) => updateField("species", event.target.value)}
                  required
                />
              </div>
              <div className="field-stack">
                <label htmlFor="anglerInput">Fiskare</label>
                <input id="anglerInput" className="field" value={form.angler} onChange={(event) => updateField("angler", event.target.value)} required />
              </div>
              <div className="field-stack">
                <label htmlFor="lengthInput">Längd i cm</label>
                <input
                  id="lengthInput"
                  className="field"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.lengthCm}
                  onChange={(event) => updateField("lengthCm", event.target.value)}
                  required
                />
              </div>
              <div className="field-stack">
                <label htmlFor="weightInput">Vikt i kg</label>
                <input
                  id="weightInput"
                  className="field"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.weightKg}
                  onChange={(event) => updateField("weightKg", event.target.value)}
                />
              </div>
              <div className="field-stack">
                <label htmlFor="dateInput">Datum</label>
                <input
                  id="dateInput"
                  className="field"
                  type="date"
                  value={form.caughtAt}
                  onChange={(event) => updateField("caughtAt", event.target.value)}
                  required
                />
              </div>
              <div className="field-stack">
                <label htmlFor="locationInput">Plats</label>
                <input id="locationInput" className="field" value={form.location} onChange={(event) => updateField("location", event.target.value)} />
              </div>
              <div className="field-stack">
                <label htmlFor="methodInput">Metod</label>
                <input id="methodInput" className="field" value={form.method} onChange={(event) => updateField("method", event.target.value)} />
              </div>
              <div className="field-stack">
                <label htmlFor="weatherInput">Väder</label>
                <input id="weatherInput" className="field" value={form.weather} onChange={(event) => updateField("weather", event.target.value)} />
              </div>
              <div className="field-stack">
                <label htmlFor="lureInput">Bete</label>
                <input id="lureInput" className="field" value={form.lure} onChange={(event) => updateField("lure", event.target.value)} />
              </div>
            </div>

            <div className="toggle-row">
              <button
                className={`toggle-pill ${form.released ? "active" : ""}`}
                type="button"
                onClick={() => updateField("released", !form.released)}
              >
                {`Återutsatt: ${form.released ? "Ja" : "Nej"}`}
              </button>
              <button className="toggle-pill" type="button" onClick={handleResetPhoto}>
                {previewUrl ? "Ta bort bild" : "Nollställ bild"}
              </button>
            </div>

            <div className="field-stack">
              <label htmlFor="noteInput">Anteckning</label>
              <textarea id="noteInput" className="field" value={form.note} onChange={(event) => updateField("note", event.target.value)} />
            </div>

            <div className="preview-shell upload-panel">
              <div className="preview-frame">{previewUrl ? <img src={previewUrl} alt="Förhandsvisning" /> : "Välj ett foto för att lägga till en bild i fångsten."}</div>
              <div className="upload-panel-copy">
                <p className="subtle">Mobil öppnar kameran direkt när det stöds. Endast bilder, max 10 MB.</p>
                {selectedFileInfo ? <p className="tiny">{selectedFileInfo}</p> : null}
                {errorMessage ? <p className="admin-status-message is-error">{errorMessage}</p> : null}
              </div>
              <div className="feed-actions">
                <label className="btn soft file-input">
                  {previewUrl ? "Byt foto" : "Ta foto eller välj bild"}
                  <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            <div className="feed-actions">
              <button className="btn primary" type="submit" disabled={saving}>
                {saving ? "Sparar..." : catchItem ? "Spara ändringar" : "Spara fångst"}
              </button>
              <button className="btn soft" type="button" onClick={onClose}>
                Avbryt
              </button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
}

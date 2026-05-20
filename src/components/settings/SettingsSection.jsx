import { useState } from "react";

export default function SettingsSection({
  authEnabled,
  usingDemo,
  userEmail,
  isAdmin,
  signInWithMagicLink,
  signOut,
  catches,
  onExport
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSignIn(event) {
    event.preventDefault();
    setSending(true);
    setStatus("");

    try {
      await signInWithMagicLink(email);
      setStatus("Magic link skickad.");
    } catch (error) {
      setStatus(error.message || "Kunde inte skicka magic link.");
    } finally {
      setSending(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setStatus("Utloggad.");
    } catch (error) {
      setStatus(error.message || "Kunde inte logga ut.");
    }
  }

  return (
    <section className="section" id="settings">
      <div className="section-head">
        <div>
          <div className="eyebrow">Inställningar</div>
          <h2>Admin</h2>
        </div>
      </div>

      <div className="setting-grid">
        <div className="setting-card setting-card-compact admin-card">
          <h3>Admin</h3>
          <div className="setting-row admin-card-body">
            {!authEnabled ? (
              <p>Adminläge är inte tillgängligt just nu.</p>
            ) : isAdmin ? (
              <div className="admin-status">
                <p className="admin-status-copy">
                  Inloggad som <strong>{userEmail || "admin"}</strong>.
                </p>
                <button className="btn primary" type="button" onClick={handleSignOut}>
                  Logga ut
                </button>
              </div>
            ) : (
              <form className="admin-login-form" onSubmit={handleSignIn}>
                <div className="field-stack">
                  <label htmlFor="adminEmail">E-post</label>
                  <input
                    id="adminEmail"
                    className="field"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    required
                    autoComplete="email"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
                <button className="btn primary" type="submit" disabled={sending}>
                  {sending ? "Skickar..." : "Skicka magic link"}
                </button>
              </form>
            )}
            {status ? (
              <p className={`admin-status-message ${status === "Magic link skickad." || status === "Utloggad." ? "is-success" : "is-error"}`}>
                {status}
              </p>
            ) : null}
          </div>
        </div>

        <div className="setting-card">
          <h3>Verktyg</h3>
          <div className="setting-row">
            <div className="list-line">
              <span>Loggade fångster</span>
              <strong>{catches.length}</strong>
            </div>
            {usingDemo ? (
              <div className="list-line">
                <span>Systemstatus</span>
                <strong>Demo-läge</strong>
              </div>
            ) : null}
            <button className="btn soft" type="button" onClick={onExport}>
              Exportera JSON
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

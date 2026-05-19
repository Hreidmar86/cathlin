import { useState } from "react";
import { ADMIN_EMAILS } from "../../lib/config";

export default function SettingsSection({
  authEnabled,
  usingDemo,
  userEmail,
  isAdmin,
  signInWithPassword,
  signOut,
  catches,
  onExport
}) {
  const [email, setEmail] = useState(userEmail || ADMIN_EMAILS[0] || "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSignIn(event) {
    event.preventDefault();
    setSending(true);
    setStatus("");
    try {
      await signInWithPassword(email, password);
      setPassword("");
      setStatus("Inloggad.");
    } catch (error) {
      setStatus(error.message || "Fel e-post eller lösenord.");
    } finally {
      setSending(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setPassword("");
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
        <div className="setting-card">
          <h3>Admin</h3>
          <div className="setting-row">
            {!authEnabled ? (
              <p>Adminläge är inte tillgängligt just nu.</p>
            ) : isAdmin ? (
              <>
                <p>
                  Inloggad som admin <strong>{userEmail}</strong>.
                </p>
                <button className="btn primary" type="button" onClick={handleSignOut}>
                  Logga ut
                </button>
              </>
            ) : (
              <form className="stack" onSubmit={handleSignIn}>
                <div className="field-stack">
                  <label htmlFor="adminEmail">E-post</label>
                  <input
                    id="adminEmail"
                    className="field"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="cathlin@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="field-stack">
                  <label htmlFor="adminPassword">Lösenord</label>
                  <input
                    id="adminPassword"
                    className="field"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Lösenord"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button className="btn primary" type="submit" disabled={sending}>
                  {sending ? "Loggar in..." : "Logga in"}
                </button>
              </form>
            )}
            {status ? <p className="subtle">{status}</p> : null}
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

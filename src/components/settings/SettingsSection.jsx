import { useState } from "react";

export default function SettingsSection({
  authEnabled,
  usingDemo,
  username,
  isAdmin,
  signInWithPassword,
  signOut,
  catches,
  onExport
}) {
  const [loginName, setLoginName] = useState("Cathyyy");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSignIn(event) {
    event.preventDefault();
    setSending(true);
    setStatus("");

    try {
      await signInWithPassword(loginName, password);
      setPassword("");
      setStatus("Inloggad.");
    } catch (error) {
      setStatus(error.message || "Fel användarnamn eller lösenord.");
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
        <div className="setting-card setting-card-compact admin-card">
          <h3>Admin</h3>
          <div className="setting-row admin-card-body">
            {!authEnabled ? (
              <p>Adminläge är inte tillgängligt just nu.</p>
            ) : isAdmin ? (
              <div className="admin-status">
                <p className="admin-status-copy">
                  Inloggad som <strong>{username || "admin"}</strong>.
                </p>
                <button className="btn primary" type="button" onClick={handleSignOut}>
                  Logga ut
                </button>
              </div>
            ) : (
              <form className="admin-login-form" onSubmit={handleSignIn}>
                <div className="field-stack">
                  <label htmlFor="adminUsername">Användarnamn</label>
                  <input
                    id="adminUsername"
                    className="field"
                    type="text"
                    value={loginName}
                    onChange={(event) => setLoginName(event.target.value)}
                    placeholder="Cathyyy"
                    required
                    autoComplete="username"
                    autoCapitalize="off"
                    spellCheck="false"
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
            {status ? (
              <p className={`admin-status-message ${status === "Inloggad." || status === "Utloggad." ? "is-success" : "is-error"}`}>
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

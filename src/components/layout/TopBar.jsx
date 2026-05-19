export default function TopBar({ teamName, summary, isAdmin, onOpenForm, onJumpToFeed }) {
  return (
    <header className="topbar">
      <div className="topbar-copy">
        <strong>{teamName}</strong>
        <span>{summary}</span>
      </div>
      <div className="topbar-actions">
        <button className="btn soft" type="button" onClick={onJumpToFeed}>
          Se fångster
        </button>
        {isAdmin && (
          <button className="btn primary" type="button" onClick={onOpenForm}>
            Logga fångst
          </button>
        )}
      </div>
    </header>
  );
}

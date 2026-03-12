import { useHistoryToggle } from "../../hooks/useHistoryToggle";
import "./TopBar.scss";

/**
 * Formats a history entry description for display in the top bar.
 * Combines the event label with formatted dates.
 */
function formatHistoryEntry(entry) {
  if (!entry) return "";

  const label = entry.label || entry.description || entry.type || "Evento";

  if (entry.date) {
    // Attempt to format date nicely
    try {
      const d = new Date(entry.date);
      const dateStr = d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeLocal = d.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      // Show UTC offset if available
      let utcStr = "";
      const offset = -d.getTimezoneOffset();
      const sign = offset >= 0 ? "+" : "-";
      const absOffset = Math.abs(offset);
      const hh = String(Math.floor(absOffset / 60)).padStart(2, "0");
      const mm = String(absOffset % 60).padStart(2, "0");
      utcStr = `(${timeLocal.slice(0, 5)}:${timeLocal.slice(6)} GMT)`;

      return `${label} el ${dateStr} a las ${timeLocal} ${utcStr}`;
    } catch {
      return label;
    }
  }

  return label;
}

/**
 * Checks if a history entry represents a rejection.
 */
function isRejectedEntry(entry) {
  if (!entry) return false;
  const type = (
    entry.type ||
    entry.label ||
    entry.description ||
    ""
  ).toLowerCase();
  return (
    type.includes("rechaz") ||
    type.includes("negativ") ||
    type.includes("reject") ||
    type.includes("denied")
  );
}

export default function TopBar({ thread }) {
  const { expanded, toggle } = useHistoryToggle(false);

  if (!thread) return null;

  const cfscode = thread.cfscode || "";
  const sender = thread.sender?.user || thread.sender?.address || "";
  const recipient = thread.recipient?.address || "";
  const history = thread.history || [];

  // Sort history descending by date (most recent first)
  const sortedHistory = [...history].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date) - new Date(a.date);
  });

  const latestEntry = sortedHistory[0];
  const olderEntries = sortedHistory.slice(1);

  return (
    <header className="top-bar">
      {/* CFS Code */}
      <div className="top-bar__code-row">
        <span className="top-bar__code-label">CFSCode:</span>
        <span className="top-bar__code-value">{cfscode}</span>
      </div>

      {/* Sender / Recipient */}
      <div className="top-bar__meta-row">
        <div className="top-bar__meta-item">
          <span className="top-bar__meta-label">De:</span>
          <span className="top-bar__meta-value">{sender}</span>
        </div>
        <div className="top-bar__meta-item">
          <span className="top-bar__meta-label">Para:</span>
          <span className="top-bar__meta-value">{recipient}</span>
        </div>
      </div>

      {/* History */}
      <div className="top-bar__history">
        {/* Latest entry (always visible) */}
        {latestEntry && (
          <div
            className={`top-bar__history-row top-bar__history-row--latest${
              isRejectedEntry(latestEntry)
                ? " top-bar__history-row--rejected"
                : ""
            }`}
            onClick={olderEntries.length > 0 ? toggle : undefined}
            style={{ cursor: olderEntries.length > 0 ? "pointer" : "default" }}
          >
            {olderEntries.length > 0 && (
              <button
                className="top-bar__history-toggle-btn"
                aria-label="Expandir histórico"
              >
                <span
                  className={`top-bar__history-toggle-icon${expanded ? " top-bar__history-toggle-icon--open" : ""}`}
                >
                  ▼
                </span>
                <span className="top-bar__history-count">
                  1/{history.length}
                </span>
              </button>
            )}
            <span className="top-bar__history-description">
              {formatHistoryEntry(latestEntry)}
            </span>
            <HistoryMeta entry={latestEntry} />
          </div>
        )}

        {/* Older entries (expandable) */}
        {expanded &&
          olderEntries.map((entry, idx) => (
            <div
              key={entry.hid || idx}
              className={`top-bar__history-row${
                isRejectedEntry(entry) ? " top-bar__history-row--rejected" : ""
              }`}
            >
              <span className="top-bar__history-description">
                {formatHistoryEntry(entry)}
              </span>
              <HistoryMeta entry={entry} />
            </div>
          ))}
      </div>
    </header>
  );
}

function HistoryMeta({ entry }) {
  if (!entry) return null;

  return (
    <>
      {entry.ip && (
        <>
          <span className="top-bar__history-sep">|</span>
          <span className="top-bar__history-meta-item top-bar__history-meta-item--ip">
            <span className="top-bar__history-meta-label">IP:</span>
            <span>{entry.ip}</span>
          </span>
        </>
      )}
      {entry.OS && (
        <>
          <span className="top-bar__history-sep">|</span>
          <span className="top-bar__history-meta-item top-bar__history-meta-item--so">
            <span className="top-bar__history-meta-label">SO:</span>
            <span>{entry.OS.split(" ")[0]}</span>
          </span>
        </>
      )}
      {(entry.browser || entry.nav) && (
        <>
          <span className="top-bar__history-sep">|</span>
          <span className="top-bar__history-meta-item">
            <span className="top-bar__history-meta-label top-bar__history-meta-item--nav">
              Nav:
            </span>
            <span>{entry.browser || entry.nav || ""}</span>
          </span>
        </>
      )}
    </>
  );
}

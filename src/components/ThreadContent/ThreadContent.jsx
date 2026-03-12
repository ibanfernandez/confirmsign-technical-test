import Forms from "../Forms/Forms";
import "./ThreadContent.scss";

/**
 * Extracts key-value pairs from the latest history entry for the status banner.
 */
function getLatestResponseEntry(history = []) {
  if (!history.length) return null;

  const sorted = [...history].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date) - new Date(a.date);
  });

  return sorted[0] || null;
}

function formatBannerDate(entry) {
  if (!entry?.date) return "";
  try {
    const d = new Date(entry.date);
    const dateStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    const timeStr = d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} / ${timeStr}`;
  } catch {
    return entry.date;
  }
}

/**
 * Status banner shown after accepting/rejecting.
 */
function StatusBanner({ thread }) {
  if (!thread?.closed) return null;

  // Determine if rejected
  const history = thread.history || [];
  const latest = getLatestResponseEntry(history);
  const isRejected =
    (latest?.type || latest?.label || "").toLowerCase().includes("rechaz") ||
    (latest?.type || latest?.label || "").toLowerCase().includes("negativ");

  const mod = isRejected ? "rejected" : "accepted";
  const labelText = isRejected ? "RECHAZADO" : "ACEPTADO";

  const date = formatBannerDate(latest);
  const ip = latest?.ip || "";
  const os = latest?.os || "";

  return (
    <div className="status-banner">
      <div className={`status-banner__label status-banner__label--${mod}`}>
        {labelText}
      </div>
      {(date || ip || os) && (
        <div className={`status-banner__meta status-banner__meta--${mod}`}>
          {date && <span className="status-banner__meta-item">{date}</span>}
          {ip && <span className="status-banner__meta-item">IP: {ip}</span>}
          {os && <span className="status-banner__meta-item">SO: {os}</span>}
        </div>
      )}
    </div>
  );
}

/**
 * Main thread content card: HTML content + forms + accept button.
 */
export default function ThreadContent({
  thread,
  onAccept,
  accepting,
  acceptError,
}) {
  if (!thread) return null;

  const isClosed = thread.closed === true;
  const forms = thread.agreement?.forms || [];
  const acceptButtonText =
    thread.agreement?.accept_button_text || "Acepto este hilo";
  const content = thread.content || "";

  return (
    <div className="thread-card">
      <div className="thread-card__body">
        {/* HTML content */}
        <div className="thread-card__content">
          <div
            className="thread-html-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Forms */}
        {forms.length > 0 && (
          <div className="thread-card__forms">
            <Forms forms={forms} disabled={isClosed} />
          </div>
        )}

        {/* Accept button or status banner */}
        {!isClosed ? (
          <div className="thread-card__actions">
            <div>
              <button
                className="accept-btn"
                onClick={onAccept}
                disabled={accepting}
              >
                {accepting && <span className="accept-btn__spinner" />}
                {acceptButtonText}
              </button>
              {acceptError && (
                <div className="inline-error">
                  <span>⚠</span>
                  <span>{acceptError}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <StatusBanner thread={thread} />
        )}
      </div>
    </div>
  );
}

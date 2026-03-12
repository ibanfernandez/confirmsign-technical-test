import "./ErrorDisplay.scss";

export function ErrorDisplay({ message }) {
  return (
    <div className="error-page">
      <div className="error-page__icon">⚠️</div>
      <h2 className="error-page__title">Ha ocurrido un error</h2>
      <p className="error-page__message">{message}</p>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-page__code">404</div>
      <h1 className="not-found-page__title">Ruta no encontrada</h1>
      <p className="not-found-page__description">
        Para acceder a un hilo, utiliza la URL con el formato:
        <br />
        <code>
          /{"{cfskey}"}/{"{cfstoken}"}
        </code>
      </p>
    </div>
  );
}

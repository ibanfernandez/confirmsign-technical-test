import "./Loader.scss";

export default function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader">
        <div className="loader__ring" />
        <p className="loader__text">Cargando hilo...</p>
      </div>
    </div>
  );
}

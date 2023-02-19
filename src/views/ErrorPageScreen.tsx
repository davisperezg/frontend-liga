export default function ErrorPageScreen() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Oops!</h1>
      <p>Lo sentimos, se ha producido un error inesperado.</p>
      <p>
        <i>Página no encontrada</i>
      </p>
    </div>
  );
}

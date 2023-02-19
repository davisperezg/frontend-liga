const Footer = () => {
  return (
    <footer
      style={{
        flex: "0 0 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        //background: "#171717",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: 450,
          fontSize: "0.94em",
        }}
      >
        © 2023 by Kemay Technology. Todos los derechos reservados. Si tuviese
        algún inconveniente por favor contactarnos al siguiente correo:
        davisperezg@gmail.com Version: 0.1.2 | Powered by @davisperezg
      </div>
    </footer>
  );
};

export default Footer;

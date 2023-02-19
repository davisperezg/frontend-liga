import Button from "react-bootstrap/Button";
import { useState, useRef, useCallback } from "react";
import { useEffect } from "react";
import { QRReader2 } from "../services/QRReader2";

const VerificarQRScreen = () => {
  const [device, setDevice] = useState("");
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const ref3 = useRef<HTMLCanvasElement>(null);

  //    navigator.userAgent.match(/Android/i) ||
  //    navigator.userAgent.match(/webOS/i) ||
  //    navigator.userAgent.match(/iPhone/i) ||
  //    navigator.userAgent.match(/iPad/i) ||
  //    navigator.userAgent.match(/iPod/i) ||
  //    navigator.userAgent.match(/BlackBerry/i) ||
  //    navigator.userAgent.match(/Windows Phone/i);

  const onClickss = useCallback(() => {
    if (ref2.current) {
      const qrReader = new QRReader2(ref3.current, ref1.current);
      qrReader.toggleCamera();
      if (qrReader.getIsCamOpen()) {
        ref2.current.innerHTML = "Parar cámara";
        return;
      }

      ref2.current.innerText = "Iniciar cámara";
    }
  }, []);

  const resizeDevice = (e: Event | UIEvent) => {
    if (e.target instanceof Window) {
      const screenWidth: number = e.target.screen.width;
      // Resto del código que maneja el evento resize
      setDevice(
        screenWidth < 1024
          ? ""
          : "Estas ingresando desde un dispositivo Desktop. No puedes scanear QR"
      );
    }

    window.removeEventListener("resize", resizeDevice);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeDevice);
  }, []);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <h1>Verificacion de QR</h1>

      {device === "" ? (
        <>
          <span
            style={{
              color: "yellow",
              fontSize: 24,
            }}
          >
            Usaremos la camara de tu celular. Por favor dar permitir a la
            ventana que aparece
          </span>
          <div
            style={{
              width: "50%",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              height: 150,
              marginTop: 50,
            }}
          >
            <Button
              ref={ref2}
              onClick={onClickss}
              style={{
                fontSize: 60,
                width: "100%",
              }}
              type="button"
            >
              VERIFICAR
            </Button>
          </div>
          <div ref={ref1}></div>
          <canvas id="cam-canvas" className="d-none" ref={ref3}></canvas>
        </>
      ) : (
        <span style={{ color: "red" }}>{device}</span>
      )}
    </div>
  );
};

export default VerificarQRScreen;

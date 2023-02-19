import Button from "react-bootstrap/Button";
import { useState, useRef, useCallback } from "react";
import { useEffect } from "react";
import { QRReader2 } from "../services/QRReader2";

const VerificarQRScreen = () => {
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const cameraBtn: any = document.querySelector("#btn-cam");
  const qrDataContainer = document.querySelector("#qr-data");
  const camCanvas = document.querySelector("#cam-canvas");
  //const qrReader;

  const onClickss = useCallback(() => {
    if (cameraBtn) {
      const qrReader = new QRReader2(camCanvas, qrDataContainer);
      console.log(qrReader);
      qrReader.toggleCamera();
      if (qrReader.getIsCamOpen()) {
        cameraBtn.innerHTML == "Parar cámara";
        return;
      }
      cameraBtn.innerHTML == "Iniciar cámara";
    }
  }, [cameraBtn]);

  // useEffect(() => {
  //   if (cameraBtn) {
  //     console.log(qrReader)
  //   }
  // }, []);

  // const btnClick = () => {
  //   qrReader.toggleCamera();
  //   if (qrReader.getIsCamOpen()) {
  //     cameraBtn.innerHTML == "Parar cámara";
  //     return;
  //   }
  //   cameraBtn.innerHTML == "Iniciar cámara";
  // };

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <h1>Verificacion de QR</h1>
      <span
        style={{
          color: "yellow",
          fontSize: 24,
        }}
      >
        Usaremos la camara de tu celular. Por favor dar permitir a la ventana
        que aparece
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
          onClick={onClickss}
          id="btn-cam"
          style={{
            fontSize: 60,
            width: "100%",
          }}
          type="button"
        >
          VERIFICAR
        </Button>
      </div>
      <div id="qr-data"></div>
      <canvas id="cam-canvas"></canvas>
    </div>
  );
};

export default VerificarQRScreen;

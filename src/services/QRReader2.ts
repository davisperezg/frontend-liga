import jsQR from "jsqr";

//https://libreriasjs.com/libreria-javascript-crear-y-leer-qrs-qrcode-y-jsqr/
export class QRReader2 {
  isCamReady: boolean;
  isCamOpen: boolean;
  stream: any;
  rafID: any;
  camCanvas: any;
  qrDataContainer: any;
  camCanvasCtx: any;
  video: any;
  //audioExito: any;

  constructor(canvasVideoElement: any, qrDataContainerElement: any) {
    this.isCamReady = false;
    this.isCamOpen = false;
    this.stream = null;
    this.rafID = null;
    this.camCanvas = canvasVideoElement;
    this.qrDataContainer = qrDataContainerElement;
    this.camCanvasCtx = this.camCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    this.video = document.createElement("video");
    this.video.classList.add("video-cam");
    this.video.setAttribute("playsinline", true);
    document.body.appendChild(this.video);
    //this.audioExito = new Audio("src/utils/sonidos/sonido_ingresa.mp3");
  }

  sonidoMoneda() {
    // Hacer algo aquí
    //this.audioExito.play();
  }

  getIsCamOpen(): boolean {
    return this.isCamOpen;
  }

  drawLine(begin: any, end: any, color: any) {
    this.camCanvasCtx.beginPath();
    this.camCanvasCtx.moveTo(begin.x, begin.y);
    this.camCanvasCtx.lineTo(end.x, end.y);
    this.camCanvasCtx.lineWidth = 4;
    this.camCanvasCtx.strokeStyle = color;
    this.camCanvasCtx.stroke();
  }

  tick() {
    if (!this.isCamOpen) {
      return;
    }
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      if (!this.isCamReady) {
        const camSize = this.video.getBoundingClientRect();
        if (camSize.width && camSize.height) {
          this.camCanvas.width = camSize.width;
          this.camCanvas.height = camSize.height;
          this.isCamReady = true;
        }
      }
      this.camCanvasCtx.drawImage(
        this.video,
        0,
        0,
        this.camCanvas.width,
        this.camCanvas.height
      );
      const imageData = this.camCanvasCtx.getImageData(
        0,
        0,
        this.camCanvas.width,
        this.camCanvas.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      //Si scanea con exito
      if (code) {
        //Emitiremos un sonido
        //this.sonidoMoneda();
        this.drawLine(
          code.location.topLeftCorner,
          code.location.topRightCorner,
          "#FF3B58"
        );
        this.drawLine(
          code.location.topRightCorner,
          code.location.bottomRightCorner,
          "#FF3B58"
        );
        this.drawLine(
          code.location.bottomRightCorner,
          code.location.bottomLeftCorner,
          "#FF3B58"
        );
        this.drawLine(
          code.location.bottomLeftCorner,
          code.location.topLeftCorner,
          "#FF3B58"
        );

        //Muestra data en el dom
        this.qrDataContainer.innerHTML = code.data;

        //Cerramos cam
        this.closeCam();
      }
    }
    this.rafID = requestAnimationFrame(this.tick.bind(this));
  }

  async closeCam() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }
    this.video.pause();
    this.stream.getTracks().forEach((track: any) => {
      track.stop();
    });
    this.isCamOpen = false;
    this.camCanvasCtx.clearRect(
      0,
      0,
      this.camCanvas.width,
      this.camCanvas.height
    );
    this.camCanvas.classList.add("d-none");
    this.qrDataContainer.classList.remove("has-background-success");
  }

  async abrirCamara() {
    this.isCamOpen = true;
    this.camCanvas.classList.remove("d-none");
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    this.video.srcObject = this.stream;
    this.video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    this.video.play();
    requestAnimationFrame(this.tick.bind(this));
  }

  async toggleCamera() {
    if (this.isCamOpen) {
      if (this.rafID) {
        cancelAnimationFrame(this.rafID);
      }
      this.video.pause();
      this.stream.getTracks().forEach((track: any) => {
        track.stop();
      });
      this.isCamOpen = false;
      this.camCanvasCtx.clearRect(
        0,
        0,
        this.camCanvas.width,
        this.camCanvas.height
      );
      this.camCanvas.classList.add("d-none");
      this.qrDataContainer.innerHTML = "";
      this.qrDataContainer.classList.remove("has-background-success");
      return;
    }
    this.isCamOpen = true;
    this.camCanvas.classList.remove("d-none");
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    this.video.srcObject = this.stream;
    this.video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    this.video.play();
    requestAnimationFrame(this.tick.bind(this));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.getElementsByTagName("video");
  if (
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  ) {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#barcode-scanner"),
          constraints: {
            facingMode: "environment",
            width: 400,
            height: 150,
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: false,
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "upc_e_reader",
          ],
        },
        locate: true,
      },
      function (err) {
        if (err) {
          console.error("QuaggaJS initialization failed:", err);
          return;
        }
        console.log("QuaggaJS initialized.");
        Quagga.start();
      }
    );

    Quagga.onProcessed(function (result) {

      const overlay = Quagga.canvas.dom.overlay;
      const ctx = overlay.getContext("2d");

      if (result && result.boxes) {
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        // Find the main barcode box
        const mainBox = result.boxes
          .filter((box) => box !== result.box)
          .map((box) => box.box)[0];

        if (mainBox) {
          const [topLeft, topRight, bottomRight, bottomLeft] = mainBox;

          // Calculate dimensions of the detected barcode

          // Resize the video feed dynamically


          // Draw barcode overlay
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(topLeft[0], topLeft[1]);
          ctx.lineTo(topRight[0], topRight[1]);
          ctx.lineTo(bottomRight[0], bottomRight[1]);
          ctx.lineTo(bottomLeft[0], bottomLeft[1]);
          ctx.closePath();
          ctx.stroke();
        }
      }
    });

    Quagga.onDetected(function (data) {
      const barcode = data.codeResult.code;
      console.log("Barcode detected:", barcode);

      document.getElementById("barcode-result").textContent =
        "Detected Barcode: " + barcode;

      const beepSound = new Audio("./beep-07a.mp3");
      beepSound.play();

      Quagga.stop();
      document.getElementById("barcode-scanner").style.display = "none";
      console.log("Scanner stopped.");
    });
  } else {
    console.error("getUserMedia not supported by this browser.");
    alert("Your browser does not support camera access.");
  }
});

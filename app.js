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

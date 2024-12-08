document.addEventListener("DOMContentLoaded", function () {
  if (
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  ) {
    // Initialize QuaggaJS
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#barcode-scanner"),
          constraints: {
            facingMode: "environment", // Use rear camera
          },
        },
        decoder: {
          readers: [
            "code_128_reader", // Add other barcode formats as needed
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader",
          ],
        },
      },
      function (err) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("QuaggaJS initialized.");
        Quagga.start(); // Start scanning
      }
    );

    // Process barcode detection
    Quagga.onDetected(function (data) {
      console.log("Barcode detected: ", data.codeResult.code);

      // Display the barcode result
      document.getElementById("barcode-result").textContent =
        data.codeResult.code;
      const beepSound = new Audio("./beep-07a.mp3"); // Path to your sound file
      beepSound.play();
      // Stop the scanner after detecting a barcode
      Quagga.stop();
      document.getElementById("barcode-scanner").style.display = "none";
      console.log("Scanner stopped.");
    });
  } else {
    console.error("getUserMedia not supported by this browser.");
  }
});

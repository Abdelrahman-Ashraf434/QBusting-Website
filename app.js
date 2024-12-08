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
          target: document.querySelector("#barcode-scanner"), // Attach the scanner to the div
          constraints: {
            facingMode: "environment", // Use the rear camera
            width: 1280, // High resolution for better accuracy
            height: 720,
          },
        },
        locator: {
          patchSize: "medium", // Small, medium, large: adjust as necessary
          halfSample: false, // Disable half-sample for full accuracy
        },
        decoder: {
          readers: [
            "code_128_reader", // Common barcode formats
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "upc_e_reader",
          ],
        },
        locate: true, // Enable barcode localization
      },
      function (err) {
        if (err) {
          console.error("QuaggaJS initialization failed:", err);
          return;
        }
        console.log("QuaggaJS initialized.");
        Quagga.start(); // Start the scanner
      }
    );

    // Handle barcode detection
    Quagga.onDetected(function (data) {
      const barcode = data.codeResult.code;
      console.log("Barcode detected:", barcode);

      // Display the barcode result
      document.getElementById("barcode-result").textContent =
        "Detected Barcode: " + barcode;

      // Play beep sound
      const beepSound = new Audio("./beep-07a.mp3"); // Path to your sound file
      beepSound.play();

      // Stop the scanner
      Quagga.stop();
      document.getElementById("barcode-scanner").style.display = "none";
      console.log("Scanner stopped.");
    });

    // Debugging: Show processed frames
    Quagga.onProcessed(function (result) {
      if (result) {
        const drawingCanvas = Quagga.canvas.dom.overlay;
        const drawingCtx = drawingCanvas.getContext("2d");

        // Clear the canvas
        drawingCtx.clearRect(
          0,
          0,
          drawingCanvas.width,
          drawingCanvas.height
        );

        // Draw detected boxes
        if (result.boxes) {
          result.boxes
            .filter((box) => box !== result.box)
            .forEach((box) => {
              Quagga.ImageDebug.drawPath(
                box,
                { x: 0, y: 1 },
                drawingCtx,
                { color: "green", lineWidth: 2 }
              );
            });
        }

        // Highlight the barcode box
        if (result.box) {
          Quagga.ImageDebug.drawPath(
            result.box,
            { x: 0, y: 1 },
            drawingCtx,
            { color: "red", lineWidth: 2 }
          );
        }

        // Draw detection result
        if (result.codeResult && result.codeResult.code) {
          drawingCtx.font = "24px Arial";
          drawingCtx.fillStyle = "blue";
          drawingCtx.fillText(
            result.codeResult.code,
            10,
            40
          );
        }
      }
    });
  } else {
    console.error("getUserMedia not supported by this browser.");
    alert("Your browser does not support camera access.");
  }
});
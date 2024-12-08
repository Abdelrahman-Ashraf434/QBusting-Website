document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");

    // Initialize Quagga
    Quagga.init(
        {
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector("#video"), // Camera preview
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader"], // Add barcode types
            },
        },
        function (err) {
            if (err) {
                console.error("Error initializing Quagga:", err);
                output.textContent = "Camera initialization failed.";
                return;
            }
            Quagga.start();
            output.textContent = "Scanning...";
        }
    );

    // Event listener for detection
    Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        output.textContent = `Barcode Detected: ${code}`;
        Quagga.stop(); // Stop scanning after detection (optional)
    });
});

try {
    // Check if BarcodeDetector is supported or use polyfill
    if (!('BarcodeDetector' in window)) {
        window['BarcodeDetector'] = barcodeDetectorPolyfill.BarcodeDetectorPolyfill;
    }
} catch (e) {
    console.error("BarcodeDetector is not available and polyfill is missing:", e);
}

// Define the video element
const video = document.querySelector('video');

try {
    // Get a stream for the rear camera
    video.srcObject = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
    });
} catch (e) {
    console.error("Unable to access the camera:", e);
    alert("Camera access is required to scan barcodes.");
    return;
}

// Initialize BarcodeDetector with correct format array
const barcodeDetector = new BarcodeDetector({
    formats: ["ean_13", "ean_8", "upc_a", "upc_e"]
});

const barcodeDisplay = document.getElementById("barcode");

if (!barcodeDisplay) {
    console.error("The element to display the barcode (with ID 'barcode') is missing.");
    alert("Please add an element with ID 'barcode' to display scanned barcodes.");
    return;
}

// Function to scan barcodes
async function scanBarcodes() {
    while (true) {
        try {
            // Detect barcodes in the current video frame
            const barcodes = await barcodeDetector.detect(video);

            if (barcodes.length > 0) {
                // Display the first barcode found
                barcodeDisplay.innerText = barcodes[0].rawValue;

                // Notify the user a barcode has been found
                navigator.vibrate(200);

                // Wait before scanning another barcode
                await new Promise(r => setTimeout(r, 1000));
            } else {
                // Short delay before trying to scan again
                await new Promise(r => setTimeout(r, 50));
            }
        } catch (e) {
            console.error("Error during barcode detection:", e);

            // Delay before retrying detection
            await new Promise(r => setTimeout(r, 200));
        }
    }
}

// Start scanning
scanBarcodes();

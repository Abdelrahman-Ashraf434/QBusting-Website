  document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.querySelector('#barcode-scanner-container');
    const resultElement = document.querySelector('#result');
    const stopButton = document.querySelector('#stop-scanner');

    // Create an instance of the barcode reader
    const codeReader = new ZXingBrowser.BrowserMultiFormatReader();

    // Start the scanner
    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        // Select the first available camera (rear camera on most devices)
        const firstDevice = videoInputDevices[0].deviceId;

        // Start decoding from the selected camera
        codeReader.decodeFromVideoDevice(firstDevice, videoElement, (result, error) => {
          if (result) {
            console.log('Barcode detected:', result.text);
            resultElement.textContent = result.text;

            // Optionally stop the scanner after a successful scan
            codeReader.reset();
            console.log('Scanner stopped after successful detection.');
          }

          if (error) {
            // Handle errors (e.g., no barcode detected in the frame)
            console.warn('No barcode detected:', error.message);
          }
        });
      })
      .catch((err) => {
        console.error('Error listing video input devices:', err);
      });

    // Stop the scanner when the stop button is clicked
    stopButton.addEventListener('click', () => {
      codeReader.reset();
      console.log('Scanner stopped.');
    });
  });

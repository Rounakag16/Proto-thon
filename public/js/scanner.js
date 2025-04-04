document.addEventListener("DOMContentLoaded", function () {
    const barcodeInput = document.getElementById('barcodeInput');
    const barcodeText = document.getElementById('barcodeText');
    const readBarcodeBtn = document.getElementById('readBarcodeBtn');
    const searchBtn = document.getElementById('searchBtn');

    async function readBarcode() {
        if (barcodeInput.files.length === 0) {
            alert("Please upload a barcode image");
            return;
        }
        const file = barcodeInput.files[0];
        const reader = new FileReader();

        reader.onload = async function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = async function () {
                const codeReader = new ZXing.BrowserBarcodeReader();
                try {
                    const result = await codeReader.decodeFromImageElement(img);
                    barcodeText.value = result.text;
                } catch (err) {
                    alert("Could not read barcode: " + err);
                }
            };
        };
        reader.readAsDataURL(file);
    }

    function searchProduct() {
        const barcode = barcodeText.value;
        if (barcode) {
            window.location.href = `/product/${barcode}`;
        } else {
            alert("No barcode scanned yet");
        }
    }

    if (readBarcodeBtn) readBarcodeBtn.addEventListener("click", readBarcode);
    if (searchBtn) searchBtn.addEventListener("click", searchProduct);
});

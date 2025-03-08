function startScanner() {
    const scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" }, // Use the rear camera
        { fps: 10, qrbox: 250 },       // 10 FPS, QR box size 250px
        (decodedText) => {
            document.getElementById("serialCode").value = decodedText;
            scanner.stop();
            fetchData();
        },
        (errorMessage) => {
            console.log("QR Scan Error: ", errorMessage);
        }
    ).catch(err => console.log("Scanner Initialization Error:", err));
}

function fetchData() {
    const serial = document.getElementById("serialCode").value;
    fetch(`/api/getData?serial=${serial}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("result").textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error("Error fetching data:", error));
}
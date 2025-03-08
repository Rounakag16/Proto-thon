document.getElementById("scanButton").addEventListener("click", startScanner);

function startScanner() {
    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode library not loaded. Check your internet connection.");
        alert("QR Scanner library failed to load. Try refreshing the page.");
        return;
    }

    const scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" }, // Rear camera
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            document.getElementById("serialCode").value = decodedText;
            scanner.stop();
            fetchData();
        },
        (errorMessage) => {
            console.warn("Scanning error:", errorMessage);
        }
    ).catch(err => console.error("Scanner Initialization Error:", err));
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

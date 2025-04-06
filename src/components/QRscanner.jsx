import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./qrscanner.css"
const QrScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        scanner.clear(); // stop scanning after success
        onScanSuccess(decodedText);
      },
      (error) => {
        // handle scan errors or just ignore
      }
    );

    return () => {
      scanner.clear().catch((error) => console.error("Clear scanner error:", error));
    };
  }, [onScanSuccess]);

  return (<>
        <div id="qr-reader" ref={scannerRef} />
        </>)
};


export default QrScanner;

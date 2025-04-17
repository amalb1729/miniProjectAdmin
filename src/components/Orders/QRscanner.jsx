import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./qrscanner.css";

const QrScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCode = useRef(null);

  useEffect(() => {
    // Initialize scanner
    html5QrCode.current = new Html5Qrcode("qr-reader-viewport");

    // Cleanup on unmount
    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current
          .stop()
          .catch(error => console.error("Error stopping scanner:", error));
      }
    };
  }, []);

  const startScanning = () => {
    const qrCodeSuccessCallback = (decodedText) => {
      onScanSuccess(decodedText);
      // Don't stop scanning to allow continuous scanning
    };

    const config = { fps: 10, qrbox: 250 };

    html5QrCode.current
      .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
      .then(() => {
        setIsScanning(true);
      })
      .catch(err => {
        console.error("Error starting scanner:", err);
      });
  };

  const stopScanning = () => {
    html5QrCode.current
      .stop()
      .then(() => {
        setIsScanning(false);
      })
      .catch(err => {
        console.error("Error stopping scanner:", err);
      });
  };

  const handleFileUpload = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    
    const imageFile = event.target.files[0];
    
    html5QrCode.current.scanFile(imageFile, true)
      .then(decodedText => {
        onScanSuccess(decodedText);
      })
      .catch(err => {
        console.error("Error scanning file:", err);
      });
  };

  return (
    <div className="custom-qr-scanner">
      <div id="qr-reader-viewport" ref={scannerRef}></div>
      
      <button 
        className="start-scan-button"
        onClick={isScanning ? stopScanning : startScanning}
      >
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </button>
      
      {/* <div className="file-upload-section">
        <label htmlFor="qr-input-file" className="file-upload-link">
          Scan an Image File
        </label>
        <input
          type="file"
          id="qr-input-file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div> */}
    </div>
  );
};

export default QrScanner;
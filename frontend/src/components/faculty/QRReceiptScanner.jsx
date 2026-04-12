import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { Html5Qrcode } from "html5-qrcode";

const API_BASE_URL = "http://localhost:3000";

function QRReceiptScanner() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [scanning, setScanning] = useState(false);

  const html5QrCodeRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const isProcessingRef = useRef(false);
  const navigate = useNavigate();

  // 🔁 Cleanup function – stops, clears, and removes DOM artifacts
  const cleanupScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.debug("Cleanup error:", err.message);
      } finally {
        html5QrCodeRef.current = null;
        setScanning(false);
      }
    }
    // Manually clear container to avoid leftover elements
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cleanupScanner();
    };
  }, [cleanupScanner]);

  const stopScanner = useCallback(async () => {
    await cleanupScanner();
  }, [cleanupScanner]);

  const initializeHtml5Qrcode = useCallback(async () => {
    if (!containerRef.current) {
      setScannerError("Scanner container not ready. Please retry.");
      return;
    }

    try {
      // Ensure any existing instance is fully cleaned up
      await cleanupScanner();

      // Give the camera hardware a moment to fully release
      await new Promise((resolve) => setTimeout(resolve, 200));

      html5QrCodeRef.current = new Html5Qrcode("qr-reader-container");

      const config = {
        fps: 30,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const boxSize = Math.floor(minEdge * 0.7);
          return { width: boxSize, height: boxSize };
        },
        aspectRatio: 1.0,
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (isProcessingRef.current || isVerified) return;
          isProcessingRef.current = true;
          handleQrCodeScanned(decodedText);
        },
        (errorMessage) => {
          if (process.env.NODE_ENV === "development" && Math.random() < 0.05) {
            console.debug("Scanning:", errorMessage);
          }
        },
      );

      setScanning(true);
      setScannerError(null);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      const errorMsg =
        err?.message || "Unknown camera error. Please refresh the page.";
      setScannerError(`Failed to start camera: ${errorMsg}`);
      setCameraPermission(false);
    }
  }, [cleanupScanner, isVerified]);

  const startScanner = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      stream.getTracks().forEach((track) => track.stop());

      setCameraPermission(true);
      setScannerError(null);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        initializeHtml5Qrcode();
        timeoutRef.current = null;
      }, 100);
    } catch (err) {
      console.error("Camera permission error:", err);
      setCameraPermission(false);
      setScannerError(
        err.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera permissions and refresh."
          : "Could not access camera. Please ensure your device has a camera.",
      );
    }
  }, [initializeHtml5Qrcode]);

  const handleQrCodeScanned = useCallback(
    async (qrData) => {
      // Stop scanner immediately to prevent multiple scans
      await cleanupScanner();

      const transactionId = qrData.trim();
      console.debug("Transaction ID scanned:", transactionId);

      setIsVerifying(true);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/faculty/check-receipt-intigrity/${transactionId}`,
          { timeout: 10000 },
        );

        if (response.data.success) {
          toast.success(
            response.data.message || "Receipt verified successfully!",
          );
          setReceiptData(response.data);
          setIsVerified(true);
        } else {
          throw new Error(response.data.message || "Verification failed");
        }
      } catch (err) {
        console.error("Verification error:", err.response?.data || err.message);
        let errorMessage = "Failed to verify receipt. Please try again.";
        if (err.response) {
          errorMessage = err.response.data?.message || errorMessage;
        } else if (err.request) {
          errorMessage = "Server is not responding. Please try again.";
        } else {
          errorMessage = err.message || errorMessage;
        }
        toast.error(errorMessage);

        // Reset processing flag and restart scanner
        isProcessingRef.current = false;
        initializeHtml5Qrcode();
      } finally {
        setIsVerifying(false);
      }
    },
    [cleanupScanner, initializeHtml5Qrcode],
  );

  const handleScanAnother = useCallback(async () => {
    isProcessingRef.current = false;
    setReceiptData(null);
    setIsVerified(false);
    setIsVerifying(false);
    setScannerError(null);

    await cleanupScanner();

    if (cameraPermission) {
      initializeHtml5Qrcode();
    } else {
      startScanner();
    }
  }, [cameraPermission, cleanupScanner, initializeHtml5Qrcode, startScanner]);

  const renderReceiptDetails = () => (
    <div className="space-y-6" aria-live="polite">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-green-600 text-2xl mb-2" aria-hidden="true">
          ✅
        </div>
        <h3 className="text-lg font-semibold text-green-800">
          Receipt Authentic
        </h3>
        <p className="text-green-600 text-sm">{receiptData.message}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 space-y-3">
        <h4 className="font-semibold text-gray-800 border-b pb-2">
          Receipt Details
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-gray-600">Student Name:</div>
          <div className="font-medium text-gray-900">
            {receiptData.first_name} {receiptData.last_name}
          </div>
          <div className="text-gray-600">Course:</div>
          <div className="font-medium text-gray-900">
            {receiptData.course_name}
          </div>
          <div className="text-gray-600">Semester:</div>
          <div className="font-medium text-gray-900">
            {receiptData.semester}
          </div>
          <div className="text-gray-600">School Year:</div>
          <div className="font-medium text-gray-900">
            {receiptData.year_series}
          </div>
          <div className="text-gray-600">Period:</div>
          <div className="font-medium text-gray-900 capitalize">
            {receiptData.period || "N/A"}
          </div>
          <div className="text-gray-600">Amount Paid:</div>
          <div className="font-medium text-green-700">
            ₱{parseFloat(receiptData.paid_amount).toFixed(2)}
          </div>
          <div className="text-gray-600">Payment Method:</div>
          <div className="font-medium text-gray-900 capitalize">
            {receiptData.payment_type}
          </div>
          <div className="text-gray-600">Payment Date:</div>
          <div className="font-medium text-gray-900">
            {new Date(receiptData.updated_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleScanAnother}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Scan Another Receipt
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Verify Receipt Authenticity
            </h2>
            <p className="text-gray-600 text-sm">
              Scan the QR code on the receipt to verify its integrity
            </p>
          </div>

          {isVerified && receiptData ? (
            renderReceiptDetails()
          ) : (
            <div className="space-y-6">
              {cameraPermission === null && !scannerError && (
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div
                      className="text-blue-600 text-5xl mb-3"
                      aria-hidden="true"
                    >
                      📷
                    </div>
                    <p className="text-gray-700 mb-4">
                      Camera access is required to scan QR codes
                    </p>
                    <button
                      onClick={startScanner}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Enable Camera
                    </button>
                  </div>
                </div>
              )}

              {cameraPermission === true && !scannerError && (
                <div className="space-y-4">
                  <div
                    ref={containerRef}
                    id="qr-reader-container"
                    className="w-full overflow-hidden rounded-lg"
                    style={{ minHeight: "350px", width: "100%" }}
                  ></div>

                  {isVerifying && (
                    <div
                      className="text-center text-blue-600"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="animate-spin inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                      Verifying receipt...
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Position the QR code within the frame.
                    </p>
                    <button
                      onClick={stopScanner}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Stop Scanning
                    </button>
                  </div>
                </div>
              )}

              {scannerError && (
                <div className="text-center space-y-4" role="alert">
                  <div className="bg-red-50 rounded-lg p-6 text-center">
                    <div
                      className="text-red-600 text-5xl mb-3"
                      aria-hidden="true"
                    >
                      ⚠️
                    </div>
                    <p className="text-red-700 mb-4">{scannerError}</p>
                    <button
                      onClick={() => {
                        setScannerError(null);
                        setCameraPermission(null);
                        startScanner();
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EnrollPlus • Developed by John Rey C.
        </p>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default QRReceiptScanner;

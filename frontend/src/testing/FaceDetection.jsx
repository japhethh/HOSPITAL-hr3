import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import axios from "axios";
import { apiURL } from "../context/Store";

function FaceDetection() {
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // State
  const [mode, setMode] = useState("clock-in");
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectionScore, setDetectionScore] = useState(0);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [cameraConsent, setCameraConsent] = useState(false);

  // Encrypt face descriptor
  const encryptDescriptor = async (descriptor) => {
    try {
      if (!window.crypto || !window.crypto.subtle) {
        throw new Error("Web Crypto API not available");
      }

      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        new Float32Array(descriptor).buffer
      );

      return {
        encryptedData: Array.from(new Uint8Array(encrypted)),
        iv: Array.from(iv),
        keyAlgorithm: key.algorithm,
      };
    } catch (error) {
      console.error("Encryption failed:", error);
      throw error;
    }
  };

  // Secure API call with enhanced error handling
  const secureApiCall = async (url, data) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        timeout: 10000,
      });

      if (!response.data) {
        throw new Error("Empty response from server");
      }

      return response.data;
    } catch (error) {
      const errorDetails = {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data,
      };
      console.error("API call failed:", errorDetails);
      throw new Error(errorDetails.message || "API request failed");
    }
  };

  // Initialize camera with privacy controls
  const initCamera = async () => {
    try {
      // Check camera permissions
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({
          name: "camera",
        });
        if (permissionStatus.state === "denied") {
          throw new Error("Camera access denied by user");
        }
      }

      // Request user consent
      if (!localStorage.getItem("cameraConsent")) {
        const consent = window.confirm(
          "This application requires camera access for face recognition. " +
            "No images or video are stored. Do you consent to camera access?"
        );

        if (!consent) throw new Error("User denied camera access");
        localStorage.setItem("cameraConsent", "true");
        setCameraConsent(true);
      } else {
        setCameraConsent(true);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      return stream;
    } catch (error) {
      console.error("Camera initialization error:", error);
      throw error;
    }
  };

  // Process face detection with quality checks
  const processFaceDetection = async (videoElement) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const detections = await faceapi
        .detectAllFaces(
          videoElement,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.5,
          }),
          { signal: controller.signal }
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      clearTimeout(timeout);

      if (detections.length === 0) {
        return null;
      }

      // Select the best detection
      const bestDetection = detections.reduce((best, current) =>
        current.detection.score > best.detection.score ? current : best
      );

      // Validate detection quality
      if (bestDetection.detection.score < 0.6) {
        return null;
      }

      return {
        descriptor: Array.from(bestDetection.descriptor),
        score: bestDetection.detection.score,
      };
    } catch (error) {
      clearTimeout(timeout);
      console.error("Face processing error:", error);
      return null;
    }
  };

  // Initialize face detection models and camera
  useEffect(() => {
    let isMounted = true;
    let streamCleanup = null;

    const initFaceDetection = async () => {
      try {
        console.log("Loading face detection models...");

        const MODEL_URL = "/models";

        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        if (!isMounted) return;

        setModelsLoaded(true);
        console.log("All models loaded successfully");

        // Initialize camera
        const stream = await initCamera();

        if (videoRef.current && isMounted) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (!isMounted) return;
            console.log("Camera stream ready");
            setIsCameraReady(true);
            startDetection();
          };

          streamCleanup = () => {
            stream.getTracks().forEach((track) => track.stop());
          };
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (isMounted) {
          setMessage(`Error: ${error.message}`);
        }
      }
    };

    initFaceDetection();

    return () => {
      isMounted = false;
      stopDetection();
      if (streamCleanup) streamCleanup();
    };
  }, []);

  // Face detection rendering
  const startDetection = () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) {
      console.log("Detection prerequisites not met - retrying...");
      setTimeout(startDetection, 100);
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };

    faceapi.matchDimensions(canvas, displaySize);

    const detect = async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 512,
              scoreThreshold: 0.3,
            })
          )
          .withFaceLandmarks();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        setFaceDetected(detections.length > 0);

        if (detections.length > 0) {
          const score = detections[0].detection.score;
          setDetectionScore(score);

          const color =
            score > 0.7 ? "#00FF00" : score > 0.5 ? "#FFFF00" : "#FF0000";

          faceapi.draw.drawDetections(canvas, resizedDetections, {
            lineWidth: 2,
            color,
          });

          if (showLandmarks) {
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections, {
              lineWidth: 1,
              color: "#00FFFF",
            });
          }

          ctx.font = "16px Arial";
          ctx.fillStyle = color;
          ctx.fillText(`Quality: ${Math.round(score * 100)}%`, 20, 30);
        } else {
          ctx.font = "16px Arial";
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText("Position your face in the frame", 20, 30);
        }
      } catch (error) {
        console.error("Detection error:", error);
      }
    };

    detectionIntervalRef.current = setInterval(detect, 200);
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  // Handle registration
  const handleRegister = async () => {
    if (!employeeId.trim()) {
      setMessage("Please enter Employee ID");
      return;
    }

    setIsProcessing(true);
    setMessage("Starting secure face capture...");

    try {
      const faceData = await processFaceDetection(videoRef.current);
      if (!faceData) {
        setMessage("Could not capture face. Please try again.");
        setIsProcessing(false);
        return;
      }

      const encryptedData = await encryptDescriptor(faceData.descriptor);

      const response = await secureApiCall(
        `${apiURL}/api/attendance-face/register-face`,
        {
          employeeId,
          faceData: encryptedData,
          qualityScore: faceData.score,
        }
      );

      if (response.success) {
        setMessage("Secure registration successful!");
        setMode("clock-in");
        setEmployeeId("");
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle clock in
  const handleClockIn = async () => {
    setIsProcessing(true);
    setMessage("Starting secure face verification...");

    try {
      const faceData = await processFaceDetection(videoRef.current);
      if (!faceData) {
        setMessage("Could not verify face. Please try again.");
        setIsProcessing(false);
        return;
      }

      const encryptedData = await encryptDescriptor(faceData.descriptor);

      const response = await secureApiCall(
        `${apiURL}/api/attendance-face/clock-in`,
        {
          faceData: encryptedData,
          qualityScore: faceData.score,
        }
      );

      console.log(response);

      if (response.success) {
        setMessage(
          `Clocked in successfully at ${
            response?.employee
          } ${new Date().toLocaleTimeString()} (${response.department})`
        );
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (error) {
      console.error("Clock in error:", error);
      setMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle clock out with enhanced error handling
  const handleClockOut = async () => {
    setIsProcessing(true);
    setMessage("Starting secure face verification for clock out...");

    try {
      const faceData = await processFaceDetection(videoRef.current);
      if (!faceData) {
        setMessage("Could not verify face. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (faceData.score < 0.6) {
        setMessage("Face quality too low. Please position face properly.");
        setIsProcessing(false);
        return;
      }

      const encryptedData = await encryptDescriptor(faceData.descriptor);

      const response = await secureApiCall(
        `${apiURL}/api/attendance-face/clock-out`,
        {
          faceData: encryptedData,
          qualityScore: faceData.score,
        }
      );

      if (response.success) {
        setMessage(
          `Clocked out successfully at ${new Date(
            response.clockOut
          ).toLocaleTimeString()} (${
            response.department || "Unknown Department"
          }) - Total hours: ${response.totalHours}`
        );
      } else {
        throw new Error(response.message || "Clock out failed");
      }
    } catch (error) {
      console.error("Clock out error:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="app-container">
      <h1 className="text-center my-3">Face Recognition Attendance</h1>
      <p className="text-center text-sm text-gray-600 mb-4">
        {cameraConsent ? "Camera access granted" : "Camera access required"}
      </p>

      <div className="mode-selector flex justify-center items-center font-bold gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            mode === "clock-in"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setMode("clock-in")}
        >
          Clock In
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            mode === "clock-out"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setMode("clock-out")}
        >
          Clock Out
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            mode === "register"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setMode("register")}
        >
          Register Face
        </button>
      </div>

      <div className="flex justify-center mb-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLandmarks}
            onChange={() => setShowLandmarks(!showLandmarks)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Show Face Landmarks</span>
        </label>
      </div>

      <div
        className="video-container relative mx-auto bg-black rounded-lg overflow-hidden"
        style={{ width: "400px", height: "300px" }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="video-element w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas
          ref={canvasRef}
          className="canvas-overlay absolute top-0 left-0 w-full h-full"
          style={{ transform: "scaleX(-1)" }}
        />

        {faceDetected && (
          <div className="detection-info absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            Detection: {(detectionScore * 100).toFixed(0)}%
          </div>
        )}
      </div>

      {mode === "register" && (
        <div className="input-container flex justify-center my-4">
          <input
            type="text"
            className="rounded-md border border-gray-300 px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={isProcessing}
          />
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={
            mode === "register"
              ? handleRegister
              : mode === "clock-in"
              ? handleClockIn
              : handleClockOut
          }
          disabled={
            !isCameraReady ||
            isProcessing ||
            (mode === "register" && !employeeId.trim())
          }
          className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${
            isProcessing ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <span className="inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : mode === "register" ? (
            "Register Face"
          ) : mode === "clock-in" ? (
            "Clock In"
          ) : (
            "Clock Out"
          )}
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 mx-auto max-w-md text-center px-4 py-3 rounded ${
            message.includes("Error") || message.includes("failed")
              ? "bg-red-100 text-red-700"
              : message.includes("Clocked out")
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {!isCameraReady && (
        <div className="text-center mt-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          {window.isSecureContext
            ? "Initializing camera..."
            : "Please use HTTPS or localhost for security"}
        </div>
      )}

      <div className="privacy-notice text-center text-xs text-gray-500 mt-6 px-4">
        <p>
          This system uses face recognition for authentication purposes only.
        </p>
        <p>No images or video recordings are stored. Face data is encrypted.</p>
      </div>
    </div>
  );
}

export default FaceDetection;

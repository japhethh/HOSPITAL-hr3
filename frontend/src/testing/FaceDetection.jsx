import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { apiURL } from "../context/Store";

function FaceDetection() {
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // State
  const [mode, setMode] = useState("register"); // Start in register mode by default
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionActive, setDetectionActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  // Initialize camera and models
  useEffect(() => {
    const loadModelsAndCamera = async () => {
      try {
        // First check if we're running in a secure context (HTTPS or localhost)
        if (!window.isSecureContext) {
          throw new Error(
            "Camera access requires secure context (HTTPS or localhost)"
          );
        }

        // Load models with error handling
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models").catch((e) => {
            throw new Error(`Failed to load face detector model: ${e.message}`);
          }),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models").catch((e) => {
            throw new Error(`Failed to load landmark model: ${e.message}`);
          }),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models").catch((e) => {
            throw new Error(`Failed to load recognition model: ${e.message}`);
          }),
        ]);

        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: "user", // Use front camera
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
            startFaceDetection();
          };
        }
      } catch (error) {
        setMessage(`Initialization Error: ${error.message}`);
        console.error("Initialization error:", error);
      }
    };

    loadModelsAndCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Enhanced face detection loop with face presence check
  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const displaySize = { width: video.width, height: video.height };

    faceapi.matchDimensions(canvas, displaySize);
    setDetectionActive(true);

    const detectFaces = async () => {
      if (!detectionActive) return;

      try {
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 512, // More accurate detection
              scoreThreshold: 0.5, // Adjust sensitivity
            })
          )
          .withFaceLandmarks();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update face detection status
        setFaceDetected(detections.length > 0);

        // Draw detections and landmarks
        if (detections.length > 0) {
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          // Add helpful text when face is detected
          ctx.font = "16px Arial";
          ctx.fillStyle = "#00FF00";
          ctx.fillText("Face detected! Ready for registration", 10, 30);
        } else {
          // Guidance when no face is detected
          ctx.font = "16px Arial";
          ctx.fillStyle = "#FF0000";
          ctx.fillText("Please position your face in the frame", 10, 30);
        }
      } catch (error) {
        console.error("Detection error:", error);
      }

      requestAnimationFrame(detectFaces);
    };

    detectFaces();
  };

  // Enhanced face descriptor capture
  const captureFaceDescriptor = async () => {
    if (!faceDetected) {
      setMessage("Please position your face in the frame before registering");
      return null;
    }

    setDetectionActive(false);
    setIsProcessing(true);
    setMessage("Capturing face data...");

    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.6, // Higher threshold for registration
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error("Face not detected clearly. Please try again.");
      }

      // Additional quality check
      const landmarks = detection.landmarks;
      const jawOutline = landmarks.getJawOutline();
      const jawDistance = faceapi.euclideanDistance(
        jawOutline[0],
        jawOutline[jawOutline.length - 1]
      );

      if (jawDistance < 100) {
        throw new Error(
          "Please move closer to the camera (about arm's length)"
        );
      }

      return Array.from(detection.descriptor);
    } catch (error) {
      setMessage(`Capture Error: ${error.message}`);
      return null;
    } finally {
      setIsProcessing(false);
      setDetectionActive(true);
    }
  };

  // Register new employee face with enhanced feedback
  const handleRegister = async () => {
    if (!employeeId.trim()) {
      setMessage("Please enter a valid Employee ID");
      return;
    }

    setMessage("Preparing to register your face...");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for UX

    const faceDescriptor = await captureFaceDescriptor();
    if (!faceDescriptor) return;

    try {
      setMessage("Registering your face... Please wait");
      const response = await axios.post(
        `${apiURL}/api/attendance-face/register-face`,
        {
          employeeId,
          faceDescriptor,
        }
      );

      setMessage(`Success: ${response.data.message}`);
      setMode("clock-in");
      setEmployeeId("");

      // Show success message for 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        `Registration Failed: ${
          error.response?.data?.message || "Server error"
        }`
      );
    }
  };

  // Clock in with face recognition
  const handleClockIn = async () => {
    if (!faceDetected) {
      setMessage("Please position your face in the frame");
      return;
    }

    const faceDescriptor = await captureFaceDescriptor();
    if (!faceDescriptor) return;

    try {
      setMessage("Verifying your identity...");
      const response = await axios.post(
        `${apiURL}/api/attendance-face/clock-in`,
        { faceDescriptor }
      );

      setMessage(
        `Successfully Clocked In: ${response.data.employeeName} (${response.data.department})`
      );
    } catch (error) {
      setMessage(
        `Clock-in Failed: ${
          error.response?.data?.message || "Recognition failed"
        }`
      );
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Face Recognition Attendance System</h1>

      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === "clock-in" ? "active" : ""}`}
          onClick={() => setMode("clock-in")}
        >
          Clock In
        </button>
        <button
          className={`mode-btn ${mode === "register" ? "active" : ""}`}
          onClick={() => setMode("register")}
        >
          Register Face
        </button>
      </div>

      <div className="video-container">
        <video
          ref={videoRef}
          className="video-element"
          autoPlay
          muted
          playsInline // Important for iOS
          width="640"
          height="480"
        />
        <canvas
          ref={canvasRef}
          className="canvas-overlay"
          width="640"
          height="480"
        />
      </div>

      {mode === "register" && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="employee-id-input"
          />
        </div>
      )}

      <div className="action-container">
        <button
          onClick={mode === "register" ? handleRegister : handleClockIn}
          disabled={
            !isCameraReady ||
            isProcessing ||
            (mode === "register" && !employeeId.trim())
          }
          className="action-btn"
        >
          {isProcessing
            ? "Processing..."
            : mode === "register"
            ? "Register Face"
            : "Clock In"}
        </button>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("Error") || message.includes("Failed")
              ? "error"
              : "success"
          }`}
        >
          {message}
        </div>
      )}

      {!isCameraReady && (
        <div className="loading-message">
          {window.isSecureContext
            ? "Loading camera and face detection models..."
            : "Waiting for secure connection..."}
        </div>
      )}

      <style>{`
        .app-container {
          max-width: 680px;
          margin: 0 auto;
          padding: 20px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .app-title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 25px;
        }

        .mode-selector {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .mode-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .mode-btn.active {
          background-color: #3498db;
          color: white;
        }

        .mode-btn:not(.active) {
          background-color: #ecf0f1;
          color: #7f8c8d;
        }

        .video-container {
          position: relative;
          width: 640px;
          height: 480px;
          margin: 0 auto 20px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .video-element {
          width: 100%;
          height: 100%;
          background-color: #ddd;
          display: block;
          transform: scaleX(-1); /* Mirror effect for front camera */
        }

        .canvas-overlay {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          transform: scaleX(-1); /* Match mirror effect */
        }

        .input-container {
          margin: 20px 0;
          text-align: center;
        }

        .employee-id-input {
          padding: 12px 15px;
          width: 300px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          text-align: center;
        }

        .action-container {
          text-align: center;
          margin: 25px 0;
        }

        .action-btn {
          padding: 12px 30px;
          background-color: #2ecc71;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .action-btn:hover:not(:disabled) {
          background-color: #27ae60;
        }

        .action-btn:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .message {
          padding: 12px;
          margin: 20px auto;
          max-width: 80%;
          border-radius: 5px;
          text-align: center;
          font-weight: 500;
        }

        .message.success {
          background-color: #d5f5e3;
          color: #27ae60;
          border: 1px solid #27ae60;
        }

        .message.error {
          background-color: #fadbd8;
          color: #e74c3c;
          border: 1px solid #e74c3c;
        }

        .loading-message {
          text-align: center;
          padding: 15px;
          background-color: #fff3e0;
          color: #e67e22;
          border-radius: 5px;
          margin-top: 20px;
          border: 1px solid #e67e22;
        }
      `}</style>
    </div>
  );
}

export default FaceDetection;

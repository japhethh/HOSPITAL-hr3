import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { apiURL } from "../context/Store";

function FaceDetection() {
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // State
  const [mode, setMode] = useState("register");
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectionScore, setDetectionScore] = useState(0);
  const [showLandmarks, setShowLandmarks] = useState(true);

  // Initialize camera and models
  useEffect(() => {
    let isMounted = true;
    const initFaceDetection = async () => {
      try {
        console.log("Loading face detection models...");

        // Load models from CDN
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(
            "https://justadudewhohacks.github.io/face-api.js/models"
          ),
          faceapi.nets.faceLandmark68Net.loadFromUri(
            "https://justadudewhohacks.github.io/face-api.js/models"
          ),
          faceapi.nets.faceRecognitionNet.loadFromUri(
            "https://justadudewhohacks.github.io/face-api.js/models"
          ),
        ]);

        if (!isMounted) return;

        setModelsLoaded(true);
        console.log("All models loaded successfully");

        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: 640,
            height: 480,
          },
        });

        if (videoRef.current && isMounted) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (!isMounted) return;
            console.log("Camera stream ready");
            setIsCameraReady(true);
            startDetection();
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
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Enhanced startDetection with better visual feedback
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

          // Visual feedback - different colors based on detection quality
          const color =
            score > 0.7 ? "#00FF00" : score > 0.5 ? "#FFFF00" : "#FF0000";

          faceapi.draw.drawDetections(canvas, resizedDetections, {
            lineWidth: 2,
            color,
          });

          // Draw landmarks if enabled
          if (showLandmarks) {
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections, {
              lineWidth: 1,
              color: "#00FFFF",
              drawLines: true,
              drawPoints: true,
              pointSize: 2,
            });
          }

          // Real-time feedback text
          ctx.font = "16px Arial";
          ctx.fillStyle = color;
          ctx.fillText(`Quality: ${Math.round(score * 100)}%`, 20, 30);
        } else {
          // Feedback when no face detected
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

  // Stop face detection
  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  // Enhanced face descriptor capture with better feedback
  const captureFaceDescriptor = async () => {
    setIsProcessing(true);
    setMessage("Starting face capture...");

    // Clear canvas before starting capture
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const maxAttempts = 5; // Increased from 3 to 5 attempts
    let attempts = 0;
    let bestDescriptor = null;
    let bestScore = 0;

    while (attempts < maxAttempts) {
      attempts++;
      setMessage(`Scanning your face... Attempt ${attempts}/${maxAttempts}`);

      try {
        // Perform a single detection with higher quality settings
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 512,
              scoreThreshold: 0.6, // Increased threshold for better quality
            })
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          setMessage("No face detected - please look directly at the camera");
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }

        // Visual feedback - draw detection box in blue during capture
        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };
        const resizedDetection = faceapi.resizeResults(detection, displaySize);

        if (ctx) {
          faceapi.draw.drawDetections(canvasRef.current, resizedDetection, {
            lineWidth: 3,
            color: "blue",
          });

          if (showLandmarks) {
            faceapi.draw.drawFaceLandmarks(
              canvasRef.current,
              resizedDetection,
              {
                lineWidth: 1,
                color: "cyan",
              }
            );
          }
        }

        const score = detection.detection.score;
        setDetectionScore(score);

        // Enhanced quality checks
        const landmarks = detection.landmarks;
        const jawOutline = landmarks.getJawOutline();
        const jawDistance = faceapi.euclideanDistance(
          jawOutline[0],
          jawOutline[jawOutline.length - 1]
        );

        // Visual feedback for distance
        if (jawDistance < 80) {
          // Increased minimum distance
          setMessage("Move slightly closer to the camera");
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }

        if (jawDistance > 200) {
          // Added maximum distance check
          setMessage("Move slightly further from the camera");
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }

        if (score < 0.6) {
          // Increased minimum score
          setMessage("Hold still and face the camera directly");
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }

        const descriptor = Array.from(detection.descriptor);
        if (!descriptor || descriptor.length !== 128) {
          setMessage("Error in face processing - trying again");
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }

        // Track best descriptor
        if (score > bestScore) {
          bestScore = score;
          bestDescriptor = descriptor;
        }

        // If high quality, return immediately
        if (score >= 0.8) {
          // Increased threshold for immediate acceptance
          setMessage("Face captured successfully!");
          return descriptor;
        }

        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error);
        setMessage(`Error: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    setIsProcessing(false);

    if (bestDescriptor) {
      setMessage(`Best quality capture (${Math.round(bestScore * 100)}%)`);
      return bestDescriptor;
    }

    setMessage("Failed to capture face - please try again");
    return null;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!employeeId.trim()) {
      setMessage("Please enter Employee ID");
      return;
    }

    const faceDescriptor = await captureFaceDescriptor();
    if (!faceDescriptor) return;

    try {
      setMessage("Registering face...");
      const response = await axios.post(
        `${apiURL}/api/attendance-face/register-face`,
        { employeeId, faceDescriptor },
        { timeout: 10000 }
      );

      if (response.data.success) {
        setMessage("Registration successful!");
        setMode("clock-in");
        setEmployeeId("");
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.response?.data?.message || error.message);
    }
  };

  // Handle clock in
  const handleClockIn = async () => {
    const faceDescriptor = await captureFaceDescriptor();
    if (!faceDescriptor) return;

    try {
      setMessage("Verifying identity...");
      const response = await axios.post(
        `${apiURL}/api/attendance-face/clock-in`,
        { faceDescriptor },
        { timeout: 10000 }
      );

      setMessage(
        `Clocked in as ${response.data.employee} (${response.data.department})`
      );
    } catch (error) {
      console.error("Clock in error:", error);
      setMessage(error.response?.data?.message || "Recognition failed");
    }
  };

  return (
    <div className="app-container">
      <h1 className="text-center my-3">Face Recognition Attendance</h1>

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
          onClick={mode === "register" ? handleRegister : handleClockIn}
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
          ) : (
            "Clock In"
          )}
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 mx-auto max-w-md text-center px-4 py-3 rounded ${
            message.includes("Error") || message.includes("failed")
              ? "bg-red-100 text-red-700"
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
            : "Please use HTTPS or localhost"}
        </div>
      )}
    </div>
  );
}

export default FaceDetection;

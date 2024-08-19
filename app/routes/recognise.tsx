import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import knownFaces from "~/assets/faces.json";

const App = () => {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    };

    const handleVideoPlay = () => {
      setInterval(async () => {
        if (videoRef.current) {
          const detections = await faceapi
            .detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({
                inputSize: 512,
                scoreThreshold: 0.5,
              })
            )
            .withFaceLandmarks()
            .withFaceDescriptors();

          const canvas = canvasRef.current;
          const displaySize = {
            width: videoRef.current.width,
            height: videoRef.current.height,
          };

          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          const labeledDescriptors = knownFaces.map(
            (f) =>
              new faceapi.LabeledFaceDescriptors(f.label, [
                new Float32Array(f.descriptor),
              ])
          );

          const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6); // Adjust the threshold as needed

          resizedDetections.forEach((detection) => {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            const box = detection.detection.box;
            const { label, distance } = bestMatch;

            // Draw the label and the box
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: `${label} (${distance.toFixed(2)})`,
            });
            drawBox.draw(canvas);
          });
        }
      }, 500); // Adjust the interval for performance
    };

    loadModels().then(startVideo);

    videoRef.current.addEventListener("play", handleVideoPlay);

    return () => {
      videoRef.current?.removeEventListener("play", handleVideoPlay);
    };
  }, []);

  return (
    <div className="App">
      <video ref={videoRef} autoPlay muted width="720" height="560" />
      <canvas ref={canvasRef} style={{ position: "absolute" }} />
    </div>
  );
};

export default App;

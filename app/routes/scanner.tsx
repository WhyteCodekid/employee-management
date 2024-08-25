/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { TableRow, TableCell, Button } from "@nextui-org/react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Header from "~/components/ui/header";
import CustomTable from "~/components/ui/new-table";
import { LoaderFunction } from "@remix-run/node";
import DepartmentController from "~/controllers/DepartmentController";
import axios from "axios";
import Face from "~/models/Faces";
import knownFaces from "~/assets/faces.json";

const App = () => {
  const { search_term, page, departments, users } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const videoRef = useRef<any>();
  const canvasRef = useRef<any>();

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
      const processVideo = async () => {
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

          const labeledDescriptors = users.map((f) => {
            return new faceapi.LabeledFaceDescriptors(f.user?._id, [
              new Float32Array(f.descriptor),
            ]);
          });

          const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5); // Adjust the threshold as needed

          let faceFound = false;

          resizedDetections.forEach((detection) => {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            const box = detection.detection.box;
            const { label, distance } = bestMatch;

            if (label !== "unknown") {
              faceFound = true;

              // Draw the label and the box
              const drawBox = new faceapi.draw.DrawBox(box, {
                label: `${label} (${distance.toFixed(2)})`,
              });
              drawBox.draw(canvas);

              // make api request to take attendance
              axios.post("/api/take-attendance", {
                user: label,
              });
            }
          });

          if (faceFound) {
            console.log("Pausing detection for 10 seconds...");
            clearInterval(intervalId);
            setTimeout(() => {
              intervalId = setInterval(processVideo, 500);
            }, 10000); // Pause for 10 seconds
          }
        }
      };

      let intervalId = setInterval(processVideo, 500);

      videoRef.current.addEventListener("play", processVideo);

      return () => {
        videoRef.current?.removeEventListener("play", processVideo);
        clearInterval(intervalId);
      };
    };

    loadModels().then(startVideo);

    videoRef.current.addEventListener("play", handleVideoPlay);

    return () => {
      videoRef.current?.removeEventListener("play", handleVideoPlay);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 h-screen overflow-y-hidden">
      <Header title="Facial Recognition Scanner" hideUserDropdown={true} />

      <section className="grid grid-cols-2 gap-5 px-4 flex-1 overflow-y-hidden">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            width="100%"
            height="560"
            className="border"
          />
          {/* <canvas
            ref={canvasRef}
            className="border border-blue-500 absolute top-0 left-0 w-full h-[540px]"
          /> */}
        </div>

        <CustomTable
          columns={["Staff ID", "Staff Name", "Time In", "Time Out"]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={1}
        >
          {departments?.map(
            (
              department: { name: string; description: string },
              index: number
            ) => (
              <TableRow key={index}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.description}</TableCell>
              </TableRow>
            )
          )}
        </CustomTable>
      </section>
    </div>
  );
};

export default App;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const users = await Face.find().populate("user");

  const departmentController = new DepartmentController(request);
  const { departments, totalPages } = await departmentController.getDepartments(
    {
      page,
      search_term,
    }
  );

  return {
    search_term,
    page,
    departments,
    totalPages,
    users,
  };
};

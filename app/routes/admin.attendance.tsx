import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import knownFaces from "~/assets/faces.json";
import { TableRow, TableCell, Button } from "@nextui-org/react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import TextInput from "~/components/inputs/text-input";
import TextareaInput from "~/components/inputs/textarea";
import SearchAndCreateRecordBar from "~/components/sections/search-create-bar";
import Header from "~/components/ui/header";
import CustomTable from "~/components/ui/new-table";
import { LoaderFunction } from "@remix-run/node";
import DepartmentController from "~/controllers/DepartmentController";

const App = () => {
  const { search_term, page, departments } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

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
    <div className="">
      <Header title="Manage Departments" />
      <video ref={videoRef} autoPlay muted width="120" height="560" />
      {/* <canvas ref={canvasRef} style={{ position: "absolute" }} /> */}

      <SearchAndCreateRecordBar
        buttonText="New Department"
        modalTitle="Create New Department"
        searchValue={search_term}
        pageValue={page}
        formIntent="create-department"
      >
        <div className="flex flex-col gap-5">
          <TextInput label="Name" name="name" />
          <TextareaInput label="Description" name="description" />
        </div>
      </SearchAndCreateRecordBar>

      <CustomTable
        columns={["Name", "Description", "Actions"]}
        page={page}
        setPage={(page) => navigate(`?page=${page}&search_term=${search_term}`)}
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
              <TableCell className="flex items-center gap-3">
                <Button>Edit</Button>
                <Button>Delete</Button>
              </TableCell>
            </TableRow>
          )
        )}
      </CustomTable>
    </div>
  );
};

export default App;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const departmentController = await new DepartmentController(request);
  const { departments, totalPages } = departmentController.getDepartments({
    page,
    search_term,
  });

  return {
    search_term,
    page,
    departments,
    totalPages,
  };
};

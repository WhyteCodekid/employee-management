import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { Input } from "@nextui-org/react";
import { Form } from "@remix-run/react";

const App = () => {
  const [loading, setLoading] = useState(false);

  //   const getFace = async (e) => {
  //     const loadImage = async () => {
  //       const image = new Image();
  //       image.src = faj;

  //       image.onload = async () => {
  //         const descriptor = await getFaceDescriptor(image);
  //         if (descriptor) {
  //           // Send the face data to the server
  //           fetch("/api/add-face", {
  //             method: "POST",
  //             body: new URLSearchParams({
  //               label: "Raj",
  //               descriptor: JSON.stringify(Array.from(descriptor)),
  //             }),
  //           })
  //             .then((response) => response.json())
  //             .then((data) => console.log("Success:", data))
  //             .catch((error) => console.error("Error:", error));
  //         }
  //       };
  //     };

  //     loadImage();
  //   };

  const getFaceDescriptor = async (image) => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

    const detection = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection ? detection.descriptor : null;
  };

  return (
    <div className="App">
      <h1>Encode face and save to JSON</h1>
      {loading && <p>Loading...</p>}
      <Form>
        <Input name="name" label="Name" />
        <Input
          type="file"
          label="Select face"
          onChange={(e) => {
            setLoading(true);
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
              const image = new Image();
              image.src = event.target.result;

              image.onload = async () => {
                const descriptor = await getFaceDescriptor(image);
                if (descriptor) {
                  // Send the face data to the server
                  fetch("/api/add-face", {
                    method: "POST",
                    body: new URLSearchParams({
                      label: "Kwamina",
                      descriptor: JSON.stringify(Array.from(descriptor)),
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => console.log("Success:", data))
                    .catch((error) => console.error("Error:", error));
                }
              };
            };

            reader.readAsDataURL(file);
            setLoading(false);
          }}
        />
      </Form>
    </div>
  );
};

export default App;

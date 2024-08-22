import { ActionFunction } from "@remix-run/node";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import UserController from "~/controllers/UserController";

// Use `import.meta.url` to get the current file URL and then resolve the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const action: ActionFunction = async ({ request }) => {
  console.log("Adding face to the database");
  const facesFilePath = path.join(__dirname, "../app/assets", "faces.json");

  // Load existing faces or initialize an empty array
  const loadFaces = () => {
    if (fs.existsSync(facesFilePath)) {
      const data = fs.readFileSync(facesFilePath);
      return JSON.parse(data);
    }
    return [];
  };

  // Save faces to the JSON file
  const saveFaces = (faces) => {
    fs.writeFileSync(facesFilePath, JSON.stringify(faces, null, 2));
  };

  const formData = await request.formData();
  const label = formData.get("label");
  const descriptor = JSON.parse(formData.get("descriptor"));

  //   const userController = new UserController(request);
  //   const user = await userController.createUser(formData);

  if (!label || !descriptor) {
    throw new Error("Invalid data");
  }

  const faces = loadFaces();
  faces.push({ label, descriptor });
  saveFaces(faces);

  return {};
};

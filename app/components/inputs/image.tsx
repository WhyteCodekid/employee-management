/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageUpload } from "~/components/icons/upload";

export const ImageInputWithPreview = ({
  label = "Upload Image",
  name,
  imageString,
  setImageString,
}: {
  label: string;
  name: string;
  imageString: string;
  setImageString: (imageString: string) => void;
}) => {
  const handleImageChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageString(reader?.result);
        console.log(imageString);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImageString("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-montserrat text-gray-900 dark:text-white font-medium">
        {label}
      </h4>

      <div className="flex items-start gap-5 w-full">
        <label
          htmlFor="image-input"
          className="border-2 hover:border-success dark:hover:border-success rounded-xl hover:text-success font-nunito px-4 pl-3 py-2 transition-colors duration-400 dark:border-white/30 flex items-center gap-2 w-max"
        >
          <ImageUpload className="size-6" />
          Choose file
        </label>
        {imageString && (
          <div>
            <img
              src={imageString}
              alt="Selected"
              className="size-24 object-cover object-center"
            />
          </div>
        )}

        <input value={imageString} name={name} className="hidden" />
      </div>

      <input
        className="hidden"
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

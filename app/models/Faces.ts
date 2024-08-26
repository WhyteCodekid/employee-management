import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { FaceInterface } from "~/utils/types";

const faceSchema = new Schema<FaceInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    image: {
      type: String,
    },
    descriptor: {
      type: [Number],
    },
  },
  {
    timestamps: true,
  }
);

let Face: mongoose.Model<FaceInterface>;
try {
  Face = mongoose.model<FaceInterface>("faces");
} catch (error) {
  Face = mongoose.model<FaceInterface>("faces", faceSchema);
}

export default Face;

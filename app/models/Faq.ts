import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { FaqInterface } from "~/utils/types";

const schema = new Schema<FaqInterface>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Faq: mongoose.Model<FaqInterface>;
try {
  Faq = mongoose.model<FaqInterface>("faqs");
} catch (error) {
  Faq = mongoose.model<FaqInterface>("faqs", schema);
}

export default Faq;

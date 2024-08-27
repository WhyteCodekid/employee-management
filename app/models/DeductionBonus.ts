import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { DeductionBonusInterface } from "~/utils/types";

const schema = new Schema<DeductionBonusInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    type: {
      type: String,
      enum: ["bonus", "deduction", ""],
      default: "bonus",
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

let DeductionBonus: mongoose.Model<DeductionBonusInterface>;
try {
  DeductionBonus = mongoose.model<DeductionBonusInterface>("deduction_bonus");
} catch (error) {
  DeductionBonus = mongoose.model<DeductionBonusInterface>(
    "deduction_bonus",
    schema
  );
}

export default DeductionBonus;

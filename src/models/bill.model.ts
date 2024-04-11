import moment from "moment";
import { model, Schema, Document } from "mongoose";
import { statusType } from "../constants/bill.constants";

//declare Bill type
export interface IBill extends Document {
  active?: boolean;
  uid?: string;
  from: string;
  to: string;
  due: string;
  status: string;
  userID: string;
  pricing: number;
  tokens: number;
  createdAt?: string;
}
// define Bill schema
const BillSchema: Schema = new Schema(
  {
    active: { type: Boolean, default: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    due: {
      type: String,
      default: moment()
        .add(15, "days")
        .toDate(),
    },
    status: {
      type: String,
      enum: [...statusType],
      default: statusType[0],
    },
    userID: {
      type: String,
      required: true,
    },
    pricing: { type: Number, required: true },
    tokens: { type: Number, required: true },
  },
  { timestamps: true },
);

BillSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    active: this.active,
    from: this.from,
    to: this.to,
    due: this.due,
    status: this.status,
    userID: this.userID,
    pricing: this.pricing,
    tokens: this.tokens,
    createdAt: this.createdAt,
  };

  return transformed;
};

export const Bill: any = model("Bill", BillSchema);

import { model, Schema } from "mongoose";

//declare Transaction type
export interface ITransaction {
  uid?: string;
  active?: boolean;
  postID: string;
  social: string;
  tokens: number;
  pricing: number;
  comments: number;
  userID: any;
  imagePost: string;
  createdAt?: string
}
// define Transaction schema
const TransactionSchema: Schema = new Schema(
  {
    active: { type: Boolean, default: true },
    postID: { type: String, required: true },
    social: { type: String, required: true },
    tokens: { type: Number, required: true },
    pricing: { type: Number, required: true },
    comments: { type: Number, required: true },
    userID: { type: String, required: true },
    imagePost: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

TransactionSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    active: this.active,
    postID: this.postID,
    social: this.social,
    tokens: this.tokens,
    pricing: this.pricing,
    comments: this.comments,
    userID: this.userID,
    imagePost: this.imagePost,
    createdAt: this.createdAt,
  };

  return transformed;
};

export const Transaction: any = model("Transaction", TransactionSchema);

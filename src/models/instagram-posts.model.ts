import { model, Schema, Document } from "mongoose";

//declare user type
export interface IInstagramPost extends Document {
  postID: string;
  userID: string;
  positive?: string[];
  neutral?: string[];
  negative?: string[];
  totalToken?: number;
  lastCommentID?: string;
}
// define schema
const InstagramPostSchema: Schema = new Schema(
  {
    postID: { type: String, required: true },
    positive: { type: Array, default: [] },
    neutral: { type: Array, default: [] },
    negative: { type: Array, default: [] },
    userID: { type: String, required: true },
    totalToken: { type: Number, required: true },
    lastCommentID: { type: String, default: "" },
  },
  { timestamps: true },
);

InstagramPostSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    positive: this.positive,
    neutral: this.neutral,
    negative: this.negative,
    userID: this.userID,
    totalToken: this.totalToken,
    lastCommentID: this.lastCommentID,
    updateAt: this.updateAt,
    createdAt: this.createdAt,
  };

  return transformed;
};

export const InstagramPost: any = model("InstagramPost", InstagramPostSchema);

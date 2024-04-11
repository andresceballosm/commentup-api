import { model, Schema, Document } from "mongoose";

//declare Developer type
export interface IDeveloper extends Document {
  active?: boolean;
  userID: string;
  description: string;
  title: string;
  experience: string;
  skills: string[];
  github: string;
  linkedin: string;
  website: string;
  rate: number;
  available: boolean;
  currency?: string;
}

// define Developer schema
const DeveloperSchema: Schema = new Schema(
  {
    userID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    experience: { type: String, required: true },
    skills: { type: Array, required: true },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
    available: { type: Boolean, default: true },
    rate: { type: Number, default: true }, // Rate by hour
    currency: { type: String, default: "usd" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

DeveloperSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    userID: this.userID,
    title: this.title,
    description: this.description,
    experience: this.experience,
    skills: this.skills,
    github: this.github,
    linkedin: this.linkedin,
    website: this.website,
    createdAt: this.createdAt,
    available: this.available,
    rate: this.rate,
    currency: this.currency,
    active: this.active,
  };

  return transformed;
};

export const Developer: any = model("Developer", DeveloperSchema);

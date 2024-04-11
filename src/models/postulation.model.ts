import { model, Schema, Document } from "mongoose";
import { statusPostulation } from "../constants/position.constants";

export interface IPostulation extends Document {
  active?: boolean;
  id?: string;
  name: string;
  positionID: string;
  cv: string;
  phone: string;
  country: string;
  github: boolean;
  linkedin: boolean;
  twitter: boolean;
  email: string;
  tokens: number;
  scoreTechnical: number;
  scoreGeneral: number;
  scoreCV: number;
  scoreAverage: number;
  resumeCV: string;
  resume: string;
  createdAt?: string;
}

// define Postulation schema
const PostulationSchema: Schema = new Schema(
  {
    active: { type: Boolean, default: true },
    name: { type: String, required: true },
    positionID: { type: String, required: true },
    cv: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    github: { type: String, required: false },
    linkedin: { type: String, required: false },
    twitter: { type: String, required: false },
    email: { type: String, required: true },
    scoreTechnical: { type: Number, required: true },
    scoreGeneral: { type: Number, required: false },
    scoreCV: { type: Number, required: true },
    scoreAverage: { type: Number, required: true },
    resume: { type: String, required: true },
    resultGeneral: { type: String, required: false },
    status: {
      type: String,
      enum: [...statusPostulation],
      default: statusPostulation[0],
    },
    questions: { type: Array, required: true },
    questionsTest: { type: Array, required: true },
    tokens: { type: Number, required: true },
  },
  { timestamps: true },
);

PostulationSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    active: this.active,
    name: this.name,
    email: this.email,
    country: this.country,
    phone: this.phone,
    cv: this.cv,
    scoreTechnical: this.scoreTechnical,
    scoreGeneral: this.scoreGeneral,
    scoreCV: this.scoreCV,
    scoreAverage: this.scoreAverage,
    resumeCV: this.resumeCV,
    resume: this.resume,
    status: this.status,
    github: this.github,
    linkedin: this.linkedin,
    twitter: this.twitter,
    tokens: this.tokens,
    createdAt: this.createdAt,
  };

  return transformed;
};

export const Postulation: any = model("Postulation", PostulationSchema);

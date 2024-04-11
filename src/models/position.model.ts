import { model, Schema, Document } from "mongoose";
import { statusPostion } from "../constants/position.constants";

export interface IResponsible {
  userID: string;
  role: string;
}

export interface IPosition extends Document {
  active?: boolean;
  id?: string;
  title: string;
  ownQuestions: boolean;
  description: any[];
  requirements: any[];
  location: string;
  github: boolean;
  linkedin: boolean;
  language: string;
  twitter: boolean;
  salary: string;
  type: string;
  tokens: number;
  skills: string[];
  questions: any[];
  questionsTest: any[];
  steps: string[];
  status: string;
  emailsTemplate: any[];
  createTokens: number;
  createdAt?: string;
  responsibles?: string[];
}

// define Position schema
const PostionSchema: Schema = new Schema(
  {
    active: { type: Boolean, default: true },
    title: { type: String, required: true },
    description: { type: Array, required: true },
    requirements: { type: Array, required: true },
    skills: { type: Array, required: true },
    questions: { type: Array, required: false, default: [] },
    questionsTest: { type: Array, required: true },
    location: { type: String, required: true },
    language: { type: String, required: true },
    status: {
      type: String,
      enum: [...statusPostion],
      default: statusPostion[0],
    },
    steps: { type: Array, required: true },
    emailsTemplate: { type: Array, required: true },
    userID: { type: String, required: true },
    companyID: { type: String, required: true },
    github: { type: Boolean, required: true },
    ownQuestions: { type: Boolean, default: false },
    linkedin: { type: Boolean, required: true },
    twitter: { type: Boolean, required: true },
    salary: { type: String, required: true },
    type: { type: String, required: true },
    responsibles: { type: Array, default: [] },
    tokens: { type: Number, required: true },
    createTokens: { type: Number, required: true },
  },
  { timestamps: true },
);

PostionSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    active: this.active,
    emailsTemplate: this.emailsTemplate,
    title: this.titel,
    description: this.description,
    requirements: this.requirements,
    skills: this.skills,
    questions: this.questions,
    questionsTest: this.questionsTest,
    location: this.location,
    status: this.status,
    userID: this.userID,
    companyID: this.companyID,
    github: this.github,
    linkedin: this.linkedin,
    twitter: this.twitter,
    salary: this.salary,
    type: this.type,
    tokens: this.tokens,
    createTokens: this.createTokens,
    createdAt: this.createdAt,
    ownQuestions: this.ownQuestions,
    steps: this.steps,
    responsibles: this.responsibles,
  };

  return transformed;
};

export const Position: any = model("Position", PostionSchema);

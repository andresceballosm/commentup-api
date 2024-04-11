import { model, Schema, Document } from "mongoose";

export interface Imeet {
  date: string;
  hour: string;
  timezone: string;
  link?: string;
}

//declare Interaction type
export interface IInteraction extends Document {
  active?: boolean;
  availability?: string;
  developerID: string;
  developerEmail: string;
  clientID: string;
  clientEmail: string;
  description: string;
  meetings?: Imeet[];
  createdAt?: string;
  status:
    | "pending"
    | "developer-accepted"
    | "developer-declined"
    | "client-closed"
    | "in-interview"
    | "finished";
}

// define Interaction schema
const InteractionSchema: Schema = new Schema(
  {
    developerID: { type: String, required: true },
    developerEmail: { type: String, required: true },
    clientID: { type: String, required: true },
    clientEmail: { type: String, required: true },
    description: { type: String, required: true },
    meetings: { type: Array, default: [] },
    status: { type: String, default: "pending" },
    availability: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

InteractionSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    developerID: this.developerID,
    developerEmail: this.developerEmail,
    clientID: this.clientID,
    clientEmail: this.clientEmail,
    meetings: this.meetings,
    description: this.description,
    status: this.status,
    createdAt: this.createdAt,
    active: this.active,
    availability: this.availability,
  };

  return transformed;
};

export const Interaction: any = model("Interaction", InteractionSchema);

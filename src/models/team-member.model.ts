import { model, Schema, Document } from "mongoose";
import { roleTypes } from "../constants/users.constants";

export interface IMemberTeam extends Document {
  uid: string;
  active?: boolean;
  displayName: string;
  email: string;
  role?: string;
  companyID?: string;
  permissions?: string[];
  status: string;
}

const teamMemberSchema: Schema = new Schema(
  {
    active: { type: Boolean, default: true },
    userID: {
      type: String,
    },
    displayName: {
      type: String,
    },
    companyID: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: [roleTypes.developer, roleTypes.admin, roleTypes.client],
      default: roleTypes.client,
    },
    permissions: {
      type: Array,
      required: true,
      default: ["All"],
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

export const TeamMember: any = model("TeamMember", teamMemberSchema);

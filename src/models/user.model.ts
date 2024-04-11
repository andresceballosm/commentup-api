import mongoose from "mongoose";
import { model, Schema, Document } from "mongoose";
import { roleTypes } from "../constants/users.constants";

export interface IAccount {
  name: string;
  token: any;
  id: any;
  refreshToken?: string;
}

//declare user type
export interface IUser extends Document {
  active?: boolean;
  displayName: string;
  email: string;
  uid: string;
  phone?: string;
  photo?: string;
  role?: string;
  accounts: IAccount[];
  company?: string;
  country?: string;
}

export interface ICard {
  brand: string;
  cardID: string;
  customer: string;
  last4: string;
  name: string;
  selected?: boolean;
}

// define user schema
const UserSchema: Schema = new Schema(
  {
    firebaseUid: { type: String, required: true },
    displayName: { type: String, default: "" },
    cards: {
      type: [
        {
          brand: String,
          cardID: String,
          customer: String,
          last4: String,
          name: String,
          selected: Boolean,
        },
      ],
      default: [],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Can't be blank"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please use a valid address"],
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: [
        roleTypes.developer,
        roleTypes.admin,
        roleTypes.client,
        roleTypes.mentor,
      ],
      required: true,
    },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    country: { type: String, default: "" },
    photo: {
      type: String,
      default: null,
    },
    active: { type: Boolean, default: true },
    accounts: { type: Array, default: [] },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeamMember",
      },
    ],
  },
  { timestamps: true },
);

UserSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    cards: this.cards,
    firebaseUid: this.firebaseUid,
    email: this.email,
    displayName: this.displayName,
    phone: this.phone,
    role: this.role,
    photo: this.photo,
    createdAt: this.createdAt,
    company: this.company,
    country: this.country,
  };

  return transformed;
};

export const User: any = model("User", UserSchema);

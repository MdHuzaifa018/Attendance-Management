import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "college_settings",
      trim: true,
    },
    collegeName: {
      type: String,
      default: "NALANDA COLLEGE",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Attendance & Academic Management System",
      trim: true,
    },
    affilText: {
      type: String,
      default: "(A Constituent Unit of Patliputra University, Patna)",
      trim: true,
    },
    locationText: {
      type: String,
      default: "Biharsharif, Nalanda- 803101 (Bihar)",
      trim: true,
    },
    estdText: {
      type: String,
      default: "Estd. 1870",
      trim: true,
    },
    logo: {
      type: String,
      default: "/logo.png",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;

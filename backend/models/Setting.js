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
      default: "NALANDA COLLEGE 'NEW EXAMINATION HALL', MOHALLA-GARHPAR, NAISARAI, BIHAR SHARIF 803101",
      trim: true,
    },
    address: {
      type: String,
      default: "NALANDA COLLEGE 'NEW EXAMINATION HALL', MOHALLA-GARHPAR, NAISARAI, BIHAR SHARIF 803101",
      trim: true,
    },
    email: {
      type: String,
      default: "nalandacollegebiharsharif@gmail.com",
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

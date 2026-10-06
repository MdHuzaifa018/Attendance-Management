import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

/**
 * Script to detect and wipe any lingering Base64 encoded images in MongoDB
 * to ensure database stays 100% lightweight and clean.
 */
async function cleanupBase64Images() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    console.log("Scanning students collection for Base64 image strings...");
    
    // Find students whose photo or signatures start with data:image or are abnormally large Base64
    const studentsWithBase64 = await db.collection("students").find({
      $or: [
        { photo: { $regex: "^data:image" } },
        { signature: { $regex: "^data:image" } },
        { directorSignature: { $regex: "^data:image" } },
      ],
    }).toArray();

    console.log(`Found ${studentsWithBase64.length} students with Base64 image data.`);

    let cleanedStudentsCount = 0;
    for (const student of studentsWithBase64) {
      const updateFields = {};
      if (student.photo && student.photo.startsWith("data:image")) {
        updateFields.photo = "";
      }
      if (student.signature && student.signature.startsWith("data:image")) {
        updateFields.signature = "";
      }
      if (student.directorSignature && student.directorSignature.startsWith("data:image")) {
        updateFields.directorSignature = "";
      }

      if (Object.keys(updateFields).length > 0) {
        await db.collection("students").updateOne(
          { _id: student._id },
          { $set: updateFields }
        );
        cleanedStudentsCount++;
      }
    }

    console.log(`Cleaned ${cleanedStudentsCount} student records.`);

    // Check settings collection for Base64 logo
    console.log("Scanning settings collection for Base64 logo...");
    const settings = await db.collection("settings").find({}).toArray();
    let cleanedSettingsCount = 0;
    for (const st of settings) {
      if (st.logo && st.logo.startsWith("data:image")) {
        await db.collection("settings").updateOne(
          { _id: st._id },
          { $set: { logo: "/logo.png" } }
        );
        cleanedSettingsCount++;
        console.log(`Reset Base64 logo in setting (${st.collegeName}) back to '/logo.png'`);
      }
    }

    console.log(`Cleaned ${cleanedSettingsCount} setting records.`);
    console.log("Database image cleanup completed successfully!");
  } catch (error) {
    console.error("Cleanup error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

cleanupBase64Images();

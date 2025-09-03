import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mediaRoutes from "./routes/media.routes";
import path from "path";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Static folder for uploaded images
app.use("/media/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Serving uploads from:", path.join(__dirname, "uploads"));

// Routes
app.use("/api/media", mediaRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Media service running on port ${PORT}`);
});

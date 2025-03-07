import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import path from "path";
import { fileURLToPath } from "url";

// Initialize environment variables
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importing the Database Connection
import dbConnection from "./db/config.js";
dbConnection();

// Importing the Cloudinary Connection
import cloudinaryConnect from "./db/cloudinary.js";
cloudinaryConnect();

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Serve static files from node_modules/swagger-ui-dist
app.use(
  "/api-docs",
  express.static(path.join(__dirname, "node_modules", "swagger-ui-dist"))
);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Importing the user Routes
import userRoutes from "./routes/userRoute.js";
app.use("/users", userRoutes);

// Importing the Blog Routes
import blogRoutes from "./routes/blogRoute.js";
app.use("/blogs", blogRoutes);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

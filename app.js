import express from 'express';
import connect from './db/db.js';
import adminRouter from './routes/admin.routes.js';
import userRouter from './routes/user.routes.js';
import vendorRouter from './routes/vendor.routes.js';
import uploadRoutes from "./routes/image.routes.js";
import adminGetRouter from "./routes/admin.get.js";
import cookieParser from "cookie-parser";
import userGetRouter from './routes/user.get.js';
import cors from "cors";
import Vendor from './model/vendor.model.js';

connect();

const app = express();
const port = 3000; // Or any other desired port

app.use(cors({
  origin: "http://localhost:8081", // allow RN web dev server
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use("/", uploadRoutes);
app.use("/", adminGetRouter);
app.use("/", userGetRouter);

app.use("/uploads", express.static("uploads"));

app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/vendor", vendorRouter)

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
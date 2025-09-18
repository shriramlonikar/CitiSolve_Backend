import express from 'express';
import connect from './db/db.js';
import adminRouter from './routes/admin.routes.js';
import userRouter from './routes/user.routes.js'
import uploadRoutes from "./routes/image.routes.js";
import cookieParser from "cookie-parser";

connect();

const app = express();
const port = 3000; // Or any other desired port

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use("/", uploadRoutes);

app.use("/user", userRouter)
app.use("/admin", adminRouter)

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
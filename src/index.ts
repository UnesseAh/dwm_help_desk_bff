import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/usersRoutes";
import departmentRouter from "./routes/departmentRoutes";
import { authErrorHandler, generateErrorHandler, prismaErrorHandler } from "./errorHandling";


dotenv.config();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();
app.use(cors());
app.use(express.json());

/** Users Routes */
app.use("/api/users", userRouter);
app.use("/api/departments" , departmentRouter);

app.use(authErrorHandler, prismaErrorHandler, generateErrorHandler);

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("IT Helpdesk TypeScript Backend API is running...");
});

app.listen(PORT, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
});

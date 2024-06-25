import express, { Express } from "express";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes";
import shortenUrlRoutes from "./routes/shortenUrlRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/url", shortenUrlRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});

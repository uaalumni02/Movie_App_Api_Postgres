import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();
const { log, error } = console;

const port = process.env.PORT || 3000;

const router = express.Router();

//import routes
import userRoutes from "./routes/user.route";
import movieRoutes from "./routes/movie.route";
import movieUserId from "./routes/movieUserID.route";
import ratingRoutes from "./routes/rating.route";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware to utilize routes
router.use("/user", userRoutes);
router.use("/movie", movieRoutes);
router.use("/movieUser", movieUserId);
router.use("/rating", ratingRoutes);

app.use("/api", router);

app.listen(port, () => log("server is running"));
export default app;

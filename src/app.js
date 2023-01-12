import express from "express";
import { usersRouter } from "./modules/user/routes.js";
import { applicationsRouter } from "./modules/application/routes.js";
import { listingsRouter } from "./modules/listing/routes.js";
import { offersRouter } from "./modules/offer/routes.js";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  bodyParser.json({
    extended: false,
  })
);

app.use("/users", usersRouter);
app.use("/applications", applicationsRouter);
app.use("/listings", listingsRouter);
app.use("/offers", offersRouter);

const server = app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`));

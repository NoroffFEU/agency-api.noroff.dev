import express from "express";
import { usersRouter } from "./modules/user/routes.js";
import { applicationsRouter } from "./modules/application/routes.js";
import { listingsRouter } from "./modules/listing/routes.js";
import { offersRouter } from "./modules/offer/routes.js";
import { companyRouter } from "./modules/company/routes.js";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";
dotenv.config();

// prevents CORS errors
const app = express();
app.use(cors());

const PORT = process.env.PORT;

// options for swagger jsdocs
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Noroff Agency API",
      version: "0.0.1",
      description:
        "An Express and Prisma rest API to server a Noroff students and industry partners in finding jobs and placements.",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          scheme: "bearer",
          in: "header",
        },
      },
    },
  },
  apis: ["./src/modules/**/*.js"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(
  bodyParser.json({
    extended: false,
  })
);

//stops html response on unexpected json token
const jsonErrorHandler = function (error, req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res
    .status(error.status)
    .send(
      JSON.stringify({ ...error, message: "Bad request, json parse failed." })
    );
};
app.use(jsonErrorHandler);

app.use("/users", usersRouter);
app.use("/applications", applicationsRouter);
app.use("/listings", listingsRouter);
app.use("/offers", offersRouter);
app.use("/company", companyRouter);

const server = app.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
);

export default server;

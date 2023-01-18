import express from "express";
// import { app } from "../../../app.js";
const request = require("supertest");
const applicationsRouter = require("../../../modules/application/routes.js");
import { Prisma } from "@prisma/client";
// import { applicationsRouter } from "../../../modules/application/routes.js";
import { databasePrisma } from "../../../prismaClient.js";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
// dotenv.config();

const app = express();
// app.use(express.json());
// const PORT = process.env.PORT;

app.use(
  bodyParser.json({
    extended: false,
  })
);

app.use("/applications", applicationsRouter);

describe("Integration tests for the job applications API", () => {
  it("GET /applications - success - get the job application", async () => {
    const { body, statusCode } = await databasePrisma.application
      .findMany(app)
      .get("/applications");

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          // created: expect.any(DateTime),
          // updated: expect.any(DateTime),
          // applicant: expect.any(User),
          applicantId: expect.any(String),
          offers: expect.any([]),
          // listing: expect.any(listing),
          listingId: expect.any(String),
          coverLetter: expect.any(String),
        }),
      ])
    );

    expect(statusCode).toBe(200);
  });
});

// const request = require("supertest");
// import { app } from "../../app.js";

import express from "express";

const request = require("supertest");

import { Prisma } from "@prisma/client";

import { databasePrisma } from "../../../prismaClient.js";

import { applicationsRouter } from "../../../modules/application/routes.js";

const app = express();

app.use(express.json());

app.use("/applications", applicationsRouter);

describe("Integration tests for the job applications API", () => {
  it("GET /applications -success-", async () => {
    // expect.assertions(0);
    request(app)
      .get("/applications")
      .expect(200)
      .end((err, res) => {
        if (err) return err;

        expect(res.body).toEqual(
          expect.objectContaining({
            // offers: expect.any(Object),
            // _count: expect.any(Number),
            // message: expect.any(String),
            // token: expect.any(String),
            applications: true,
          })
        );

        // expect(res.body).toEqual(
        //   expect.arrayContaining([
        //     expect.objectContaining({
        //       // success: true,
        //       // Offers: true,
        //       // _count: true,
        //       // message: "success",
        //       // token: expect.any(String),
        //       // id: expect.any(String),
        //       // created: expect.anything(),
        //       // updated: expect.anything(),
        //       // applicant: expect.any(Object),
        //       // applicantId: expect.any(String),
        //       // offers: expect.any(Object),
        //       // listing: expect.any(Object),
        //       // listingId: expect.any(String),
        //       // coverLetter: expect.any(String),
        //     }),
        //   ])
        // );
      });
  });
});

//EXAMPLE

// describe("Integration tests for the job applications API", () => {
//   it("GET /applications - success - get the job application", async () => {
//     const { body, statusCode } = await request(app).get("/applications");

//     expect(body).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           Offers: true,
//           _count: true,
//           message: "success",
//           token: expect.any(String),
//         }),
//       ])
//     );

//     expect(statusCode).toBe(200);
//   });
// });

///EXAMPLE OF ARRAY AND OBJECT
// expect.arrayContaining([]);

// expect.objectContaining({});

//   expect(body).toEqual(
//     expect.arrayContaining([
//       expect.objectContaining({
//         id: "8ee4b00c-beca-41f0-b4dd-79a61da42717",
//         created: "07/05/2023",
//         updated: "07/05/2023",
//         applicant: {
//           id: "31",
//           email: "email@emai22.com",
//           firstName: "Jo2n",
//           lastName: "Do3e",
//           password: "password",
//           applications: [],
//           offers: [],
//           listings: [],
//         },
//         applicantId: "31",
//         offers: [],
//         listing: [],
//         listingId: "30",
//         coverLetter: "example",
//       }),
//     ])
//   );
// });

//EXAMPLE

// describe("Test the root path", () => {
//   test("It should response the GET method", async () => {
//     const response = await request(app).get("/");
//     expect(response.statusCode).toBe(200);
//   });
// });

//EXAMPLE

// const request = require("supertest");
// const app = require("../../src/app");

// describe("Users", () => {
//   test("It returns successfully", (done) => {
//     request(app)
//       .get("/")
//       .then((response) => {
//         expect(response.statusCode).toBe(200);
//         done();
//       });
//   });
// });

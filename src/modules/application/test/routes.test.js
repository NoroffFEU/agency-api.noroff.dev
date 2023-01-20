import express from "express";
import jwt from "jsonwebtoken";
// import request from "supertest";
import { applicationsRouter } from "../routes.js";
// import { databasePrisma } from "../../../prismaClient.js";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { databasePrisma } from "../../../prismaClient.js";

// Manually inserting a user to my postgreSQL database
// app.post("/users", async (req, res) => {
//   try {
//     const data = await databasePrisma.data.create({
//       data: {
//         firstName: "Tony",
//         lastName: "Skogmann",
//         email: "some@some.com",
//         password: "password",
//       },
//     });
//     // Send a success message
//     res.json({ message: "Data inserted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.json({ message: "Error inserting data" });
//   }
//   await databasePrisma.disconnect();
// });

// app.post("users/login", async (req, res) => {
//   try{
//     const data = await databasePrisma.data.create()
//   }
// })

dotenv.config();

const app = express();

app.use(express.json());
app.use("/applications", applicationsRouter);

const PORT = process.env.PORT;
const base_URL = `http://localhost:${PORT}`;

const secret = "MySecretKey";
const testUser = {
  id: "756efc6e-2d12-4c9d-9be4-3a1a39e78e98",
  email: "some@some.com",
  firstName: "Tony",
  lastName: "Testing",
  password: "password",
  salt: "salty",
  role: "Applicant",
};

const token = jwt.sign(testUser, secret);

console.log(token);

// Endpoint testing with JWT token

const options = {
  body: JSON.stringify({
    coverLetter: "CoverLetter test",
  }),
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

fetch(`${base_URL}/applications`, {
  method: "post",
  options,
})
  .then((response) => response.json())
  .then((json) => console.log(json))
  .catch((error) => console.log(error));

// const testData = {
//   coverLetter: "CoverLetter test",
// };

// console.log(testData.coverLetter);

// it("should create an application on a listing and return a 200 response", async () => {
//   const response = await request(base_URL).post("/applications").send(testData).set("Authorization", `Bearer ${token}`);
//   expect(response.status).toBe(200);
//   expect(response.body.coverLetter).toEqual(testData.coverLetter);
// });

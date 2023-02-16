import request from "supertest";
import * as dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import { createTestDatabase } from "./createTestData.js";
const { sign } = jsonwebtoken;
dotenv.config();

const PORT = process.env.PORT;
const baseURL = `http://localhost:${PORT}`;

const signToken = function (id, email) {
  const token =
    "Bearer " +
    sign({ userId: id, email: email }, process.env.SECRETSAUCE, {
      expiresIn: "24h",
    });

  return token;
};

let companyTest,
  testCompanyAdmin,
  testCompanyApplicant1,
  testCompanyClient1,
  testCompanyClient2,
  testCompanyClient3,
  client1Token,
  client2Token,
  client3Token,
  applicantToken;

const testCompany = {
  name: "TestingCompanyClient1",
  sector: "tester",
  phone: "tester",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2ChocolateChipCookies.jpg/1280px-2ChocolateChipCookies.jpg",
};

const testCompany2 = {
  ...testCompany,
  name: "BadLogoCompany",
  logo: "errm?",
};

const testCompany3 = {
  ...testCompany,
  name: "TestCompanyClient3",
};

const testCompany4 = {
  ...testCompany,
  name: "NoAdminCompany",
};

// Create listing tests
describe("POST /company", () => {
  beforeAll(async () => {
    ({
      testCompanyAdmin,
      testCompanyApplicant1,
      testCompanyClient1,
      testCompanyClient2,
      testCompanyClient3,
    } = await createTestDatabase());
    client1Token = signToken(testCompanyClient1.id, testCompanyClient1.email);
    client2Token = signToken(testCompanyClient2.id, testCompanyClient2.email);
    client3Token = signToken(testCompanyClient3.id, testCompanyClient3.email);
    applicantToken = signToken(
      testCompanyApplicant1.id,
      testCompanyApplicant1.email
    );
    testCompany.admin = testCompanyClient1.id;
    testCompany3.admin = testCompany2.admin = testCompanyClient2.id;
  });

  it("should return 201 and the company, when creating", async () => {
    const response = await request(baseURL)
      .post("/company")
      .set("Authorization", `${client1Token}`)
      .send(testCompany);
    companyTest = response.body;
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toEqual(testCompany.name);
  });

  it("should return 401 and unauthorized with no token", async () => {
    const response = await request(baseURL).post("/company").send(testCompany2);
    expect(response.body.message).toEqual("No authorization header provided.");
    expect(response.statusCode).toBe(401);
  });

  it("should return 400 and bad request with same name", async () => {
    const response = await request(baseURL)
      .post("/company")
      .set("Authorization", `${client2Token}`)
      .send(testCompany3);
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toEqual("Company already exists.");
  });

  it("should return 400 and bad logo URL", async () => {
    const response = await request(baseURL)
      .post("/company")
      .set("Authorization", `${client2Token}`)
      .send(testCompany2);
    expect(response.body.message).toEqual("Image Url is not an approved image");
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 and with no admin id", async () => {
    const response = await request(baseURL)
      .post("/company")
      .set("Authorization", `${client2Token}`)
      .send(testCompany4);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(expect.any(String));
  });
});

describe("PUT /company", () => {});

describe("GET /company", () => {
  it("should return 200 and array of companies", async () => {
    const response = await request(baseURL).get(`/company`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
    expect(response.body[0].offers).toEqual(undefined);
    expect(response.body[0].application).toEqual(undefined);
  });
});

describe("GET /company/:id", () => {
  it("should return 200 and a company without applications and listings with no auth", async () => {
    const id = testCompanyClient3.companyId;
    const response = await request(baseURL).get(`/company/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(id);
    expect(response.body.offers).toEqual(undefined);
    expect(response.body.applications).toEqual(undefined);
  });

  it("should return 200 and a company without applications and listings with auth", async () => {
    const id = testCompanyClient3.companyId;
    const response = await request(baseURL)
      .get(`/company/${id}`)
      .set("Authorization", `${client1Token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(id);
    expect(response.body.offers).toEqual(undefined);
    expect(response.body.applications).toEqual(undefined);
  });

  it("should return 200 and a company with applications and listings", async () => {
    const id = testCompanyClient3.companyId;
    const response = await request(baseURL)
      .get(`/company/${id}`)
      .set("Authorization", `${client3Token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(id);
    expect(response.body.offers).toEqual(expect.any(Array));
    expect(response.body.applications).toEqual(expect.any(Array));
  });
});

describe("DELETE /company", () => {
  it("should return 401 when attempting to edit other company listings", async () => {
    const id = testCompanyClient3.companyId;
    const response = await request(baseURL)
      .delete(`/company/${id}`)
      .set("Authorization", `${client1Token}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual(
      "User is not authorized to make this request"
    );
  });

  it("should return 200 and a successful delete message", async () => {
    const id = testCompanyClient3.companyId;
    const response = await request(baseURL)
      .delete(`/company/${id}`)
      .set("Authorization", `${client3Token}`);
    expect(response.status).toBe(200);
  });
});

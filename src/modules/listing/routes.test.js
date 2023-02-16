import request from "supertest";
import * as dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import { createListingsTestDatabase } from "./createListingTestData.js";
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

let listingTest;
let testListingsAdmin,
  testListingsApplicant1,
  testListingsClient1,
  testListingsClient2,
  testListingsClient3,
  client1Token,
  client2Token,
  client3Token,
  applicantToken;

const testListings = {
  title: "Test Listing",
  tags: ["test", "listing"],
  description: "This is a test listing 1",
  requirements: ["test", "listing"],
  deadline: "2024-11-30T20:57:00.000Z",
};

const testListings2 = {
  title: "Test Listing",
  tags: ["test", "listing"],
  deadline: "2024-11-30T20:57:00.000Z",
};

const testListings3 = { ...testListings, deadline: "dzfgdfg" };
const testListings4 = { ...testListings, deadline: "2021-11-30T20:57:00.000Z" };

// Create listing tests
describe("POST /listings", () => {
  beforeAll(async () => {
    ({
      testListingsAdmin,
      testListingsApplicant1,
      testListingsClient1,
      testListingsClient2,
      testListingsClient3,
    } = await createListingsTestDatabase());
    client1Token = signToken(testListingsClient1.id, testListingsClient1.email);
    client2Token = signToken(testListingsClient2.id, testListingsClient2.email);
    client3Token = signToken(testListingsClient3.id, testListingsClient3.email);
    applicantToken = signToken(
      testListingsApplicant1.id,
      testListingsApplicant1.email
    );
    testListings4.company =
      testListings3.company =
      testListings2.company =
      testListings.company =
        testListingsClient1.companyId;
  });

  it("should return 201 and the listing, when creating", async () => {
    const response = await request(baseURL)
      .post("/listings")
      .set("Authorization", `${client1Token}`)
      .send(testListings);
    listingTest = response.body;
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toEqual(testListings.title);
  });

  it("should return 401 and a message without a company", async () => {
    const response = await request(baseURL)
      .post("/listings")
      .set("Authorization", `${client2Token}`)
      .send(testListings2);
   
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual("You must create a company first.");
  });

  it("should return 400 and a message with missing required keys", async () => {
    const response = await request(baseURL)
      .post("/listings")
      .set("Authorization", `${client1Token}`)
      .send(testListings2);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(expect.any(String));
  });

  it("should return 400 and a message with bad date format", async () => {
    const response = await request(baseURL)
      .post("/listings")
      .set("Authorization", `${client1Token}`)
      .send(testListings3);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "Deadline must be in a valid ISO date format."
    );
  });

  it("should return 400 and a message with past date", async () => {
    const response = await request(baseURL)
      .post("/listings")
      .set("Authorization", `${client1Token}`)
      .send(testListings4);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Deadline must be a future date");
  });

  it("should return 401 and a message with invalid token", async () => {
    const response = await request(baseURL)
      .post("/listings")
      .set("Authorization", `asdj`)
      .send(testListings);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual(
      "Invalid authorization token provided, please re-log."
    );
  });

  it("should return 401 and a message when applicant tries to create", async () => {
    const response = await request(baseURL)
      .post("/listings")
      .set("Authorization", `${applicantToken}`)
      .send(testListings);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual("Only clients can create listings.");
  });
});

// get all listings test
describe("GET /listings", () => {
  it("should return 200 and an array of listings", async () => {
    const response = await request(baseURL).get("/listings");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });
});

// get specific listing
describe("GET /listings/:id", () => {
  it("should return 200 and a listing", async () => {
    const id = listingTest.id;
    const response = await request(baseURL).get(`/listings/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toEqual(testListings.title);
    expect(response.body.offer).toEqual(undefined);
    expect(response.body.applications).toEqual(undefined);
  });

  it("should return 200 and a listing, plus offers and applications on own listing with token", async () => {
    const id = listingTest.id;
    const response = await request(baseURL)
      .get(`/listings/${id}`)
      .set("Authorization", `${client1Token}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toEqual(testListings.title);
    expect(response.body.offer).toEqual(expect.any(Array));
    expect(response.body.applications).toEqual(expect.any(Array));
  });

  it("should return 404 and a message", async () => {
    const id = "123";
    const response = await request(baseURL).get(`/listings/${id}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "Listing with id " + id + " doesn't exist."
    );
  });
});

// Update listing
describe("PUT /listings/:id", () => {
  it("should return 200 and a successful updated message", async () => {
    const id = listingTest.id;
    const data = {
      title: "Test Listing 2",
      description: "This is a test listing 2",
      deadline: "2024-11-30T20:57:00.000Z",
    };
    const response = await request(baseURL)
      .put(`/listings/${id}`)
      .set("Authorization", `${client1Token}`)
      .send(data);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Listing updated successfully");
  });

  it("should return 401 and a message when attempting to edit another companies listing", async () => {
    const id = listingTest.id;
    const data = {
      title: "Test Listing 2",
      description: "This is a test listing 2",
      deadline: "2024-11-30T20:57:00.000Z",
    };
    const response = await request(baseURL)
      .put(`/listings/${id}`)
      .set("Authorization", `${client3Token}`)
      .send(data);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual(
      "You can only edit your own company listings."
    );
  });

  it("should return 400 and an error message on deadline", async () => {
    const id = listingTest.id;
    const data = {
      deadline: "2020-11-30T20:57:00.000Z",
    };
    const response = await request(baseURL)
      .put(`/listings/${id}`)
      .set("Authorization", `${client1Token}`)
      .send(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Deadline must be a future date.");
  });
});

describe("DELETE /listings/:id", () => {
  it("should return 401 when attempting to edit other company listings", async () => {
    const id = listingTest.id;
    const response = await request(baseURL)
      .delete(`/listings/${id}`)
      .set("Authorization", `${client3Token}`);
    expect(response.status).toBe(401);
  });

  it("should return 200 and a successful delete message", async () => {
    const id = listingTest.id;
    const response = await request(baseURL)
      .delete(`/listings/${id}`)
      .set("Authorization", `${client1Token}`);
    expect(response.status).toBe(200);
  });
});

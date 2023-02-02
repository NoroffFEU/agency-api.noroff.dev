import request from "supertest";
import { signToken } from "../../utilities/jsonWebToken";
import * as dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;
dotenv.config();

const PORT = process.env.PORT;
const baseURL = `http://localhost:${PORT}`;

const testClient1 = {
  id: "aef24a05-ed31-418a-af24-34a854ca6f06",
  email: "testClient1@test.com",
  companyId: "5037fdfd-5839-4856-b240-e96f262ef639",
};

const client1Token =
  "Bearer " +
  sign(
    { userId: testClient1.id, email: testClient1.email },
    process.env.SECRETSAUCE,
    {
      expiresIn: "24h",
    }
  );

const testClient2 = {
  id: "c44af6c6-dd6c-427c-97d1-014313e62c6f",
  email: "testClient2@test.com",
  companyId: null,
};

const client2Token =
  "Bearer " +
  sign(
    { userId: testClient2.id, email: testClient2.email },
    process.env.SECRETSAUCE,
    {
      expiresIn: "24h",
    }
  );

const testClient3 = {
  id: "60a94485-9694-4fd3-a883-a658bb4342b8",
  email: "testClient2@test.com",
  companyId: "15ca1361-65c9-44c3-922b-622d2f0426ea",
};

const client3Token =
  "Bearer " +
  sign(
    { userId: testClient3.id, email: testClient3.email },
    process.env.SECRETSAUCE,
    {
      expiresIn: "24h",
    }
  );

const testApplicant = {
  id: "e52df418-b7e8-46e7-b56d-01ecac9bfc38",
  email: "testApplicant1@test.com",
  companyId: null,
};

const applicantToken =
  "Bearer " +
  sign(
    { userId: testApplicant.id, email: testApplicant.email },
    process.env.SECRETSAUCE,
    {
      expiresIn: "24h",
    }
  );

const testListings = {
  title: "Test Listing",
  tags: ["test", "listing"],
  description: "This is a test listing 1",
  requirements: ["test", "listing"],
  deadline: "2024-11-30T20:57:00.000Z",
  company: testClient1.companyId,
};

const testListings2 = {
  title: "Test Listing",
  tags: ["test", "listing"],
  deadline: "2024-11-30T20:57:00.000Z",
  company: testClient1.companyId,
};

const testListings3 = { ...testListings, deadline: "dzfgdfg" };
const testListings4 = { ...testListings, deadline: "2021-11-30T20:57:00.000Z" };

let listingTest;

// Create listing tests
describe("POST /listings", () => {
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
    console.log(response.body);
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

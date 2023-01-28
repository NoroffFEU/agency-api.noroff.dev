import jwt from "jsonwebtoken";
import request from "supertest";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const base_URL = `http://localhost:${PORT}`;

const secret = "MySecretKey";

// Create a testUser in your local database and place the following here.
const testUser = {
  id: "be559b29-1616-412f-ad06-1351936de656",
  email: "tes@tes.com",
  firstName: "tes",
  lastName: "testost",
};

const token = jwt.sign(testUser, secret);

// Create a listing f.eks like this to test the applications endpoints
// const testListing = {
//   title: "Test listing",
//   tags: ["test", "listing", "jest"],
//   description: "listing test with jest",
//   deadline: "2025-11-30T20:55:00.000Z",
//   authorId: `${testUser.id}`,
// };

const letter = "testing letter";

let applicationTest;

describe("POST /applications", () => {
  it("should return application and return a 200 response", async () => {
    const res = await request(base_URL)
      .post("/applications")
      .send({
        applicant: { connect: { id: testUser.id } },
        // Replace the listing id here with the targeted one.
        listing: { connect: { id: "9122ffa3-21e9-4115-8938-83825c65c5ca" } },
        coverLetter: letter,
      })
      .set("Authorization", `Bearer ${token}`);

    applicationTest = res.body;
    console.log(applicationTest);

    expect(res.status).toBe(200);
    expect(res.body.applicantId).toEqual(testUser.id);
    expect(res.body.listingId).toEqual(applicationTest.listingId);
    expect(res.body.coverLetter).toEqual(applicationTest.coverLetter);
  });
});

describe("POST /applications Error", () => {
  it("should return a status code of 409 with application already exist on listing message", async () => {
    const res = await request(base_URL)
      .post(`/applications`)
      .send({
        applicant: { connect: { id: testUser.id } },
        listing: { connect: { id: applicationTest.listingId } },
        coverLetter: letter,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.status).toBe(409);
    expect(res.body.message).toBe(
      "You've already created an application on this listing"
    );
  });
});

describe("GET /applications", () => {
  it("should return array of applications and 200 response code", async () => {
    const res = await request(base_URL)
      .get(`/applications`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

describe("GET /applications/id", () => {
  it("should return a single application and 200 response code", async () => {
    const res = await request(base_URL)
      .get(`/applications/${applicationTest.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.coverLetter).toEqual(applicationTest.coverLetter);
  });
});

// PUT unit-test
describe("PUT /applications/id", () => {
  describe("given an applicantId and a listingId", () => {
    //should check there's a valid token
    //should update cover letter in database

    test("should respond with a status code of 200", async () => {
      const response = await request(base_URL).put("/applications/id").send({
        applicantId: "0c3fd305-e8bb-43d5-8f3f-bdb405dfed96",
        listingId: "91f5004b-df7e-4cc8-aaee-8703f14c031c",
        coverLetter: "This is my updated cover letter",
      });

      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content-type header", async () => {
      const response = await request(base_URL).put("/applications/id").send({
        applicantId: "0c3fd305-e8bb-43d5-8f3f-bdb405dfed96",
        listingId: "91f5004b-df7e-4cc8-aaee-8703f14c031c",
        coverLetter: "This is my updated cover letter",
      });

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("should respond with a json object containing applicationId, applicantId, listingId, coverLetter, created, updated", async () => {
      const response = await request(base_URL).put("/applications/id").send({
        applicantId: "0c3fd305-e8bb-43d5-8f3f-bdb405dfed96",
        listingId: "91f5004b-df7e-4cc8-aaee-8703f14c031c",
        coverLetter: "This is my updated cover letter",
      });

      expect(response.body.applicationId).toBeDefined();
      expect(response.body.applicantId).toBeDefined();
      expect(response.body.listingId).toBeDefined();
      expect(response.body.coverLetter).toBeDefined();
      expect(response.body.created).toBeDefined();
      expect(response.body.updated).toBeDefined();
    });
  });

  describe("missing applicantId or listingId", () => {
    test("should respond with 400 status code", async () => {
      const data = [
        { applicantId: "0c3fd305-e8bb-43d5-8f3f-bdb405dfed96" },
        { listingId: "91f5004b-df7e-4cc8-aaee-8703f14c031c" },
        {},
      ];

      for (const body of data) {
        const response = await request(base_URL)
          .put("/applications/id")
          .send(body);

        expect(response.statusCode).toBe(400);
      }
    });
  });

  describe("invalid or missing token", () => {
    //should respond with 401 status code
  });
});

// DELETE unit-test

describe("DELETE /applications/id", () => {
  it("should delete application and return a 200 response", async () => {
    const res = await request(base_URL)
      .delete(`/applications/${applicationTest.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(
      `Successfully deleted application with id: ${applicationTest.id}`
    );
  });

  it("should return a 400 response and application already deleted", async () => {
    const res = await request(base_URL)
      .delete(`/applications/${applicationTest.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});

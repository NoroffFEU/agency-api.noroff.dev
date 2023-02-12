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

let applicationTestObject = {
  applicant: "0aa86aff-d3d8-4bb5-86d1-d3d1436d93b2",
  listing: "e0c7470b-3074-4742-8754-65477465bd73",
  coverLetter: "I want the frontend developer job",
  company: "0870de8a-07ac-47b8-aa6e-9032363df987",
};

let newCoverLetter = "This is a formal cover letter";

// PUT unit-test
describe("PUT /applications/id", () => {
  describe("given an applicant, a listing, and a company", () => {
    //should check there's a valid token
    //should update cover letter in database

    test("should respond with a status code of 200", async () => {
      const response = await request(base_URL)
        .put("/applications/id")
        .send(applicationTestObject)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content-type header", async () => {
      const response = await request(base_URL)
        .put("/applications/id")
        .send(applicationTestObject);

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("should respond with a 401 status if user isn't authenticated", async () => {
      const response = await request(base_URL)
        .put("/applications/id")
        .send(applicationTestObject);

      expect(response.body.status).toBe(401);
      expect(response.body.message).toBe(
        "User has to be authenticated to make this request"
      );
    });

    test("should respond with a json object containing id, applicantId, companyId, listingId, coverLetter, created, updated, response", async () => {
      const response = await request(base_URL)
        .put("/applications/e8f18f38-c39b-4f59-a44e-d15367e7025e")
        .send({
          applicant: "0aa86aff-d3d8-4bb5-86d1-d3d1436d93b2",
          listing: "e0c7470b-3074-4742-8754-65477465bd73",
          coverLetter: newCoverLetter,
          company: "0870de8a-07ac-47b8-aa6e-9032363df987",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.body.data.id).toBe(
        "e8f18f38-c39b-4f59-a44e-d15367e7025e"
      );
      expect(response.body.data.applicantId).toBe(
        "0aa86aff-d3d8-4bb5-86d1-d3d1436d93b2"
      );
      expect(response.body.data.companyId).toBe(
        "0870de8a-07ac-47b8-aa6e-9032363df987"
      );
      expect(response.body.data.listingId).toBe(
        "e0c7470b-3074-4742-8754-65477465bd73"
      );
      expect(response.body.data.coverLetter).toBe(
        "This is a formal cover letter"
      );
      expect(response.body.data.created).toBeDefined();
      expect(response.body.data.updated).toBeDefined();
      expect(response.body.data.response).toBe(
        "Your Application is updated successfully"
      );
    });
  });

  describe("when not provided with either applicant, listing, or company", () => {
    test("should respond with 409 status code", async () => {
      const data = [
        { applicant: "0aa86aff-d3d8-4bb5-86d1-d3d1436d93b2" },
        { listing: "e0c7470b-3074-4742-8754-65477465bd73" },
        { company: "0870de8a-07ac-47b8-aa6e-9032363df987" },
        {
          applicant: "0aa86aff-d3d8-4bb5-86d1-d3d1436d93b2",
          listing: "e0c7470b-3074-4742-8754-65477465bd73",
        },
        {
          applicant: "0aa86aff-d3d8-4bb5-86d1-d3d1436d93b2",
          company: "0870de8a-07ac-47b8-aa6e-9032363df987",
        },
        {
          listing: "e0c7470b-3074-4742-8754-65477465bd73",
          company: "0870de8a-07ac-47b8-aa6e-9032363df987",
        },
        {},
      ];

      for (const body of data) {
        const response = await request(base_URL)
          .put("/applications/id")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response._body.status).toBe(409);
      }
    });
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

import jwt from "jsonwebtoken";
import request from "supertest";
import * as dotenv from "dotenv";
import { response } from "express";

dotenv.config();

const PORT = process.env.PORT;
const base_URL = `http://localhost:${PORT}`;

const secret = "MySecretKey";

// Create a testUser in your local database and place the following here.
const testUser = {
  id: "e4c0d3d6-c107-4d84-bd0c-8d36f6fd5741",
  email: "applicantTestUser@email.com",
  firstName: "applicantTestUser",
  lastName: "test",
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

let newCoverLetter = "This is a formal cover letter";

let offersCountTest = {
  offers: 0,
};

describe("POST /applications", () => {
  describe("given an applicant, a listing, a company, and a cover letter", () => {
    it("should return a 200 status code and the application", async () => {
      const res = await request(base_URL)
        .post("/applications")
        .send({
          applicant: { connect: { id: testUser.id } },
          // Replace the listing id here with the targeted one.
          listing: { connect: { id: "e7f7851d-1ad1-4b9a-9885-fb467293bcba" } },
          //Replace the company id here with the company's that published the listing
          company: { connect: { id: "e44f1c33-13ed-4432-81ae-156ac0170287" } },
          coverLetter: letter,
        })
        .set("Authorization", `Bearer ${token}`);

      applicationTest = res.body;

      expect(res.status).toBe(200);
      expect(res.body.id).toEqual(applicationTest.id);
      expect(res.body.applicantId).toEqual(testUser.id);
      expect(res.body.companyId).toEqual(applicationTest.companyId);
      expect(res.body.listingId).toEqual(applicationTest.listingId);
      expect(res.body.coverLetter).toEqual(applicationTest.coverLetter);
      expect(res.body.created).toBeDefined();
      expect(res.body.updated).toBeDefined();
    });
  });

  describe("given the same data", () => {
    it("should return a status code of 409 with application already exist on listing message", async () => {
      const res = await request(base_URL)
        .post("/applications")
        .send({
          applicant: { connect: { id: testUser.id } },
          listing: { connect: { id: applicationTest.listingId } },
          company: { connect: { id: applicationTest.companyId } },
          coverLetter: letter,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.status).toBe(409);
      expect(res.body.message).toBe(
        "You've already created an application on this listing"
      );
    });

    describe("when not provided with authorisation token", () => {
      test("should return a 401 status code", async () => {
        const res = await request(base_URL).post("/applications");

        expect(res.status).toBe(401);
      });
    });
  });

  describe("when not provided with either applicant, listing, company, or cover letter", () => {
    test("should respond with 409 status code", async () => {
      const data = [
        { applicant: testUser.id },
        { listing: applicationTest.listingId },
        { company: applicationTest.companyId },
        { coverLetter: letter },
        {
          applicant: testUser.id,
          listing: applicationTest.listingId,
        },
        {
          applicant: testUser.id,
          company: applicationTest.companyId,
        },
        {
          applicant: testUser.id,
          coverLetter: letter,
        },
        {
          listing: applicationTest.listingId,
          company: applicationTest.companyId,
        },
        {
          listing: applicationTest.listingId,
          coverLetter: letter,
        },
        {
          company: applicationTest.companyId,
          coverLetter: letter,
        },
        {
          applicant: testUser.id,
          listing: applicationTest.listingId,
          company: applicationTest.companyId,
        },
        {
          applicant: testUser.id,
          listing: applicationTest.listingId,
          coverLetter: letter,
        },
        {
          applicant: testUser.id,
          company: applicationTest.companyId,
          coverLetter: letter,
        },
        {
          listing: applicationTest.listingId,
          company: applicationTest.companyId,
          coverLetter: letter,
        },
        {},
      ];

      for (const body of data) {
        const response = await request(base_URL)
          .put(`/applications/${applicationTest.id}`)
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response._body.status).toBe(409);
      }
    });
  });
});

describe("GET /applications", () => {
  describe("given an authorisation token", () => {
    it("should return array of applications and 200 response code", async () => {
      const res = await request(base_URL)
        .get(`/applications`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("when authorisation token is missing", () => {
    it("a 401 response code", async () => {
      const res = await request(base_URL).get(`/applications`);

      expect(res.status).toBe(401);
    });
  });
});

describe("GET /applications/id", () => {
  describe("given an application id, and an authorisation token", () => {
    test("should return a 200 response code", async () => {
      const res = await request(base_URL)
        .get(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it("should return a single application", async () => {
      const res = await request(base_URL)
        .get(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.id).toBe(applicationTest.id);
      expect(res.body.applicantId).toBe(applicationTest.applicantId);
      expect(res.body.companyId).toBe(applicationTest.companyId);
      expect(res.body.listingId).toBe(applicationTest.listingId);
      expect(res.body.coverLetter).toBeDefined();
      expect(res.body.created).toBeDefined();
      expect(res.body.updated).toBeDefined();
      expect(res.body._count).toMatchObject(offersCountTest);
    });
  });

  describe("when not provided with authorisation token", () => {
    test("should return a 401 when not providing authentication", async () => {
      const res = await request(base_URL).get(
        `/applications/${applicationTest.id}`
      );

      expect(res.status).toBe(401);
    });
  });
});

// PUT unit-test
describe("PUT /applications/id", () => {
  describe("given an applicant, a listing, and a company", () => {
    test("should respond with a status code of 200", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationTest.id}`)
        .send(applicationTest)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content-type header", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationTest.id}`)
        .send(applicationTest);

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("should respond with a 401 status if user isn't authenticated", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationTest.id}`)
        .send(applicationTest);

      expect(response.body.status).toBe(401);
      expect(response.body.message).toBe(
        "User has to be authenticated to make this request"
      );
    });

    test("should respond with a json object containing id, applicantId, companyId, listingId, coverLetter, created, updated, response", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationTest.id}`)
        .send({
          applicant: applicationTest.applicantId,
          listing: applicationTest.listingId,
          coverLetter: newCoverLetter,
          company: applicationTest.companyId,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.applicantId).toBeDefined();
      expect(response.body.data.companyId).toBeDefined();
      expect(response.body.data.listingId).toBeDefined();
      expect(response.body.data.coverLetter).toBeDefined();
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
        { applicant: applicationTest.applicantId },
        { listing: applicationTest.listingId },
        { company: applicationTest.companyId },
        {
          applicant: applicationTest.applicantId,
          listing: applicationTest.listingId,
        },
        {
          applicant: applicationTest.applicantId,
          company: applicationTest.companyId,
        },
        {
          listing: applicationTest.listingId,
          company: applicationTest.companyId,
        },
        {},
      ];

      for (const body of data) {
        const response = await request(base_URL)
          .put(`/applications/${applicationTest.id}`)
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response._body.status).toBe(409);
      }
    });
  });
});

// DELETE unit-test

describe("DELETE /applications/id", () => {
  describe("when not provided with authorisation token", () => {
    test("should respond with a 401 status code and the message 'Unauthorized'", async () => {
      const response = await request(base_URL).delete(
        `/applications/${applicationTest.id}`
      );

      expect(response.error.status).toBe(401);
      expect(response.error.text).toBe("Unauthorized");
    });
  });

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

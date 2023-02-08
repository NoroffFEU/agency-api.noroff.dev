import jwt from "jsonwebtoken";
import request from "supertest";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const base_URL = `http://localhost:${PORT}`;

const secret = "MySecretKey";

// Create a testUser in your local database and place the following here.
const testUser = {
  id: "1145f0f6-58d2-4972-bf1b-93287b9504bc",
  email: "melisa@email.com",
  firstName: "Melisa",
  lastName: "Doe",
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

let applicationTestObject = {
  applicant: "1145f0f6-58d2-4972-bf1b-93287b9504bc",
  listing: "a2fa9876-9185-46a5-a8d2-f24518fcbf06",
  coverLetter: "I want the frontend developer job",
  company: "e57462d6-8e21-421c-a30a-095f8f97f265",
};

let newCoverLetter = "This is a formal cover letter";

let applicationId = "cfab505e-e7f4-40ce-8acd-64ff5bf29925";

describe("POST /applications", () => {
  it("should return application and return a 200 response", async () => {
    const res = await request(base_URL)
      .post("/applications")
      .send({
        applicant: { connect: { id: testUser.id } },
        // Replace the listing id here with the targeted one.
        listing: { connect: { id: "a2fa9876-9185-46a5-a8d2-f24518fcbf06" } },
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
  //should return a 200 response
  //should return a single application
  //should return a 400 when not providing authentication
  it("should return a single application and 200 response code", async () => {
    const res = await request(base_URL)
      .get(`/applications/${applicationId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.coverLetter).toBe(applicationTestObject.coverLetter);
  });
});

// PUT unit-test
describe("PUT /applications/id", () => {
  describe("given an applicant, a listing, and a company", () => {
    test("should respond with a status code of 200", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationId}`)
        .send(applicationTestObject)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content-type header", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationId}`)
        .send(applicationTestObject);

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("should respond with a 401 status if user isn't authenticated", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationId}`)
        .send(applicationTestObject);

      expect(response.body.status).toBe(401);
      expect(response.body.message).toBe(
        "User has to be authenticated to make this request"
      );
    });

    test("should respond with a json object containing id, applicantId, companyId, listingId, coverLetter, created, updated, response", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationId}`)
        .send({
          applicant: applicationTestObject.applicant,
          listing: applicationTestObject.listing,
          coverLetter: newCoverLetter,
          company: applicationTestObject.company,
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
        { applicant: applicationTestObject.applicant },
        { listing: applicationTestObject.listing },
        { company: applicationTestObject.company },
        {
          applicant: applicationTestObject.applicant,
          listing: applicationTestObject.listing,
        },
        {
          applicant: applicationTestObject.applicant,
          company: applicationTestObject.company,
        },
        {
          listing: applicationTestObject.listing,
          company: applicationTestObject.company,
        },
        {},
      ];

      for (const body of data) {
        const response = await request(base_URL)
          .put(`/applications/${applicationId}`)
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response._body.status).toBe(409);
      }
    });
  });
});

// DELETE unit-test

/* describe("DELETE /applications/id", () => {
  it("should delete application and return a 200 response", async () => {
    const res = await request(base_URL)
      .delete(`/applications/${applicationId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(
      `Successfully deleted application with id: ${applicationId}`
    );
  });

  it("should return a 400 response and application already deleted", async () => {
    const res = await request(base_URL)
      .delete(`/applications/${applicationId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
}); */

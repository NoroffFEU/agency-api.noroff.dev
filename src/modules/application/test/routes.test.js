import jwt from "jsonwebtoken";
import request from "supertest";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const base_URL = `http://localhost:${PORT}`;

const secret = "MySecretKey";

// Create a testUser in your local database and place the following here.
const testUser = {
  id: "2a951181-0fb7-4835-aa93-1a5647cbb947",
  email: "anotherTestUser@email.com",
  firstName: "anotherTestUser",
  lastName: "test",
};

//Create a second test user with the role of 'Client' in your database
/* {
  firstName: "clientTestUser",
  lastName: "test",
  email: "clientTestUser@email.com",
  password: "password",
  role: "Client"
} */

//Use this second user to create a company and replace the id here
const testCompany = "e44f1c33-13ed-4432-81ae-156ac0170287";

// Create a listing f.eks like this using the company's id you've just created
// const testListing = {
//   title: "Test listing",
//   tags: "test, listing, jest",
//   description: "listing test with jest",
//   requirements: "t, e, s, t",
//   deadline: "2025-11-30T20:55:00.000Z",
//   company: "e44f1c33-13ed-4432-81ae-156ac0170287"
// };

//Replace listing's id here
const testListing = "e7f7851d-1ad1-4b9a-9885-fb467293bcba";

const token = jwt.sign(testUser, secret);

const letter = "testing letter";

let applicationTest;

let newCoverLetter = "This is a formal cover letter";

let offersCountTest = {
  offers: 0,
};

describe("POST /applications", () => {
  describe("when not provided with either applicant, listing, company, or cover letter", () => {
    test("should respond with 409 status code", async () => {
      const data = [
        { applicant: testUser.id },
        { listing: testListing },
        { company: testCompany },
        { coverLetter: letter },
        {
          applicant: testUser.id,
          listing: testListing,
        },
        {
          applicant: testUser.id,
          company: testCompany,
        },
        {
          applicant: testUser.id,
          coverLetter: letter,
        },
        {
          listing: testListing,
          company: testCompany,
        },
        {
          listing: testListing,
          coverLetter: letter,
        },
        {
          company: testCompany,
          coverLetter: letter,
        },
        {
          applicant: testUser.id,
          listing: testListing,
          company: testCompany,
        },
        {
          applicant: testUser.id,
          listing: testListing,
          coverLetter: letter,
        },
        {
          applicant: testUser.id,
          company: testCompany,
          coverLetter: letter,
        },
        {
          listing: testListing,
          company: testCompany,
          coverLetter: letter,
        },
        {},
      ];

      for (const body of data) {
        const response = await request(base_URL)
          .post("/applications")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response._body.status).toBe(400);
      }
    });
  });
  describe("given an applicant, a listing, a company, and a cover letter", () => {
    it("should return a 200 status code and the application", async () => {
      const res = await request(base_URL)
        .post("/applications")
        .send({
          applicantId: testUser.id,
          listingId: testListing,
          companyId: testCompany,
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

  describe("when provided with authorisation token", () => {
    it("should delete application and return a 200 response", async () => {
      const res = await request(base_URL)
        .delete(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toEqual(
        `Successfully deleted application with id: ${applicationTest.id}`
      );
    });
  });

  describe("when application isn't found in the database", () => {
    it("should return a 400 response", async () => {
      const res = await request(base_URL)
        .delete(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });
  });
});

import jwt from "jsonwebtoken";
import request from "supertest";
import * as dotenv from "dotenv";
import { databasePrisma } from "../../../prismaClient";

dotenv.config();

const PORT = process.env.PORT;
const base_URL = `http://localhost:${PORT}`;

/*---------------- Test Data -----------------------*/
let testApplicationApplicant1 = {
  email: "testApplicationApplicant1@test.com",
  firstName: "John",
  lastName: "Doe",
  password: "password",
};

let testApplicationApplicant2 = {
  email: "testApplicationApplicant2@test.com",
  firstName: "Jane",
  lastName: "Doe",
  password: "password",
};

let testApplicationClient = {
  email: "testApplicationClient@test.com",
  firstName: "John",
  lastName: "Doe",
  role: "Client",
  password: "password",
};

let testCompany = {
  name: "testApplicationCompany",
  sector: "test",
  phone: "123",
};

let testListing = {
  title: "Test listing",
  tags: "test, listing, jest",
  description: "listing test with jest",
  requirements: "t, e, s, t",
  deadline: "2025-11-30T20:55:00.000Z",
};

let token, secondUsersToken;

const invalidToken = "test-token-1234";

const letter = "testing letter";

let applicationTest;

let newCoverLetter = "This is a formal cover letter";

let offersCountTest = {
  offers: 0,
};

describe("POST /applications", () => {
  beforeAll(async () => {
    const Client = await databasePrisma.user.findUnique({
      where: {
        email: testApplicationClient.email,
      },
    });
    if (!Client) {
      testApplicationClient = await databasePrisma.user.create({
        data: testApplicationClient,
      });
    } else {
      testApplicationClient = Client;
    }

    const company = await databasePrisma.company.findUnique({
      where: {
        name: testCompany.name,
      },
    });
    if (!company) {
      testCompany = await databasePrisma.company.create({
        data: {
          ...testCompany,
          admin: { connect: { id: testApplicationClient.id } },
        },
      });
    } else {
      testCompany = company;
    }

    testListing = await databasePrisma.listing.create({
      data: { ...testListing, company: { connect: { id: testCompany.id } } },
    });

    const applicant1 = await databasePrisma.user.findUnique({
      where: {
        email: testApplicationApplicant1.email,
      },
    });
    if (!applicant1) {
      testApplicationApplicant1 = await databasePrisma.user.create({
        data: testApplicationApplicant1,
      });
    } else {
      testApplicationApplicant1 = applicant1;
    }

    const applicant2 = await databasePrisma.user.findUnique({
      where: {
        email: testApplicationApplicant2.email,
      },
    });
    if (!applicant2) {
      testApplicationApplicant2 = await databasePrisma.user.create({
        data: testApplicationApplicant2,
      });
    } else {
      testApplicationApplicant2 = applicant2;
    }

    secondUsersToken = jwt.sign(
      {
        userId: testApplicationApplicant2.id,
        email: testApplicationApplicant2.email,
      },
      process.env.SECRETSAUCE
    );
    token = jwt.sign(
      {
        userId: testApplicationApplicant1.id,
        email: testApplicationApplicant1.email,
      },
      process.env.SECRETSAUCE
    );
  });

  describe("when not provided with either applicant, listing, company, or cover letter", () => {
    test("should respond with 400 status code", async () => {
      const data = [
        { applicant: testApplicationApplicant1.id },
        { listing: testListing.id },
        { company: testCompany.id },
        { coverLetter: letter },
        {
          applicant: testApplicationApplicant1.id,
          listing: testListing.id,
        },
        {
          applicant: testApplicationApplicant1.id,
          company: testCompany.id,
        },
        {
          applicant: testApplicationApplicant1.id,
          coverLetter: letter,
        },
        {
          listing: testListing.id,
          company: testCompany.id,
        },
        {
          listing: testListing.id,
          coverLetter: letter,
        },
        {
          company: testCompany.id,
          coverLetter: letter,
        },
        {
          applicant: testApplicationApplicant1.id,
          listing: testListing.id,
          company: testCompany.id,
        },
        {
          applicant: testApplicationApplicant1.id,
          listing: testListing.id,
          coverLetter: letter,
        },
        {
          applicant: testApplicationApplicant1.id,
          company: testCompany.id,
          coverLetter: letter,
        },
        {
          listing: testListing.id,
          company: testCompany.id,
          coverLetter: letter,
        },
        {},
      ];

      for (const body of data) {
        const response = await request(base_URL)
          .post("/applications")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
      }
    });
  });

  describe("when given listing doesn't exist", () => {
    test("should respond with a 400 status code and the message 'Listing doesn't exist'", async () => {
      const response = await request(base_URL)
        .post("/applications")
        .send({
          applicantId: testApplicationApplicant1.id,
          listingId: "fake-listing",
          companyId: testCompany,
          coverLetter: letter,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Listing doesn't exist");
    });
  });

  describe("when given company doesn't exist", () => {
    test("should respond with a 400 status code and the message 'Company doesn't exist'", async () => {
      const response = await request(base_URL)
        .post("/applications")
        .send({
          applicantId: testApplicationApplicant1.id,
          listingId: testListing.id,
          companyId: "fake-company",
          coverLetter: letter,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Company doesn't exist");
    });
  });

  describe("when given applicant doesn't exist", () => {
    test("should respond with a 400 status code and the message 'User doesn't exist'", async () => {
      const response = await request(base_URL)
        .post("/applications")
        .send({
          applicantId: "fake-user",
          listingId: testListing.id,
          companyId: testCompany.id,
          coverLetter: letter,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User doesn't exist");
    });
  });

  describe("given an applicant, a listing, a company, and a cover letter", () => {
    it("should return a 201 status code and the application", async () => {
      const res = await request(base_URL)
        .post("/applications")
        .send({
          applicantId: testApplicationApplicant1.id,
          listingId: testListing.id,
          companyId: testCompany.id,
          coverLetter: letter,
        })
        .set("Authorization", `Bearer ${token}`);

      applicationTest = res.body;

      expect(res.status).toBe(201);
      expect(res.body.id).toEqual(applicationTest.id);
      expect(res.body.applicantId).toEqual(testApplicationApplicant1.id);
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
          applicantId: testApplicationApplicant1.id,
          listingId: testListing.id,
          companyId: testCompany.id,
          coverLetter: letter,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(409);
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

      expect(response.body.id).toBeDefined();
      expect(response.body.applicantId).toBeDefined();
      expect(response.body.companyId).toBeDefined();
      expect(response.body.listingId).toBeDefined();
      expect(response.body.coverLetter).toBeDefined();
      expect(response.body.created).toBeDefined();
      expect(response.body.updated).toBeDefined();
      expect(response.body.response).toBe(
        "Your Application is updated successfully"
      );
    });
  });

  describe("when not provided with cover letter", () => {
    test("should respond with 409 status code and the message 'Cover letter is mandatory'", async () => {
      const data = [{}];

      const response = await request(base_URL)
        .put(`/applications/${applicationTest.id}`)
        .send(data)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Cover letter is mandatory");
    });
  });

  describe("when not provided with authorisation token", () => {
    test("should respond with a 401 status code", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationTest.id}`)
        .send(applicationTest);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "User has to be authenticated to make this request"
      );
    });
  });

  describe("when application isn't found in the database", () => {
    test("should respond with a 404 status code and the message 'Application not found'", async () => {
      const response = await request(base_URL).put("/applications/12345");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Application not found");
    });
  });

  describe("when user attempting the update isn't the same user that sent the application", () => {
    test("should respond with a 401 status code and the message 'Unauthorized access: you cannot update or delete another user's application'", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${secondUsersToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Unauthorized access: you cannot update or delete another user's application"
      );
    });
  });

  describe("when the token is invalid", () => {
    test("should respond with a 403 status code and the message 'Invalid token'", async () => {
      const response = await request(base_URL)
        .put(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Invalid token");
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

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "User has to be authenticated to make this request"
      );
    });
  });

  describe("when user attempting the delete isn't the same user that sent the application", () => {
    test("should respond with a 401 status code and the message 'Unauthorized access: you cannot update or delete another user's application'", async () => {
      const response = await request(base_URL)
        .delete(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${secondUsersToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Unauthorized access: you cannot update or delete another user's application"
      );
    });
  });

  describe("when the token is invalid", () => {
    test("should respond with a 403 status code and the message 'Invalid token'", async () => {
      const response = await request(base_URL)
        .delete(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Invalid token");
    });
  });

  describe("when provided with authorisation token", () => {
    it("should delete application and return a 200 response", async () => {
      const res = await request(base_URL)
        .delete(`/applications/${applicationTest.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual("Your Application was successfully deleted");
    });
  });

  describe("when application isn't found in the database", () => {
    it("should return a 404 status code and the message 'Application not found'", async () => {
      const res = await request(base_URL).delete("/applications/12345");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Application not found");
    });
  });
});

import request from "supertest";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { databasePrisma } from "../../prismaClient.js";
import { generateHash } from "../../utilities/password.js";

dotenv.config();

const PORT = process.env.PORT;
const baseURL = `http://localhost:${PORT}`;

let testOffer;
let authToken;
let adminToken;
let testApplication;

describe("Offer Routes", () => {
  beforeAll(async () => {
    authToken = await getValidAuthToken();
    adminToken = await getAdminAuthToken();
    testApplication = await createTestApplication();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("POST /offers", () => {
    test("should create an offer with valid application ID", async () => {
      const response = await request(baseURL)
        .post("/offers")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          applicationId: testApplication.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.applicationId).toBe(testApplication.id);
      expect(response.body.state).toBe("Pending");

      testOffer = response.body;
    });

    test("should return 400 when application ID is missing", async () => {
      const response = await request(baseURL)
        .post("/offers")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Application ID is required");
    });

    test("should return 404 when application doesn't exist", async () => {
      const response = await request(baseURL)
        .post("/offers")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          applicationId: "non-existent-id",
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Application not found");
    });
  });

  describe("GET /offers", () => {
    test("should return array of offers", async () => {
      const response = await request(baseURL).get("/offers");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /offers/:id", () => {
    test("should return specific offer by ID", async () => {
      const response = await request(baseURL).get(`/offers/${testOffer.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testOffer.id);
      expect(response.body).toHaveProperty("application");
      expect(response.body).toHaveProperty("listing");
      expect(response.body).toHaveProperty("company");
    });

    test("should return 404 for non-existent offer", async () => {
      const response = await request(baseURL).get("/offers/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Offer not found");
    });
  });

  describe("PUT /offers/:id", () => {
    test("should update offer state (applicant)", async () => {
      const response = await request(baseURL)
        .put(`/offers/${testOffer.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          state: "Accepted",
        });

      expect(response.status).toBe(200);
      expect(response.body.state).toBe("Accepted");
    });

    test("should return 400 when state is missing", async () => {
      const response = await request(baseURL)
        .put(`/offers/${testOffer.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "State is required in the request body."
      );
    });

    test("should return 401 when not authorized", async () => {
      const response = await request(baseURL)
        .put(`/offers/${testOffer.id}`)
        .send({
          state: "Accepted",
        });

      expect(response.status).toBe(401);
    });
  });
  describe("DELETE /offers/:id", () => {
    test("should delete offer (admin only)", async () => {
      const response = await request(baseURL)
        .delete(`/offers/${testOffer.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Offer deleted successfully");
    });

    test("should return 404 for non-existent offer", async () => {
      const response = await request(baseURL)
        .delete("/offers/non-existent-id")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});

// Helper functions
async function getValidAuthToken() {
  const testUser = {
    email: "testOfferApplicant@test.com",
    firstName: "Test",
    lastName: "User",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let user = await databasePrisma.user.findUnique({
    where: { email: testUser.email },
  });
  if (!user) {
    user = await databasePrisma.user.create({
      data: testUser,
    });
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.SECRETSAUCE
  );
}

async function getAdminAuthToken() {
  const testAdmin = {
    email: "testOfferAdmin@test.com",
    firstName: "Test",
    lastName: "Admin",
    password: await generateHash("password"),
    role: "Admin",
  };

  let admin = await databasePrisma.user.findUnique({
    where: { email: testAdmin.email },
  });

  if (!admin) {
    admin = await databasePrisma.user.create({
      data: testAdmin,
    });
  }

  return jwt.sign(
    {
      userId: admin.id,
      email: admin.email,
    },
    process.env.SECRETSAUCE
  );
}

async function createTestApplication() {
  const testClient = {
    email: "testOfferClient@test.com",
    firstName: "Test",
    lastName: "Client",
    password: await generateHash("password"),
    role: "Client",
  };

  let client = await databasePrisma.user.findUnique({
    where: { email: testClient.email },
  });

  if (!client) {
    client = await databasePrisma.user.create({
      data: testClient,
    });
  }

  const testApplicant = {
    email: "testOfferApplicant@test.com",
    firstName: "Test",
    lastName: "User",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let applicant = await databasePrisma.user.findUnique({
    where: { email: testApplicant.email },
  });
  if (!applicant) {
    applicant = await databasePrisma.user.create({
      data: testApplicant,
    });
  }

  const testCompanyData = {
    name: "Test Offer Company",
    sector: "Technology",
    phone: "123456789",
  };

  let company = await databasePrisma.company.findUnique({
    where: { name: testCompanyData.name },
  });

  if (!company) {
    company = await databasePrisma.company.create({
      data: {
        ...testCompanyData,
        admin: { connect: { id: client.id } },
      },
    });
  }

  const testListingData = {
    title: "Test Job Listing",
    tags: ["test", "job"],
    description: "This is a test job listing for offers",
    requirements: ["Test requirement 1", "Test requirement 2"],
    deadline: new Date("2025-12-31T23:59:59.000Z"),
  };

  const listing = await databasePrisma.listing.create({
    data: {
      ...testListingData,
      company: { connect: { id: company.id } },
    },
  });

  const application = await databasePrisma.application.create({
    data: {
      applicant: { connect: { id: applicant.id } },
      company: { connect: { id: company.id } },
      listing: { connect: { id: listing.id } },
      coverLetter: "This is a test cover letter for the offer test",
    },
  });

  return application;
}

async function cleanupTestData() {
  try {
    await databasePrisma.offer.deleteMany({
      where: {
        application: {
          applicant: {
            email: {
              in: ["testOfferApplicant@test.com", "testOfferClient@test.com"],
            },
          },
        },
      },
    });

    await databasePrisma.application.deleteMany({
      where: {
        applicant: {
          email: {
            in: ["testOfferApplicant@test.com", "testOfferClient@test.com"],
          },
        },
      },
    });

    await databasePrisma.listing.deleteMany({
      where: {
        company: {
          name: "Test Offer Company",
        },
      },
    });

    await databasePrisma.company.deleteMany({
      where: {
        name: "Test Offer Company",
      },
    });

    await databasePrisma.user.deleteMany({
      where: {
        email: {
          in: [
            "testOfferApplicant@test.com",
            "testOfferClient@test.com",
            "testOfferAdmin@test.com",
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  }
}

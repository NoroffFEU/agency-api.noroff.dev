import request from "supertest";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config();

const PORT = process.env.PORT;
const baseURL = `http://localhost:${PORT}`;

const Offer = {
  id: 1,
  listingId: 2,
  listing: "looking for a job",
  user: "Name1",
  userId: 33,
  state: "Admin",
};

// Create Offer code test

describe("createOffer", () => {
  test("creates an offer", async () => {
    const listingId = "listing1";
    const applicationId = "application1";
    const userId = "user1";
    const applicantId = "applicant1";
    const userRole = "landlord";
    const offerState = "pending";

    const response = await request(baseURL).post("/offer").send({
      listingId,
      applicationId,
      userId,
      applicantId,
      userRole,
      offerState,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      listingId,
      applicationId,
      userId,
      applicantId,
      userRole,
      offerState,
    });
  });
});

// Get offers/offer (by id) code test

describe("GET /offer", () => {
  it("should return a array of offer and a 200 response", async () => {
    const response = await request(baseURL).get("/offer");
    expect(response.body[0].id).toEqual(Offer.id);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /offer/:id", () => {
  it("should return a offer object and a 200 response", async () => {
    const id = Offer.id;
    const response = await request(baseURL).get(`/offer/${id}`);
    expect(response.body.id).toEqual(Offer.id);
    expect(response.statusCode).toBe(200);
  });
});

// Delete offer (by id) code test

describe("DELETE /offer/:id", () => {
  it("should delete an offer", async () => {
    await request(baseURL)
      .delete(`/offer/${Offer.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.offer).toEqual(null);
      });
  });

  it("should return error if invalid id is provided", async () => {
    await request(baseURL)
      .delete("/offer/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toEqual("Offer not found");
      });
  });
});

// Update offer (by id) code test

describe("PUT /offer/:id", () => {
  it("should update an offer", async () => {
    const updatedOffer = {
      listingId: 2,
      applicationId: 3,
      companyId: 4,
      userId: 33,
      applicantId: 55,
      state: "Accepted",
      updated: true,
    };

    const res = await request(baseURL)
      .put(`/offer/1`)
      .send(updatedOffer)
      .expect(200);

    expect(res.body.offer).toEqual(updatedOffer);
  });

  it("should return error if invalid id is provided", async () => {
    const res = await request(baseURL).put("/offer/invalid_id").expect(400);
    expect(res.body.error).toEqual("Offer not found");
  });

  it("should return error if offer state is not pending", async () => {
    const res = await request(baseURL)
      .put("/offer/1")
      .send({ state: "Accepted" })
      .expect(400);
    expect(res.body.error).toEqual("Offer state is not pending");
  });
});

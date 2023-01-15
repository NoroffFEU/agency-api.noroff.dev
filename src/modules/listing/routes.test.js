import request from "supertest";

const baseURL = "http://localhost:8080";

let listing;

const listingData = {
  title: "Test",
  tags: ["test"],
  description: "Test",
  requirements: ["test"],
  deadline: new Date(),
};

describe("POST /listings", () => {
  it("should create a new listing", async () => {
    const response = await request(baseURL).post("/listings").send(listingData);
    expect(response.status).toBe(201);
    expect(response.title).toBe(listingData.title);
  });
});

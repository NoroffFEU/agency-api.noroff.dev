import request from "supertest";
import server from "../../app";

const baseURL = "/listings";

let listing;

const testListings = {
  id: "1640e7e8-c192-434b-a520-43498617eef1",
  title: "Test Listing",
  tags: ["test", "listing"],
  description: "This is a test listing",
  requirements: ["test", "listing"],
  deadline: "2024-11-30T20:57:00.000Z",
  authorId: "9b454993-7e9b-4322-bd56-922897099cca",
};

describe("POST /listings", () => {
  it("should return 201 and the listing", async () => {
    const response = await request(server).post(baseURL).send(testListings);
    listing = response.body;
    expect(response.status).toBe(201);
    expect(response.body.title).toEqual(testListings.title);
  });
});

describe("GET /listings", () => {
  it("should return 200 and an array of listings", async () => {
    const response = await request(server).get(baseURL);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });
});

describe("GET /listings/:id", () => {
  it("should return 200 and a listing", async () => {
    const id = listing.id;
    const response = await request(server).get(`${baseURL}/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toEqual(testListings.title);
  });

  it("should return 404 and a message", async () => {
    const id = "123";
    const response = await request(server).get(`${baseURL}/${id}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Listing with id: " + id + " doesn't exist.");
  });
});

describe("PUT /listings/:id", () => {
  it("should return 200 and a message", async () => {
    const id = listing.id;
    const response = await request(server)
      .put(`${baseURL}/${id}`)
      .send({ title: "Updated Test Listing" });
    expect(response.status).toBe(200);
  });

  // it("should return 400 and a message", async () => {
  //   const id = listing.id;
  //   const response = await request(server)
  //     .put(`${baseURL}/${id}`)
  //     .send({ deadline: "2020-11-30T20:57:09.586Z" });
  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toEqual("deadline must be a future date");
  // });
});

describe("DELETE /listings/:id", () => {
  it("should return 200 and a message", async () => {
    const id = listing.id;
    const response = await request(server).delete(`${baseURL}/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Listing with id: " + id + " was deleted.");
  });
});

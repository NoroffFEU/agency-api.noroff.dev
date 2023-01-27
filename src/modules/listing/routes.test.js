import request from "supertest";
import server from "../../app";

const baseURL = "/listings";

let listingTest;

const testListings = {
  title: "Test Listing",
  tags: ["test", "listing"],
  description: "This is a test listing 1",
  requirements: ["test", "listing"],
  deadline: "2024-11-30T20:57:00.000Z",
  authorId: "9b454993-7e9b-4322-bd56-922897099cca",
};

describe("POST /listings", () => {
  it("should return 201 and the listing", async () => {
    const response = await request(server).post(baseURL).send(testListings);
    listingTest = response.body;
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
    const id = listingTest.id;
    const response = await request(server).get(`${baseURL}/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toEqual(testListings.title);
  });

  it("should return 404 and a message", async () => {
    const id = "123";
    const response = await request(server).get(`${baseURL}/${id}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "Listing with id " + id + " doesn't exist."
    );
  });
});

describe("PUT /listings/:id", () => {
  it("should return 200 and a successful updated message", async () => {
    const id = listingTest.id;
    const data = {
      title: "Test Listing 2",
      description: "This is a test listing 2",
      deadline: "2024-11-30T20:57:00.000Z",
    };
    const response = await request(server).put(`${baseURL}/${id}`).send(data);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Listing updated successfully");
  });
});

describe("DELETE /listings/:id", () => {
  it("should return 200 and a successful delete message", async () => {
    const id = listingTest.id;
    console.log(id);
    const response = await request(server).delete(`${baseURL}/${id}`);
    console.log(response.body);
    expect(response.status).toBe(200);
  });
});

describe("PUT /listings/:id deadline", () => {
  it("should return 400 and an error message on deadline", async () => {
    const id = listingTest.id;
    const data = {
      deadline: "2020-11-30T20:57:00.000Z",
    };
    const response = await request(server).put(`${baseURL}/${id}`).send(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("deadline must be a future date");
  });
});

import request from "supertest";

const baseURL = "http://localhost:3000"

let user;

const testUser = {
    "firstName": "John",
    "lastName": "Doe",
    "email": "something@somth.com",
    "password": "password"
}

describe("POST /users", () => {
    it("should create a new user and return 201 response", async () => {
        const response = await request(baseURL).post("/users").send(testUser);
        user = response.body;
        expect(response.body.email).toEqual(testUser.email);
        expect(response.statusCode).toBe(201);
    })
})

describe("GET /users", () => {
    it("should return a array og users and a 200 response", async () => {
        const response = await request(baseURL).get("/users");
        expect(response.body[0].name).toEqual(testUser.name);
        expect(response.statusCode).toBe(200);
    })
})

describe("GET /users/:id", () => {
    it("should return a user object and a 200 response", async () => {
        const { id } = user;
        const response = await request(baseURL).get(`/users/${id}`);
        expect(response.body.name).toEqual(testUser.name);
        expect(response.statusCode).toBe(200);
    })
})

describe("PUT /users/:id", () => {
    it("should return a updated user object and a 200 response", async () => {
        const { id } = user;
        const data = { firstName: "Lesslie" }
        const response = await request(baseURL).put(`/users/${id}`).send(data);
        expect(response.body.firstName).toEqual(data.firstName);
        expect(response.statusCode).toBe(200);
    })
})

describe("DELETE /users/:id", () => {
    it("should return 200", async () => {
        const { id } = user;
        const response = await request(baseURL).delete(`/users/${id}`);
        expect(response.statusCode).toBe(200);
    })
})



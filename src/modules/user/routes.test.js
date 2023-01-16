import request from "supertest";
import { verifyPassword } from "../../utilities/password";

const baseURL = "http://localhost:3000"

const testUser = {
    "firstName": "John",
    "lastName": "Doe",
    "email": "something@email.com",
    "password": "strongPassword"
}

let createdUser;
let loggedInUser;


describe("POST /users", () => {
    it("should create and return new user object and a 201 response", async () => {
        const response = await request(baseURL).post("/users").send(testUser);
        createdUser = response.body;
        expect(response.body.email).toEqual(testUser.email);
        expect(response.body.lastName).toEqual(testUser.lastName);
        expect(response.statusCode).toBe(201);
    })
})

describe("POST /users(login", () => {
    it("should return an object with user details and a 200 response when successfully logged in", async () => {
        const response = await request(baseURL).post("/users/login").send({ "email": testUser.email, "password": testUser.password });
        loggedInUser = response.body;
        expect(response.body.email).toEqual(loggedInUser.email);
        expect(response.body.lastName).toEqual(loggedInUser.lastName);
        expect(response.statusCode).toBe(200);
    })

    it("should not return user details if incorrect password is provided, and also return a 403 response", async () => {
        const response = await request(baseURL).post("/users/login").send({ "email": testUser.email, "password": "badPassword" });
        expect(response.body.email).toEqual(undefined)
        expect(response.body.lastName).toEqual(undefined)
        expect(response.body.message).toEqual("Invalid email or password.");
        expect(response.statusCode).toBe(403);
    })
})

describe("GET /users", () => {
    it("should return a array of users and a 200 response", async () => {
        const response = await request(baseURL).get("/users");
        expect(response.body[0].name).toEqual(testUser.name);
        expect(response.statusCode).toBe(200);
    })
})

describe("GET /users/:id", () => {
    it("should return a user object and a 200 response", async () => {
        const { id } = createdUser;
        const response = await request(baseURL).get(`/users/${id}`);
        expect(response.body.name).toEqual(testUser.name);
        expect(response.statusCode).toBe(200);
    })
})

describe("PUT /users/:id", () => {
    it("should return a updated user object and a 200 response", async () => {
        const { id } = createdUser;
        const data = { firstName: "Lesslie", password: "newPassword", currentpassword: "strongPassword" }
        const response = await request(baseURL).put(`/users/${id}`).set('Authorization', `Bearer ${loggedInUser.token}`).send(data);
        expect(response.body.firstName).toEqual(data.firstName);
        expect(response.statusCode).toBe(200);
    })
})

describe("DELETE /users/:id", () => {
    it("should return 200", async () => {
        const { id } = createdUser;
        const response = await request(baseURL).delete(`/users/${id}`);
        expect(response.statusCode).toBe(200);
    })
})
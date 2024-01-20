import request from "supertest";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { databasePrisma } from "../../prismaClient.js";
import { signToken } from "../../utilities/jsonWebToken.js";
import { generateHash } from "../../utilities/password.js";

dotenv.config();

const PORT = process.env.PORT;
const baseURL = `http://localhost:${PORT}`;

const testUser = {
  firstName: "John",
  lastName: "Doe",
  email: "something@email.com",
  password: "strongPassword",
};

const testUser2 = {
  firstName: "Jane",
  lastName: "Doe",
  email: "someotheremail@email.com",
  password: "strongPassword",
};

let firstUser;
let signedToken1;
let signedToken2;
let secondUser;

describe("POST /users", () => {
  beforeAll(async () => {
    const firstUser = await databasePrisma.user.findUnique({
      where: {
        email: testUser.email,
      },
    });
    if (firstUser) {
      await databasePrisma.user.delete({
        where: {
          email: testUser.email,
        },
      });
    }
  });

  it("should return 400 response with bad image", async () => {
    const response = await request(baseURL)
      .post("/users")
      .send({ ...testUser, avatar: "not a url" });
    expect(response.body.message).toEqual("Bad image URL");
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 response with bad email", async () => {
    const response = await request(baseURL)
      .post("/users")
      .send({ ...testUser, email: "not an email" });
    expect(response.body.message).toEqual("Invalid value in email field(s)");
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 response with short password", async () => {
    const response = await request(baseURL)
      .post("/users")
      .send({ ...testUser, password: "sho" });
    // expect(response.body.message).toEqual("Bad image URL");
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 response with no first name", async () => {
    const response = await request(baseURL).post("/users").send({
      email: testUser.email,
      lastName: testUser.lastName,
      password: testUser.password,
    });
    expect(response.body.message).toEqual(
      "Invalid value in firstName field(s)"
    );
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 response with no last name", async () => {
    const response = await request(baseURL).post("/users").send({
      email: testUser.email,
      firstName: testUser.firstName,
      password: testUser.password,
    });
    expect(response.body.message).toEqual("Invalid value in lastName field(s)");
    expect(response.statusCode).toBe(400);
  });

  it("should create and return new user object and a 201 response", async () => {
    const response = await request(baseURL).post("/users").send(testUser);
    firstUser = response.body;
    expect(response.body.email).toEqual(testUser.email);
    expect(response.body.lastName).toEqual(testUser.lastName);
    expect(response.statusCode).toBe(201);
  });

  it("should create and return 409 response when using same email", async () => {
    const response = await request(baseURL).post("/users").send(testUser);
    expect(response.body.message).toEqual("User already exists");
    expect(response.statusCode).toBe(409);
  });
});

describe("POST /users/login", () => {
  beforeAll(async () => {
    const firstUser = await databasePrisma.user.findUnique({
      where: {
        email: testUser.email,
      },
    });
    if (!firstUser) {
      await databasePrisma.user.create({
        data: { ...testUser, password: generateHash(testUser.password) },
      });
    }
  });

  it("should return an object with user details and a 200 response when successfully logged in", async () => {
    const response = await request(baseURL)
      .post("/users/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(response.body.email).toEqual(testUser.email);
    expect(response.body.lastName).toEqual(testUser.lastName);
    expect(response.statusCode).toBe(200);
  });

  it("should not return user details if incorrect password is provided, and also return a 403 response", async () => {
    const response = await request(baseURL)
      .post("/users/login")
      .send({ email: testUser.email, password: "badPassword" });
    expect(response.body.email).toEqual(undefined);
    expect(response.body.lastName).toEqual(undefined);
    expect(response.body.message).toEqual("Invalid email or password.");
    expect(response.statusCode).toBe(403);
  });

  it("should not return user details if incorrect email is provided, and also return a 403 response", async () => {
    const response = await request(baseURL).post("/users/login").send({
      email: "badtesting313212@something.com",
      password: "badPassword",
    });
    expect(response.body.email).toEqual(undefined);
    expect(response.body.lastName).toEqual(undefined);
    expect(response.body.message).toEqual("Invalid email or password.");
    expect(response.statusCode).toBe(403);
  });
});

describe("GET /users", () => {
  it("should return a array of users and a 200 response", async () => {
    const response = await request(baseURL).get("/users");
    expect(response.body[0].name).toEqual(testUser.name);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /users/:id", () => {
  beforeAll(async () => {
    secondUser = await databasePrisma.user.findUnique({
      where: {
        email: testUser2.email,
      },
    });
    if (!secondUser) {
      secondUser = await databasePrisma.user.create({
        data: {
          ...testUser2,
          password: await generateHash(testUser2.password),
        },
      });
    }
    signedToken2 = signToken(secondUser);
  });

  it("should return a user object and a 200 response", async () => {
    const { id } = secondUser;

    const response = await request(baseURL).get(`/users/${id}`);
    expect(response.body.name).toEqual(testUser2.name);
    expect(response.body.password).toEqual(undefined);
    expect(response.body.offers).toEqual(undefined);
    expect(response.body.applications).toEqual(undefined);
    expect(response.statusCode).toBe(200);
  });

  it("With auth on own user id should return offers and applications", async () => {
    const { id } = secondUser;
    const response = await request(baseURL)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${signedToken2}`);
    expect(response.body.name).toEqual(testUser2.name);
    expect(response.body.password).toEqual(undefined);
    expect(response.body.offers).toEqual(expect.any(Array));
    expect(response.body.applications).toEqual(expect.any(Array));
    expect(response.statusCode).toBe(200);
  });
});

describe("PUT /users/:id", () => {
  beforeAll(async () => {
    secondUser = await databasePrisma.user.findUnique({
      where: {
        email: testUser2.email,
      },
    });

    if (!secondUser) {
      secondUser = await databasePrisma.user.create({
        data: {
          ...testUser2,
          password: await generateHash(testUser2.password),
        },
      });
    } else {
      await databasePrisma.user.update({
        where: { email: testUser2.email },
        data: {
          firstName: testUser2.firstName,
          lastName: testUser2.lastName,
          password: await generateHash("strongPassword"),
        },
      });
    }

    signedToken2 = signToken(secondUser);
  });
  it("should return 401 response, with wrong password", async () => {
    const { id } = secondUser;
    const data = {
      password: "newPassword",
      currentpassword: "strongPass",
    };
    const response = await request(baseURL)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${signedToken2}`)
      .send(data);
    expect(response.body.message).toEqual("Incorrect Password.");
    expect(response.statusCode).toBe(401);
  });

  it("should return 400 response, with short new password", async () => {
    const { id } = secondUser;
    const data = {
      password: "new",
      currentpassword: "strongPassword",
    };
    const response = await request(baseURL)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${signedToken2}`)
      .send(data);
    expect(response.body.message).toEqual(
      "Password does not meet required parameters length: min 5, max 20."
    );
    expect(response.statusCode).toBe(400);
  });

  it("should return a updated user object and a 200 response", async () => {
    const { id } = secondUser;
    const data = {
      title: "Queen",
      firstName: "Leslie",
      lastName: "Lie",
      about: "It's about me.",
      skills: "html,css",
      password: "newPassword",
      currentpassword: "strongPassword",
    };

    const response = await request(baseURL)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${signedToken2}`)
      .send(data);
    expect(response.body.title).toEqual("Queen");
    expect(response.body.firstName).toEqual("Leslie");
    expect(response.body.lastName).toEqual("Lie");
    expect(response.body.about).toEqual("It's about me.");
    expect(response.body.skills).toEqual(["html", "css"]);
    expect(response.statusCode).toBe(200);
  });
});

describe("DELETE /users/:id", () => {
  beforeAll(async () => {
    secondUser = await databasePrisma.user.findUnique({
      where: {
        email: testUser2.email,
      },
    });
    if (!secondUser) {
      secondUser = await databasePrisma.user.create({
        data: {
          ...testUser2,
          password: await generateHash(testUser2.password),
        },
      });
    }

    firstUser = await databasePrisma.user.findUnique({
      where: {
        email: testUser.email,
      },
    });
    if (!firstUser) {
      await databasePrisma.user.create({
        data: testUser,
      });
    }

    signedToken2 = signToken(secondUser);
    signedToken1 = signToken(firstUser);
  });

  it("should return a status 401 when not provided with a token", async () => {
    const { id } = firstUser;
    const response = await request(baseURL).delete(`/users/${id}`);
    expect(response.body.message).toEqual("No authorization header provided.");
    expect(response.statusCode).toEqual(401);
  });

  it("should return a status 401 when provided with an other users token", async () => {
    const { id } = firstUser;
    const response = await request(baseURL)
      .delete(`/users/${id}`)
      .set("Authorization", `Bearer ${signedToken2}`);
    expect(response.body.message).toEqual(
      "You can not edit another users profile."
    );
    expect(response.statusCode).toEqual(401);
  });

  it("should return status 200", async () => {
    const { id } = firstUser;
    const response = await request(baseURL)
      .delete(`/users/${id}`)
      .set("Authorization", `Bearer ${signedToken1}`);
    expect(response.body.message).toEqual("User successfully deleted.");
    expect(response.statusCode).toBe(200);
  });
});

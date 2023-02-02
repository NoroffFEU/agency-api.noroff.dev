import { generateHash } from "./utilities/password.js";
import { databasePrisma } from "./prismaClient.js";

// Just filling test data
export const createTestDatabase = async function () {
  let testUserAdmin = {
    email: "testAdmin@test.com",
    firstName: "Admin",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Admin",
  };

  let testUserApplicant1 = {
    email: "testApplicant1@test.com",
    firstName: "Applicant1",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let testUserApplicant2 = {
    email: "testApplicant2@test.com",
    firstName: "Applicant2",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let testUserClient1 = {
    email: "testClient1@test.com",
    firstName: "Client1",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testUserClient2 = {
    email: "testClient2@test.com",
    firstName: "Client2",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testUserClient3 = {
    email: "testClient3@test.com",
    firstName: "Client3",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  const getUser = async function (user) {
    const exists = await databasePrisma.user.findUnique({
      where: {
        email: user.email,
      },
      include: { company: true },
    });
    if (!exists) {
      user = await databasePrisma.user.create({ data: user });
    } else {
      user = exists;
    }
    return user;
  };

  testUserAdmin = await getUser(testUserAdmin);
  testUserApplicant1 = await getUser(testUserApplicant1);
  testUserApplicant2 = await getUser(testUserApplicant2);
  testUserClient1 = await getUser(testUserClient1);
  testUserClient2 = await getUser(testUserClient2);
  testUserClient3 = await getUser(testUserClient3);

  // await databasePrisma.user.delete({
  //   where: {
  //     id: testUserAdmin.id,
  //   },
  // });
  // await databasePrisma.user.delete({
  //   where: {
  //     id: testUserApplicant1.id,
  //   },
  // });
  // await databasePrisma.user.delete({
  //   where: {
  //     id: testUserApplicant2.id,
  //   },
  // });
  // await databasePrisma.user.delete({
  //   where: {
  //     id: testUserClient1.id,
  //   },
  // });
  // await databasePrisma.user.delete({
  //   where: {
  //     id: testUserClient2.id,
  //   },
  // });

  const testCompany = {
    name: "CompanyClient1",
    sector: "tester",
    phone: "tester",
    logo: "tester",
  };

  let testCompanyClient1 = testUserClient1.companyId;
  if (!testCompanyClient1) {
    testCompanyClient1 = await databasePrisma.company.create({
      data: { ...testCompany, admin: { connect: { id: testUserClient1.id } } },
    });
  }

  const testCompany3 = {
    name: "CompanyClient1",
    sector: "tester",
    phone: "tester",
    logo: "tester",
  };
  let testCompanyClient3 = testUserClient3.companyId;
  if (!testCompanyClient3) {
    testCompanyClient1 = await databasePrisma.company.create({
      data: { ...testCompany3, admin: { connect: { id: testUserClient3.id } } },
    });
  }

  //return { testUserAdmin, testUserApplicant1, testUserApplicant2, testUserClient1, testUserClient2 };
};

await createTestDatabase();

//export const { testUserAdmin, testUserApplicant1, testUserApplicant2, testUserClient1, testUserClient2, testCompanyClient1 } = await createTestDatabase();

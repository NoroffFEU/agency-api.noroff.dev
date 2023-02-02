import { generateHash } from "../../utilities/password.js";
import { databasePrisma } from "../../prismaClient.js";

// Just filling test data
export const createTestDatabase = async function () {
  let testAdmin = {
    email: "testAdmin@test.com",
    firstName: "Admin",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Admin",
  };

  let testApplicant1 = {
    email: "testApplicant1@test.com",
    firstName: "Applicant1",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let testApplicant2 = {
    email: "testApplicant2@test.com",
    firstName: "Applicant2",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let testClient1 = {
    email: "testClient1@test.com",
    firstName: "Client1",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testClient2 = {
    email: "testClient2@test.com",
    firstName: "Client2",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testClient3 = {
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

  testAdmin = await getUser(testAdmin);
  testApplicant1 = await getUser(testApplicant1);
  testApplicant2 = await getUser(testApplicant2);
  testClient1 = await getUser(testClient1);
  testClient2 = await getUser(testClient2);
  testClient3 = await getUser(testClient3);

  // await databasePrisma.user.delete({
  //   where: {
  //     id: testAdmin.id,
  //   },
  // });
  // await databasePrisma.user.delete({
  //   where: {
  //     id: testApplicant1.id,
  //   },
  // });
  // await databasePrisma.user.delete({
  //   where: {
  //     id: testApplicant2.id,
  //   },
  // });
  // await databasePrisma.user.delete({
  //   where: {
  //     id: testClient1.id,
  //   },
  // });
  // await databasePrisma.user.delete({
  //   where: {
  //     id: testClient2.id,
  //   },
  // });

  const testCompany = {
    name: "CompanyClient1",
    sector: "tester",
    phone: "tester",
    logo: "tester",
  };

  let testCompanyClient1 = testClient1.companyId;
  if (!testCompanyClient1) {
    testCompanyClient1 = await databasePrisma.company.create({
      data: { ...testCompany, admin: { connect: { id: testClient1.id } } },
    });
  }

  const testCompany3 = {
    name: "CompanyClient1",
    sector: "tester",
    phone: "tester",
    logo: "tester",
  };
  let testCompanyClient3 = testClient3.companyId;
  if (!testCompanyClient3) {
    testCompanyClient1 = await databasePrisma.company.create({
      data: { ...testCompany3, admin: { connect: { id: testClient3.id } } },
    });
  }

  testClient1 = await getUser(testClient1);
  testClient3 = await getUser(testClient3);
  console.log(
    testAdmin,
    testApplicant1,
    testApplicant2,
    testClient1,
    testClient2,
    testClient3
  );

  return {
    testAdmin,
    testApplicant1,
    testApplicant2,
    testClient1,
    testClient2,
    testClient3,
  };
};

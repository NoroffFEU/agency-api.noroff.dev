import { generateHash } from "../../utilities/password.js";
import { databasePrisma } from "../../prismaClient.js";

// Just filling test data
export const createTestDatabase = async function () {
  let testCompanyAdmin = {
    email: "testCompanyAdmin@test.com",
    firstName: "Admin",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Admin",
  };

  let testCompanyApplicant1 = {
    email: "testCompanyApplicant1@test.com",
    firstName: "Applicant1",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let testCompanyClient1 = {
    email: "testCompanyClient1@test.com",
    firstName: "Client1",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testCompanyClient2 = {
    email: "testCompanyClient2@test.com",
    firstName: "Client2",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testCompanyClient3 = {
    email: "testCompanyClient3@test.com",
    firstName: "Client3",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testCompanyClient4 = {
    email: "testCompanyClient4@test.com",
    firstName: "Client4",
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

  // const deleteUsers = async function (user) {
  //   const exists = await databasePrisma.user.findUnique({
  //     where: {
  //       email: user,
  //     },
  //   });
  //   if (exists) {
  //     await databasePrisma.user.delete({ where: { email: user } });
  //   }
  // };

  // const deleteCompany = async function (company) {
  //   const exists = await databasePrisma.company.findUnique({
  //     where: {
  //       name: company,
  //     },
  //   });
  //   if (exists) {
  //     await databasePrisma.company.delete({ where: { name: company } });
  //   }
  // };

  // const companies = ["CompanyClientTest1", "CompanyClientTest2", "CompanyClientTest3"];
  // companies.forEach((company) => deleteCompany(company));

  // const users = [("testCompanyApplicant1@test.com", "testCompanyClient1@test.com", "testCompanyClient2@test.com", "testCompanyClient3@test.com", "testCompanyClient4@test.com")];
  // users.forEach((user) => deleteUsers(user));

  testCompanyAdmin = await getUser(testCompanyAdmin);
  testCompanyApplicant1 = await getUser(testCompanyApplicant1);
  testCompanyClient1 = await getUser(testCompanyClient1);
  testCompanyClient2 = await getUser(testCompanyClient2);
  testCompanyClient3 = await getUser(testCompanyClient3);
  testCompanyClient4 = await getUser(testCompanyClient4);

  if (testCompanyClient4.companyId) {
    await databasePrisma.company.update({
      where: { id: testCompanyClient4.companyId },
      data: {
        admin: { disconnect: { id: testCompanyClient4.id } },
      },
    });
    testCompanyClient1.companyId = null;
  }

  const testCompany3 = {
    name: "CompanyClientTest3",
    sector: "tester",
    phone: "tester",
    logo: "tester",
  };

  let testClient3Company = testCompanyClient3.companyId;
  if (!testClient3Company) {
    testClient3Company = await databasePrisma.company.create({
      data: {
        ...testCompany3,
        admin: { connect: { id: testCompanyClient3.id } },
      },
    });
  }

  //cleans up the created company
  if (testCompanyClient1.companyId) {
    await databasePrisma.company.delete({
      where: { id: testCompanyClient1.companyId },
    });
    testCompanyClient1.companyId = null;
  }

  testCompanyClient3 = await getUser(testCompanyClient3);
  //fix after update test
  await databasePrisma.company.update({
    where: { id: testCompanyClient3.companyId },
    data: { name: testCompany3.name },
  });

  return {
    testCompanyAdmin,
    testCompanyApplicant1,
    testCompanyClient1,
    testCompanyClient2,
    testCompanyClient3,
    testCompanyClient4,
  };
};

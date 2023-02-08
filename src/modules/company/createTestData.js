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

  testCompanyAdmin = await getUser(testCompanyAdmin);
  testCompanyApplicant1 = await getUser(testCompanyApplicant1);
  testCompanyClient1 = await getUser(testCompanyClient1);
  testCompanyClient2 = await getUser(testCompanyClient2);
  testCompanyClient3 = await getUser(testCompanyClient3);

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

  testCompanyClient3 = await getUser(testCompanyClient3);

  return {
    testCompanyAdmin,
    testCompanyApplicant1,
    testCompanyClient1,
    testCompanyClient2,
    testCompanyClient3,
  };
};
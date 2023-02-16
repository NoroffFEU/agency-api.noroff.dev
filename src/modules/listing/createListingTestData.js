import { generateHash } from "../../utilities/password.js";
import { databasePrisma } from "../../prismaClient.js";

// Just filling testListings data
export const createListingsTestDatabase = async function () {
  let testListingsAdmin = {
    email: "testListingsAdmin@testListings.com",
    firstName: "Admin",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Admin",
  };

  let testListingsApplicant1 = {
    email: "testListingsApplicant1@testListings.com",
    firstName: "Applicant1",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let testListingsApplicant2 = {
    email: "testListingsApplicant2@testListings.com",
    firstName: "Applicant2",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Applicant",
  };

  let testListingsClient1 = {
    email: "testListingsClient1@testListings.com",
    firstName: "Client1",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testListingsClient2 = {
    email: "testListingsClient2@testListings.com",
    firstName: "Client2",
    lastName: "Doe",
    password: await generateHash("password"),
    role: "Client",
  };

  let testListingsClient3 = {
    email: "testListingsClient3@testListings.com",
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

  testListingsAdmin = await getUser(testListingsAdmin);
  testListingsApplicant1 = await getUser(testListingsApplicant1);
  testListingsApplicant2 = await getUser(testListingsApplicant2);
  testListingsClient1 = await getUser(testListingsClient1);
  testListingsClient2 = await getUser(testListingsClient2);
  testListingsClient3 = await getUser(testListingsClient3);

  const testListingsCompany = {
    name: "CompanyListingsTestClient1",
    sector: "testListing",
    phone: "testListing",
    logo: "testListings",
  };

  let testListingsCompanyClient1 = testListingsClient1.companyId;
  if (!testListingsCompanyClient1) {
    testListingsCompanyClient1 = await databasePrisma.company.create({
      data: {
        ...testListingsCompany,
        admin: { connect: { id: testListingsClient1.id } },
      },
    });
  }

  const testListingsCompany3 = {
    name: "CompanyListingsTestClient3",
    sector: "testListings",
    phone: "testListings",
    logo: "testListings",
  };

  let testListingsCompanyClient3 = testListingsClient3.companyId;
  if (!testListingsCompanyClient3) {
    testListingsCompanyClient1 = await databasePrisma.company.create({
      data: {
        ...testListingsCompany3,
        admin: { connect: { id: testListingsClient3.id } },
      },
    });
  }

  testListingsClient1 = await getUser(testListingsClient1);
  testListingsClient3 = await getUser(testListingsClient3);

  // databasePrisma.listing.deleteMany({});
  // databasePrisma.company.deleteMany({});
  // databasePrisma.user.deleteMany({});

  return {
    testListingsAdmin,
    testListingsApplicant1,
    testListingsApplicant2,
    testListingsClient1,
    testListingsClient2,
    testListingsClient3,
  };
};

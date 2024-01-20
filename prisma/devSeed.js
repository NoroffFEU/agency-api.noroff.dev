import { PrismaClient } from "@prisma/client";
import { generateHash } from "../src/utilities/password";

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.delete({
  //   where: {
  //     email: "JohnCool@Client.com",
  //   },
  // });

  // await prisma.user.delete({
  //   where: {
  //     email: "EggsBenedict@Applicant.com",
  //   },
  // });

  const password = await generateHash(password);

  // Your data seeding logic goes here
  const clientUser = await prisma.user.create({
    data: {
      email: "JohnCool@Client.com",
      firstName: "John",
      lastName: "Cool",
      password: password,
      role: "Client",
    },
  });

  const applicantUser = await prisma.user.create({
    data: {
      email: "EggsBenedict@Applicant.com",
      firstName: "Eggs",
      lastName: "Benedict",
      password: password,
      role: "Applicant",
    },
  });

  const Company = await prisma.company.create({
    data: {
      name: "Crab Apple Inc",
      sector: "Apples",
      phone: "420 800713",
      logo: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      admin: { connect: { id: clientUser.id } },
    },
  });

  const jobListing = await prisma.listing.create({
    data: {
      title: "Apple Orbital Launcher Specialist",
      description:
        "At Crab Apple Inc., where apples aren’t just fruits – they’re a lifestyle, we’re searching for a highly specialized individual to join our elite Appletonaut team. As an Apple Orbital Launcher Specialist, you'll play a pivotal role in our secret mission: Project Appollo, aimed at making Crab Apples the first interstellar fruit. Use our patented “Apple-pult” to send apples into the stratosphere and beyond.  Ensure that the launched apples avoid interstellar worm-eating space worms and navigate through the Milky Way. Collaborate with our Starfish division to recover apples once they have orbited and completed their space mission. Craft cosmic apple jams using the interstellar ingredients the apples collect on their journeys. Ensure all apples are equipped with tiny apple-sized space helmets and O2 packs. Crab Apple Inc. is an equal fruit opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all apple-thusiasts. Interested applicants may apply by sending their CVs attached to a helium balloon or by pigeon mail to our Treehouse #7. Only those applicants shortlisted for the next round – the Great Apple Juggle – will be contacted.",
      requirements: [
        "Minimum of 3 years experience in fruit-based propulsion systems.",
        "Degree in Astrofruitology or related field is a plus.",
        "Ability to communicate with extraterrestrial fruit enthusiasts.",
        "Expertise in Apple-nautics and apple-centric gravitational theories.",
        "Must be comfortable working at heights, especially on top of apple trees.",
        "Passion for apples (if you’re more of a pear person, this might not be the job for you).",
      ],
      tags: ["Astrofruitology", "Apples", "Apple-nautics"],
      deadline: "2034-12-26T12:19:48.625Z",
      company: { connect: { id: Company.id } },
    },
  });

  const Application = await prisma.application.create({
    data: {
      listingId: jobListing.id,
      applicantId: applicantUser.id,
      companyId: Company.id,
      coverLetter: "I love apples",
    },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

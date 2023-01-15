import { PrismaClient } from "@prisma/client";
export const databasePrisma = new PrismaClient();

// async function ab1() {
// 	await databasePrisma.listing.create({
// 		data: {
// 			title: "title3",
// 			tags: ["1", "2"],
// 			description: "description2",
// 			requirements: ["HTML", "CSS"],
// 			deadline: new Date(2023, 11, 18),
// 			created: new Date(),
// 			updated: new Date(),
// 			authorId: "1",
// 		},
// 	});
// }
// ab1();

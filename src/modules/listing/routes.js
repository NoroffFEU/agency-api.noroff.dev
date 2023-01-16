import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { checkIfIdExist } from "./middleware/index.js";

export const listingsRouter = express.Router();

// Handling request using router
listingsRouter.get("/", async (req, res) => {
	const list = await databasePrisma.listing.findMany();
	res.send(list);
});

/**
 * DELETE listing endpoint.
 */
listingsRouter.delete("/:id", checkIfIdExist, async (req, res) => {
	try {
		await databasePrisma.listing.delete({
			where: {
				id: req.params.id,
			},
		});
		res.status(200).json({ message: `Listing with id: ${req.params.id} was deleted.` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

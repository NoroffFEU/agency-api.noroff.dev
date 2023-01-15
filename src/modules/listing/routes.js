import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const listingsRouter = express.Router();

// Handling request using router
listingsRouter.get("/", async (req, res) => {
	const list = await databasePrisma.listing.findMany();
	res.send(list);
});

/**
 * DELETE listing endpoint.
 */
listingsRouter.delete("/:id", getListing, async (req, res) => {
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

/**
 * Middleware function that checks if listing with specified id does exist.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns "status 404" with error message if listing doesn't exist.
 */
async function getListing(req, res, next) {
	let listing;
	try {
		listing = await databasePrisma.listing.findUnique({
			where: {
				id: req.params.id,
			},
		});
		if (listing == null) {
			return res.status(404).json({ message: `Listing with id ${req.params.id} doesn't exist.` });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}

	res.listing = listing;
	next();
}

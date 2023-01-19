import { databasePrisma } from "../../../prismaClient.js";

/**
 * Middleware function that checks if listing with specified id does exist.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns "status 404" with error message if listing doesn't exist.
 */
export async function checkIfIdExist(req, res, next) {
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

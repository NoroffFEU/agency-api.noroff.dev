import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const offersRouter = express.Router();

export const offers = offersRouter.get("/", async (req, res) => {
    try {
        const offer = await databasePrisma.offer.findMany();
        if (!offer) {
            res.status(404).json({ message: "Offer not found" });
            return;
        } else if (offer.length === 0) {
            res.status(404).json({ message: "No offer found" });
            return;
        }
        res.send(offer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `${error}` });
    }
});

export const offer = offersRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await databasePrisma.offer.findUnique({
            where: {
                id: String(id),
            },
        });
        if (!offer) {
            res.status(404).json({ message: "Offer not found" });
            return;
        }
        res.send(offer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `${error}` });
    }
});
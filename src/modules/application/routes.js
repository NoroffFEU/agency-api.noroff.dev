import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const applicationsRouter = express.Router();

applicationsRouter
    .get("/", async (req, res) => {
        try {
            const applications = await databasePrisma.application.findMany({
                include: { Offers: true },
            });
            res.status(200).json(applications);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `internal server error`, code: "500" });
        }
    })
    .get("/:id", async (req, res) => {
        try {
            const URLid = req.params.id;
            const applicationById = await databasePrisma.application.findUnique({
                where: {
                    id: URLid,
                },
            });
            if (applicationById === null) {
                res.status(404).json({ message: `no application found with id "${URLid}"` });
            }
            res.json(applicationById);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `internal server error`, code: "500" });
        }
    });

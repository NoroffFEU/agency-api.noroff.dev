import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { Prisma } from "@prisma/client";
import { checkAuth } from "./controllers/checkAuth.js";

export const applicationsRouter = express.Router();

applicationsRouter
    .get("/", checkAuth, async (req, res) => {
        try {
            const applications = await databasePrisma.application.findMany({
                include: { offers: true },
            });
            res.status(200).json(applications);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `internal server error`, code: "500" });
        }
    })
    .get("/:id", checkAuth, async (req, res) => {
        try {
            const params = req.query;
            const URLid = req.params.id;
            const applicationById = await databasePrisma.application.findUnique({
                where: {
                    id: URLid,
                },
                include: { _count: true, ...params },
            });
            if (applicationById === null) {
                res.status(404).json({ message: `no application found with id "${URLid}"` });
                return;
            }
            res.json(applicationById);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientValidationError) {
                res.status(400).send("mispelled url param");
            } else {
                res.status(500).send(`internal server error `);
            }
        }
    });

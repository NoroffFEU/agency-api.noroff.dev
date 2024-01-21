/**
 * @swagger
 * components:
 *   schemas:
 *     Offers:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the offer
 *           example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *         listingId:
 *           type: string
 *           description: the id of the listing the application is attached to
 *           example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *         applicationId:
 *           type: string
 *           description: The id of the Application
 *           example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *         userId:
 *           type: string
 *           description: The user ID
 *           example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *         applicantId:
 *           type: string
 *           description: The id of the applicant of the application
 *           example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *         state:
 *           type: string
 *           description: The state of the offer
 *           example: "Accepted"
 *         created:
 *           type: string
 *           format: date-time
 *           description: Creation date and time of the offer
 *           example: "2021-11-24T12:34:56.789Z"
 *         updated:
 *           type: string
 *           format: date-time
 *           description: Updated date and time for the offer
 *           example: "2021-12-24T12:34:56.789Z"
 */
/**
 * @swagger
 * /offer:
 *   post:
 *     summary: Creates a new offer
 *     tags: [Offer]
 *     description: Creates a new offer
 *     security:
 *       - BearerAuth: []  # Use correct security name
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 description: OfferState on the offer
 *                 example: "Accepted"
 *     responses:
 *       200:
 *         description: offer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of offer
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date and time of the offer
 *                   example: "2021-11-24T12:34:56.789Z"
 *                 updated:
 *                   type: string
 *                   format: date-time
 *                   description: Updated date and time for the offer
 *                   example: "2021-12-24T12:34:56.789Z"
 *                 applicantId:
 *                   type: string
 *                   description: The id of the applicant of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 listingId:
 *                   type: string
 *                   description: the id of the listing the application is attached to
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 user:
 *                   type: object
 *                   description: The user special offer
 *                   example: {id: string, email: string, firstName: string, lastName: string, Offers: [object], listings: [object], role: string}
 *                 userId:
 *                   type: string
 *                   description: The user ID
 *                   example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *                 listing:
 *                   type: [object]
 *                   description: The listing the application is attached to.
 *                   example: {id: string, title: string, tags: ["[tag,tag,tag]"], description: string, requirements: ["string, string, string"], deadline: "2023-01-14T16:49:44.456Z", created: "2023-01-12T17:06:05.952Z", updated: "2023-01-12T16:49:44.456Z", authorId: string}
 *                 applicant:
 *                   type: [object]
 *                   description: The applicant attached to the application.
 *                   example: {id: string, email: "example@example.com", userName: "John", lastName: "Doe", role: "applicant"}
 *                 Application:
 *                   type: [object]
 *                   description: The application attached to the applicant.
 *                   example: {id: string, coverLetter: string, Offers: [object], applicant: user, role: "applicant"}
 *                 state:
 *                   type: string
 *                   description: The state of the offer
 *                   example: "Accepted"
 *       401:
 *         description: Unauthorized access.
 */
/**
 * @swagger
 * /offer:
 *   get:
 *     summary: Get all offers.
 *     tags: [Offer]
 *     description: Retrieves a list of all offers.
 *     responses:
 *       200:
 *         description: A list of offers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of offer
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date and time of the offer
 *                   example: "2021-11-24T12:34:56.789Z"
 *                 updated:
 *                   type: string
 *                   format: date-time
 *                   description: Updated date and time for the offer
 *                   example: "2021-12-24T12:34:56.789Z"
 *                 applicantId:
 *                   type: string
 *                   description: The id of the applicant of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 listingId:
 *                   type: string
 *                   description: the id of the listing the application is attached to
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 user:
 *                   type: object
 *                   description: The user special offer
 *                   example: {id: string, email: string, firstName: string, lastName: string, Offers: [object], listings: [object], role: string}
 *                 userId:
 *                   type: string
 *                   description: The user ID
 *                   example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *                 listing:
 *                   type: [object]
 *                   description: The listing the application is attached to.
 *                   example: {id: string, title: string, tags: ["[tag,tag,tag]"], description: string, requirements: ["string, string, string"], deadline: "2023-01-14T16:49:44.456Z", created: "2023-01-12T17:06:05.952Z", updated: "2023-01-12T16:49:44.456Z", authorId: string}
 *                 applicant:
 *                   type: [object]
 *                   description: The applicant attached to the application.
 *                   example: {id: string, email: "example@example.com", userName: "John", lastName: "Doe", role: "applicant"}
 *                 Application:
 *                   type: [object]
 *                   description: The application attached to the applicant.
 *                   example: {id: string, coverLetter: string, Offers: [object], applicant: user, role: "applicant"}
 *                 state:
 *                   type: string
 *                   description: The state of the offer
 *                   example: "Accepted"
 *       404:
 *         description: No offers found.
 *       401:
 *         description: Unauthorized access.
 */
/**
 * @swagger
 * /offer/{id}:
 *   get:
 *     summary: Get offer by ID
 *     tags: [Offer]
 *     description: Retrieves a single offer by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the offer to retrieve.
 *         schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Details of the offer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of offer
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date and time of the offer
 *                   example: "2021-11-24T12:34:56.789Z"
 *                 updated:
 *                   type: string
 *                   format: date-time
 *                   description: Updated date and time for the offer
 *                   example: "2021-12-24T12:34:56.789Z"
 *                 applicantId:
 *                   type: string
 *                   description: The id of the applicant of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 listingId:
 *                   type: string
 *                   description: the id of the listing the application is attached to
 *                   example: 49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c
 *                 user:
 *                   type: object
 *                   description: The user special offer
 *                   example: {id: string, email: string, firstName: string, lastName: string, Offers: [object], listings: [object], role: string}
 *                 userId:
 *                   type: string
 *                   description: The user ID
 *                   example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *                 listing:
 *                   type: [object]
 *                   description: The listing the application is attached to.
 *                   example: {id: string, title: string, tags: ["[tag,tag,tag]"], description: string, requirements: ["string, string, string"], deadline: "2023-01-14T16:49:44.456Z", created: "2023-01-12T17:06:05.952Z", updated: "2023-01-12T16:49:44.456Z", authorId: string}
 *                 applicant:
 *                   type: [object]
 *                   description: The applicant attached to the application.
 *                   example: {id: string, email: example@example.com, userName: John, lastName: Doe, role: applicant}
 *                 Application:
 *                   type: [object]
 *                   description: The application attached to the applicant.
 *                   example: {id: string, coverLetter: string, Offers: [object], applicant: user, role: applicant}
 *                 state:
 *                   type: string
 *                   description: The state of the offer
 *                   example: "Accepted"
 *       404:
 *         description: Offer not found.
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /offer/{id}:
 *   put:
 *     summary: Update offer details.
 *     tags: [Offer]
 *     description: Updates offer details.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 description: OfferState on the offer
 *                 example: "Accepted"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the offer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single offer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of offer
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date and time of the offer
 *                   example: "2021-11-24T12:34:56.789Z"
 *                 updated:
 *                   type: string
 *                   format: date-time
 *                   description: Updated date and time for the offer
 *                   example: "2021-12-24T12:34:56.789Z"
 *                 applicantId:
 *                   type: string
 *                   description: The id of the applicant of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 listingId:
 *                   type: string
 *                   description: the id of the listing the application is attached to
 *                   example: 49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c
 *                 user:
 *                   type: object
 *                   description: The user special offer
 *                   example: {id: string, email: string, firstName: string, lastName: string, Offers: [object], listings: [object], role: string}
 *                 userId:
 *                   type: string
 *                   description: The user ID
 *                   example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *                 listing:
 *                   type: [object]
 *                   description: The listing the application is attached to.
 *                   example: {id: string, title: string, tags: ["[tag,tag,tag]"], description: string, requirements: ["string, string, string"], deadline: "2023-01-14T16:49:44.456Z", created: "2023-01-12T17:06:05.952Z", updated: "2023-01-12T16:49:44.456Z", authorId: string}
 *                 applicant:
 *                   type: [object]
 *                   description: The applicant attached to the application.
 *                   example: {id: string, email: example@example.com, userName: John, lastName: Doe, role: applicant}
 *                 Application:
 *                   type: [object]
 *                   description: The application attached to the applicant.
 *                   example: {id: string, coverLetter: string, Offers: [object], applicant: user, role: applicant}
 *                 state:
 *                   type: string
 *                   description: The state of the offer
 *                   example: "Accepted"
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /offer/{id}:
 *   delete:
 *     summary: Delete offer
 *     tags: [Offer]
 *     description: Deletes an offer by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the offer to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offer successfully deleted."
 *       404:
 *         description: Offer not found.
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */
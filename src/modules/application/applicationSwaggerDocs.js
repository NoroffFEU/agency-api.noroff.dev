/**
 * @swagger
 *  components:
 *    schemas:
 *      application:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            description: The ID of the application
 *            example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *          created:
 *            type: string
 *            format: date-time
 *            description: Creation date and time of the application
 *            example: "2021-11-24T12:34:56.789Z"
 *          updated:
 *            type: string
 *            format: date-time
 *            description: Updated date and time for the application
 *            example: "2021-12-24T12:34:56.789Z"
 *          applicantId:
 *            type: string
 *            description: The id of the applicant of the application
 *            example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *          listingId:
 *            type: string
 *            description: the id of the listing the application is attached to
 *            example: 49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c
 *          coverLetter:
 *            type: string
 *            description: The coverLetter attached to the application
 */

//-------------------------- POST /application ------------------------

/**
 * @swagger
 * /application:
 *   post:
 *     summary: Create a new application
 *     tags: [Application]
 *     description: Creates a new application on a listing
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicantId:
 *                 type: string
 *                 description: users ID
 *                 example: string
 *               listingId:
 *                 type: string
 *                 description: listing ID
 *                 example: string
 *               coverLetter:
 *                 type: string
 *                 description: coverLetter on the application
 *                 example: string
 *     responses:
 *       200:
 *         description: application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date and time of the application
 *                   example: "2021-11-24T12:34:56.789Z"
 *                 updated:
 *                   type: string
 *                   format: date-time
 *                   description: Updated date and time for the application
 *                   example: "2021-12-24T12:34:56.789Z"
 *                 applicantId:
 *                   type: string
 *                   description: The id of the applicant of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 listingId:
 *                   type: string
 *                   description: the id of the listing the application is attached to
 *                   example: 49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c
 *                 coverLetter:
 *                   type: string
 *                   description: The coverLetter attached to the application
 *                 offers:
 *                   type: [object]
 *                   description: Offers on the application sent by user.
 *                   example: []
 *                 listing:
 *                   type: [object]
 *                   description: The listing the application is attached to.
 *                   example: {id: string, title: string, tags: ["[tag,tag,tag]"], description: string, requirements: ["string, string, string"], deadline: "2023-01-14T16:49:44.456Z", created: "2023-01-12T17:06:05.952Z", updated: "2023-01-12T16:49:44.456Z", authorId: string}
 *                 applicant:
 *                   type: [object]
 *                   description: The applicant attached to the application.
 *                   example: {id: string, email: example@example.com, userName: John, lastName: Doe, role: applicant}
 *                 _count:
 *                   type: array
 *                   description: count for offers on the application
 *                   example: {offers: 0}
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /application:
 *   get:
 *     summary: Get all applications.
 *     tags: [Application]
 *     description: Gets all applications.
 *     parameters:
 *       - in: query
 *         name: listing
 *         required: false
 *         description: Gets the listing for the targeted application
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: offers
 *         required: false
 *         description: Gets the offers for the targeted application
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: applicant
 *         required: false
 *         description: Gets the applicant for the targeted application
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: application response with queryParams ?applicant=true&listing=true&offers=true.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date and time of the application
 *                   example: "2021-11-24T12:34:56.789Z"
 *                 updated:
 *                   type: string
 *                   format: date-time
 *                   description: Updated date and time for the application
 *                   example: "2021-12-24T12:34:56.789Z"
 *                 applicantId:
 *                   type: string
 *                   description: The id of the applicant of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 listingId:
 *                   type: string
 *                   description: the id of the listing the application is attached to
 *                   example: 49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c
 *                 coverLetter:
 *                   type: string
 *                   description: The coverLetter attached to the application
 *                 offers:
 *                   type: [object]
 *                   description: Offers on the application sent by user.
 *                   example: []
 *                 listing:
 *                   type: [object]
 *                   description: The listing the application is attached to.
 *                   example: {id: string, title: string, tags: ["[tag,tag,tag]"], description: string, requirements: ["string, string, string"], deadline: "2023-01-14T16:49:44.456Z", created: "2023-01-12T17:06:05.952Z", updated: "2023-01-12T16:49:44.456Z", authorId: string}
 *                 applicant:
 *                   type: [object]
 *                   description: The applicant attached to the application.
 *                   example: {id: string, email: example@example.com, userName: John, lastName: Doe, role: applicant}
 *                 _count:
 *                   type: array
 *                   description: count for offers on the application
 *                   example: {offers: 0}
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /application/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Application]
 *     description: Get a single application by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the application to retrieve.
 *         schema:
 *           type: string
 *       - in: query
 *         name: listing
 *         required: false
 *         description: Gets the listing for the targeted application
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: offers
 *         required: false
 *         description: Gets the offers for the targeted application
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: applicant
 *         required: false
 *         description: Gets the applicant for the targeted application
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: default response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date and time of the application
 *                   example: "2021-11-24T12:34:56.789Z"
 *                 updated:
 *                   type: string
 *                   format: date-time
 *                   description: Updated date and time for the application
 *                   example: "2021-12-24T12:34:56.789Z"
 *                 applicantId:
 *                   type: string
 *                   description: The id of the applicant of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 listingId:
 *                   type: string
 *                   description: the id of the listing the application is attached to
 *                   example: 49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c
 *                 coverLetter:
 *                   type: string
 *                   description: The coverLetter attached to the application
 *                 offers:
 *                   type: [object]
 *                   description: Offers on the application sent by user.
 *                   example: []
 *                 listing:
 *                   type: [object]
 *                   description: The listing the application is attached to.
 *                   example: {id: string, title: string, tags: ["[tag,tag,tag]"], description: string, requirements: ["string, string, string"], deadline: "2023-01-14T16:49:44.456Z", created: "2023-01-12T17:06:05.952Z", updated: "2023-01-12T16:49:44.456Z", authorId: string}
 *                 applicant:
 *                   type: [object]
 *                   description: The applicant attached to the application.
 *                   example: {id: string, email: example@example.com, userName: John, lastName: Doe, role: applicant}
 *                 _count:
 *                   type: array
 *                   description: count for offers on the application
 *                   example: {offers: 0}
 *     security:
 *       - bearerAuth: []
 */

// --------------------------- PUT /application ------------------------------------

/**
 * @swagger
 * /application/{id}:
 *   put:
 *     summary: Update application details.
 *     tags: [Application]
 *     description: Updates application details.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter:
 *                 type: string
 *                 description: coverLetter on the application
 *                 example: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the application.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single application.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date and time of the application
 *                   example: "2021-11-24T12:34:56.789Z"
 *                 updated:
 *                   type: string
 *                   format: date-time
 *                   description: Updated date and time for the application
 *                   example: "2021-12-24T12:34:56.789Z"
 *                 applicantId:
 *                   type: string
 *                   description: The id of the applicant of the application
 *                   example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *                 listingId:
 *                   type: string
 *                   description: the id of the listing the application is attached to
 *                   example: 49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c
 *                 coverLetter:
 *                   type: string
 *                   description: The coverLetter attached to the application
 *                 offers:
 *                   type: [object]
 *                   description: Offers on the application sent by user.
 *                   example: []
 *                 listing:
 *                   type: [object]
 *                   description: The listing the application is attached to.
 *                   example: {id: string, title: string, tags: ["[tag,tag,tag]"], description: string, requirements: ["string, string, string"], deadline: "2023-01-14T16:49:44.456Z", created: "2023-01-12T17:06:05.952Z", updated: "2023-01-12T16:49:44.456Z", authorId: string}
 *                 applicant:
 *                   type: [object]
 *                   description: The applicant attached to the application.
 *                   example: {id: string, email: example@example.com, userName: John, lastName: Doe, role: applicant}
 *                 _count:
 *                   type: array
 *                   description: count for offers on the application
 *                   example: {offers: 0}
 *     security:
 *       - bearerAuth: []
 */

// ---------------- DELETE /application -----------------------------

/**
 * @swagger
 * /application/{id}:
 *   delete:
 *     summary: Delete application
 *     tags: [Application]
 *     description: Deletes an application.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the application.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application deleted.
 *         content:
 *           application/json:
 *             properties:
 *               type: string
 *               description: Default response
 *
 *     security:
 *       - bearerAuth: []
 */

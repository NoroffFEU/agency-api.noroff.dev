/**
 * @swagger
 * components:
 *   schemas:
 *     Listing:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The listing's id.
 *           example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *         title:
 *           type: string
 *           description: The listing's title.
 *           example: Looking for Front-end developer
 *         tags:
 *           type: [string]
 *           description: Tags on listing
 *           example: ["front-end", "hiring"]
 *         description:
 *           type: string
 *           description: The listing description.
 *         requirements:
 *           type: [string]
 *           description: List of requirements for the position.
 *           example: ["html", "css", "javascript"]
 *         deadline:
 *           type: string
 *           description: The listing's deadline.
 *           example: 2023-04-16T12:19:48.625Z
 *         created:
 *           type: string
 *           description: When the listing was created.
 *           example: 2023-01-16T12:19:48.625Z
 *         updated:
 *           type: string
 *           description: When the listing was last updated.
 *           example: 2023-02-16T12:19:48.625Z
 *         applications:
 *           type: [object]
 *           description:  An array of application objects.
 *           example: [object, object, object]
 *         offer:
 *           type: [object]
 *           description: An array of offers objects.
 *           example: [object, object, object]
 *         company:
 *           type: string
 *           description: Company object
 *           example: {id:"", name:"" ...}
 *         companyId:
 *           type: string
 *           description: The id of the company.
 *           example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *
 */

//----------------- POST /listings --------------------
/**
 * @swagger
 * /listings:
 *   post:
 *     summary: Create a new listing.
 *     tags: [Listings]
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     security:
 *       - bearerAuth: []
 *     required:
 *       - company
 *       - title
 *       - description
 *       - requirements
 *       - deadline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 description: The company's id.
 *                 example: a120a09d-5td2-4eb1-8724-407fb13a8694
 *               title:
 *                 type: string
 *                 description: The listing's title.
 *                 example: Looking for Front-end developer
 *               tags:
 *                 type: [string]
 *                 description: Tags on listing.
 *                 example: ["front-end", "hiring"]
 *               description:
 *                 type: string
 *                 description: The listing description.
 *               requirements:
 *                 type: [string]
 *                 description: List of requirements for the position
 *                 example: ["html", "css", "javascript"]
 *               deadline:
 *                 type: string
 *                 description: The listing's deadline, valid ISO date format.
 *                 example: 2023-04-16T12:19:48.625Z
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: string
 *                       description: The listing's id.
 *                       example: a120a09d-5td2-4eb1-8724-407fb13a8694
 *                     title:
 *                       type: string
 *                       description: The listing's title.
 *                       example: Looking for Front-end developer
 *                     tags:
 *                       type: [string]
 *                       description: Tags on listing.
 *                       example: front-end, hiring
 *                     description:
 *                       type: string
 *                       description: The listing description.
 *                     requirements:
 *                       type: [string]
 *                       description: List of requirements for the position
 *                       example: ["HTML", "CSS", "JavaScript"]
 *                     deadline:
 *                       type: string
 *                       description: The listing's deadline
 *                       example: 2023-04-16T12:19:48.625Z
 *                     created:
 *                       type: string
 *                       description: When the listing was created
 *                       example: 2023-01-16T12:19:48.625Z
 *                     updated:
 *                       type: string
 *                       description: When the listing was last updated
 *                       example: 2023-02-16T12:19:48.625Z
 *                     company:
 *                       type: string
 *                       description: The id of the company.
 *                       example: a120a09d-5td2-4eb1-8724-407fb13a8694
 *       400:
 *         description: Bad request response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Missing require fields
 *       401:
 *         description: Unauthorised
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Invalid token, please re-log.
 *       500:
 *         description: Unexpected Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Internal server error.
 */

//------------------ GET /listings --------------------
/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Get an array of listings.
 *     tags: [Listings]
 *     description: Returns an array of all listings.
 *     responses:
 *       200:
 *         description: A list of listings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  properties:
 *                        id:
 *                          type: string
 *                          description: The listing's id.
 *                          example: a120a09d-5td2-4eb1-8724-407fb13a8694
 *                        title:
 *                          type: string
 *                          description: The listing's title.
 *                          example: Looking for Front-end developer
 *                        tags:
 *                          type: [string]
 *                          description: Tags on listing.
 *                          example: front-end, hiring
 *                        description:
 *                          type: string
 *                          description: The listing description.
 *                        requirements:
 *                          type: [string]
 *                          description: List of requirements for the position
 *                          example: html, css, javascript
 *                        deadline:
 *                          type: string
 *                          description: The listing's deadline
 *                          example: 2023-04-16T12:19:48.625Z
 *                        created:
 *                          type: string
 *                          description: When the listing was created
 *                          example: 2023-01-16T12:19:48.625Z
 *                        updated:
 *                          type: string
 *                          description: When the listing was last updated
 *                          example: 2023-02-16T12:19:48.625Z
 *                        company:
 *                          type: string
 *                          description: The id of the company.
 *                          example: a120a09d-5td2-4eb1-8724-407fb13a8694
 */

//------------------ GET /listings/{id} --------------------
/**
 * @swagger
 * /listings/{id}:
 *   get:
 *     summary: Gets a specific listing info. If listing is owned by user's company offers and applications will be returned with a valid header token.
 *     tags: [Listings]
 *     description: Gets a specific listing info. If listing is owned by user's company offers and applications will be returned with a valid header token.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the listing to retrieve.
 *         schema:
 *           type: String
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A single listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: string
 *                       description: The listing's id.
 *                       example: a120a09d-5td2-4eb1-8724-407fb13a8694
 *                     title:
 *                       type: string
 *                       description: The listing's title.
 *                       example: Looking for Front-end developer
 *                     tags:
 *                       type: [string]
 *                       description: Tags on listing.
 *                       example: front-end, hiring
 *                     description:
 *                       type: string
 *                       description: The listing description.
 *                     requirements:
 *                       type: [string]
 *                       description: List of requirements for the position
 *                       example: html, css, javascript
 *                     deadline:
 *                       type: string
 *                       description: The listing's deadline
 *                       example: 2023-04-16T12:19:48.625Z
 *                     created:
 *                       type: string
 *                       description: When the listing was created
 *                       example: 2023-01-16T12:19:48.625Z
 *                     updated:
 *                       type: string
 *                       description: When the listing was last updated
 *                       example: 2023-02-16T12:19:48.625Z
 *                     applications:
 *                       type: [object]
 *                       description:  An array of application objects.
 *                       example: [object, object, object]
 *                     offer:
 *                       type: [object]
 *                       description: An array of offers objects.
 *                       example: [object, object, object]
 *                     company:
 *                       type: string
 *                       description: The id of the company.
 *                       example: a120a09d-5td2-4eb1-8724-407fb13a8694
 *       404:
 *         description: id not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Missing require fields
 */

//------------------ PUT /listings/{id} --------------------
/**
 * @swagger
 * /listings/{id}:
 *   put:
 *     summary: Update listing details.
 *     tags: [Listings]
 *     description: Updates listing details.
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the listing to retrieve.
 *         schema:
 *           type: String
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The listing's title.
 *                 example: Looking for Front-end developer
 *               tags:
 *                 type: [string]
 *                 description: Tags on listing.
 *                 example: front-end, hiring
 *               description:
 *                 type: string
 *                 description: The listing description.
 *               requirements:
 *                 type: [string]
 *                 description: List of requirements for the position
 *                 example: html, css, javascript
 *               deadline:
 *                 type: string
 *                 description: The listing's deadline
 *                 example: 2023-04-16T12:19:48.625Z
 *     responses:
 *       200:
 *         description: Update a listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                         id:
 *                           type: string
 *                           description: The listing's id.
 *                           example: a120a09d-5td2-4eb1-8724-407fb13a8694
 *                         title:
 *                           type: string
 *                           description: The listing's title.
 *                           example: Looking for Front-end developer
 *                         tags:
 *                           type: [string]
 *                           description: Tags on listing.
 *                           example: front-end, hiring
 *                         description:
 *                           type: string
 *                           description: The listing description.
 *                         requirements:
 *                           type: [string]
 *                           description: List of requirements for the position
 *                           example: html, css, javascript
 *                         deadline:
 *                           type: string
 *                           description: The listing's deadline
 *                           example: 2023-04-16T12:19:48.625Z
 *                         created:
 *                           type: string
 *                           description: When the listing was created
 *                           example: 2023-01-16T12:19:48.625Z
 *                         updated:
 *                           type: string
 *                           description: When the listing was last updated
 *                           example: 2023-02-16T12:19:48.625Z
 *                         company:
 *                           type: string
 *                           description: The id of the company.
 *                           example: a120a09d-5td2-4eb1-8724-407fb13a8694
 *       400:
 *         description: Bad request response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Missing require fields
 *
 *       401:
 *         description: Unauthorised
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Invalid token, please re-log.
 *       404:
 *         description: id not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Missing require fields
 *       500:
 *         description: Unexpected Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Internal server error.
 */

//------------------ DELETE /listings/{id} --------------------
/**
 * @swagger
 * /listings/{id}:
 *   delete:
 *     summary: delete a listing.
 *     tags: [Listings]
 *     description: Deletes a listing. Listing ID must match listing being deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the listing to retrieve.
 *         schema:
 *           type: String
 *     responses:
 *       200:
 *         description: Listing deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Success message.
 *                       example: Listing deleted.
 *       404:
 *         description: id not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Missing require fields
 *
 *       401:
 *         description: Unauthorised
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Invalid token, please re-log.
 *       500:
 *         description: Unexpected Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: The error message.
 *                       example: Internal server error.
 *     security:
 *       - bearerAuth: []
 */

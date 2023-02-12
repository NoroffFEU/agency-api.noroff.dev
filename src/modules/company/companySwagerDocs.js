/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *         - sector
 *         - logo
 *         - phone
 *         - admin
 *       properties:
 *         id:
 *           type: string
 *           description: The company ID.
 *           example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *         name:
 *           type: string
 *           description: The company's name.
 *           example: Tech Agency Inc
 *         sector:
 *           type: string
 *           description: The company's sector(s).
 *           example: Web Development.
 *         phone:
 *           type: number
 *           description: The company's number.
 *           example: 242424242424
 *         logo:
 *           type: string (url)
 *           description: Image link for logo.
 *           example: www.tech-agency-inc.com/logo.jpg
 *         admin:
 *           type: [string]
 *           format: id
 *           description: Array of admin IDs
 *           example: ["fcadcac5-b894-4150-818c-7d6f0e730c59", "fcadc..."]
 *         applications:
 *           type: [object]
 *           description:  An array of application objects.
 *           example: [object, object, object]
 *         offer:
 *           type: [object]
 *           description: An array of offers objects.
 *           example: [object, object, object]
 *         listings:
 *           type: [object]
 *           description: An array of listing objects.
 *           example: [object, object, object]
 *         created:
 *           type: string
 *           description: When the company was created.
 *           example: 2023-01-16T12:19:48.625Z
 *         updated:
 *           type: string
 *           description: When the company was last updated.
 *           example: 2023-02-16T12:19:48.625Z
 */

//----------------- POST /company --------------------
/**
 * @swagger
 * /company:
 *   post:
 *     summary: Create a new company.
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sector
 *               - logo
 *               - phone
 *               - admin
 *             properties:
 *               name:
 *                 type: string
 *                 description: The company's name.
 *                 example: Tech Agency Inc
 *               sector:
 *                 type: string
 *                 description: The company's sector(s).
 *                 example: Web Development.
 *               phone:
 *                 type: number
 *                 description: The company's number.
 *                 example: 242424242424
 *               logo:
 *                 type: string (url)
 *                 description: Image link for logo.
 *                 example: www.tech-agency-inc.com/logo.jpg
 *               admin:
 *                 type: string
 *                 format: id
 *                 description: admin IDs
 *                 example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
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
 *                       description: The company ID.
 *                       example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *                     name:
 *                       type: string
 *                       description: The company's name.
 *                       example: Tech Agency Inc
 *                     sector:
 *                       type: string
 *                       description: The company's sector(s).
 *                       example: Web Development.
 *                     phone:
 *                       type: number
 *                       description: The company's number.
 *                       example: 242424242424
 *                     logo:
 *                       type: string (url)
 *                       description: Image link for logo.
 *                       example: www.tech-agency-inc.com/logo.jpg
 *                     admin:
 *                       type: [string]
 *                       format: id
 *                       description: Array of admin ID
 *                       example: ["fcadcac5-b894-4150-818c-7d6f0e730c59", "fcadc..."]
 *                     created:
 *                       type: string
 *                       description: When the company was created.
 *                       example: 2023-01-16T12:19:48.625Z
 *                     updated:
 *                       type: string
 *                       description: When the company was last updated.
 *                       example: 2023-02-16T12:19:48.625Z
 *       400:
 *         description: Image Url is not an approved image
 *       401:
 *         description: User has to be authenticated to make this request
 *       409:
 *         description: Company already exists
 *       500:
 *         description: Internal Server Error
 *
 */

//------------------ PUT /company/{id} --------------------

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     summary: Update a new company.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the company to retrieve.
 *         schema:
 *           type: String
 *     security:
 *       - bearerAuth: []
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The company's name.
 *                 example: Tech Agency Inc
 *               sector:
 *                 type: string
 *                 description: The company's sector(s).
 *                 example: Web Development.
 *               phone:
 *                 type: number
 *                 description: The company's number.
 *                 example: 242424242424
 *               logo:
 *                 type: string (url)
 *                 description: Image link for logo.
 *                 example: www.tech-agency-inc.com/logo.jpg
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: string
 *                       description: The company ID.
 *                       example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *                     name:
 *                       type: string
 *                       description: The company's name.
 *                       example: Tech Agency Inc
 *                     sector:
 *                       type: string
 *                       description: The company's sector(s).
 *                       example: Web Development.
 *                     phone:
 *                       type: number
 *                       description: The company's number.
 *                       example: 242424242424
 *                     logo:
 *                       type: string (url)
 *                       description: Image link for logo.
 *                       example: www.tech-agency-inc.com/logo.jpg
 *                     admin:
 *                       type: [string]
 *                       format: id
 *                       description: Array of admin IDs
 *                       example: ["fcadcac5-b894-4150-818c-7d6f0e730c59", "fcadc..."]
 *                     created:
 *                       type: string
 *                       description: When the company was created.
 *                       example: 2023-01-16T12:19:48.625Z
 *                     updated:
 *                       type: string
 *                       description: When the company was last updated.
 *                       example: 2023-02-16T12:19:48.625Z
 *       400:
 *         description: Image Url is not an approved image
 *       401:
 *         description: User has to be authenticated to make this request
 *       409:
 *         description: Company already exists
 *       500:
 *         description: Internal Server Error
 */

//------------------ GET /company --------------------
/**
 * @swagger
 * /company:
 *   get:
 *     summary: Get an array of companies.
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: Array of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                   properties:
 *                         id:
 *                           type: string
 *                           description: The company ID.
 *                           example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *                         name:
 *                           type: string
 *                           description: The company's name.
 *                           example: Tech Agency Inc
 *                         sector:
 *                           type: string
 *                           description: The company's sector(s).
 *                           example: Web Development.
 *                         phone:
 *                           type: number
 *                           description: The company's number.
 *                           example: 242424242424
 *                         logo:
 *                           type: string (url)
 *                           description: Image link for logo.
 *                           example: www.tech-agency-inc.com/logo.jpg
 *                         admin:
 *                           type: [string]
 *                           format: id
 *                           description: Array of admin IDs
 *                           example: ["fcadcac5-b894-4150-818c-7d6f0e730c59", "fcadc..."]
 *                         created:
 *                           type: string
 *                           description: When the company was created.
 *                           example: 2023-01-16T12:19:48.625Z
 *                         updated:
 *                           type: string
 *                           description: When the company was last updated.
 *                           example: 2023-02-16T12:19:48.625Z
 *       500:
 *         description: Internal Server Error
 */

//------------------ GET /company/{id} --------------------
/**
 * @swagger
 * /company/{id}:
 *   get:
 *     summary: Get a single company, offers and applications provided with correct authorization from a company admin.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the company to retrieve.
 *         schema:
 *           type: String
 *     security:
 *       - bearerAuth: []
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: string
 *                       description: The company ID.
 *                       example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *                     name:
 *                       type: string
 *                       description: The company's name.
 *                       example: Tech Agency Inc
 *                     sector:
 *                       type: string
 *                       description: The company's sector(s).
 *                       example: Web Development.
 *                     phone:
 *                       type: number
 *                       description: The company's number.
 *                       example: 242424242424
 *                     logo:
 *                       type: string (url)
 *                       description: Image link for logo.
 *                       example: www.tech-agency-inc.com/logo.jpg
 *                     admin:
 *                       type: [string]
 *                       format: id
 *                       description: Array of admin IDs
 *                       example: ["fcadcac5-b894-4150-818c-7d6f0e730c59", "fcadc..."]
 *                     applications:
 *                       type: [object]
 *                       description:  An array of application objects.
 *                       example: [object, object, object]
 *                     offer:
 *                       type: [object]
 *                       description: An array of offers objects.
 *                       example: [object, object, object]
 *                     listings:
 *                       type: [object]
 *                       description: An array of listing objects.
 *                       example: [object, object, object]
 *                     created:
 *                       type: string
 *                       description: When the company was created.
 *                       example: 2023-01-16T12:19:48.625Z
 *                     updated:
 *                       type: string
 *                       description: When the company was last updated.
 *                       example: 2023-02-16T12:19:48.625Z
 *       400:
 *         description: Could not find company!
 *       500:
 *         description: Internal Server Error
 */

//------------------ Delete /company/{id} --------------------

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: delete a company.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the company to add admin to.
 *         schema:
 *           type: String
 *     security:
 *       - bearerAuth: []
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     responses:
 *       200:
 *         description: Deleted company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     message:
 *                       type: string
 *                       description: Success message.
 *                       example: "Company and all related listings, offers and applications deleted."
 *       400:
 *         description: Bad request, Company doesn't exist.
 *       401:
 *         description: User is not authorized to make this request.
 *       500:
 *         description: Internal Server Error.
 */

//------------------ PUT /company/admin/{id} --------------------

/**
 * @swagger
 * /company/admin/{id}:
 *   put:
 *     summary: Add an admin to the company.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the company to add admin to.
 *         schema:
 *           type: String
 *     security:
 *       - bearerAuth: []
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin:
 *                 type: string
 *                 description: The users ID.
 *                 example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: string
 *                       description: The company ID.
 *                       example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *                     name:
 *                       type: string
 *                       description: The company's name.
 *                       example: Tech Agency Inc
 *                     sector:
 *                       type: string
 *                       description: The company's sector(s).
 *                       example: Web Development.
 *                     phone:
 *                       type: number
 *                       description: The company's number.
 *                       example: 242424242424
 *                     logo:
 *                       type: string (url)
 *                       description: Image link for logo.
 *                       example: www.tech-agency-inc.com/logo.jpg
 *                     admin:
 *                       type: [string]
 *                       format: id
 *                       description: Array of admin IDs
 *                       example: ["fcadcac5-b894-4150-818c-7d6f0e730c59", "fcadc..."]
 *                     created:
 *                       type: string
 *                       description: When the company was created.
 *                       example: 2023-01-16T12:19:48.625Z
 *                     updated:
 *                       type: string
 *                       description: When the company was last updated.
 *                       example: 2023-02-16T12:19:48.625Z
 *       400:
 *         description: Bad request, admin doesn't exist
 *       401:
 *         description: User is not authorized to make this request
 *       500:
 *         description: Internal Server Error
 */

//------------------ delete /company/admin/{id} --------------------

/**
 * @swagger
 * /company/admin/{id}:
 *   delete:
 *     summary: remove an admin from the company.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the company to add admin to.
 *         schema:
 *           type: String
 *     security:
 *       - bearerAuth: []
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin:
 *                 type: string
 *                 description: The users ID.
 *                 example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: string
 *                       description: The company ID.
 *                       example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *                     name:
 *                       type: string
 *                       description: The company's name.
 *                       example: Tech Agency Inc
 *                     sector:
 *                       type: string
 *                       description: The company's sector(s).
 *                       example: Web Development.
 *                     phone:
 *                       type: number
 *                       description: The company's number.
 *                       example: 242424242424
 *                     logo:
 *                       type: string (url)
 *                       description: Image link for logo.
 *                       example: www.tech-agency-inc.com/logo.jpg
 *                     admin:
 *                       type: [string]
 *                       format: id
 *                       description: Array of admin IDs
 *                       example: ["fcadcac5-b894-4150-818c-7d6f0e730c59", "fcadc..."]
 *                     created:
 *                       type: string
 *                       description: When the company was created.
 *                       example: 2023-01-16T12:19:48.625Z
 *                     updated:
 *                       type: string
 *                       description: When the company was last updated.
 *                       example: 2023-02-16T12:19:48.625Z
 *       400:
 *         description: Bad request, User doesn't exist
 *       401:
 *         description: User is not authorized to make this request
 *       500:
 *         description: Internal Server Error
 */

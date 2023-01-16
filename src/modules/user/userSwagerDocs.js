/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID.
 *           example: "fcadcac5-b894-4150-818c-7d6f0e730c59"
 *         firstName:
 *           type: string
 *           description: The user's first name.
 *           example: John
 *         lastName:
 *           type: string
 *           description: The user's last name.
 *           example: Smith
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email.
 *           example: example@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *           example: Password123
 *         avatar:
 *           type: string (url)
 *           description: url to user avatar
 *           example: www.example.com/example.jpeg
 *         profile:
 *           type: string
 *           description: information about the user
 *           example: I'm John Smith and I like coding.
 *         skills:
 *           type: [string]
 *           description: skills this user has.
 *           example: [HTML, CSS, JavaScript, Node, Git]
 *         role:
 *           type: string
 *           description:  A user can be an Applicant, Client, or Admin.
 *           example: Applicant
 *         applications:
 *           type: [object]
 *           description: An array of application objects
 *           example: [object, object, object]
 *         offers:
 *           type: [object]
 *           description: An array of offers objects
 *           example: [object, object, object]
 *         company:
 *           type: string
 *           description: Company's name.
 *           example: Tech Jobs!
 *         companyId:
 *           type: string
 *           description: Id of company
 *           example: fcadcac5-b894-4150-818c-7d6f0e730c59
 */

//----------------- POST /users --------------------
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user.
 *     tags: [Users Authenticate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The user's last name.
 *                 example: Smith
 *               email:
 *                 type: string (email)
 *                 description: The user's email.
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: Password123
 *               avatar:
 *                 type: string (url)
 *                 description: url to user avatar
 *                 example: www.example.com/example.jpeg
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: String
 *                       description: The user ID.
 *                       example: fcadcac5-b894-4150-818c-7d6f0e730c59
 *                     firstName:
 *                       type: string
 *                       description: The user's first name.
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: The user's last name.
 *                       example: Smith
 *                     email:
 *                       type: string
 *                       description: The user's email.
 *                       example: example@example.com
 *                     token:
 *                       type: string
 *                       description: The user's access token.
 *                       example: "string"
 */

//------------------ POST /users/login --------------------
//  POST /users/login
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log user in.
 *     tags: [Users Authenticate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string (email)
 *                 description: The user's email.
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: String
 *                       description: The user ID.
 *                       example: fcadcac5-b894-4150-818c-7d6f0e730c59
 *                     firstName:
 *                       type: string
 *                       description: The user's first name.
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: The user's last name.
 *                       example: Smith
 *                     email:
 *                       type: string
 *                       description: The user's email.
 *                       example: example@example.com
 *                     avatar:
 *                       type: string
 *                       description: The user's avatar image URL.
 *                       example: "example.com/example.jpg"
 *                     token:
 *                       type: string
 *                       description: The user's access token.
 *                       example: "string"
 */

//------------------ GET /users/ --------------------
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get an array of users.
 *     tags: [Users]
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

//------------------ GET /users/{id} --------------------
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific user.
 *     tags: [Users]
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Leanne Graham
 */

//------------------ PUT /users/{id} --------------------
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details.
 *     tags: [Users]
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Leanne Graham
 */

//------------------ DELETE /users/{id} --------------------
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: delete a user.
 *     tags: [Users]
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Leanne Graham
 */

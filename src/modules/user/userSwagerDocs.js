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
 *                       format: email
 *                       description: The user's email.
 *                       example: example@example.com
 *                     avatar:
 *                       type: string
 *                       format: URL
 *                       description: Avatar URL.
 *                       example: example.com/example.jpeg
 *                     token:
 *                       type: string
 *                       description: The user's access token.
 *                       example: "string"
 *       400:
 *         description: Bad image url
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
 *
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
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 */

//------------------ GET /users/ --------------------
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get an array of users.
 *     tags: [Users]
 *     description: Returns an array of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
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
 *                       format: email
 *                       description: The user's email.
 *                       example: example@example.com
 *                     avatar:
 *                       type: string
 *                       format: URL
 *                       description: Avatar URL.
 *                       example: example.com/example.jpeg
 *                     about:
 *                       type: string
 *                       description: Details about te user.
 *                       example: "I'm a student of front-end....."
 *                     skills:
 *                       type: [string]
 *                       description: Array of users skills.
 *                       example: [HTML, CSS, JavaScript, Git, GitHub]
 *                     applications:
 *                       type: [object]
 *                       description: An array of application objects
 *                       example: [application]
 *                     offers:
 *                       type: [object]
 *                       description: An array of offers objects
 *                       example: [offer]
 *                     listings:
 *                       type: [object]
 *                       description: An array of listing objects
 *                       example: [listing]
 *                     Created:
 *                       type: string
 *                       format: date
 *                       description: Date user joined.
 *                       example: 2023-01-16T19:55:13.609Z
 *                     Updated:
 *                       type: string
 *                       format: date
 *                       description: Most recent update.
 *                       example: 2023-01-16T19:55:13.609Z
 *       500:
 *         description: Internal server error
 */

//------------------ GET /users/{id} --------------------
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific user.
 *     tags: [Users]
 *     description: Gets a specific users info.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the user to retrieve.
 *         schema:
 *           type: String
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
 *                       format: email
 *                       description: The user's email.
 *                       example: example@example.com
 *                     avatar:
 *                       type: string
 *                       format: URL
 *                       description: Avatar URL.
 *                       example: example.com/example.jpeg
 *                     about:
 *                       type: string
 *                       description: Details about te user.
 *                       example: "I'm a student of front-end....."
 *                     skills:
 *                       type: [string]
 *                       description: Array of users skills.
 *                       example: [HTML, CSS, JavaScript, Git, GitHub]
 *                     applications:
 *                       type: [object]
 *                       description: An array of application objects
 *                       example: [application]
 *                     offers:
 *                       type: [object]
 *                       description: An array of offers objects
 *                       example: [offer]
 *                     listings:
 *                       type: [object]
 *                       description: An array of listing objects
 *                       example: [listing]
 *                     Created:
 *                       type: string
 *                       format: date
 *                       description: Date user joined.
 *                       example: 2023-01-16T19:55:13.609Z
 *                     Updated:
 *                       type: string
 *                       format: date
 *                       description: Most recent update.
 *                       example: 2023-01-16T19:55:13.609Z
 *       400:
 *         description: Bad request, user id is undefined / Could not find user
 *       500:
 *         description: Internal server error
 */

//------------------ PUT /users/{id} --------------------
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details.
 *     tags: [Users]
 *     description: Updates users details, for password and email changes the current password is required.
 *     components:
 *       BearerAuth:
 *         type: jsonToken
 *         in: header
 *         scheme: bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the user to retrieve.
 *         schema:
 *           type: String
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
 *                       format: email
 *                       description: The user's email.
 *                       example: example@example.com
 *                     avatar:
 *                       type: string
 *                       format: URL
 *                       description: Avatar URL.
 *                       example: example.com/example.jpeg
 *                     about:
 *                       type: string
 *                       description: Details about te user.
 *                       example: "I'm a student of front-end....."
 *                     skills:
 *                       type: [string]
 *                       description: Array of users skills.
 *                       example: [HTML, CSS, JavaScript, Git, GitHub]
 *                     applications:
 *                       type: [object]
 *                       description: An array of application objects
 *                       example: [application]
 *                     offers:
 *                       type: [object]
 *                       description: An array of offers objects
 *                       example: [offer]
 *                     listings:
 *                       type: [object]
 *                       description: An array of listing objects
 *                       example: [listing]
 *                     Created:
 *                       type: string
 *                       format: date
 *                       description: Date user joined.
 *                       example: 2023-01-16T19:55:13.609Z
 *                     Updated:
 *                       type: string
 *                       format: date
 *                       description: Most recent update.
 *                       example: 2023-01-16T19:55:13.609Z
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

//------------------ DELETE /users/{id} --------------------
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: delete a user.
 *     tags: [Users]
 *     description: Deletes a users account and all related applications and offers. User ID must match user being deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String ID of the user to retrieve.
 *         schema:
 *           type: String
 *     responses:
 *       200:
 *         description: Account deleted.
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
 *                       example: Account deleted.
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

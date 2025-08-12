/**
 * @swagger
 *  components:
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
 *         companyId:
 *           type: string
 *           description: The id of the company making the offer
 *           example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *         userId:
 *           type: string
 *           description: The user ID of the applicant
 *           example: "5s3d4aw5q-a2f6-4a6c-5c4d-8a5e5e5b6d2d"
 *         state:
 *           type: string
 *           enum: [Pending, Accepted, Rejected]
 *           description: The state of the offer
 *           example: "Pending"
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
 * /offers:
 *   post:
 *     summary: Creates a new offer for an application
 *     tags: [Offers]
 *     description: Company creates an offer for a specific application
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: ID of the application to create an offer for
 *                 example: "49a7d8f8-c5f6-4a6c-9c1d-8a5e5e5b6d5c"
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offers'
 *       400:
 *         description: Bad request - Application ID missing or invalid
 *       404:
 *         description: Application not found
 *       409:
 *         description: Offer already exists for this application
 */

/**
 * @swagger
 * /offers:
 *   get:
 *     summary: Get all offers
 *     tags: [Offers]
 *     description: Retrieves all offers with related application, listing, and company data
 *     responses:
 *       200:
 *         description: Array of offers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Offers'
 */

/**
 * @swagger
 * /offers/{id}:
 *   get:
 *     summary: Get offer by ID
 *     tags: [Offers]
 *     description: Retrieve a single offer by ID with related data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Offer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Single offer with related data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offers'
 *       404:
 *         description: Offer not found
 */

/**
 * @swagger
 * /offers/{id}:
 *   put:
 *     summary: Update offer state
 *     tags: [Offers]
 *     description: |
 *       Update the state of an offer.
 *       - **Applicants** can Accept or Reject offers made to them
 *       - **Companies** can only set offers back to Pending
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Offer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [Pending, Accepted, Rejected]
 *                 description: |
 *                   New state for the offer:
 *                   - **Applicants**: "Accepted" or "Rejected"
 *                   - **Companies**: "Pending"
 *                 example: "Accepted"
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offers'
 *       400:
 *         description: |
 *           Bad request:
 *           - State is required
 *           - Invalid state value
 *           - Only pending offers can be updated
 *           - Role-specific state restrictions
 *       401:
 *         description: Not authorized to perform operation
 *       403:
 *         description: |
 *           Forbidden:
 *           - Applicants can only update their own offers
 *           - Companies can only update offers from their company
 *       404:
 *         description: Offer not found
 */

/**
 * @swagger
 * /offers/{id}:
 *   delete:
 *     summary: Delete offer
 *     tags: [Offers]
 *     description: Delete an offer (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Offer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offer deleted successfully"
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Offer not found
 */

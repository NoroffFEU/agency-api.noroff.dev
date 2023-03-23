/**
 * Creates a new offer using the provided application ID and offer state.
 * @async
 * @function createOffer
 * @param {Object} prismaClient - The prisma client instance
 * @param {Object} request - The HTTP request object
 * @param {Object} response - The HTTP response object
 * @returns {Promise<void>} A Promise that resolves when the offer has been created and the HTTP response has been sent.
 * @throws {Error} If there is an error creating the offer.
 * @description
 * - Destructure the application ID and offer state from the request body.
 *  ```js
const { applicationId, offerState } = request.body;
```
 * - Create a new offer in the database using the provided application ID and offer state.
```js
const offer = await prismaClient.offer.create({
data: {
applicationId: applicationId,
state: offerState,
},
});
```
 * - Send a success response with the newly created offer as JSON.
```js
response.status(200).json(offer);
}
```
 * - Send a 400 Bad Request response if there is an error creating the offer.
```js
 catch (error) {
response.status(400);
}
}
```
 */
export async function createOffer(prismaClient, request, response) {
  try {
    const { applicationId, offerState } = request.body;

    const offer = await prismaClient.offer.create({
      data: {
        applicationId: applicationId,
        state: offerState,
      },
    });

    response.status(200).json(offer);
  } catch (error) {
    response.status(400);
  }
}

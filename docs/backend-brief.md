# Industry Knowledge CA - Backend Brief

Noroff has requested a job agency web application to allow for students to interact with industry partners to find placements. As a member of the development team your role will involve the creation of a RESTful API to serve the front end application.

This document outlines the API requirements for this project. It is important to note that this document is not a design document and does not contain any information about the front end application.

## Users

This application uses `roles` to separate users into different groups. These roles are:

- Applicant
- Client
- Administrator

A guest represents an unauthenticated user browsing the site without a login. A guest can view information on the site but cannot interact with this information without registering.

An applicant represents an authenticated student user browsing the site with the intention of creating applications. An applicant can view information on the site and can interact with this information by creating applications and responding to offers.

A client represents an authenticated industry partner user browsing the site with the intention of creating listings and offers. A client can view information on the site and can interact with this information by creating listings and by responding to applications by creating offers.

An administrator represents an authenticated user browsing the site with the intention of managing the site. An administrator can view information on the site and can interact with this information by creating, updating and deleting listings, offers and applications.

Only Clients and Applicants can register and admin users will be added manually by the Product Owner. Clients and Applicants should have their own registration form at a different URL.

### User Endpoints

The following API endpoints are required for Users:

```
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
POST /users/login
```

## Listings

A listing represents an industry partner's job listing. Listings are created by clients and can be viewed by applicants. Listings can be created, updated and deleted by clients. A listing can be viewed by anyone and can be applied to by applicants.

### Listing Endpoints

The following API endpoints are required for Listings:

```
GET /listings
GET /listings/:id
POST /listings
PUT /listings/:id
DELETE /listings/:id
```

## Applications

An application represents an applicant's application to a listing. Applications are created by applicants and can be viewed by clients. Applications can be created, updated and deleted by applicants. An application can be viewed by anyone and can be responded to by clients.

### Application Endpoints

The following API endpoints are required for Applications:

```
GET /applications
GET /applications/:id
POST /applications
PUT /applications/:id
DELETE /applications/:id
```

## Offers

An offer represents an industry partner's offer to an applicant. Offers are created by clients and can be viewed by applicants. Offers can be created, updated and deleted by clients. An applicant can accept or reject an offer.

### Offer Endpoints

The following API endpoints are required for Offers:

```
GET /offers
GET /offers/:id
POST /offers
PUT /offers/:id
DELETE /offers/:id
```

## Recommended Libraries

- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)

These libraries will handle the majority of the databasing and interaction work, but this project may require additional libraries that will be identified by the team. In particular QA will require a testing library to be installed and used.

## Quality Assurance

The QA role is responsible for ensuring that the application is working as expected. This includes testing the application for bugs and ensuring that the application is secure. Testing can be done manually and with the assistance of automated tools. Each team should support their QA in creating test routines that can be used to benchmark the API throughout the project.

## Approach

1. Pass your GitHub username onto your Scrum Master so that you can be added to the team repository.
2. Discuss the requirements as a team and generate work items to split up the tasks into manageable chunks.
3. Once you have committed to at least one work item, create a branch for that task in the repository.
4. Using the recommended technologies, complete your work item and notify your Scrum Master when you are ready for review.
5. Once your work item has been reviewed and approved it will be merged into the `master` branch.
6. If there are remaining work items to complete, repeat this until the end of the scrum period.
7. If there are no remaining work items, offer assistance with other outstanding tasks - especially QA.

## Deliverables

- [ ] Swagger documentation for delivered endpoints
- [ ] A passing test suite for delivered features
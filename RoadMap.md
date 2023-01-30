# Backend Road Map

## General Task List

- Update schema.
  - Add more meta-data
  - blog models?
- Implement Company endpoints.
- Update all endpoints to Company schema.
- Update and expand all tests.
  - mock database and implement automated testing on github.
- Add token validation to all endpoints.
- Ensure frontend only receives data they should have access to.
  - Applicant can see their own applications and offers but not other users.
  - Applicant can't see other users applications and offers on company and listings.
  - Clients can see applications and offers on their company and listings but not others.
- Standardise the code layout, and error responses across all endpoints.

### Future tasks

- User verification through email, to verify email and reset password.
- Email notifications for users and clients for applications and offers.
- Storage for images, pdf and other documentation for applications?.
- Search Implementation.
- Blog feed, with posts, reactions, and comments.

### Additional ideas and requirements?

????

## Code Standardisation

### Middleware

Try to add reusable validation, typically update/delete use identical user verification on each route.

Example middleware for user endpoint.

```js
import { findUserById } from "../../../utilities/findUser.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const validateUser = async function (req, res, next) {
  const id = req.params.id;
  const user = await findUserById(id);

  if (!user) {
    return res.status(401).json({ message: "User does not exist." });
  }

  const token = req.headers.authorization;
  let readyToken = token;
  if (!token) {
    return res.status(401).json({ message: "No authorization header provided." });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  let verified;
  if (readyToken != undefined) {
    verified = await verifyToken(readyToken);

    if (!verified) {
      return res.status(401).json({ message: "Invalid authorization token provided, please re-log." });
    }
  }

  //Throw 401 error if user isn't the correct user
  if (verified.role !== "admin") {
    if (verified.id != id) {
      return res.status(401).json({ message: "You do not have authorization to delete this user." });
    }
  }

  next();
};
```

This is then insert before the controller that handles the request in the route.js

```js
// PUT /users/:id
usersRouter.put("/:id", validateUser, async (req, res) => {
  try {
    const { status, data } = await handleUpdate(req);
    res.status(status).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
});

// DELETE /users/:id
usersRouter.delete("/:id", validateUser, async (req, res) => {
  try {
    const { status, data } = await handleDelete(req);
    res.status(status).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
});
```

### File layout

```
Route
  |- route.js
  |- route.test.js
  |- routeSwaggerDocs.js
  |--- Controllers
  |      |-create.js
  |      |-read.js
  |      |-update.js
  |      |-delete.js
  |--- Middleware
        |-tokenVerification.js
        |-additionalChecks.js

```

### Errors

```js
// unexpected errors in catch blocks return errors with message.
res.status(500).json({
  ...error,
  message: "Internal server error",
});

// Expected errors with user or developer friendly messages.
res.status(400).json({
  message: "Bad Request, skills must be in an array.",
});

//  using express validator
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({
    message: `${errors.array()[0].msg} in ${errors.array()[0].param}${errors.array()[1] ? " and " + errors.array()[1].param : ""} field(s)`,
  });
}
```

## Possible Schema Updates

### User model expansion

```js
model User {
  id           String         @id @default(uuid())
  email        String         @unique
  title        String?
  firstName    String
  lastName     String
  password     String
  profile      String?
  salt         String?
  about        String?
  avatar       String?
  // users git, port and linkedin
  github       String?
  portfolio    String?
  linkedin     String?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  role         UserRole       @default(Applicant)
  // users skills, experience, and education
  skills       String[]       @default([])
  languages    UserLanguage[]
  experience   Experience[]
  education    Education[]
  applications Application[]
  offers       Offer[]
  company      Company?       @relation(fields: [companyId], references: [id])
  companyId    String?
  created      DateTime       @default(now())
  updated      DateTime       @updatedAt
}

enum UserRole {
  Applicant
  Client
  Admin
}

// work experience
model Experience {
  id               String   @id @default(uuid())
  user             User     @relation(fields: [userId], references: [id])
  userId           String
  company          String
  location         String
  start            String
  end              String?
  current          Boolean
  title            String
  description      String?
  responsibilities String[]
}

// education
model Education {
  id          String   @id @default(uuid())
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  institution  String
  location    String
  start       String
  end         String?
  current     Boolean
  course      String
  description String?
  skills      String[]
}

// users languages
model UserLanguage {
  id       String        @id @default(uuid())
  language String
  level    LanguageLevel
  user     User          @relation(fields: [userId], references: [id])
  userId   String
}

// beginner, elementary, lower intermediate, upper intermediate, advanced, fluent.
enum LanguageLevel {
  A1
  A2
  B1
  B2
  C1
  C2
}
```

### Listings model

```js

model Listing {
  id               String         @id @default(uuid())
  title            String
  type             EmploymentType
  // possibly multiple locations to work at?
  location         String[]
  locationtype     LocationType
  tags             String[]
  description      String
  //possible additional optional data
  responsibilities String?
  salary           String?
  positions        Int?
  incentives       String?
  requirements     String[]
  deadline         DateTime
  created          DateTime       @default(now())
  updated          DateTime       @updatedAt
  applications     Application[]
  offer            Offer[]
  company          Company        @relation(fields: [companyId], references: [id])
  companyId        String
  listingsState    ListingState   @default(Active)
}

enum ListingState {
  Active
  Ended
}

enum EmploymentType {
  Fulltime
  Parttime
  Contract
  Internship
}

enum LocationType {
  Onsite
  Hybrid
  Remote
}
```

### Additional meta data on company

```js
model Company {
  id           String        @id @default(uuid())
  name         String        @unique
  admin        User[]
  sector       String
  logo         String
  banner       String?
  phone        String
  email        String
  locations    String[]
  about        String
  website      String
  applications Application[]
  offers       Offer[]
  listings     Listing[]
  created      DateTime      @default(now())
  updated      DateTime      @updatedAt
}
```

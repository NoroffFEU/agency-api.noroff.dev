# User Endpoint Temporary Documentation

## Table Of Contents

1. [Register](#register)
2. [Login](#login)
3. [Get All Users](#login)
4. [Get A User](#login)
5. [Update A User](#login)
6. [Delete A User](#login)

## `POST` /users <a id="register"></a>

## `POST` /users/login <a id="login"></a>

**Request Parameters**

- Expected: Body(Object)
- Content type: application/json

**_Example Value_**

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**_Model_**

    {
    email*	    string($email)
    password*	string
                minLength: 8
    }

**Responses Parameters**

- Code: 200
- Content type: application/json

**_Example Value_**

    {
      userId: String,
      firstName: String,
      lastName: String,
      email: email,
      token: string,
    }

## `GET` /users <a id="get-all-users"></a>

## `GET` /users/:id <a id="get-user"></a>

## `PUT` /users/:id <a id="update-user"></a>

## `DELETE` /users/:id <a id="delete-user"></a>

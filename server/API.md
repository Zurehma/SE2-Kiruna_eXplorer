## Server APIs

For all constraints on request parameters and request body content, always assume a 422 error in case one constraint is not satisfied.
For all access constraints, always assume a 401 error in case the access rule is not satisfied.
For all success scenarios, always assume a 200 status code for the API response.
Specific error scenarios will have their corresponding error code.

### User APIs

### Document APIs

#### GET `api/document`

Returns the list of all documents.

- Request Parameters: _None_
- Request Body Content: _None_
- Response Body Content: An array of **Document** objects.
- Example:

  ```json
  [
    {
        "id": 1,
        "title": "example",
        "stakeholder": "example",
        "scale": 100,
        "issuanceDate": "2024-10-28",
        "connections": 3,
        "language": "english",
        "page": 2,
        "description": "Lore ipsum..."
    },
    ...
  ]
  ```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints: _None_

#### POST `api/document`

Add a new document with the provided information.

- Request Parameters: _None_
- Request Body Content: An object with the following parameters:
  - `title`: a string that must not be empty.
  - `stakeholder`: a string that must not be empty.
  - `scale`: an integer that must be greater than 0. It represent the relationship between the dimensions drawn on a plan or
    architectural drawing and the actual dimensions of the building.
  - `issuanceDate`: a string that represent the date. It must be in the format _YYYY-MM-DD_.
  - `language`: a string that must not be empty.
  - `page`: an integer that must be greater than 0.
  - `description`: a string that must not be empty. It represent a brief description of the document.
- Response Body Content: The newly created **Document** object.
- Example:

  ```json
  {
    "id": 1,
    "title": "example",
    "stakeholder": "example",
    "scale": 100,
    "issuanceDate": "2024-10-28",
    "connections": 0,
    "language": "english",
    "page": 2,
    "description": "Lore ipsum..."
  }
  ```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints:
  - It should return a 400 error when `issuanceDate` is after the current date.

#### POST `api/document/:id/link`

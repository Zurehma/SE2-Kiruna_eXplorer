## Server APIs

For all constraints on request parameters and request body content, always assume a 422 error in case one constraint is not satisfied.
For all access constraints, always assume a 401 error in case the access rule is not satisfied.
For all success scenarios, always assume a 200 status code for the API response.
Specific error scenarios will have their corresponding error code.

### User APIs

#### POST `api/sessions/login`

- Performs user login with username and password

#### DELETE `api/sessions/logout`

- Logs out the user

#### GET `api/sessions/current`

- Returns information of the logged in user
- Example:
  ```json
  {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "username": "johndoe",
    "role": "Urban Planner"
  }
  ```

### Document APIs

#### GET `api/documents`

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

- Access Constraints: _None_
- Additional Constraints: _None_

#### GET `api/documents/document-types`

Returns the list of all document types.

- Request Parameters: _None_
- Request Body Content: _None_
- Response Body Content: An array of strings.
- Example:

```json
["Informative", "Prescriptive", "Material", "Design", "Technical"]
```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints: _None_

#### GET `api/documents/scale-types`

Returns the list of all specific scale types.

- Request Parameters: _None_
- Request Body Content: _None_
- Response Body Content: An array of strings.
- Example:

```json
["Blueprint/effects", "Text"]
```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints: _None_

#### POST `api/documents`

Add a new document with the provided information.

- Request Parameters: _None_
- Request Body Content: An object with the following parameters:
  - `title`: a string that must not be empty.
  - `stakeholder`: a string that must not be empty.
  - `scale`: an integer that must be greater than 0 or a specific value between: [`Blueprint/effects`, `Text`]. It has to be sent as string value. It represent the relationship between the dimensions drawn on a plan or architectural drawing and the actual dimensions of the building.
  - `issuanceDate`: a string that represent the date. It must be in the format _YYYY-MM-DD_.
  - `type`: a string that represent the type. Can be a value between: [`Informative`, `Prescriptive`, `Material`, `Design`, `Technical`].
  - `language`: a string that must not be empty.
  - `pages`: an integer that must be greater than 0. If `pageFrom` and `pageTo` are present, this parameter is ignored and computed as the difference between `pageTo` and `pageFrom`.
  - `pageFrom`: an integer that must be greater than 0.
  - `pageTo`: an integer that must be greater than 0.
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
    "pages": 20,
    "pageFrom": 12,
    "pageTo": 32,
    "description": "Lore ipsum..."
  }
  ```

- Access Constraints: Can only be called by a logged in user whose role is Urban Planner.
- Additional Constraints:
  - It should return a 400 error when `issuanceDate` is after the current date.

#### POST `api/documents/:id/link`

- Request Parameters: `id` - ID of the first document (document being linked from...).
- Request Body: An object with the following fields:

  - `id2`: an integer that is the ID of the second document (...document being linked to)
  - `type`: a string that represents the type of the link. Must be one of the following: [`Direct`, `Collateral`, `Projection`, `Update`]

- Response Body: The newly created link:
- Example:
  ```json
  {
    "docID1": 3,
    "docID2": 4,
    "type": "Direct"
  }
  ```
- Access Constraints: Can only be called by a logged in user whose role is Urban Planner.
- Additional Constraints:
  - It should return a `404` error when document ID does not exist
  - It should return a `422` error if the link type is invalid

## Database Tables

### Table `User`

- Fields: id-name-surname-username-password-salt-role
- Primary key: id
- Description: Each user is uniquely identified through an ID. Role is a string and can be one of: [`Urban Planner`]

### Table `Document`

- Fields: id-title-stakeholder-scale-issuanceDate-type-connections-language-pages-description-lat-long
- Primary key: id
- Description: The table stores information on each document. The information is the one from the cards along with longitude & latitude (NULL default means the document covers the whole area).  
  Each document is uniquely identified by an ID.

### Table `Link`

- Fields: docID1-docID2-type
- Primary key: docID1,docID2
- Description: The tables stores the link between 2 documents and the link type. The link type can be one of: [`Direct`, `Collateral`, `Projection`, `Update`]

### Access Credentials

- Urban Planner:
  - Username: johndoe
  - Password: password

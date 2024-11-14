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
        "language": "English",
        "page": 2,
        "description": "Lore ipsum..."
    },
    ...
  ]
  ```

- Access Constraints: _None_
- Additional Constraints: _None_

#### GET `api/documents/document-types`

Returns the list of already existing document types.

- Request Parameters: _None_
- Request Body Content: _None_
- Response Body Content: An array of strings.
- Example:

```json
["Informative", "Prescriptive", "Material", "Design", "Technical"]
```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints: _None_

#### GET `api/documents/stakeholders`

Returns the list of already existing stakeholders.

- Request Parameters: _None_
- Request Body Content: _None_
- Response Body Content: An array of strings.
- Example:

```json
["KirunaKiruna kommun", "Kiruna kommun/White Arkitekter", "Kiruna kommun/Residents"]
```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints: _None_

#### POST `api/documents`

Add a new document with the provided information.

- Request Parameters: _None_
- Request Body Content: An object with the following parameters:
  - `title`: a string that must not be empty.
  - `stakeholder`: a string that must not be empty.
  - `scale`: an string value between: [`Blueprint/effects`, `Text`, `1:n`]. If the user choose `1:n`, it has to send only the value **n** in integer format. It represent the relationship between the dimensions drawn on a plan or architectural drawing and the actual dimensions of the building.
  - `issuanceDate`: a string that represent the date. It must be in the format _YYYY-MM-DD_.
  - `type`: a string that represent the type. Can be a value between: [`Informative`, `Prescriptive`, `Material`, `Design`, `Technical`].
  - `language`: a string that must not be empty.
  - `description`: a string that must not be empty. It represent a brief description of the document.
  - `coordinates`: an object that must have only two properties: `lat` and `long` that must be valid latitude and longitude values.
  - `pages`: an integer that must be greater than 0. If `pageFrom` or `pageTo` are present, this parameter should not be present.
  - `pageFrom`: an integer that must be greater than 0. It need `pageTo` to be present.
  - `pageTo`: an integer that must be greater than 0. It need `pageFrom` to be present.
- Response Body Content: The newly created **Document** object.
- Example:

  ```json
  {
    "id": 1,
    "title": "example",
    "stakeholder": "example",
    "scale": 100,
    "issuanceDate": "2024-10-28",
    "type": "Informative",
    "connections": 0,
    "language": "English",
    "pages": 20,
    "pageFrom": 12,
    "pageTo": 32,
    "description": "Lore ipsum..."
  }
  ```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints:
  - It should return a 400 error when `issuanceDate` is after the current date.
  - It should return a 400 error when `coordinates` is located in a different place than Kiruna.

#### PUT `api/documents/:docID`

Update an existing document with the provided information.

- Request Parameters: _None_
- Request Body Content: An object with at least one of the following parameters:
  - `title`: a string that must not be empty.
  - `stakeholder`: a string that must not be empty.
  - `scale`: an string value between: [`Blueprint/effects`, `Text`, `1:n`]. If the user choose `1:n`, it has to send only the value **n** in integer format. It represent the relationship between the dimensions drawn on a plan or architectural drawing and the actual dimensions of the building.
  - `issuanceDate`: a string that represent the date. It must be in the format _YYYY-MM-DD_.
  - `type`: a string that represent the type. Can be a value between: [`Informative`, `Prescriptive`, `Material`, `Design`, `Technical`].
  - `language`: a string that must not be empty.
  - `description`: a string that must not be empty. It represent a brief description of the document.
  - `coordinates`: an object that must have only two properties: `lat` and `long` that must be valid latitude and longitude values.
  - `pages`: an integer that must be greater than 0. If `pageFrom` or `pageTo` are present, this parameter should not be present.
  - `pageFrom`: an integer that must be greater than 0. It need `pageTo` to be present.
  - `pageTo`: an integer that must be greater than 0. It need `pageFrom` to be present.
- Response Body Content: _None_

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints:
  - It should return a 400 error when `issuanceDate` is after the current date.
  - It should return a 400 error when `coordinates` is located in a different place than Kiruna.

#### GET `api/documents/link-types`

Returns the list of all specific link types.

- Request Parameters: _None_
- Request Body Content: _None_
- Response Body Content: An array of strings.
- Example:

```json
[
  {
    "name": "Direct"
  },
  {
    "name": "Collateral"
  },
  {
    "name": "Projection"
  },
  {
    "name": "Update"
  }
]
```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints: _None_

#### GET `api/documents/links:id`

- Request Parameters:
  - `id`: ID of the document for which the links are being requested
- Request Body Content: _None_
- Response Body Content: An array where each object is composed of the Document ID and the title of the existing link.
- Example:

```json
[
  {
    "linkedDocID": 1,
    "title": "Compilation of responses “So what the people of Kiruna think?” (15)",
    "type": "Direct"
  },
  {
    "linkedDocID": 2,
    "title": "Detail plan for Bolagsomradet Gruvstad-spark (18)",
    "type": "Direct"
  }
]
```

- Access Constraints: _None_
- Additional Constraints: _None_

#### POST `api/documents/link`

- Request Body: An object with the following fields:

  - `id1`: an integer that is the ID of the first document (document being linked from...)
  - `ids`: an array of integers that are the ID of the documents (...documents being linked to)
  - `type`: a string that represents the type of the link. Must be one of the following: [`Direct`, `Collateral`, `Projection`, `Update`]

- Response Body: The newly created links:
- Example:
  ```json
  {
    "message": "Links added successfully",
    "addedLinks": [
      {
        "id1": 3,
        "id2": 1,
        "type": "Direct"
      },
      {
        "id1": 3,
        "id2": 2,
        "type": "Direct"
      }
    ]
  }
  ```
- Access Constraints: Can only be called by a logged in user whose role is Urban Planner.
- Additional Constraints:
  - It should return a `404` error when document ID does not exist
  - It should return a `409` error when the link already exists
  - It should return a `422` error if the link type is invalid

### Attachment APIs

#### GET `api/documents/:docID/attachments`

Get all the attachment info objects of the document.

- Request Parameters:
  - `docID`: a number that represent the ID of the document.
- Request Body Content: _None_
- Response Body Content: An array of **Attachment info** objects:
- Example:

  ```json
  [
    {
      "id": 1,
      "docID": 1,
      "name": "filename.pdf",
      "path": "uploads/documents/randomfilename.pdf",
      "format": "application/pdf"
    },
    ...
  ]
  ```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints:
  - It should return a 404 error when the attachment does not exist.

#### POST `api/documents/:docID/attachments`

Add a new attachment to a document.

- Request Parameters:
  - `docID`: a number that represent the ID of the document.
- Request Header Content Type: One of the following choices:
  - `application/pdf`.
  - `image/jpg`.
  - `image/png`.
  - `video/mp4`.
- Request Body Content: The file associated with the request.
- Response Body Content: The newly created **Attachment info** object.
- Example:

  ```json
  {
    "id": 1,
    "docID": 1,
    "name": "filename.pdf",
    "path": "uploads/documents/randomfilename.pdf",
    "format": "application/pdf"
  }
  ```

- Access Constraints: Can only be called by a logged in user.
- Additional Contraints:
  - It should return a 400 error when the file mimetype does not match any of the supported mimetypes.
  - It should return a 400 error when the file size exceed supported limits.

#### DELETE `api/documents/:docID/attachments/:attachmentID`

Delete an existing attachment to a document.

- Request Parameters:
  - `docID`: a number that represent the ID of the document.
  - `attachmentID`: a number that represent the ID of the attachment.
- Request Body Content: _None_
- Response Body Content: _None_
- Access Constraints: Can only be called by a logged in user.
- Additional Constraints:
  - It should return a 400 error when the attachment is not linked with the document provided.
  - It should return a 404 error when the attachment does not exist.

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

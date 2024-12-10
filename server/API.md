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

#### GET `api/documents/:id`

Returns the document with the requested id.

- Request Parameters:
  - `id`: a number that represent the id of the document.
- Additional Constraints: _None_
- Response Body Content: A **Document** object.
- Example:

  ```json
    {
        "id": 1,
        "title": "example",
        "stakeholder": ["example"],
        "scale": 100,
        "issuanceDate": "2024-10-28",
        "connections": 3,
        "language": "English",
        "coordinates": {
          "lat": 67.853058,
          "long": 20.294995
         },
        "pages": 2,
        "description": "Lore ipsum..."
    },
    ...
  ```

#### GET `api/documents`

Returns the list of all documents (if filters applied it returns the list of all documents filtered).

- Request Parameters (optional):

  - `title`: a substring that match the title.
  - `description`: a substring that match the description.
  - `type`: a string that represent the type of the document.
  - `stakeholder`: a string that represent the stakeholder of the document.
  - `issuanceDateFrom`: a date that represent the starting date of the filtered document.
  - `issuanceDateTo`: a date that represent the last date in the range.
  - `pageNo`: an integer that represent the page number. If not specified the first page will be retrieved. If the integer specified is bigger than the total number of pages the last page will be retrieved.

- Request Body Content: _None_
- Response Body Content: An object with the list of **Document** objects, the next field is absent if the page retrieved is the last one.
- Example:

  ```json
  {
    "pageNo": 1,
    "totalPages": 4,
    "elements": [
      {
        "id": 1,
        "title": "example",
        "stakeholder": ["example"],
        "scale": 100,
        "issuanceDate": "2024-10-28",
        "connections": 3,
        "language": "English",
        "pages": "1-32",
        "description": "Lore ipsum...",
        "coordinates": {
          "lat": 67.853058,
          "long": 20.294995
        },
      },
      ...
    ],
    "next": "api/documents?pageNo=2"
  }
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
["KirunaKiruna kommun", "White Arkitekter", "Residents"]
```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints: _None_

#### POST `api/documents`

Add a new document with the provided information.

- Request Parameters: _None_
- Request Body Content: An object with the following parameters:
  - `title`: a string that must not be empty.
  - `stakeholders`: a array of strings that must not be empty.
  - `scale`: an string value between: [`Blueprint/effects`, `Text`, `1:n`]. If the user choose `1:n`, it has to send only the value **n** in integer format. It represent the relationship between the dimensions drawn on a plan or architectural drawing and the actual dimensions of the building.
  - `issuanceDate`: a string that represent the date. It must be in the format _YYYY-MM-DD_.
  - `type`: a string that represent the type. Can be a value between: [`Informative`, `Prescriptive`, `Material`, `Design`, `Technical`].
  - `language`: a string that must not be empty.
  - `description`: a string that must not be empty. It represent a brief description of the document.
  - `coordinates`: an optional field that could be an object with the properties `lat` and `long` or an array that contains a list of coordinates in a two values array where the first one is the latitude and the second one is the longitude. All the values must be valid latitude and longitude values.
  - `pages`: an optional string that must not be empty. This string can must have one or multiple numbers and in that case the numbers must be separated with '-' symbol.
- Response Body Content: The newly created **Document** object.
- Example:

  ```json
  {
    "id": 1,
    "title": "example",
    "stakeholders": ["example1", "example2"],
    "scale": 100,
    "issuanceDate": "2024-10-28",
    "type": "Informative",
    "connections": 0,
    "language": "English",
    "coordinates": [
      {
        "lat": 67.87318157366065,
        "long": 20.20047943270466
      }
    ],
    "pages": 20,
    "pageFrom": 12,
    "pageTo": 32,
    "description": "Lore ipsum..."
  }
  ```

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints:
  - It should return a 400 error when `issuanceDate` is after the current date.
  - It should return a 400 error when `coordinates` are located in a different place than Kiruna.

#### PUT `api/documents/:docID`

Update an existing document by providing a new object.

- Request Parameters: _None_
- Request Body Content: An object with the following parameters:
  - `title`: a string that must not be empty.
  - `stakeholders`: a array of strings that must not be empty.
  - `scale`: an string value between: [`Blueprint/effects`, `Text`, `1:n`]. If the user choose `1:n`, it has to send only the value **n** in integer format. It represent the relationship between the dimensions drawn on a plan or architectural drawing and the actual dimensions of the building.
  - `issuanceDate`: a string that represent the date. It must be in the format _YYYY-MM-DD_.
  - `type`: a string that represent the type. Can be a value between: [`Informative`, `Prescriptive`, `Material`, `Design`, `Technical`].
  - `language`: a string that must not be empty.
  - `description`: a string that must not be empty. It represent a brief description of the document.
  - `coordinates`: an optional field that could be an object with the properties `lat` and `long` or an array that contains a list of coordinates in a two values array where the first one is the latitude and the second one is the longitude. All the values must be valid latitude and longitude values.
  - `pages`: an optional string that must not be empty. This string can must have one or multiple numbers and in that case the numbers must be separated with '-' symbol.
- Response Body Content: _None_

- Access Constraints: Can only be called by a logged in user.
- Additional Constraints:
  - It should return a 400 error when `issuanceDate` is after the current date.
  - It should return a 400 error when `coordinates` are located in a different place than Kiruna.

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

#### GET `api/documents/allExistingLinks`

- Request Parameters: _None_
- Request Body Content: _None_
- Response Body Content: The response is a an array of links. Each link has a DocID1, DocID2 and the type of the link.
- Example:

```json
[
  {
    "DocID1": 1,
    "DocID2": 2,
    "type": "Direct"
  },
  {
    "DocID1": 1,
    "DocID2": 3,
    "type": "Projection"
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
  - It should return a `409` error when the link of the same type already exists between a pair of documents
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

- Access Constraints: _None_
- Additional Constraints:
  - It should return a 404 error when the document does not exist.

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

#### GET `api/documents/:docID/attachments/:attachmentID/download`

Start the download of a specific attachment.

- Request Parameters:
  - `docID`: a number that represent the ID of the document.
  - `attachmentID`: a number that represent the ID of the attachment.
- Request Body Content: _None_
- Response Body Content: _None_
- Access Constraints: _None_
- Additional Constraints:
  - It should return a 400 error when the attachment is not linked with the document provided.
  - It should return a 404 error when the attachment does not exist.

## Database Tables

### Table `User`

- Fields: id-name-surname-username-role-password-salt
- Primary key: id
- Description: Each user is uniquely identified through an ID. Role is a string and can be one of: [`Urban Planner`]

### Table `Document`

- Fields: id-title-scale-issuanceDate-type-connections-language-description-coordinates-pages-pageFrom-pageTo
- Primary key: id
- Description: The table stores information on each document. The information is the one from the cards along with an object of coordinates (NULL default means the document covers the whole area).
  - id: Each documents is uniquely identified through an id
  - title: Title of the document
  - scale: Can be one of "Text", "Blueprints/Effects" or a number representing n in "1:n"
  - issuanceDate: can be YYYY, YYYY-MM or YYYY-MM-DD
  - type: Represents the type of the document
  - connections: Represents the number of connections a document has with other documents
  - language: Represents the language of the document
  - description: description of the document
  - coordinates:
  - pages: The number of pages in the document. Optional field. If this exists then pageFrom and pageTo should be NULL
  - pageFrom: Starting of range of pages. Optional field but must exist if pageTo exists. If a range exists then pages should be NULL
  - pageTo: Ending of range of pages. Optional field but must exist if pageFrom exists. If a range exists then pages should be NULL

### Table `Document_Stakeholder`

- Fields: docID-stakeholder
- Primary key: docID, stakeholder
- Description: Stores the relationship between the document and stakeholders. A document can have more than one stakeholder
  - docID: Foreign key that references the DOCUMENT table
  - stakeholder: Name of the stakeholder. Foreign key that references STAKEHOLDER table

### Table `Stakeholder`

- Fields: name
- Primary key: name
- Description: Stores the different stakeholders

### Table `Document_Type`

- Fields: name
- Primary key: name
- Description: Stores the different document types

### Table `Link`

- Fields: linkID-docID1-docID2-type
- Primary key: linkID
- Description: The table stores the link between 2 documents and the link type. The link type references the Link_Type table and can be one of: [`Direct`, `Collateral`, `Projection`, `Update`]

### Table `Link_Type`

- Fields: name
- Primary key: name
- Description: Stores the different link types

### Table `Attachment`

- Fields: docID-id-name-path-format
- Primary key: id
- Description: The table stores information about attachments being added for a document.
  - docID: document to which the attachment refers to
  - name: name of the document
  - path: path to the document
  - format: format of the document

### Access Credentials

- Urban Planner:
  - Username: johndoe
  - Password: password

# SE2-Kiruna_eXplorer

## User APIs
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

## Document APIs
#### GET `api/document`
- Return all the documents in the document table
- Example: 
  [
  {
    "id": 2,
    "title": "Compilation of responses “So what the people of Kiruna think?”",
    "stakeholder": "Kiruna kommun/Residents",
    "scale": "Text",
    "issuaceDate": "2007",
    "type": "Informative document",
    "connections": 3,
    "language": "Swedish",
    "pages": 1,
    "description": "This document is a compilation of the responses to the survey"
  }
  ]

## Database Tables
### Table `User`
- Fields: id-name-surname-username-password-salt-role
- Primary key: id
- Description: Each user is uniquely identified through an ID. Role is a string and can be one of: [`Urban Planner`]

### Table `Document`
- Fields: id-title-stakeholder-scale-issuanceDate-type-connections-language-pages-description
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



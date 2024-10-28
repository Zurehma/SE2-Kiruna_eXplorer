# SE2-Kiruna_eXplorer

## Database Table
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



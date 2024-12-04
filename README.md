# SE2-Kiruna_eXplorer

## Overview
Kiruna Explorer is a document management application designed to support the relocation project of Kiruna, Sweden. The platform enables users to view, add, modify, and study documents related to various aspects of the relocation process. 

## Features
- Users can view on the map documents related to different areas of Kiruna
- Users can view on the diagram the relationship between different documents
- Urban Planners can login and access a variety of other features that include:
  - Adding documents
  - Modifying documents
  - Adding links between documents
  - Uploading resources for documents
  - Filtering and searching for documents

## Installation
The Kiruna Explorer project can be set up quickly using Docker. Follow the instructions provided in the `Docker_Instructions.md` file to build and run the application in a containerized environment.

## Testing Strategy
1. Unit and Integration Testing (Backend):  
    Conducted using Jest to verify the functionality and integration of individual modules and services.

2. Frontend Testing:  
    Initially performed with React Testing Library, but due to complex component dependencies, manual testing was adopted from the third sprint onward.

3. Manual End-to-End (E2E) Testing:  
    Detailed manual E2E testing scenarios and results are documented in the `e2e_test` directory.

4. Automated End-to-End (E2E) Testing:  
    Utilizes Cypress for automated testing of user flows and critical functionalities to ensure seamless user experience across different environments.

### Access Credentials

- Urban Planner:
  - Username: johndoe
  - Password: password

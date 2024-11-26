# End 2 End testing

## Tests for the Popup shown in the map, in the documents page accessible to logged in users and in the single document page. All the following tests must be done on all the three pages, the exact same outcome is expected since the component is the same.

## Tests to open a Popup in the map and in the documents page are taken in the appropriate section

#### Test 1: Open a popup and check for the reported information (Logged-in User)
Steps:
1. Open a popup in all the three aforementioned ways

**Expected Results:**
- All the relevant information are listed: stakeholders,issuance date,type,attachments (if present), title, pages, range of pages (if present),connections and description. There should also be a button on the top-right corner that redirects you to the modify form with the same information contained in the popup (refer to cypress tests).

#### Test 2: Repeat the previous test when not logged in, the procedure is the same

**Expected Results:**
- All the relevant information are listed: stakeholders,issuance date,type,attachments (if present), title, pages, range of pages (if present),connections and description. There are no buttons that allows you to modify the document.

#### Test 3: Download an attachment (Logged-in User)
Steps:
1. Open a popup in all the three aforementioned ways
2. Click on one of the attachment in the first column (if present, otherwise look for a document where it is present)

**Expected Results:**
- The browser should start the download of the attachment on which you clicked. Verify that the title of the downloaded attachment is consistent with the one reported in the popup.

#### Test 4: repeat the previous test as visitor/citizen, the expected outcame is the same

#### Test 5: Open a document connected to the current one (Logged-in User)
Steps:
1. Open a popup in all the three aforementioned ways
2. Verify that, if the number of connections is greater than 0, a dropdown menu is available
3. Click on the arrow, a list of connected documents should open
4. Click on one of the titles 

**Expected Results:**
- A page containing the information regarding the clicked document should open, verify that it is consistent with the one you clicked on and that all relevant information are present (repeat test 1).

#### Test 6: repeat the previous test as a citizen/visitor, the expected outcame is the same

#### Test 7: when test 5 and 6 are complete, try to go back to the previous page with the 'back' button (logged-in)

Steps:
1. Complete test 5 or 6 
2. There should be a button with 'back' in the top-left corner, right over the popup card
3. Click on it

**Expected Results:**
- You go back to the page where you were previously: it could be the map or the list of documents.

#### Test 8: repeat the previous test, the expected outcame is slightly different: you cannot be redirected to the list of documents because as citizen/visitor you do not have access to it, the only possibility is to be redirected to the map.







# End 2 End testing

## Tests for Stories KX4 and KX11

### [ ] Map-Based Document Management Features

In this section, we verify that logged-in users can use the filtering options, perform map operations (zoom, center), and interact with documents assigned to specific locations.

#### Test 1: Filtering Documents by Type (Logged-in User)
Steps:
1. Log in to the application with valid credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map".
3. Locate the "Filter" button on the top right of the map.
4. Click on the "Filter" button.
5. Select different document types (e.g., Design, Informative, Prescriptive) from the dropdown.
6. Observe the changes on the map after each selection.

**Expected Results:**
- Only documents of the selected type are visible on the map.
- If "All" is selected, all available documents are displayed.
- The filtered documents should update dynamically according to the chosen type.

#### Test 2: Accessing Filtering Without Logging In (Not Logged-in User)
Steps:
1. Attempt to access the map page without logging in.
2. Try to use the "Filter" button to filter documents.

**Expected Results:**
- The "Filter" button should be either disabled or not visible.

#### Test 3: Zooming In and Out
Steps:
1. Log in to the application with valid credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Locate the "+" and "-" buttons on the left-hand side of the map.
4. Click on the "+" button to zoom in.
5. Click on the "-" button to zoom out.

**Expected Results:**
- Clicking the "+" button should zoom in smoothly, increasing the level of detail.
- Clicking the "-" button should zoom out smoothly, showing a broader view of the map.
- The zooming should be smooth without lag, and document markers should remain in the correct positions.

#### Test 4: Centering the Map
Steps:
1. Log in to the application with valid credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Locate and click the "Recenter" button (circular arrow icon) on the left-hand side of the map.
4. Pan the map to a different location.
5. Click the "Recenter" button.

**Expected Results:**
- The map should return to the original centered location upon clicking the "Recenter" button.
- All documents and markers visible initially should be displayed correctly again.

#### Test 5: Viewing Document Details within the Triangle
Steps:
1. Verify that a "Modify" button is visible in the right-hand side panel for logged-in users.
2. Click the "Modify" button and ensure it redirects to /documents/{id} where {id} corresponds to the selected document's ID.

Expected Results:
1. The "Modify" button should be visible for logged-in users in the details panel.
2. Clicking the "Modify" button should redirect the user to the appropriate document's edit page.

#### Test 6: Viewing General Documents Outside the Triangle
Steps:
1. Log in to the application with valid credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Locate document markers that are outside the blue triangle.
4. Click on these general document markers to view their details.

**Expected Results:**
- General documents not assigned to a specific location within the triangle should be clickable.
- The details of these documents should be displayed similarly to those within the triangle, with complete information.

#### Test 7: Filter Interaction with Map Display
Steps:
1. Log in to the application.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Apply a filter using the "Filter" dropdown to select a specific document type (e.g., "Design").
4. Observe the markers on the map after applying the filter.
5. Zoom in or out and check the visibility of filtered markers.

**Expected Results:**
- Only the filtered documents of the selected type should be visible.
- Zooming in or out should not change the type of documents displayed; the filter should remain in effect.
- The markers within the triangle should disappear if they do not match the selected filter.

#### Test 8: Marker Interaction and Popup Behavior
Steps:
1. Log in to the application.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Click on a document marker within the blue triangle.
4. Observe the popup displaying document details.
5. Click on the "x" button to close the popup.

**Expected Results:**
- The document details should be displayed in a popup after clicking the marker.
- Clicking the "x" button should close the popup smoothly without affecting the map view or other markers.

#### Test 9: Accessibility and Responsiveness of Map Elements
Steps:
1. Log in to the application.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
4. Ensure all map functionalities (filter, zoom, document selection) remain accessible.
5. Use a screen reader (e.g., NVDA) to navigate the map.

**Expected Results:**
- The map and filter panel should be fully responsive and functional across all screen sizes.
- The "Filter" button and zoom controls should be easily accessible on all devices.
- The screen reader should be able to read out map features, including buttons, markers, and popups.

#### Test 10: No Documents Assigned in a Filtered Search
Steps:
1. Log in to the application with valid credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Apply a filter that results in no documents being displayed (e.g., a document type that doesn’t exist in the current selection).
4. Observe the map behavior.

**Expected Results:**
- A message stating "No documents found" should be displayed.
- The map should remain visible but with no document markers.
- The user should be able to modify or reset the filter to return to the previous view.

# E2E Testing related to the version delivered for sprint 3 (functionalities related to the previous sprint are still tested, refer to the previous documentation)

#### Test 1: Change of the view of the map when logged in
Steps:
1. Login using credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
4. Try to open the drop-up menù on the bottom-left corner
5. 4 options should be visible, 'satellite' should be the default one
6. Try to click all the other 3 options in the menu

**Expected Results:**
- The view of the map changes
- The dropdown closes, you can click on it again and repeat step 5 and 6
#### Test 2: Change of the view of the map when not logged in
Steps:
1. Navigate to the map by selecting "Relocation of Kiruna" from the home page.
2. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
3. Try to open the drop-up menù on the bottom-left corner
4. 4 options should be visible, 'satellite' should be the default one
5. Try to click all the other 3 and verify that the view of the map changes
   
**Expected Results:**
- The view of the map changes
- The dropdown closes, you can click on it again and repeat step 5 and 6

#### Test 3: Open the modal containing documents without coordinates when logged in 
Steps:
1. Login using credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
4. Try to click on the button on the top-right corner, 'Kiruna municipality'


**Expected Results:**
- A modal opens in the center of the page, it contains documents without coordinates (just one by now)
- The modal has a search bar in which you should be allowed to type and a button to close it 

#### Test 4: Repeat the previous steps when not logged in, the expected result should be the same

#### Test 5: Try to open a document without coordinates
Steps:
1. Login using credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
4. Try to click on the button on the top-right corner, 'Kiruna municipality'
5. When the modal opens, click on the document without coordinates


**Expected Results:**
- The modal closes, the popup related to the document opens and the area of the municipality appears
- By clicking on the close button or on any other place of the map, the popup closes and the area disappears

 #### Test 6: Try to open a document without coordinates when not logged in, the steps and the expected result is the same as before

#### Test 7: Verify that the new clustering capability works when logged in 
Steps:
1. Login using credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
4. Try to click on a cluster and then go back re-centering the map

**Expected Results:**
- When the cluster contains icons that are close but not in the same position, the zoom is increased and the map centered over the icons contained in the cluster or over the subclusters, depending on which one you clicked, verify that numbers reported in the cluster are coherent 
- When the cluster contains documents that are exactly in the same position, they are spiderfied, making clear that they belong to the same point
  
#### Test 8: Repeat the previous procedure when not logged in, the expected outcame is the same

#### Test 9: Try to open a popup related to a document with coordinates when logged-in
Steps:
1. Login using credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
4. Try to click on a cluster until you don't see an icon
5. Click on the icon

**Expected Results:**
- A popup opens, verify that all the informations are available in the card 
- If in the card the area is mentioned, you should be able to see it on the map, otherwise no

#### Test 10: Repeat the previous procedure as a normal user, the expected outcame is the same, except that the modify button on the top-right corner of the map should not be visible

#### Test 11: Try to open a document linked to the one currently open
Steps:
1. Login using credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
4. Try to click on a cluster until you don't see an icon
5. Click on the icon
6. If there are connections to that document, an arrow to open a dropdown should be visible
7. Click on the arrow, the list of connections should appear in the form title-typeOfLink
8. Click on the title of one of the connections

**Expected Results:**
- A page with the card of the connected document opens
- You should be able to see a card with all the informations and a button on the top-left corner that allows you to go back to the map

#### Test 12: Try to open a document linked to the one currently open when not logged in

#### Test 13: See the cumulative area, KX11
Steps:
1. Login using credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Resize the browser window to different dimensions (e.g., mobile, tablet, desktop).
4. Try to click on all the document
**Expected Results:**
- At the end, the cumulative area of the documents with an associated area can be seen.

#### Test 14: Close areas
Steps:
1. Repeat all the steps of test 13
2. Try to close areas with the dedicated button shown in the lowest point of the area.
**Expected Results:**
- At the end, the cumulative area of the documents should not be visible anymore once all have been closed.


# End 2 End testing

## Tests for Stories

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
1. Log in to the application with valid credentials.
2. Navigate to the map by either:
   - Selecting "Relocation of Kiruna" from the home page.
   - Using the dropdown menu in the menu bar and selecting "Map."
3. Locate the blue triangle on the map that contains several document markers.
4. Click on a document marker within the triangle.
5. Observe the document details displayed on the right-hand side panel.

**Expected Results:**
- Clicking on a document marker should open the detailed information of the selected document.
- The details should include stakeholder information, scale, issue date, language, pages, and description.
- The attachment section should be visible even if there are no attachments added.

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



# Not Logged-In User Tests

## Test 1: Accessing the Map without Logging In
**Steps:**
1. Navigate to the application without logging in.
2. From the homepage, click on "Relocation of Kiruna."

**Expected Results:**
- The map should load successfully with default document markers visible.
- The filter button should not be visible or accessible.

---

## Test 2: Interacting with Map Markers
**Steps:**
1. Navigate to the map page by clicking "Relocation of Kiruna" from the homepage without logging in.
2. Locate document markers on the map.
3. Click on a document marker to view its details.

**Expected Results:**
- The details of the document should display correctly in a popup.
- The popup should include stakeholder information, scale, issue date, language, pages, and description.
- No "Modify" button should be present in the popup.

---

## Test 3: Zooming In and Out
**Steps:**
1. Navigate to the map page by clicking "Relocation of Kiruna" from the homepage without logging in.
2. Locate the "+" and "-" buttons on the left-hand side of the map.
3. Click the "+" button to zoom in.
4. Click the "-" button to zoom out.

**Expected Results:**
- The map should zoom in and out smoothly.
- Document markers should remain in their correct positions and adjust according to the zoom level.
- The functionality should not differ from logged-in users for zooming.

---

## Test 4: Centering the Map
**Steps:**
1. Navigate to the map page by clicking "Relocation of Kiruna" from the homepage without logging in.
2. Locate and click the "Recenter" button (circular arrow icon) on the left-hand side of the map.
3. Pan the map to a different location.
4. Click the "Recenter" button.

**Expected Results:**
- The map should return to its default centered location.
- All initial document markers should display correctly again.

---

## Test 5: No Access to Filtering
**Steps:**
1. Navigate to the map page by clicking "Relocation of Kiruna" from the homepage without logging in.
2. Check for the presence of the "Filter" button on the top right of the map.

**Expected Results:**
- The "Filter" button should not be visible or accessible.
- Users should not be able to apply filters to document markers on the map.

## Tests related to the functionalities of the map developed during the third sprint for the normal user (not logged in) are reported in the file manual_map_logged_in_user.md, since the new functionalities are the same both for citizens/visitors and urban planners.
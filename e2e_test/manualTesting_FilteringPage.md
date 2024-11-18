# End-to-End Testing

## Tests for Stories

### Filtering Page

In this section, we have verified the behavior of the filtering page for both logged-in and not-logged-in users. Below are the test cases categorized by functionality.

---

### Test 1: Navigation to the Filtering Page (Logged-in User)

**Objective:** Verify that logged-in users can navigate to the filtering page via the dropdown menu.

**Steps:**
1. Log in to the application with valid credentials.
2. Locate the dropdown menu in the top-right corner of the page.
3. Click the dropdown menu to reveal options.
4. Select "View All Documents" from the menu.

**Expected Results:**
- The filtering page opens successfully.
- Filtering options (Stakeholder, Document Type, Date Type) and the list of documents are displayed.

---

### Test 2: Accessing the Filtering Page via URL (Not Logged-in User)

**Objective:** Verify that not-logged-in users cannot access the filtering page and are redirected to the "Access Denied" page.

**Steps:**
1. Log out of the application if logged in.
2. Manually enter the URL for the filtering page in the browser (e.g., `http://localhost:5173/documents/all`).
3. Press "Enter" to load the page.

**Expected Results:**
- The user is redirected to the "Access Denied" page.
- The page displays an appropriate message, such as "403 Forbidden," with options to log in or return to the home page.
- No documents, filters, or content from the filtering page are visible.

---

### Test 3: Behavior of "Access Denied" Page

**Objective:** Verify that the "Access Denied" page is displayed correctly for not-logged-in users attempting to access the filtering page.

**Steps:**
1. Access the filtering page URL (`http://localhost:5173/documents/all`) without logging in.
2. Observe the content displayed on the page.

**Expected Results:**
- The "Access Denied" page is shown.
- The page includes the following elements:
  - A clear message indicating the user does not have permission (e.g., "403 Forbidden").
  - Buttons or links to:
    - Redirect to the login page.
    - Return to the home page.
  - Optionally, an image or meme to make the experience engaging.

---

### Test 4: Applying Filters for Logged-in Users

**Objective:** Verify that logged-in users can apply filters to narrow down the list of documents.

**Steps:**
1. Log in to the application.
2. Navigate to the filtering page via the dropdown menu.
3. Apply various filters (e.g., Stakeholder, Document Type, Single Date, or Date Range).
4. Observe the filtered results.

**Expected Results:**
- Filters are applied successfully, and only matching documents are displayed.
- Each active filter is clearly indicated.

---

### Test 5: Combining Filters for Logged-in Users

**Objective:** Verify that logged-in users can combine multiple filters to refine the document list further.

**Steps:**
1. Log in to the application.
2. Navigate to the filtering page.
3. Apply a combination of filters (e.g., Stakeholder, Document Type, Date Type).
4. Observe the filtered results.

**Expected Results:**
- Filters are applied in combination, and only documents matching all criteria are displayed.
- Active filters are visible and clearly labeled.

---

### Test 6: No Documents Found (Logged-in Users)

**Objective:** Verify the behavior when logged-in users apply filters that yield no results.

**Steps:**
1. Log in to the application.
2. Navigate to the filtering page.
3. Apply a set of filters that do not match any documents (e.g., a non-existent stakeholder and date range).
4. Observe the page behavior.

**Expected Results:**
- A "No documents found" message is displayed.
- Users can modify or reset the filters to perform another search.



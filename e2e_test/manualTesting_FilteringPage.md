
# End 2 End testing

## Tests for Stories

### [ ] Filtering Page

In this section, we have verified the behavior of the filtering page for both logged-in and not-logged-in users. Below are the test cases categorized by functionality.

#### Test 1: Navigation to the Filtering Page (Logged-in User)

**Steps:**

1. Log in to the application with valid credentials.
2. Locate the dropdown menu in the top-right corner of the page.
3. Click the dropdown menu to reveal options.
4. Select "View All Documents" from the menu.

**Expected Results:**

- The filtering page opens successfully.
- Filtering options (Stakeholder, Document Type, Date Type) and the list of documents are displayed.

#### Test 2: Accessing the Filtering Page via URL (Not Logged-in User)

Steps:

1. Log out of the application if logged in.
2. Manually enter the URL for the filtering page in the browser (e.g., `http://localhost:5173/documents/all`).
3. Press "Enter" to load the page.

**Expected Results:**

- The user is redirected to the "Access Denied" page.
- The page displays an appropriate message, such as "403 Forbidden," with options to log in or return to the home page.
- No documents, filters, or content from the filtering page are visible.

#### Test 3: Behavior of "Access Denied" Page

Steps:

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

#### Test 4: Applying Filters for Logged-in Users

Steps:

1. Log in to the application.
2. Navigate to the filtering page via the dropdown menu.
3. Apply various filters (e.g., Stakeholder, Document Type, Single Date, or Date Range).
4. Observe the filtered results.

**Expected Results:**

- Filters are applied successfully, and only matching documents are displayed.
- Each active filter is clearly indicated.

#### Test 5: Combining Filters for Logged-in Users

Steps:

1. Log in to the application.
2. Navigate to the filtering page.
3. Apply a combination of filters (e.g., Stakeholder, Document Type, Date Type).
4. Observe the filtered results.

**Expected Results:**

- Filters are applied in combination, and only documents matching all criteria are displayed.
- Active filters are visible and clearly labeled.

#### Test 6: No Documents Found (Logged-in Users)

Steps:

1. Log in to the application.
2. Navigate to the filtering page.
3. Apply a set of filters that do not match any documents (e.g., a non-existent stakeholder and date range).
4. Observe the page behavior.

**Expected Results:**

- A "No documents found" message is displayed.
- Users can modify or reset the filters to perform another search.

#### Test 7: Toggling the Filter Panel with Filter Icon

Steps:

1. Log in to the application.
2. Locate the filter icon on the filtering page.
3. Click the filter icon to open the filter panel.
4. Observe the opened filter panel and available options.
5. Click the "Close filtering page" button to close the panel.

**Expected Results:**

- Clicking the filter icon successfully opens the filter panel.
- All filter options (Stakeholder, Document Type, Date Type) are displayed.
- Clicking the "Close filtering page" button closes the panel.
- The main content of the page remains accessible when the filter panel is closed.

#### Test 8: Responsiveness of the Filtering Panel

Steps:

1. Log in to the application.
2. Resize the browser window to simulate different screen sizes (e.g., desktop, tablet, and mobile).
3. Observe the behavior of the filter panel.
4. Attempt to open and close the filter panel using the filter icon.
5. Apply filters and observe the results on different screen sizes.

**Expected Results:**

- The filtering panel is fully responsive across different screen sizes.
- On smaller screens (e.g., tablet or mobile), the filter panel should overlay the main content smoothly when opened.
- The "Close filtering page" button and filter icon are easily accessible on all screen sizes.
- All filtering functionality (applying filters, modifying filters, etc.) works properly regardless of the screen size.


#### Test 9: Persisting Filter State after Closing Panel

Steps:

1. Log in to the application.
2. Open the filter panel using the filter icon.
3. Apply some filters (e.g., Stakeholder and Date Type).
4. Close the filter panel using the "Close filtering page" button.
5. Reopen the filter panel using the filter icon.

**Expected Results:**

- The previously selected filters remain active and visible when the panel is reopened.
- Users do not lose their filter settings upon closing and reopening the filter panel.

# Route-Based Test Cases

## Test 1: Accessing a Valid Route Without Logging In
**Steps:**
1. Ensure you are not logged in.
2. Navigate to any of the following valid routes:
   - `/documents`
   - `/documents/links`
   - `/documents/all`
   - `/documents/:id`

**Expected Results:**
- The "Access Denied" page should be displayed with:
  - A message: "Oops! You don't have permission to access this page."
  - A "Go to Login" button redirecting to the login page.
  - A "Return to Home" button redirecting to the homepage.

---

## Test 2: Accessing an Invalid Route Without Logging In
**Steps:**
1. Ensure you are not logged in.
2. Navigate to a non-existent route (e.g., `/invalidroute`).

**Expected Results:**
- The "404 Not Found" page should be displayed with:
  - A message: "The page you are looking for does not exist."
  - A "Go Home" button redirecting to the homepage.

---

## Test 3: Accessing a Valid Route While Logged In
**Steps:**
1. Log in to the application with valid credentials.
2. Navigate to each of the following valid routes:
   - `/documents`
   - `/documents/links`
   - `/documents/all`
   - `/documents/:id`

**Expected Results:**
- Each valid route should load the appropriate component:
  - `/documents` displays the "Documents" page.
  - `/documents/links` displays the "Links" page.
  - `/documents/all` displays the "Filtering Documents" page.
  - `/documents/:id` displays the document details for the specified ID.
- No "Access Denied" page should be shown.

---

## Test 4: Accessing an Invalid Route While Logged In
**Steps:**
1. Log in to the application with valid credentials.
2. Navigate to a non-existent route (e.g., `/randomurl`).

**Expected Results:**
- The "404 Not Found" page should be displayed with:
  - A message: "The page you are looking for does not exist."
  - A "Go Home" button redirecting to the homepage.

---

## Test 5: Verifying "Go to Login" and "Return to Home" Functionality (For Access Denied Page)
**Steps:**
1. Ensure you are not logged in.
2. Navigate to a restricted route (e.g., `/documents`).
3. On the "Access Denied" page, click the "Go to Login" button.
4. Navigate back to the "Access Denied" page and click the "Return to Home" button.

**Expected Results:**
- Clicking "Go to Login" redirects to the login page.
- Clicking "Return to Home" redirects to the homepage.

---

## Test 6: Verifying "Go Home" Button Functionality (For 404 Page)
**Steps:**
1. Navigate to a non-existent route (e.g., `/nonexistent`).
2. On the "404 Not Found" page, click the "Go Home" button.

**Expected Results:**
- Clicking "Go Home" redirects to the homepage.

---

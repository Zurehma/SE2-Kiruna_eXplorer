# Logged-In User Tests for Home Page

## Test 1: Accessing the Home Page
**Steps:**
1. Log in to the application with valid credentials.
2. Navigate to the homepage.

**Expected Results:**
- The homepage should display:
  - A welcoming message with the logged-in username (e.g., "Welcome, johndoe").
  - A menu bar with options: "Map," "Add Document," "Add Link," "View All Documents," and "Logout."
  - Two buttons: 
    - "Relocation of Kiruna"
    - "Why do we need this relocation?"
- The "Kiruna" logo in the top-left corner should redirect to the homepage when clicked.

---

## Test 2: Clicking "Relocation of Kiruna" Button
**Steps:**
1. On the homepage, locate and click the "Relocation of Kiruna" button.

**Expected Results:**
- The application should redirect to the map page.

---

## Test 3: Clicking "Why do we need this relocation?" Button
**Steps:**
1. On the homepage, locate and click the "Why do we need this relocation?" button.

**Expected Results:**
- The application should display a short explanation about the relocation of Kiruna.
- A "Back to Home" button should be visible and functional.
- Clicking "Back to Home" should redirect back to the homepage.

---

## Test 4: Using the Menu Bar
**Steps:**
1. Log in to the application and locate the menu bar in the top-right corner.
2. Click on each menu item ("Map," "Add Document," "Add Link," "View All Documents," "Logout") and verify functionality.

**Expected Results:**
- **Map:** Redirects to the map page.
- **Add Document:** Redirects to the "Add Document" form page.
- **Add Link:** Redirects to the "Add Link" form page.
- **View All Documents:** Redirects to the list of all documents.
- **Logout:** Logs the user out and redirects to the homepage for not logged-in users.

---

## Test 5: Clicking "Kiruna" Logo
**Steps:**
1. Log in to the application and navigate to any page.
2. Click the "Kiruna" logo in the top-left corner.

**Expected Results:**
- The application should redirect to the homepage.
- The logged-in welcome message and menu bar should still be visible.
- The "Relocation of Kiruna" and "Why do we need this relocation?" buttons should remain functional.

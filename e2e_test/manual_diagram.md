# End 2 End testing

## Tests for Stories KX10 and KX14

## Tests reported here regarding the visualization of the diagram are the same for what concerns urban planners and other users. Other tests, referring to the possibility to click on an icon and see the card of the associated document, are only for logged-in user (the feature is only accessible for them).

#### Test 1: You can see the diagram under the map
Steps:
1. Navigate to the map by selecting "Relocation of Kiruna" from the home page.
2. Scroll down under the map

**Expected Results:**
- You should be able to visualize the diagram, made of the legend (on the left) and documents with their connections;
- If the screen is large, the legend is immediately visible, otherwise, if using it from a phone, you have the possibility to open the legend through a button that opens a modal;
- Verify that the number of documents shown in the map is coherent with the number of icons appearing in the diagram.

### Test 2: Log in with correct credentials and repeat the previous test. The expected result is the same, but the map can be reached not only from the home page, but also through the menu in the navigation bar

### Test 3: Click on an icon when logged in
Steps:
1. Navigate to the map by selecting "Relocation of Kiruna" from the home page or from the menu in the navbar;
2. Scroll down under the map;
3. Click on an icon.

**Expected Results:**
- A page opens with the card representing the clicked document;
- Verify that the type of document is coherent with the one you clicked, do the same for the number of connections;
- Verify that, by clicking 'back', you return to the page showing the map and the diagram.

### Test 4-n: Repeat Test 3 for all the icons shown in the diagram, ensuring that the document appearing is always different and coherent.

# Tests related to the fourth sprint. Repeat also the previous tests, but the diagram now is in a separated page with respect to the map to improve readability of both


# The first tests we are reporting can be executed by both Urban planners and visitors and are related to KX10 and KX15. Follow the procedure of the following test to reach the diagram.
### Test 5: Filter documents in the diagram
Steps:
1. Navigate to the diagram using the appropriate button in the navbar or in the home page;
2. Click on the button in the bottom-left of the screen ('Legend & Filter').

**Expected Results:**
- A side bar opens, with the legend and a menu containing advanced filters. In particular, filters allow to filter by stakeholder and document type.

### Test 6: Filter documents in the diagram
Steps:
1. Navigate to the diagram using the appropriate button in the navbar or in the home page;
2. Click on the button in the bottom-left of the screen ('Legend & Filter').
3. Open the dropdown menu containing filters;
4. Try different combinations of filters.

**Expected Results:**
- You should see in the background that the diagram is changing. When there are no documents associated with the filtering combination, a page displaying 'No documents found' appears. Moreover, if u try to close and open again the filtering side bar, the configuration set for filters is kept. With respect to the view all documents page, filtering by date is not allowed because it is already an information shown on the x axis of the diagram, so, filtering by date, the diagram wouldn't lose meaning. 

# The following tests refers to the urban planner only and requires authentication (thus can be performed also by the admin).

### Test 7: Move a document
Steps:
1. Navigate to the diagram using the appropriate button in the navbar or in the home page;
2. Try to move a document;

**Expected Results:**
- You should be allowed to move a document within its cell and the position in which it is placed is stored. This can be verified by opening two different pages or by changing pages.

### Test 8: Move a link
Steps:
1. Navigate to the diagram using the appropriate button in the navbar or in the home page;
2. Try to move a link by using the control point over the link

**Expected Results:**
- You should be allowed to move it and everything it has been said as expected result of the previous test is valid also in this context.

### Test 8: Delete a link
Steps:
1. Navigate to the diagram using the appropriate button in the navbar or in the home page;
2. Try to hoover on different link;
3. Click the 'Delete' button for one or more of them;

**Expected Results:**
- You should see that, by hoovering on the links and documents, informations about them appears. In particular, regarding links, there's also the possibility to delete them if you are authenticated. By doing it, the diagram is promptly updated and the deleted link is not visible anymore. Obviously, the modification is permanent and this is also made clear through a message in a modal.






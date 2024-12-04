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


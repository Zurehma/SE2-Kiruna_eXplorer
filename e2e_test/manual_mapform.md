# End 2 End testing

## Tests for Stories KX9 and KX19 (some of the tests reported here are also automated through cypress)

## The following tests are about setting a position for a doc when adding it, so, they are feasible only for urban planners

#### Test 1: You can see the small map in the form (step 3) and you can enlarge it
Steps:
1. Perform Login as Urban planner;
2. Through the button in the Navbar, move to the form to add a document (Add Document);
3. Complete and fill necessary fields in the first two steps;
4. In the third step, you should see a small map, try to enlarge it with the button on the top_right.


**Expected Results:**
- You should be able to open the map (overlayed over the screen). You should see a menù on the bottom left, a recenter button in the top-left and a button to close the map from full screen on the top right. The default option selected in the menu should be 'explore'.

#### Test 2: Open the map and try to move to predefined position
Steps:
1. Follow the steps of Test 1;
2. Select the second option in the menu, 'Predefined position';
3. Move around existing documents and clusters.

**Expected Results:**
- You should be able to see all the documents associated to a position. It should also appear a filter bar on the top-right that allows you to filter by title. Moreover, when hoovering on the document, you should be able to see the title. If clicked, the icon becomes yellow and a popup appears showing the title of the document.
  
#### Test 3: Open the map and try to select a document with predefined position
Steps:
1. Follow the steps of Test 2;
2. Select a document;
3. Close the map.

**Expected Results:**
- If the document selected was related to a specific point, you should only see the yellow icon and the title. Otherwise, also the area appears. When you close the map, you should see the point/area selected. 

#### Test 4: Open the map and try to select a document with predefined position, change it later
Steps:
1. Follow the steps of Test 3;
2. Reopen the map and select another document.


**Expected Results:**
- The previously selected document should become as it was originally, while the new one becomes yellow and the popup opens again. If closing the map, also the stored position changes.

#### Test 5: Open the map and try to select a custom point
Steps:
1. Follow the steps of Test 1;
2. Move to the third option, 'Custom Point';
3. Select a point in the map over the blue area.

**Expected Results:**
- A marker should appear in the map, if the map is closed the point is stored. Alse, in the menu two boxes should be apppeared allowing to insert coordinates by hand. When the icon is placed, numerical values inside those should appear automatically.

#### Test 7: Open the map and try to place a custom point outside the Kiruna municipality (blue area) by clicking on the map
Steps:
1. Follow the steps of Test 4;
2. Click on a point of the map that is not blue (kiruna municipality)

**Expected Results:**
- The marker is not placed, that position is not allowed.
  

#### Test 8: Open the map and try to draw a custom area
Steps:
1. Follow the steps of Test 1;
2. Move in the fourth option of the menu;
3. Use instruments on the right to draw an area.

**Expected Results:**
- You are able to place as many points as you want to describe a polygon. When you click on 'finish', the polygon is saved. If you try to place a second polygon, an alert appears without saving the second document.

#### Test 9: Open the map and try to draw a custom area, then modify it
Steps:
1. Follow the steps of Test 8;
2. Modify the area with the button on the right


**Expected Results:**
- You should be able to modify and confirm all the changes. While you modify, the original shape is visible. 

#### Test 10: Open the map and try to draw a custom area, then clear it
Steps:
1. Follow the steps of Test 8;
2. Clear the area with the button 'clear' in the menu, that appears as soon as the polygon is drawn.


**Expected Results:**
- The polygon should disappear, and you should be able to draw another one.

**Test 10 can be repeated both for the predefined point and the custom position, with the same expected result**

**All the previous test must be repreated trying to submit and verifying the outcame in the map with the stored document**

**All the previous steps must be repeated also when modifying a document, for a total of 36 tests.**






# End 2 End testing

## Tests for Stories

### [ ] Login

In this section, we have verified that a user can login with the right credentials.

#### Test 1
Steps:
1. Enter the username and password of user.
2. Click on the `login` button.
3. Ensure that the login does not occur if the credentials are wrong or if the password is less than 6 characters.
4. If the credentials are okay, it should redirect to the home page.


### [1] Add document

In this section, we have verified that the submission of a document occurs correctly.

#### Test 1
Steps:
1. Click on the `save` button at the bottom of the form.
2. Ensure that the submission does not occur until all mandatory fields have been filled in.
3. Enter all the fields required in the form.
4. Click the `save` button.
5. Ensure that the created document is now present on the map.
6. Look if it contains correct data.

#### Test 2
Steps:
1. Enter all the fields required in the form, select `1:n` in the `scale` field but leave the `n` field empty.
2. Click the `save` button.
3. Ensure that the creation of the document is not possible.


### [2] Link document to each other

In this section, we have verified that the documents can be linked with each other in the proper way.


#### Test 1
Steps:
1. 
2. 
3. 


### [3] Georeference a document 

In this section, we have verified that the document is related to a geographical part in the map at the time of document creation.


#### Test 1
Steps:
1. Select a point in the map.
2. Ensure that the coordinates are updated in the form.
3. Click on `remove marker` button.
4. Ensure that the point in the map and also the related coordinates are removed.
5. Click in `zoom in/zoom` out buttons.
6. Ensure that the map is zoomed.
7. Click on the `recenter` button.
8. Ensure that the map is recenter.
9. After the form is saved ensure that the document is now present on the map.
10. Look if it contains correct data.


### [4] See all documents

In this section, we have verified that each document is related to a geographical part in the map.


#### Test 1
Steps:
1. Click on the `blue checkpoints` in the map.
2. Ensure that each point opens a popup of the document related to that geographical part.
3. Click on the `x` button in the popup.
4. Ensure that the popup closes. 

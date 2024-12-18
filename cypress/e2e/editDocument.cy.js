
describe('Edit Document test', () => {
  it('Correct fill of form', () => {
    cy.visit('/documents')
    cy.contains('Login').should('be.visible');
    cy.contains('Login').click();
    
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Documents List').should('be.visible').click();
    cy.get('[name="edit-button"]').first().click();

    cy.get("#title").should('exist').clear();
    cy.get("#title").type("New document title");

    cy.get('[id="react-select-3-input"]').click({ force: true });
    cy.get('[id="react-select-3-option-1"]').click();
    cy.contains('button', 'Next').click();

    cy.get('[name="scale"]').should('exist').select("1:n");
    cy.contains('Value of n*').should('be.visible');
    cy.get('[name="nValue"]').type(20);
    cy.get('[name="type"]').select("Design");
    cy.get('[name="language"]').select("Spanish");
    cy.get('#pages').type("20");
    cy.contains('button', 'Next').click();

    cy.get('.resize-button').click()
    cy.contains('Custom point').click();

    cy.get('.leaflet-container').click(67.849982, 20.217068); 
    cy.get('.resize-button').click()
    cy.contains('button', 'Next').click();

    cy.contains('button', 'Submit').click();
  }) 

  it('Title missing in step 1', () => {
    cy.visit('/documents')
    cy.contains('Login').should('be.visible');
    cy.contains('Login').click();
    
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Documents List').should('be.visible').click();
    cy.get('[name="edit-button"]').first().click();

    cy.get("#title").should('exist').clear();
    cy.contains('button', 'Next').click();

    cy.contains('Title is required and cannot be empty.').should('be.visible');
  }) 

  it('Continuing without selecting a type', () => {
    cy.visit('/documents')
    cy.contains('Login').should('be.visible');
    cy.contains('Login').click();
      
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();
    cy.contains('Documents List').should('be.visible').click();
    cy.get('[name="edit-button"]').first().click();
      
    cy.wait(1000);
    cy.contains('button', 'Next').click();

    cy.get('[name="scale"]').should('exist').select("1:n");
    cy.contains('Value of n*').should('be.visible');
    cy.get('[name="nValue"]').type(20);
    cy.get('[name="type"]').select("Select a type");
    
    cy.get('[name="language"]').select("Spanish");
    cy.get('#pages').type("20");
    cy.get('[name="issuanceDateYear"]').select("2023");
    cy.get('select[name="issuanceDateMonth"]').should('be.visible');
    cy.get('[name="issuanceDateMonth"]').select("02");
    cy.get('select[name="issuanceDateDay"]').should('be.visible');
    cy.get('[name="issuanceDateDay"]').select("10");
    cy.contains('button', 'Next').click();

    cy.contains('You must select a type.').should('be.visible');
  }) 
})
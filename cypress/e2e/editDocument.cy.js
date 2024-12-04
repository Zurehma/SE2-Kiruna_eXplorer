describe('Edit Document test', () => {
  it('Correct fill of form', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('View All').should('be.visible');
    cy.contains('View All').click();

    cy.get('[name="edit-button"]').first().click();
    cy.get("#title").should('exist').clear();
    cy.get("#title").type("New document title");

    cy.get('.react-select__control').click();
    cy.get('.react-select__menu .react-select__option').first().click();
    cy.get('.react-select__multi-value').contains('Kiruna kommun').parent().find('.react-select__multi-value__remove').click();

    cy.contains('button', 'Next').click();

    cy.get('[name="scale"]').should('exist').select("1:n");
    cy.contains('Value of n*').should('be.visible');
    cy.get('[name="nValue"]').type(20);
    cy.get('[name="type"]').select("Design");
    cy.get('[name="language"]').select("Spanish");
    cy.get('#pages').type("20");
    cy.contains('button', 'Next').click();

    // cy.get('.resize-button').click()
    // cy.get('#dropdown-map-mode-button').click();
    // cy.get('.dropdown-menu .dropdown-item').eq(2).click();

    // cy.get('.leaflet-container').as('map');
    // cy.get('@map').click(67.849982, 20.217068); 
    // cy.get('.resize-button').click()
    cy.contains('button', 'Next').click();

    cy.contains('button', 'Submit').click();
  }) 

  it('Stakeholder missing in step 1', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('View All').should('be.visible');
    cy.contains('View All').click();

    cy.get('[name="edit-button"]').first().click();
    cy.get("#title").should('exist').clear();
    cy.get("#title").type("New document title");

    cy.get('.react-select__multi-value').parent().find('.react-select__multi-value__remove').click();

    cy.contains('button', 'Next').click();

    cy.contains('You must select at least one stakeholder.').should('be.visible');
  }) 

    it('Continuing without selecting a type', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('View All').should('be.visible');
    cy.contains('View All').click();

    cy.get('[name="edit-button"]').first().click();
    cy.get("#title").should('exist').clear();
    cy.get("#title").type("New document title");

    cy.get('.react-select__control').click();
    cy.get('.react-select__menu .react-select__option').first().click();
    cy.get('.react-select__multi-value').contains('Kiruna kommun').parent().find('.react-select__multi-value__remove').click();

    cy.contains('button', 'Next').click();

    cy.get('[name="scale"]').should('exist').select("1:n");
    cy.contains('Value of n*').should('be.visible');
    cy.get('[name="nValue"]').type(20);
    cy.get('[name="type"]').select("Select a type");
    cy.contains('button', 'Next').click();

    cy.contains('You must select a type.').should('be.visible');
    
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
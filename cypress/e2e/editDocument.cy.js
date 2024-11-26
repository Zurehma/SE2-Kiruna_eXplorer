describe('Edit Document test', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.get(".dropdown-toggle").click();
    cy.get(".dropdown-item").contains("View All Documents").click();

    cy.get('[name="edit-button"]').first().click();
    cy.get("#title").should('exist').clear();
    cy.get("#title").type("New document title");
    cy.contains('button', 'Next').click();

    cy.get('[name="scale"]').should('exist').select("1:n");
    cy.contains('Value of n*').should('be.visible');
    cy.get('[name="nValue"]').type(20);
    cy.get('[name="type"]').select("Design");
    cy.get('[name="language"]').select("Spanish");
    cy.get('#pages').type("20");
    cy.contains('button', 'Next').click();

    cy.get('[name="lat"]').should('exist').clear().type(67.84320492459841);
    cy.get('[name="long"]').should('exist').clear().type(20.251029966166243);
    cy.contains('button', 'Next').click();

    cy.contains('button', 'Submit').click();
  }) 
})
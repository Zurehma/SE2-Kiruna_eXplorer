describe('Link document tests', () => {
  it('Correct linking of documents', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Add Link').should('be.visible');
    cy.contains('Add Link').click();

    cy.get('.form-select').first().click();
    cy.get('.dropdown-menu .dropdown-item').first().click();

    cy.get('select[name="linkType"]').as('dropdown');
    cy.get('@dropdown').select('Direct'); 

    cy.get('.form-select').eq(2).click();
    cy.get('.dropdown-menu').eq(1).find('.dropdown-item').eq(1).click();

    cy.contains('button', 'Save Link').click();
  })

  it('Validation of errors', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Add Link').should('be.visible');
    cy.contains('Add Link').click();

    cy.get('.form-select').first().click();
    cy.get('.dropdown-menu .dropdown-item').first().click();

    cy.contains('button', 'Save Link').click();
    cy.contains('You must select at least one document.').should('be.visible');
  })

  it('Select more than one document in Document 2', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Add Link').should('be.visible');
    cy.contains('Add Link').click();

    cy.get('.form-select').first().click();
    cy.get('.dropdown-menu .dropdown-item').first().click();

    cy.get('select[name="linkType"]').as('dropdown');
    cy.get('@dropdown').select('Direct'); 

    cy.get('.form-select').eq(2).click();
    cy.get('.dropdown-menu').eq(1).find('.dropdown-item').eq(0).click();
    cy.get('.form-select').eq(2).click();
    cy.get('.dropdown-menu').eq(1).find('.dropdown-item').eq(1).click();

    cy.contains('button', 'Save Link').click();
  })
})
describe('Link test', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.get(".dropdown-toggle").click();
    cy.get(".dropdown-item").contains("Add Link").click();
  
    cy.get('[name="document1"]')
    .find('[name=optionsDoc1]')
    .then((option) => {
      const secondOptionValue = option[0].value; 
      cy.get('[name="document1"]').select(secondOptionValue);
    });
    
    cy.get('.basic-multi-select').should('not.be.disabled');
    cy.get('.basic-multi-select').click();
    cy.get('.select__menu').find('.select__option').first().click();

    cy.get('[name="linkType"]')
    .find('[name=optionLink]')
    .then((option) => {
      const secondOptionValue = option[0].value; 
      cy.get('[name="linkType"]').select(secondOptionValue);
    });

    cy.contains('button', 'Save Link').click();
  })

  it('Validation of errors', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.get(".dropdown-toggle").click();
    cy.get(".dropdown-item").contains("Add Link").click();
  
    cy.get('[name="document1"]')
    .find('[name=optionsDoc1]')
    .then((option) => {
      const secondOptionValue = option[0].value; 
      cy.get('[name="document1"]').select(secondOptionValue);
    });

    cy.contains('button', 'Save Link').click();
    cy.contains('You must select at least one document.').should('be.visible');
  })
})
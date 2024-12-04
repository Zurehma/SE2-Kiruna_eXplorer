describe('Add Document Form test', () => {
  it('Correct fill of form', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Add Document').should('be.visible');
    cy.contains('Add Document').click();

    // Step 1
    cy.get("#title").type("My Document");
    cy.get('.react-select__control').click();
    cy.get('.react-select__menu .react-select__option').first().click();
    cy.get("#description").type("This is a test description");
    cy.get('.btn-save').click()

    // Step 2
    cy.get('[name="scale"]').select("Text");
    cy.get('[name="type"]').select("Design");
    cy.get('[name="language"]').select("Spanish");
    cy.get('#pages').type("20");
    cy.get('[name="issuanceDateYear"]').select("2023");
    cy.get('select[name="issuanceDateMonth"]').should('be.visible');
    cy.get('[name="issuanceDateMonth"]').select("02");
    cy.get('select[name="issuanceDateDay"]').should('be.visible');
    cy.get('[name="issuanceDateDay"]').select("10");
    cy.contains('button', 'Next').click()

    // Step 3
    cy.contains('button', 'Next').click()

    // Step 4
    const fileName = 'example.text'; 
    cy.get('input[type="file"]').attachFile(fileName);

    cy.contains('button', 'Submit').click()
  })

  it('Invalid credentials', () => {
    cy.visit('/login')

    cy.get("#username").type("wrongusername");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();
  
    cy.contains('Unauthorized').should('be.visible');
  });

  it('Validate fields in step1', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Add Document').should('be.visible');
    cy.contains('Add Document').click();

    cy.get('.react-select__control').click();
    cy.get('.react-select__menu .react-select__option').first().click();

    cy.get("#description").type("This is a test description");
    cy.get('.btn-save').click()
    cy.contains('button', 'Next').click();

    cy.contains('Title is required and cannot be empty.').should('be.visible');

    cy.get('.react-select__multi-value').contains('Kiruna kommun') 
    .parent() 
    .find('.react-select__multi-value__remove')
    .click();

    cy.get('.react-select__multi-value').should('not.exist'); 
  })

  it('Validate fields in step2', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Add Document').should('be.visible');
    cy.contains('Add Document').click();

    // Step 1
    cy.get("#title").type("My Document");
    cy.get('.react-select__control').click();
    cy.get('.react-select__menu .react-select__option').first().click();
    cy.get("#description").type("This is a test description");
    cy.get('.btn-save').click()

    // Step 2
    cy.get('[name="scale"]').select("Text");
    cy.get('[name="type"]').select("Design");
    cy.get('[name="language"]').select("Spanish");
    cy.get('#pages').type("20");
    cy.contains('button', 'Next').click()
    cy.contains('You must select a Date in a valid format (YYYY or YYYY-MM or YYYY-MM-DD).').should('be.visible');

    cy.get('[name="issuanceDateYear"]').select("2023");
    cy.get('select[name="issuanceDateMonth"]').should('be.visible');

    cy.get('[name="scale"]').select("1:n");
    cy.contains('Value of n*').should('be.visible');
    cy.get('[name="nValue"]').type(20);

    cy.contains('button', 'Next').click()
  })
})
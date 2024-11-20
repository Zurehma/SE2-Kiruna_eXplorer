describe('Form test', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.get(".dropdown-toggle").click();
    cy.get(".dropdown-item").contains("Add Document").click();

    cy.get("#title").type("My Document");
    cy.get('[name="stakeholder"]').select("Kiruna kommun");
    cy.get('input[placeholder="Select a date"]').click()
    cy.get('.react-datepicker').should('be.visible')
    cy.get('.react-datepicker__day--020') 
      .not('.react-datepicker__day--outside-month') 
      .click()

    cy.get("#description").type("This is a test description");
    cy.get('.btn-save').click()

    cy.get('[name="scale"]').select("Text");
    cy.get('[name="type"]').select("Design");
    cy.get('[name="language"]').select("Spanish");
    cy.get('#pages').type("20");
    cy.contains('button', 'Next').click()

    let lat = 59.3293;
    let long = 18.0686;
    cy.get('[name="lat"]').type(lat);
    cy.get('[name="long"]').type("18.0686");
    cy.contains('button', 'Next').click()

    const fileName = 'example.text'; 
    cy.get('input[type="file"]').attachFile(fileName);

    cy.contains('button', 'Submit').click()
  })
})
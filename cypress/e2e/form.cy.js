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

    cy.get('[name="lat"]').type(67.84320492459841);
    cy.get('[name="long"]').type(20.251029966166243);
    cy.contains('button', 'Next').click()

    const fileName = 'example.text'; 
    cy.get('input[type="file"]').attachFile(fileName);

    cy.contains('button', 'Submit').click()
  })

  describe('Form Validation Test', () => {
    it('Shows an error for an invalid email', () => {
      cy.visit('/login')

      cy.get("#username").type("wrongusername");
      cy.get("#password").type("password");
      cy.get('button[type="submit"]').click();
  
      cy.contains('Unauthorized').should('be.visible');
    });
  });

  it('Validate error in step1', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.get(".dropdown-toggle").click();
    cy.get(".dropdown-item").contains("Add Document").click();

    cy.get('[name="stakeholder"]').select("Kiruna kommun");
    cy.get('input[placeholder="Select a date"]').click()
    cy.get('.react-datepicker').should('be.visible')
    cy.get('.react-datepicker__day--020') 
      .not('.react-datepicker__day--outside-month') 
      .click()

    cy.get("#description").type("This is a test description");
    cy.contains('button', 'Next').click();

    cy.contains('Title is required and cannot be empty.').should('be.visible');
  })

  it('Validate error in step2', () => {
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

    cy.get('[name="scale"]').select("1:n");
    cy.contains('Value of n*').should('be.visible');
    cy.get('[name="nValue"]').type(20);
    cy.get('[name="type"]').select("Design");
    cy.get('[name="language"]').select("Spanish");
    cy.get('#pages').type("20");
    cy.contains('button', 'Next').click()
  })
})
describe('Register Urban Planner', () => {
  it('Create new user', () => {
    cy.visit('/documents')
    cy.contains('Login').should('be.visible');
    cy.contains('Login').click();
    
    cy.get("#username").type("admin");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('New User').should('be.visible').click();

    cy.get("#name").type("User");
    cy.get("#surname").type("User");
    cy.get("#username").type("urbanplanner");
    cy.get("#role").select("Urban Planners");
    cy.get("#password").type("password");
    cy.get("#repPassword").type("password");
    cy.get('button[type="submit"]').click();
  })

  it('User cannot be created', () => {
    cy.visit('/documents')
    cy.contains('Login').should('be.visible');
    cy.contains('Login').click();
    
    cy.get("#username").type("admin");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('New User').should('be.visible').click();

    cy.get("#name").type("User");
    cy.get("#surname").type("User");
    cy.get("#username").type("urbanplanner");
    cy.get("#role").select("Urban Planners");
    cy.get("#password").type("wrongpassword");
    cy.get("#repPassword").type("password");

    cy.get('button[type="submit"]').click();

    cy.contains('Please repeat the same password.').should('be.visible');
  })
})
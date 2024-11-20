describe('Edit Document test', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get("#username").type("johndoe");
    cy.get("#password").type("password");
    cy.get('button[type="submit"]').click();

    cy.get(".dropdown-toggle").click();
    cy.get(".dropdown-item").contains("Map").click();

    // cy.get('[name="marker"]').click(200, 130);
    cy.get('[name="markerr"]')
    .each(($marker) => {
      cy.wrap($marker).click();
    });
  })
})
describe('Create draft', () => {
  /*
   * Visits the page before each test
   */
  beforeEach(() => {
    cy.log(`Visiting http://localhost:3000`);
    cy.visit('/', {
      onBeforeLoad: (win) => {
        // make sure admin is signed out
        win.sessionStorage.clear();
      },
    });
  });

  it('should create a post', async () => {
    cy.get('[data-cy=btn-admin]').click();
    cy.get('[data-cy=input-pwd]').type('password');
    cy.get('[data-cy=btn-login]').click();
    cy.get('[data-cy=btn-new-draft]').click();
    cy.get('[data-cy=editor]').focus().type('Title{enter}Message');
    cy.url().should('include', '/admin/posts/');
    cy.get('[data-cy=post-menu-item]').first().should('contain', 'Title').and('contain', 'Message');
  });
});

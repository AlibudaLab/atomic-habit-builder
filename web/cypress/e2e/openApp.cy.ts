describe('Open the app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display the onboard page', () => {
    cy.get('p').should('contain', 'Stake to join a challenge.');
    cy.get('button').should('contain', 'Sign in');
  });

  it('should display the habit page', () => {
    cy.visit('http://localhost:3000/habit/list');
    cy.get('div').should('contain', 'Browse Challenges');
  });

  it('should able to enter a challenge page', () => {
    cy.visit('http://localhost:3000/habit/list');
    cy.get('main').eq(1).find('button').first().click();

    // Check if the challenge details are displayed
    cy.get('div').should('contain', 'Goal');
    cy.get('div').should('contain', 'Check In');
    cy.get('div').should('contain', 'Stake Amount');
    cy.get('button').should('contain', 'Join This Challenge');

    // Click on join button
    cy.get('button').contains('Join This Challenge').click();
    // Check if the modal id open
    cy.get('[role="dialog"]').should('be.visible');
    // Check if the button text is "Sign in"
    cy.get('button').should('contain', 'Sign in');
  });

  it('should display the create habit page', () => {
    cy.visit('http://localhost:3000/habit/create');
    cy.get('div').should('contain', `Let's Build Another Habit`);

    // Fill in the form
    cy.contains('label', 'Challenge Name').should('exist');
    // assume the second input is the challenge name
    cy.get('input').eq(1).type('Test Challenge');
    // assume the first textarea is the challenge description
    cy.get('textarea').eq(0).type('Test Description');

    // Click on the next button
    cy.get('button').contains('Next').click();

    // Check if the second page is displayed
    cy.get('button').should('contain', 'Create');
    // Click on the create button
    cy.get('button').contains('Create').click();
    // Check if the modal id open
    cy.get('[role="dialog"]').should('be.visible');
    // Check if the button text is "Sign in"
    cy.get('button').should('contain', 'Sign in');
  });

  it('should display the profile page', () => {
    cy.visit('http://localhost:3000/profile');
    cy.get('div').should('contain', `User Profile`);
    cy.get('button').should('contain', 'Sign in');
  });
});

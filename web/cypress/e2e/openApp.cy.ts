describe('Open the app', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })
  
    it('should display the onboard page', () => {
      cy.get('div').should('contain', 'Welcome to Atomic')
      cy.get('button').should('contain', 'Sign in')
    })

    it('should display the habit page', () => {
        cy.visit('http://localhost:3000/habit/list')
        cy.get('div').should('contain', 'Browse Challenges')
    })

    it('should able to enter a challenge page', () => {
        cy.visit('http://localhost:3000/habit/list')
        cy.get(':nth-child(3) > .wrapped > .w-full').click()
        cy.get('div').should('contain', 'Stake and Commit to It!')
        cy.get('button').should('contain', 'Join This Challenge')

        // Click on join button
        cy.get('.z-0').click()
        // Check if the modal id open
        cy.get('[role="dialog"]').should('be.visible')
        // Check if the button text is "Sign in"
        cy.get('button').should('contain', 'Sign in')
    })

    it('should display the create habit page', () => {
        cy.visit('http://localhost:3000/habit/create')
        cy.get('div').should('contain', `Let's Build Another Habit`)
        
        // Fill in the form
        cy.contains('label', 'Challenge Name').should('exist')
        cy.get('.px-8 > :nth-child(2) > .relative > .inline-flex').type('Test Challenge')
        cy.get(':nth-child(3) > .tap-highlight-transparent').type('Test Description')
        // cy.get('input[label="Challenge Name"]').type('Test Challenge')
        
        // Click on the next button
        cy.get('button').contains('Next').click()

        // Check if the second page is displayed
        cy.get('button').should('contain', 'Create')
        // Click on the create button
        cy.get('button').contains('Create').click()
        // Check if the modal id open
        cy.get('[role="dialog"]').should('be.visible')
        // Check if the button text is "Sign in"
        cy.get('button').should('contain', 'Sign in')
    })

    it('should display the profile page', () => {
        cy.visit('http://localhost:3000/profile')
        cy.get('div').should('contain', `User Profile`)
        cy.get('button').should('contain', 'Sign in')
    })
})
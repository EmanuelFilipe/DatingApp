describe('<Login />', () => {
  beforeEach(() => {
    //cy.viewport(Cypress.env('viewportWidth'), Cypress.env('viewportHeight'));
    cy.visit(Cypress.env('APP_URL'))
    cy.wait(500)
    //cy.url().should()
    cy.get('#title').should('exist').contains('Dating App')
    cy.get('#home-text').should('exist').contains('Find your match')
  })

  it.skip('Email and Password inputs must have be visible on form', () => {
    cy.get('#email').should('exist')
    cy.get('#password').should('exist')
    cy.get('#btnLogin').should('exist').contains('Login')
  })

  it.skip('will show "Required Message Error" for both E-mail and Password after click on "Login" button without fill the fields', () => { 
    cy.get('#btnLogin').click()
    cy.get('#toast-container > :nth-child(1)').contains('Email and Password are required')
  })

  it.skip('will show "email-invalid-message" after type incorrect email', () => {
    cy.get('#email').should('exist');
    cy.get('#password').should('exist')
    cy.get('#email').type('teste@');
    cy.get('#password').type('123')
    cy.get('#btnLogin').click();
    cy.get('#toast-container > :nth-child(1)').contains('Invalid email')
  })

  it('will can do Login on apllication with successful after correct filled the fields', () => {
    cy.get('#email').should('exist');
    cy.get('#password').should('exist')
    cy.get('#email').type('lisa@test.com');
    cy.get('#password').type('Pa$$w0rd')
    cy.get('#btnLogin').click();
    cy.get('#toast-container > :nth-child(1)').contains('Logged in successfully!')
    cy.wait(1000)

    cy.url().should('include', 'members');
    cy.get('#userName-logged').contains('Lisa')
    cy.get('#nav-members').should('exist').contains('Matches')
    cy.get('#nav-lists').should('exist').contains('Lists')
    cy.get('#nav-messages').should('exist').contains('Messages')
  })

  it.skip('will be able to open user options when click over you picture', () => {
    cy.login()
    cy.wait(500)
    cy.get('#userName-logged').contains('Lisa')
    cy.get('#userName-logged').click()
    cy.get('#edit-profile').should('exist').contains('Edit Profile')
    cy.get('#btnLogout').should('exist').contains('Logout')
  })

  it.skip('will can logout of the app', () => {
    cy.login()
    cy.wait(500)
    cy.get('#userName-logged').contains('Lisa')
    cy.get('#userName-logged').click()
    cy.get('#edit-profile').should('exist').contains('Edit Profile')
    cy.get('#btnLogout').should('exist').contains('Logout')
    cy.get('#btnLogout').click()

  })
})
describe('<Create-User />', () => {
    beforeEach(() => {
        //cy.viewport(Cypress.env('viewportWidth'), Cypress.env('viewportHeight'));
        cy.visit(Cypress.env('APP_URL'))
        cy.wait(500)
        //cy.url().should()
        cy.get('#title').should('exist').contains('Dating App')
        cy.get('#home-text').should('exist').contains('Find your match')
    })

    it.skip('will can able to call Register form', () => {
        cy.get('#btnRegister').should('exist').contains('Register')
        cy.get('#btnRegister').click()
        
        cy.get('#title-create-user').should('exist').contains('Sign Up')
        cy.get('#email').should('exist')
        cy.get('#displayName').should('exist')
        cy.get('#password').should('exist')
    })

    it.skip('will show toast error messeger without fill any field', () => {
        cy.get('#btnRegister').click()
        cy.wait(500)
        cy.get('#btnRegisterUser').should('exist').click()
        cy.get('#toast-container > :nth-child(1)').contains('All fields are required!')
    })

    it.skip('with all fields filled with "test" word most show "invalid email" message error', () => {
        cy.get('#btnRegister').click()
        cy.wait(500)

        cy.get('#email-user').should('exist').type('test')
        cy.get('#displayName-user').should('exist').type('test')
        cy.get('#password-user').should('exist').type('test')

        cy.get('#btnRegisterUser').should('exist').click()
        cy.get('#toast-container > :nth-child(1)').contains('Invalid Email')
    })

    it.skip('must show message error for password when filled with less than 4 words', () => {
        cy.get('#btnRegister').click()
        cy.wait(500)

        cy.get('#email-user').should('exist').type('test@test.com')
        cy.get('#displayName-user').should('exist').type('test')
        cy.get('#password-user').should('exist').type('tes')

        cy.get('#btnRegisterUser').should('exist').click()
        cy.get('#toast-container > :nth-child(1)').contains('The field Password must be a string or array type with a minimum length')
    })

    it.skip('will can create a new user successfully after correct filled all fields', () => {
        cy.get('#btnRegister').click()
        cy.wait(500)

        cy.get('#email-user').should('exist').type('test2@test.com')
        cy.get('#displayName-user').should('exist').type('test 2')
        cy.get('#password-user').should('exist').type('test2')

        cy.get('#btnRegisterUser').should('exist').click()
        cy.wait(1000)
        cy.url().should('not.include', 'members');
    })

    it('will cannot create a new user with email already exist on database', () => {
        cy.get('#btnRegister').click()
        cy.wait(500)

        cy.get('#email-user').should('exist').type('test2@test.com')
        cy.get('#displayName-user').should('exist').type('test 2')
        cy.get('#password-user').should('exist').type('test2')

        cy.get('#btnRegisterUser').should('exist')
        cy.get('#btnRegisterUser').click()
        cy.wait(500)
        cy.get('#toast-container > :nth-child(1)').contains('Email is already taken')
    })

})
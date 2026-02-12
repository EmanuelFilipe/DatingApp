describe('<Members - Home />', () => {
    beforeEach(() => {
        cy.login()
    })

    it('teste', () => {
        cy.url().should('include', 'members')
        cy.get('#member-card').should('exist').click()
        cy.url().should('include', 'profile')
    })
})
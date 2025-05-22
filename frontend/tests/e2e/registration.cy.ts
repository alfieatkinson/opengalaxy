// tests/e2e/registration.cy.ts

describe('User registration', () => {
  const user = {
    username: `testuser${Date.now()}`,
    email_address: `test${Date.now()}@example.com`,
    first_name: 'Test',
    last_name: 'User',
    password: 'Password123!',
    confirm_password: 'Password123!',
  }

  beforeEach(() => {
    // Point Cypress at your running frontend
    cy.visit('http://localhost:3000/register')
  })

  it('shows validation errors for empty fields', () => {
    cy.get('button[type=submit]').click()
    cy.contains('Username is required').should('be.visible')
    cy.contains('Invalid email address').should('be.visible')
  })

  it('registers a new user successfully', () => {
    // Fill form
    cy.get('input[name=username]').type(user.username)
    cy.get('input[name=email_address]').type(user.email_address)
    cy.get('input[name=first_name]').type(user.first_name)
    cy.get('input[name=last_name]').type(user.last_name)
    cy.get('input[name=password]').type(user.password)
    cy.get('input[name=confirm_password]').type(user.confirm_password)

    // Stub window.alert so it doesn’t block the test
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.get('button[type=submit]').click()

    // Should have called alert with success message
    cy.get('@alert').should('have.been.calledWith', 'Registration successful! Please log in.')

    // Should be redirected to login page
    cy.url().should('include', '/login')
  })
})

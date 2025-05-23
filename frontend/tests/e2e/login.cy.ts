// tests/e2e/login.cy.ts

describe('Login flow (with programmatic registration)', () => {
  const user = {
    username: `testuser${Date.now()}`,
    email_address: `test${Date.now()}@example.com`,
    first_name: 'Test',
    last_name: 'User',
    password: 'Password123!',
  }

  before(() => {
    // Direct API call to register the user without using the UI
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/accounts/register/',
      body: {
        username: user.username,
        email: user.email_address,
        first_name: user.first_name,
        last_name: user.last_name,
        password: user.password,
      },
      failOnStatusCode: true,
    })
  })

  it('logs in successfully with the newly registered account', () => {
    // Visit the login page
    cy.visit('http://localhost:3000/login')

    // Fill in credentials
    cy.get('input[name=username]').type(user.username)
    cy.get('input[name=password]').type(user.password)

    // Stub alert from onSubmit uses it
    cy.window().then((win) => cy.stub(win, 'alert').as('alert'))

    // Submit and assert redirect to home
    cy.get('button[type=submit]').click()
    cy.url().should('eq', 'http://localhost:3000/')

    // Optionally confirm no error alert was shown
    cy.get('@alert').should('not.have.been.called')
  })

  it('shows error on invalid credentials', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('input[name=username]').type(user.username)
    cy.get('input[name=password]').type('WrongPassword!')
    cy.window().then((win) => cy.stub(win, 'alert').as('alert'))
    cy.get('button[type=submit]').click()
    cy.get('@alert').should('have.been.calledWithMatch', /Login failed/)
  })
})

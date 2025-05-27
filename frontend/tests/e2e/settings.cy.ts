// tests/e2e/settings.cy.ts

describe('Settings page flows', () => {
  const user = {
    username: `user${Date.now()}`,
    email: `user${Date.now()}@example.com`,
    first_name: 'Foo',
    last_name: 'Bar',
    password: 'Password123!',
  }
  let tokens: { access: string; refresh: string }

  before(() => {
    // Register
    cy.request('POST', 'http://localhost:8000/api/accounts/register/', {
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: user.password,
    })
      .its('status')
      .should('eq', 201)

    // Login and capture tokens
    cy.request('POST', 'http://localhost:8000/api/accounts/token/', {
      username: user.username,
      password: user.password,
    }).then((resp) => {
      // parse out the two cookies
      const header = resp.headers['set-cookie'] as string[]
      const cookieMap = Object.fromEntries(
        header.map((str) => {
          const [pair] = str.split(';')
          const [name, val] = pair.split('=')
          return [name, val]
        }),
      )
      tokens = {
        access: cookieMap.accessToken,
        refresh: cookieMap.refreshToken,
      }
    })
  })

  beforeEach(() => {
    cy.clearCookies()
    cy.setCookie('accessToken', tokens.access, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    })
    cy.setCookie('refreshToken', tokens.refresh, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    })

    cy.intercept('GET', '/api/accounts/users/me/', {
      statusCode: 200,
      body: user,
    }).as('getMe')

    cy.intercept('GET', '/api/accounts/users/*/preferences/', {
      statusCode: 200,
      body: { public_profile: true, show_sensitive: false, blur_sensitive: true },
    }).as('getPrefs')

    cy.intercept('GET', '/api/search/history/preview/', [
      { id: 1, search_key: 'query', search_value: 'dog', searched_at: new Date().toISOString() },
    ]).as('getHistory')

    cy.visit('http://localhost:3000/settings')
    cy.wait('@getMe')
    cy.wait('@getPrefs')
    cy.wait('@getHistory')
  })

  it('toggles preferences and persists', () => {
    // Stub PATCH prefs
    cy.intercept('PATCH', '/api/accounts/users/*/preferences/', (req) => {
      // flip the field being updated
      req.reply((res) => res.send({ ...req.body }))
    }).as('patchPrefs')

    // Toggle "Show sensitive"
    cy.get('label').contains('Show sensitive').parent().find('input[type=checkbox]').as('toggle')
    cy.get('@toggle').should('not.be.checked').check()
    cy.wait('@patchPrefs')
    cy.get('@toggle').should('be.checked')
  })

  it('shows recent searches and navigates', () => {
    cy.contains('"dog"').should('exist')
    cy.get('[data-cy=view-all-search-history]').click()
    cy.url().should('include', '/search-history')
  })

  it('edits first_name and handles wrong + correct password', () => {
    // Start editing first_name
    cy.get('[data-cy=edit-first_name]').click()
    cy.get('[data-cy=input-first_name]').clear().type('NewName')

    // Incorrect password stub
    cy.intercept('PATCH', `/api/accounts/users/${user.username}/`, {
      statusCode: 400,
      body: { detail: 'Incorrect password' },
    }).as('updateFail')

    // Attempt save with no password → client-side error
    cy.get('[data-cy=save-first_name]').click()
    cy.contains('Enter your password').should('be.visible')

    // Now supply wrong password and save
    cy.get('[data-cy=password-first_name]').type('wrong')
    cy.get('[data-cy=save-first_name]').click()

    // Wait for the network and assert error message
    cy.wait('@updateFail')
    cy.contains('Failed. Check your password.').should('be.visible')

    // Remove the old stub and set up success stub
    cy.intercept('PATCH', `/api/accounts/users/${user.username}/`, (req) => {
      // echo the new name back
      const updated = { ...user, first_name: 'NewName' }
      req.reply({ statusCode: 200, body: updated })
    }).as('updateSuccess')

    // Clear the password field, type the correct one, and save again
    cy.get('[data-cy=password-first_name]').clear().type(user.password)
    cy.get('[data-cy=save-first_name]').click()

    cy.wait('@updateSuccess')

    // Finally, verify the UI shows the updated name and exit edit mode
    cy.get('[data-cy=input-first_name]').should('have.value', 'NewName')

    // Check that edit mode is exited
    cy.get('[data-cy=save-first_name]').should('not.exist')
  })

  it('changes password with validation and success', () => {
    // Stub change password
    cy.intercept('POST', `/api/accounts/users/${user.username}/password/`, { statusCode: 204 }).as(
      'chgPwd',
    )

    // Click change password
    cy.contains('Change password').click()

    // Submit invalid form
    cy.contains('Save').click()
    cy.contains('Current password is required').should('be.visible')

    // Fill form
    cy.get('input[placeholder="Enter current password"]').type(user.password)
    cy.get('input[placeholder="Enter new password"]').type('NewPass123!')
    cy.get('input[placeholder="Confirm new password"]').type('NewPass123!')
    cy.contains('Save').click()

    cy.wait('@chgPwd')
    cy.contains('Password changed successfully').should('be.visible')
  })

  it('deletes account and redirects home', () => {
    // Stub delete user
    cy.intercept('DELETE', `/api/accounts/users/${user.username}/`, { statusCode: 204 }).as(
      'delUser',
    )
    cy.intercept('POST', '/api/accounts/logout/', { statusCode: 204 }).as('logout')

    cy.contains('Delete account').click()
    // Try without password
    cy.contains('Confirm delete').click()
    cy.contains('Enter your password to confirm').should('be.visible')

    // Now confirm with password
    cy.get('input[placeholder="Enter your password"]').type(user.password)
    cy.contains('Confirm delete').click()

    cy.wait('@delUser')
    cy.wait('@logout')
    cy.url().should('eq', 'http://localhost:3000/')
  })
})

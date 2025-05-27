// tests/e2e/profile.cy.ts

describe('Profile flows', () => {
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

  context('Public profile (anonymous)', () => {
    it('renders user info and favourites preview', () => {
      // Stub profile fetch
      cy.intercept('GET', `/api/accounts/users/${user.username}/`, {
        statusCode: 200,
        body: user,
      }).as('getProfile')

      // Stub first page of favourites
      cy.intercept('GET', `/api/accounts/users/${user.username}/favourites/*`, {
        fixture: 'favourites-page1.json',
      }).as('getFavs')

      cy.visit(`/profile/${user.username}`)
      cy.wait(['@getProfile', '@getFavs'])

      // Verify UserInfo
      cy.contains(user.username).should('be.visible')
      cy.contains(`${user.first_name} ${user.last_name}`).should('be.visible')

      // FavouritesPreview shows both media cards
      cy.get('h2').contains('Favourites').should('exist')
      cy.get('[data-cy=media-card]').should('have.length', 2)

      // “View all favourites” navigates to the full page
      cy.get('[data-cy=view-all-favourites]').click()
      cy.url().should('include', `/profile/${user.username}/favourites`)
    })
  })

  context('Own profile (logged-in)', () => {
    beforeEach(() => {
      // Re-set the cookies on every test so the app sees you as “me”
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

      // Stub /users/me/ so useAuth() fills in `me`
      cy.intercept('GET', '/api/accounts/users/me/', {
        statusCode: 200,
        body: {
          id: '1',
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          is_staff: false,
          preferences: { public_profile: true, show_sensitive: false, blur_sensitive: true },
        },
      }).as('getMe')

      // Stub your QuickSettings prefs fetch
      cy.intercept('GET', `/api/accounts/users/${user.username}/preferences/`, {
        statusCode: 200,
        body: { public_profile: true, show_sensitive: false, blur_sensitive: true },
      }).as('getPrefs')

      // Stub the profile + favourites calls too
      cy.intercept('GET', `/api/accounts/users/${user.username}/`, {
        statusCode: 200,
        body: user,
      }).as('getProfile')
      cy.intercept('GET', `/api/accounts/users/${user.username}/favourites/*`, {
        statusCode: 200,
        body: { results: [], count: 0 },
      }).as('getFavs')

      // Finally visit and wait for *all* four calls
      cy.visit(`/profile/${user.username}`)
      cy.wait(['@getMe', '@getPrefs', '@getProfile', '@getFavs'])
    })

    it('shows QuickSettings for self', () => {
      cy.contains('Quick Settings').should('exist')
      cy.get('[data-cy=more-settings]').click()
      cy.url().should('include', '/settings')
    })
  })

  context('Private profile', () => {
    it('renders PrivateProfile when flagged private', () => {
      // PROFILE endpoint returns 403 => private
      cy.intercept('GET', `/api/accounts/users/${user.username}/`, {
        statusCode: 403,
      }).as('getProfile')

      // Stub favourites too, though code will skip fetching them
      cy.intercept('GET', `/api/accounts/users/${user.username}/favourites*`, {
        statusCode: 403,
      }).as('getFavs')

      cy.visit(`/profile/${user.username}`)
      cy.wait(['@getProfile']) // only need to wait this one
      cy.get('[data-cy=private-profile]').should('be.visible')
    })
  })

  context('Full Favourites page', () => {
    it('paginates and shows all media cards', () => {
      const pageSize = 2

      // Stub profile fetch
      cy.intercept('GET', `/api/accounts/users/${user.username}/`, {
        statusCode: 200,
        body: user,
      }).as('getProfile')

      // Page 1 using fixture; inject username into path if needed via `url.pathname`
      cy.intercept(
        'GET',
        `/api/accounts/users/${user.username}/favourites/?page=1&page_size=${pageSize}`,
        { fixture: 'favourites-page1.json' },
      ).as('getFavs1')

      // Page 2
      cy.intercept(
        'GET',
        `/api/accounts/users/${user.username}/favourites/?page=2&page_size=${pageSize}`,
        { fixture: 'favourites-page2.json' },
      ).as('getFavs2')

      // Visit page 1
      cy.visit(`/profile/${user.username}/favourites/?page=1&page_size=${pageSize}`)
      cy.wait(['@getProfile', '@getFavs1'])

      // Expect 2 cards (from page1 fixture)
      cy.get('[data-cy=media-card]').should('have.length', 2)

      // Click Next
      cy.get('[data-cy=next-page]').click()
      cy.wait('@getFavs2')

      // Expect 1 card (from page2 fixture)
      cy.get('[data-cy=media-card]').should('have.length', 1)

      // URL updated
      cy.url().should('include', 'page=2')
    })
  })
})

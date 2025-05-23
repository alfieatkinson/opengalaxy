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
    // 1) Register
    cy.request('POST', 'http://localhost:8000/api/accounts/register/', {
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: user.password,
    })
      .its('status')
      .should('eq', 201)

    // 2) Login and capture tokens
    cy.request('POST', 'http://localhost:8000/api/accounts/token/', {
      username: user.username,
      password: user.password,
    }).then(({ body }) => {
      tokens = { access: body.access, refresh: body.refresh }
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
    beforeEach(function () {
      // Inject tokens before load
      cy.visit(`/profile/${user.username}`, {
        onBeforeLoad(win) {
          win.localStorage.setItem('accessToken', tokens.access)
          win.localStorage.setItem('refreshToken', tokens.refresh)
        },
      })
    })

    it('shows QuickSettings for self', () => {
      cy.intercept('GET', `/api/accounts/users/${user.username}/`, {
        statusCode: 200,
        body: user,
      }).as('getProfile')
      cy.intercept('GET', `/api/accounts/users/${user.username}/favourites/*`, {
        statusCode: 200,
        body: { results: [], count: 0 },
      }).as('getFavs')
      cy.wait(['@getProfile', '@getFavs'])

      // QuickSettings button present
      cy.contains('Quick Settings').should('exist')
      // Clicking “More settings =>” lands on /settings
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

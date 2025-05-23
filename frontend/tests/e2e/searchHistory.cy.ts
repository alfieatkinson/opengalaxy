// tests/e2e/searchHistory.cy.ts

describe('Search History page', () => {
  const user = {
    username: `user${Date.now()}`,
    email: `user${Date.now()}@example.com`,
    first_name: 'Test',
    last_name: 'User',
    password: 'Password123!',
  }
  let tokens: { access: string; refresh: string }
  const pageSize = 2

  before(() => {
    // Register + login
    cy.request('POST', '/api/accounts/register/', { ...user })
      .its('status')
      .should('eq', 201)
    cy.request('POST', '/api/accounts/token/', {
      username: user.username,
      password: user.password,
    }).then(({ body }) => {
      tokens = { access: body.access, refresh: body.refresh }
    })
  })

  context('Not logged in', () => {
    it('shows error if you`re not authenticated', () => {
      cy.clearLocalStorage()
      cy.visit('/search-history')
      cy.contains('You must be signed in to view search history.').should('be.visible')
    })
  })

  context('Logged in', () => {
    beforeEach(() => {
      // stub the user info request
      cy.intercept('GET', '/api/accounts/users/me/', {
        statusCode: 200,
        body: {
          id: '1',
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          is_active: true,
          is_staff: false,
        },
      }).as('getMe')
    })

    it('renders empty state', () => {
      // stub an empty list
      cy.intercept('GET', `/api/search/history/?page=1&page_size=${pageSize}`, {
        statusCode: 200,
        body: { count: 0, next: null, previous: null, results: [] },
      }).as('getEmpty')

      // visit the page with the tokens set
      cy.visit(`/search-history/?page=1&page_size=${pageSize}`, {
        onBeforeLoad(win) {
          win.localStorage.setItem('accessToken', tokens.access)
          win.localStorage.setItem('refreshToken', tokens.refresh)
        },
      })
      cy.wait('@getMe')

      cy.wait('@getEmpty')
      cy.contains('No recent searches.').should('be.visible')
      cy.get('[data-cy=clear-search-history]').should('be.disabled')
    })

    it('renders a page of items and paginates', () => {
      // Stub page 1
      cy.intercept('GET', `/api/search/history/?page=1&page_size=${pageSize}`, {
        fixture: 'search-history-page1.json',
      }).as('getPage1')

      // Visit with page=1
      cy.visit(`/search-history/?page=1&page_size=${pageSize}`, {
        onBeforeLoad(win) {
          win.localStorage.setItem('accessToken', tokens.access)
          win.localStorage.setItem('refreshToken', tokens.refresh)
        },
      })
      cy.wait('@getMe')

      // Wait for that stub
      cy.wait('@getPage1')

      // Assert 2 items
      cy.get('[data-cy=search-history-item]').should('have.length', 2)

      // Stub page 2 before clicking
      cy.intercept('GET', `/api/search/history/?page=2&page_size=${pageSize}`, {
        fixture: 'search-history-page2.json',
      }).as('getPage2')

      // Click next page
      cy.get('[data-cy=next-page]').click()

      // Wait on page2 stub
      cy.wait('@getPage2')

      // Assert you got 1 item
      cy.get('[data-cy=search-history-item]').should('have.length', 1)

      // URL has updated
      cy.url().should('include', 'page=2')
    })

    it('deletes a single entry', () => {
      // assume page1 fixture loaded
      cy.intercept('GET', `/api/search/history/?page=1&page_size=${pageSize}`, {
        fixture: 'search-history-page1.json',
      }).as('getH1')

      // visit the page with the tokens set
      cy.visit(`/search-history/?page=1&page_size=${pageSize}`, {
        onBeforeLoad(win) {
          win.localStorage.setItem('accessToken', tokens.access)
          win.localStorage.setItem('refreshToken', tokens.refresh)
        },
      })
      cy.wait('@getMe')

      cy.wait('@getH1')

      cy.intercept('DELETE', '/api/search/history/1/', { statusCode: 204 }).as('del1')
      cy.intercept('GET', `/api/search/history/?page=1&page_size=${pageSize}`, {
        fixture: 'search-history-page1-delete.json',
      }).as('getAfterDel')

      cy.get('[data-cy=search-history-item]')
        .first()
        .within(() => {
          cy.get('[data-cy=search-history-delete]').click()
        })

      cy.wait('@del1')
      cy.wait('@getAfterDel')
      cy.get('[data-cy=search-history-item]').should('have.length', 1)
    })

    it('clears all history', () => {
      cy.intercept('GET', `/api/search/history/?page=1&page_size=${pageSize}`, {
        fixture: 'search-history-page1.json',
      }).as('getH1')

      // visit the page with the tokens set
      cy.visit(`/search-history/?page=1&page_size=${pageSize}`, {
        onBeforeLoad(win) {
          win.localStorage.setItem('accessToken', tokens.access)
          win.localStorage.setItem('refreshToken', tokens.refresh)
        },
      })
      cy.wait('@getMe')

      cy.wait('@getH1')

      cy.intercept('DELETE', '/api/search/history/clear/', { statusCode: 204 }).as('clear')
      cy.intercept('GET', `/api/search/history/?page=1&page_size=${pageSize}`, {
        statusCode: 200,
        body: { count: 0, next: null, previous: null, results: [] },
      }).as('getEmpty')

      cy.get('[data-cy=clear-search-history]').should('not.be.disabled').click()
      cy.wait('@clear')
      cy.wait('@getEmpty')
      cy.contains('No recent searches.').should('be.visible')
    })

    it('navigates to search results when clicking an entry', () => {
      cy.intercept('GET', `/api/search/history/?page=1&page_size=${pageSize}`, {
        fixture: 'search-history-page1.json',
      }).as('getH1')

      // visit the page with the tokens set
      cy.visit(`/search-history/?page=1&page_size=${pageSize}`, {
        onBeforeLoad(win) {
          win.localStorage.setItem('accessToken', tokens.access)
          win.localStorage.setItem('refreshToken', tokens.refresh)
        },
      })
      cy.wait('@getMe')

      cy.wait('@getH1')

      cy.intercept('GET', '/api/search/**', {
        statusCode: 200,
        body: { results: [], count: 0 },
      }).as('searchFoo')

      cy.get('[data-cy=search-history-item]').first().click()
      cy.wait('@searchFoo')
      // fixture page1 first item's search_key='query', search_value='foo'
      cy.url().should('include', '/search/?query=foo')
    })
  })
})

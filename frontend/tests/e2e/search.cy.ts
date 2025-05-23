// tests/e2e/search.cy.ts

describe('Search flow', () => {
  const queryTerm = 'cat'

  beforeEach(() => {
    // Start each test fresh
    cy.visit('http://localhost:3000/search')
  })

  it('shows prompt when no search term is entered', () => {
    cy.contains('Enter a search term.').should('be.visible')
  })

  it('performs a search and displays results', () => {
    // Stub your backend proxy to return a saved fixture
    cy.intercept('GET', '**/api/search/*', { fixture: 'search-results.json' }).as('getSearch')

    // Type in the search box and submit
    cy.get('input[type=text]').type(queryTerm)
    cy.get('[data-cy=search-button]').click()

    // Wait for network
    cy.wait('@getSearch')

    // Heading should reflect the query
    cy.contains(`Search results for "${queryTerm}"`).should('be.visible')

    // Result cards should appear (using an attribute you know, e.g. data-cy or a class)
    cy.get('[data-cy=media-card]').its('length').should('be.gte', 1)
  })

  it('applies a filter and updates results', () => {
    cy.intercept('GET', '**/api/search/*', { fixture: 'search-results.json' }).as('getFiltered')

    // Perform initial search
    cy.get('input[type=text]').type(queryTerm)
    cy.get('[data-cy=search-button]').click()
    cy.wait('@getFiltered')

    // Open the "License" filter dropdown
    cy.get('[data-cy=filter-source]').click()
    // Select the first license option
    cy.get('.dropdown-content button').first().click()

    // Wait for the new network call
    cy.wait('@getFiltered')

    // URL should include license param
    cy.url().should('include', 'source=')

    // Cards still render
    cy.get('[data-cy=media-card]').should('exist')
  })

  it('changes sort order', () => {
    cy.intercept('GET', '**/api/search/*', { fixture: 'search-results.json' }).as('getSorted')

    // Initial search
    cy.get('input[type=text]').type(queryTerm)
    cy.get('[data-cy=search-button]').click()
    cy.wait('@getSorted')

    // Open sort selector and choose "Date Added"
    cy.get('[data-cy=sort-selector]').click()
    cy.get('[data-cy=sort-date-added]').click()

    // Wait for resorted results
    cy.wait('@getSorted')

    // URL should include sort_by=indexed_on
    cy.url().should('include', 'sort_by=indexed_on')

    // Change sort direction
    cy.get('[data-cy=sort-direction]').click()

    // Wait for resorted results
    cy.wait('@getSorted')

    // URL should include sort_dir=asc
    cy.url().should('include', 'sort_dir=asc')
  })

  it('paginates if there are multiple pages', () => {
    // Use a fixture with total_pages > 1
    cy.intercept('GET', '**/api/search/*', { fixture: 'search-results.json' }).as('getPaged')

    cy.get('input[type=text]').type(queryTerm)
    cy.get('[data-cy=search-button]').click()
    cy.wait('@getPaged')

    // Next‐page button should exist
    cy.get('[data-cy=next-page]').should('be.visible').click()

    cy.wait('@getPaged')

    // URL should include page=2
    cy.url().should('include', 'page=2')
  })
})

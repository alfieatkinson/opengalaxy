// tests/e2e/media.cy.ts

describe('Media page flows', () => {
  const imageId = 'img12345'
  const audioId = 'aud67890'

  beforeEach(() => {
    // Clear any stored localStorage or session state
    cy.clearLocalStorage()
    localStorage.setItem('accessToken', 'fake-token')
    localStorage.setItem('refreshToken', 'fake-refresh-token')

    cy.intercept('GET', '/api/accounts/users/me/', {
      statusCode: 200,
      body: {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        is_active: true,
        is_staff: false,
      },
    })
  })

  context('Image media', () => {
    beforeEach(() => {
      // Stub the media details endpoint
      cy.intercept('GET', `**/api/media/${imageId}`, {
        fixture: 'media-image.json',
      }).as('getImageMedia')

      // Stub favourite status
      cy.intercept('GET', `**/api/media/${imageId}/favourite/`, {
        statusCode: 200,
        body: { is_favourite: false },
      }).as('getImgFavStatus')

      // Stub adding favourite
      cy.intercept('POST', `**/api/media/${imageId}/favourite/`, {
        statusCode: 200,
      }).as('addImgFav')

      // Stub removing favourite
      cy.intercept('DELETE', `**/api/media/${imageId}/favourite/`, {
        statusCode: 200,
      }).as('removeImgFav')

      // Visit the page
      cy.visit(`http://localhost:3000/media/${imageId}`)
      cy.wait(['@getImageMedia', '@getImgFavStatus'])
    })

    it('renders image, title, attribution and all attribute cards', () => {
      // Full-size image should be in the DOM
      cy.get('[data-cy=image-img12345]').should('be.visible')

      // Title
      cy.contains('h1', 'Sunset Over Mountains').should('be.visible')

      // Attribution footer
      cy.get('.card-footer').contains('Jane Doe').should('be.visible')

      // Attribute cards
      const expectedFields = [
        'Creator',
        'Source',
        'License',
        'Indexed On',
        'Category',
        'File Type',
        'File Size',
        'Dimensions',
      ]

      expectedFields.forEach((field) => {
        cy.get('.card').contains(field).should('be.visible')
      })
    })

    it('toggles favourite on and off', () => {
      // Initially not filled star
      cy.get('button[aria-pressed="false"]').should('exist')

      // Click to favourite
      cy.get('button[aria-pressed="false"]').click()
      cy.wait('@addImgFav')
      cy.get('button[aria-pressed="true"]').should('exist')

      // Click to unfavourite
      cy.get('button[aria-pressed="true"]').click()
      cy.wait('@removeImgFav')
      cy.get('button[aria-pressed="false"]').should('exist')
    })
  })

  context('Audio media', () => {
    beforeEach(() => {
      cy.intercept('GET', `**/api/media/${audioId}`, {
        fixture: 'media-audio.json',
      }).as('getAudioMedia')

      cy.intercept('GET', `**/api/media/${audioId}/favourite/`, {
        statusCode: 200,
        body: { is_favourite: true },
      }).as('getAudioFavStatus')

      cy.intercept('POST', `**/api/media/${audioId}/favourite/`, {
        statusCode: 200,
      }).as('addAudioFav')

      cy.intercept('DELETE', `**/api/media/${audioId}/favourite/`, {
        statusCode: 200,
      }).as('removeAudioFav')

      cy.visit(`http://localhost:3000/media/${audioId}`)
      cy.wait(['@getAudioMedia', '@getAudioFavStatus'])
    })

    it('renders audio waveform with play/pause control and attributes', () => {
      // The waveform container should exist
      cy.get('[data-cy=waveform]').should('exist')

      // Play button present
      cy.get('[data-cy=play-pause-button]').should('exist')

      // Title and attribution
      cy.contains('h1', 'Lo-Fi Chill Beat').should('be.visible')
      cy.get('.card-footer').contains('DJ CoolCat').should('be.visible')

      // Attribute cards
      const expectedFields = [
        'Creator',
        'Source',
        'License',
        'Indexed On',
        'Category',
        'File Type',
        'File Size',
        'Duration',
      ]

      expectedFields.forEach((field) => {
        cy.get('.card').contains(field).should('be.visible')
      })
    })

    it('toggles favourite on audio', () => {
      // Initially favourite
      cy.get('button[aria-pressed="true"]').should('exist')

      // Unfavourite
      cy.get('button[aria-pressed="true"]').click()
      cy.wait('@removeAudioFav')
      cy.get('button[aria-pressed="false"]').should('exist')

      // Favourite again
      cy.get('button[aria-pressed="false"]').click()
      cy.wait('@addAudioFav')
      cy.get('button[aria-pressed="true"]').should('exist')
    })
  })
})

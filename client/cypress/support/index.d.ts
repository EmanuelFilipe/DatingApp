/// <reference types="cypress" />

// arquivo de declaração de tipos para informar ao TS que esse tipo existe

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>
    //logout(): Chainable<void>
  }
}

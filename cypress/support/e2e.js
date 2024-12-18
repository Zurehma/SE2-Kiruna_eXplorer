// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on("uncaught:exception", (err, runnable) => {
    // Ignore 'onSuccess is not defined' errors
    if (err.message.includes("onSuccess is not defined")) {
      return false;
    }
    return true;
  });

Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore errors caused by Leaflet
  if (err.message.includes('_leaflet_pos')) {
    return false; // Prevent the test from failing
  }
  return true;
});
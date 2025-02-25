import { randomString } from '../../../framework/utils/random-string';
import { Remotes } from './constants';

describe('Remotes', () => {
  before(() => {
    cy.hubLogin();
  });

  it('bulk delete remotes', () => {
    for (let i = 0; i < 5; i++) {
      const remoteName = `test-remote-${randomString(5, undefined, { isLowercase: true })}`;
      cy.createRemote(remoteName);
    }
    cy.navigateTo('hub', 'remotes');
    cy.setTablePageSize('50');
    cy.get('#select-all').click();
    cy.clickToolbarKebabAction('delete-selected-remotes');
    cy.get('#confirm').click();
    cy.clickButton(/^Delete remotes$/);
    cy.contains(/^Success$/);
    cy.clickButton(/^Close$/);
  });

  it('explore different views and pagination', () => {
    const remoteName = `test-remote-${randomString(5, undefined, { isLowercase: true })}`;
    cy.createRemote(remoteName);
    cy.navigateTo('hub', 'remotes');
    cy.setTablePageSize('50');
    cy.searchAndDisplayResource(remoteName);
    cy.get('[data-cy="card-view"]').click();
    cy.contains(remoteName).should('be.visible');
    cy.get('[data-cy="list-view"]').click();
    cy.contains(remoteName).should('be.visible');
    cy.get('[data-cy="table-view"]').click();
    cy.contains(remoteName).should('be.visible');
    cy.get('#select-all').click();
    cy.clickToolbarKebabAction('delete-selected-remotes');
    cy.get('#confirm').click();
    cy.clickButton(/^Delete remotes$/);
    cy.contains(/^Success$/);
    cy.clickButton(/^Close$/);
    cy.clickButton(/^Clear all filters$/);
  });

  it('create, search and delete a remote', () => {
    cy.navigateTo('hub', 'remotes');
    const remoteName = `test-remote-${randomString(5, undefined, { isLowercase: true })}`;
    cy.get('h1').should('contain', Remotes.title);
    cy.get('[data-cy="create-remote"]').should('be.visible').click();
    cy.url().should('include', Remotes.urlCreate);
    cy.get('[data-cy="name"]').type(remoteName);
    cy.get('[data-cy="url"]').type(Remotes.remoteURL);
    cy.get('[data-cy="Submit"]').click();
    cy.url().should('include', `remotes/details/${remoteName}`);
    cy.contains('Remotes').click();
    cy.url().should('include', Remotes.url);
    cy.searchAndDisplayResource(remoteName);
    cy.get('[data-cy="actions-column-cell"]').click();
    cy.get('[data-cy="delete-remote"]').click({ force: true });
    cy.get('#confirm').click();
    cy.clickButton(/^Delete remote/);
    cy.contains(/^Success$/);
    cy.clickButton(/^Close$/);
    cy.clickButton(/^Clear all filters$/);
  });

  it('display alert when creating a remote with community URL and checking select `signed collections only`', () => {
    cy.navigateTo('hub', 'remotes');
    const remoteName = `test-remote-${randomString(5, undefined, { isLowercase: true })}`;
    cy.get('[data-cy="create-remote"]').should('be.visible').click();
    cy.get('[data-cy="name"]').type(remoteName);
    cy.get('[data-cy="url"]').type(Remotes.remoteCommunityURL);
    cy.get('[data-cy="signed_only"]').check();
    cy.get('[data-cy="signed-only-warning"]').should('be.visible');
    cy.contains(Remotes.showAdvancedOptions).click();
    cy.get('[data-cy="requirements-file-warning"]').should('be.visible');
    cy.get('[data-cy="url"]').clear().type(Remotes.remoteURL);
    cy.get('[data-cy="signed-only-warning"]').should('not.exist');
    cy.get('[data-cy="requirements-file-warning"]').should('not.exist');
    cy.get('[data-cy="Submit"]').click();
    cy.contains('Remotes').click();
    cy.searchAndDisplayResource(remoteName);
    cy.get('[data-cy="actions-column-cell"]').click();
    cy.get('[data-cy="delete-remote"]').click({ force: true });
    cy.get('#confirm').click();
    cy.clickButton(/^Delete remote/);
    cy.contains(/^Success$/);
    cy.clickButton(/^Close$/);
    cy.clickButton(/^Clear all filters$/);
  });

  it('edit a remote', () => {
    const communityCollection = `
---
collections:
  - name: ${Remotes.communityGeneral}
`;
    cy.navigateTo('hub', 'remotes');
    const remoteName = `test-remote-${randomString(5, undefined, { isLowercase: true })}`;
    cy.get('[data-cy="create-remote"]').should('be.visible').click();
    cy.url().should('include', Remotes.urlCreate);
    cy.get('[data-cy="name"]').type(remoteName);
    cy.get('[data-cy="url"]').type(Remotes.remoteURL);
    cy.get('[data-cy="signed_only"]').check();
    cy.get('[data-cy="sync_dependencies"]').check();
    cy.get('[data-cy="Submit"]').click();
    cy.contains('Remotes').click();
    cy.searchAndDisplayResource(remoteName);
    cy.get('[data-cy="actions-column-cell"]').click();
    cy.get('[data-cy="edit-remote"]').click({ force: true });
    cy.url().should('include', `remotes/${remoteName}/edit`);
    cy.get('[data-cy="url"]').clear().type(Remotes.editRemoteURL);
    cy.get('[data-cy="username"]').type(Remotes.username);
    cy.get('[data-cy="password"]').type(Remotes.password);
    cy.get('[data-cy="expandable-section"]').find('button').first().click();
    cy.get('[data-cy="token"]').type(Remotes.token);
    cy.get('[data-cy="auth-url"]').type(Remotes.ssoURL);
    cy.get('[data-cy="proxy-url"]').type(Remotes.proxyURL);
    cy.get('[data-cy="proxy-username"]').type(Remotes.username);
    cy.get('[data-cy="proxy-password"]').type(Remotes.password);
    cy.get('[data-cy="download-concurrency"]').type(Remotes.downloadConcurrency);
    cy.get('[data-cy="rate-limit"]').type(Remotes.rateLimit);
    cy.get('[data-cy="tls_validation"]').click();
    cy.get('[data-cy="requirements_file"]')
      .click()
      .focused()
      .invoke('select')
      .clear()
      .type(communityCollection);
    cy.clickButton(/^Edit remote$/);
    cy.clickButton(/^Clear all filters$/);
    cy.contains(remoteName).click();
    cy.get('[data-cy="yaml-requirements"]').should('be.visible');
    cy.get('[data-cy="code-block-value"]').should('contain', Remotes.communityGeneral);
    cy.url().should('include', `remotes/details/${remoteName}`);
    cy.get('[data-cy="name"]').should('contain', remoteName);
    cy.get('[data-cy="url"]').should('contain', Remotes.editRemoteURL);
    cy.get('[data-cy="proxy-url"]').should('contain', Remotes.proxyURL);
    cy.get('[data-cy="tls-validation"]').should('contain', Remotes.tlsValidation);
    cy.get('[data-cy="rate-limit"]').should('contain', Remotes.rateLimit);
    cy.get('[data-cy="download-concurrency"]').should('contain', Remotes.downloadConcurrency);
    cy.get('[data-cy="download-only-signed-collections"]').should('contain', Remotes.signedOnly);
    cy.get('[data-cy="include-all-dependencies-when-syncing-a-collection"]').should(
      'contain',
      Remotes.syncDependencies
    );

    // Delete the edited remote
    cy.get('[data-cy="actions-dropdown"]').click();
    cy.get('[data-cy="delete-remote"]').click();
    cy.get('#confirm').click();
    cy.clickButton(/^Delete remotes/);
  });
});

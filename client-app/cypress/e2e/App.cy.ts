/* eslint-disable jest/expect-expect */
const host = 'http://localhost:3000/';

const user = {
    email: 'user@user.ua',
    password: 'user',
};

const admin = {
    email: 'admin@admin.ua',
    password: 'admin',
};

describe('Tests', () => {
    it('Try login as user', () => {
        cy.visit(host);

        cy.get('.MuiButton-contained').click();

        cy.get('#standard-basic').type(user.email);
        cy.get('#\\:r1\\:').type(user.password);

        cy.get('.modal-window > .MuiButton-root').click();

        cy.get('.MuiAvatar-img');
        cy.get('.user-name');
        cy.get('.MuiButton-textError');
        cy.get('.MuiButton-textInherit').click();
    });

    it('Try login as admin', () => {
        cy.visit(host);

        cy.get('.MuiButton-contained').click();

        cy.get('#standard-basic').type(admin.email);
        cy.get('#\\:r1\\:').type(admin.password);

        cy.get('.modal-window > .MuiButton-root').click();

        cy.get('.MuiAvatar-img');
        cy.get('.user-name');
        cy.get('.MuiButton-textError');
        cy.get('.MuiToolbar-root > :nth-child(2)').click();

        cy.contains('Add new user').click();

        cy.get(':nth-child(1) > .MuiInput-root > #standard-basic').type('test');
        cy.get(':nth-child(2) > .MuiInput-root > #standard-basic').type('test');
        cy.get(':nth-child(3) > .MuiInput-root > #standard-basic').type('test');

        cy.get('#tags-filled').type('test');
        cy.get(
            '.css-136h9lv-MuiFormControl-root-MuiTextField-root > .MuiInput-root > #standard-basic',
        ).type('test');

        cy.get('.css-1cp3q7g-MuiStack-root > .MuiButton-containedPrimary').click();

        cy.get(
            ':nth-child(1) > .actions > [src="https://cdn-icons-png.flaticon.com/512/61/61456.png"]',
        ).click();
        cy.get('.css-1cp3q7g-MuiStack-root > .MuiButton-containedPrimary').click();

        cy.get('.MuiToolbar-root > :nth-child(3)').click();

        cy.contains('Add new model').click();

        cy.get('#standard-basic-name').type('test');
        cy.get('#tags-filled').type('test');
        cy.get('#standard-basic-description').type('test');

        cy.get('.css-1cp3q7g-MuiStack-root > .MuiButton-containedPrimary').click();

        cy.get('.MuiButton-textError').click();
        cy.get('h1');
    });

    it('Try reg new user', () => {
        cy.visit(host);

        cy.get('.MuiButton-outlined').click();

        cy.get(':nth-child(2) > .MuiInput-root > #standard-basic').type('test');
        cy.get(':nth-child(3) > .MuiInput-root > #standard-basic').type('test');
        cy.get(':nth-child(4) > .MuiInput-root > #standard-basic').type('test');
        cy.get('#\\:r7\\:').type('test');
    });

    it('Try to move to incorrect path', () => {
        cy.visit(`${host}/testUrl`);

        cy.contains('Page not found');

        cy.get('.text > .MuiButton-root').click();
        cy.get('h1');
    });
});

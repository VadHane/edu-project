import { ADD_USER_BUTTON_TEXT } from './../../src/components/UsersTable/UsersTable.constants';
import {
    APPROVE_IMAGE,
    CANCEL_IMAGE,
    EDIT_IMAGE,
    FILE_NOT_IMAGE_EXCEPTION,
    INCORRECT_EMAIL_EXCEPTION,
    LENGTH_OF_NAME_EXCEPTION,
    LENGTH_OF_SURNAME_EXCEPTION,
    REMOVE_IMAGE,
} from './../../src/App.constants';
import {
    ADD_ROLE_MESSAGE,
    GET_CREATE_ROLE_MESSAGE,
    LIST_INCLUDES_ROLE_MESSAGE,
} from './../../src/components/UserCreateAndUpdateModal/AvailableRolesList/AvailableRolesList.constants';

const host = 'http://localhost:3000';

describe('End to end test aplication.', () => {
    it('Start page should send request to API and the response should not be null.', () => {
        const apiUrl = 'https://localhost:44303/api/users/';
        const requestMethod = 'GET';

        cy.intercept({
            method: requestMethod,
            url: apiUrl,
        }).as('getUsersFromAPI');

        cy.visit(host);

        cy.wait('@getUsersFromAPI').then((interception) => {
            assert.isNotNull(interception.response?.body, 'API response is not null.');
        });
    });

    it('Start page should consist with button and users table.', () => {
        cy.visit(host);

        cy.contains(ADD_USER_BUTTON_TEXT);
        cy.get('table');
    });

    it('After click on the "Add user" button, url path should was edited.', () => {
        cy.visit(host);

        cy.contains(ADD_USER_BUTTON_TEXT).click();

        cy.url().should('eq', `${host}/add`);
    });

    it('After click on the "Add user" button, application should send a request to API and the response should not be null.', () => {
        const apiUrl = 'https://localhost:44303/api/users/';
        const requestMethod = 'GET';

        cy.intercept({
            method: requestMethod,
            url: apiUrl,
        }).as('getRolesFromAPI');

        cy.visit(host);

        cy.contains(ADD_USER_BUTTON_TEXT).click();
        cy.wait('@getRolesFromAPI').then((interception) => {
            assert.isNotNull(interception.response?.body, 'API response is not null.');
        });
    });

    it('Create modal window should validate inputed data.', () => {
        const testName = 'test-name';
        const testSurname = 'test-surname';
        const testIncorrectEmail = 'test-email.t';
        const testCorrectEmail = 'test@email.ts';
        const testAvailableRoleName = 'Admin';
        const testNewRoleName = 'new-role';

        cy.visit(host);

        cy.contains(ADD_USER_BUTTON_TEXT).click();

        cy.contains(ADD_USER_BUTTON_TEXT).click();
        cy.contains(LENGTH_OF_NAME_EXCEPTION);

        cy.get('input#first_name')
            .should('have.value', '')
            .type(testName)
            .should('have.value', testName);
        cy.contains(ADD_USER_BUTTON_TEXT).click();
        cy.contains(LENGTH_OF_SURNAME_EXCEPTION);

        cy.get('input#last_name')
            .should('have.value', '')
            .type(testSurname)
            .should('have.value', testSurname);
        cy.contains(ADD_USER_BUTTON_TEXT).click();
        cy.contains(INCORRECT_EMAIL_EXCEPTION);

        cy.get('input#email')
            .should('have.value', '')
            .type(testIncorrectEmail)
            .should('have.value', testIncorrectEmail);
        cy.contains(ADD_USER_BUTTON_TEXT).click();
        cy.contains(INCORRECT_EMAIL_EXCEPTION);

        cy.get('input#email')
            .clear()
            .should('have.value', '')
            .type(testCorrectEmail)
            .should('have.value', testCorrectEmail);
        cy.contains(ADD_USER_BUTTON_TEXT).click();
        cy.contains(FILE_NOT_IMAGE_EXCEPTION);

        cy.get('input#available-roles-list-input')
            .should('have.value', '')
            .type(testNewRoleName)
            .should('have.value', testNewRoleName);
        cy.contains(GET_CREATE_ROLE_MESSAGE);

        cy.get(`[alt=${CANCEL_IMAGE.ALT}]`).click();

        cy.get('input#available-roles-list-input')
            .should('have.value', '')
            .type(testAvailableRoleName)
            .should('have.value', testAvailableRoleName);
        cy.contains(ADD_ROLE_MESSAGE);

        cy.get(`[alt=${APPROVE_IMAGE.ALT}]`).click();

        cy.get('input#available-roles-list-input')
            .should('have.value', '')
            .type(testAvailableRoleName)
            .should('have.value', testAvailableRoleName);
        cy.contains(LIST_INCLUDES_ROLE_MESSAGE);

        cy.get(`[alt=${APPROVE_IMAGE.ALT}]`).click();
        cy.get('input#available-roles-list-input').should('have.value', '');

        cy.get(`.list-row img[alt=${REMOVE_IMAGE.ALT}]`).click();
    });

    it('Edit modal window should include the data of selected user.', () => {
        cy.visit(host);

        cy.get('tbody .name').first().invoke('text').as('name');
        cy.get('tbody .surname').first().invoke('text').as('surname');
        cy.get('tbody .email').first().invoke('text').as('email');

        cy.get(`.actions [alt=${EDIT_IMAGE.ALT}]`).first().click();

        cy.get('@name').then((name) => {
            cy.get('input#first_name').should('have.value', name);
        });

        cy.get('@surname').then((surname) => {
            cy.get('input#last_name').should('have.value', surname);
        });

        cy.get('@email').then((email) => {
            cy.get('input#email').should('have.value', email);
        });
    });
});

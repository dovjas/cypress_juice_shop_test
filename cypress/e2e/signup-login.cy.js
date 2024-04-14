///<reference types='Cypress' />

describe('Signup and Login test',()=>{
    let email = Math.random().toString(20).substring(2)+'@gmail.com';
    let pw = 'password1';
    let securityAnswer = 'answer';

    beforeEach(()=>{
        cy.visit('http://localhost:3000/#/');
        cy.get('.cdk-overlay-backdrop').click(-50,-50,{force:true});
        cy.get('#navbarAccount').click();
        cy.get('button').contains('Login').click({force:true});
    })

    it('Signup test',()=>{  
        cy.get('#newCustomerLink').contains('Not yet a customer?').click({force:true});
        cy.get('#emailControl').type(email);
        cy.get('#passwordControl').type(pw);
        cy.get('#repeatPasswordControl').type(pw);
        cy.get('.mat-select-placeholder').click();
        cy.get('#mat-option-3 > .mat-option-text').click();
        cy.get('#securityAnswerControl').type(securityAnswer);
        cy.get('#registerButton').click();
        cy.get('.mat-snack-bar-container').contains('Registration completed successfully.')
    });
    it('Login test',()=>{
        cy.get('#email').type(email);
        cy.get('#password').type(pw);
        cy.get('#loginButton').click();
        cy.get('.fa-layers-counter').contains(0);
    });
    describe('API tests',()=>{
        const userData = {
            'email':email,
            'password':pw
        };
        it('Test login via API',()=>{
            cy.request({
                method:'POST',
                url:'http://localhost:3000/rest/user/login',
                body:userData
            }).then((response)=>{
                expect(response.status).to.eq(200)
            });
        });

        it('Login via Token',()=>{
            cy.request('POST','http://localhost:3000/rest/user/login',userData)
            .its('body').then(body =>{
                const token = body.authentication.token;
                cy.wrap(token).as('userToken');
                cy.log('@userToken');

                const userToken = cy.get('@userToken');
                cy.visit('http://localhost:3000',{
                    onBeforeLoad(browser){
                        browser.localStorage.setItem('token',userToken);
                    }
                })
                cy.get('.cdk-overlay-backdrop').click(-50,-50,{force:true});
                cy.get('.fa-layers-counter').contains(0);
            });
        });
    });
}) 
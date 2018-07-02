'use strict';

const supertest = require("supertest");
const expect = require('chai').expect;
const server = supertest.agent("http://localhost:3002");

describe('Тест открытия стартовой страницы', function() {

    this.timeout(10000);

    before((done) => {
        require('../server');
        setTimeout(() => {            
            done();
        }, 1000);
    });

    it('должен вернуть код 200', function(done) {
        server
            .get("/")
            .expect(200)
            .end(function(error, response) {                
                expect(response.status).to.equal(200);
                done();
            });
    });
});


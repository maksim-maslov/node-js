const UserPage = require('../test/page-objects/user');
const expect = require('chai').expect;

describe('Тест страницы интерфейса клиента', function() {

    this.timeout(10000);
    let dronecafeApp = {};

    beforeEach(function() {
      dronecafeApp = new UserPage();
      dronecafeApp.get();
    });

    it('страница должна содержать заголовок "Document"', function() {
      const title = dronecafeApp.getPageTitle();
      expect(title.value_).to.equal('Document');
    });
    
});
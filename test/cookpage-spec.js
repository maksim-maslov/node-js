const CookPage = require('../test/page-objects/cook');
const expect = require('chai').expect;

describe('Тест страницы интерфейса повара', function() {

    this.timeout(10000);
    let dronecafeApp = {};

    beforeEach(function() {
      dronecafeApp = new CookPage();
      dronecafeApp.get();
    });

    it('страница должна содержать список заказанных блюд', function() {
      const orderedList = dronecafeApp.getOrderedList();
      expect(orderedList.length).not.equal(0);
    });

    it('страница должна содержать список блюд, которые готовятся', function() {
      const cookingList = dronecafeApp.getCookingList();
      expect(cookingList.length).not.equal(0);
    });
    
});
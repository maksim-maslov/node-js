var CookPage = function() {

    const url = '/#!/kitchen';

    const orderedList = element.all(by.repeater('order in orderedDishes'));
    const cookingList = element.all(by.repeater('order in cookingDishes'));

    this.get = function() {
        browser.get(url);
    };

    this.getOrderedList = function() {
        return orderedList;
    };

    this.getCookingList = function() {
        return cookingList;
    };
};

module.exports = CookPage;
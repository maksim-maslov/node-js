var UserPage = function() {

    const url = '/#!/';

    const pageTitle = browser.getTitle();

    this.get = function() {
        browser.get(url);
    };

    this.getPageTitle = function() {        
        return pageTitle;
    };
};

module.exports = UserPage;
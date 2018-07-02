exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',  
    capabilities: {
      'browserName': 'chrome'
    },
    specs: ['test/*-spec.js'],
    framework: 'mocha',
    baseUrl: 'http://localhost:3002'
};


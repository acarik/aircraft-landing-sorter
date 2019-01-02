utils = require('./utils');
scenario = utils.loadScenario();

var currLine;

// sort aircraft possible landing times
scenario.forEach(element => {
    element.sort();
});

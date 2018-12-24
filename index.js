utils = require('./utils');
scenario = utils.loadScenario();

var currLine;
scenario.forEach(element => {
    currLine = element;
    console.log(currLine);
    
});
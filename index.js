// measure exection time
var start = new Date();

utils = require('./utils');
scenario = utils.loadScenario();

scenario.disp();

if(scenario.find(0)){
    console.log('Solution found.');
    scenario.disp();
}
else{
    console.log('Solution NOT found.');
}

var end = new Date();
console.log("Execution time: %dms", end-start)
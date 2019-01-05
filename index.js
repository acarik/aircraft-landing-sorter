utils = require('./utils');
scenario = utils.loadScenario();

scenario.disp();

if(scenario.find(0)){
    console.log('Solution found.');
}
else{
    console.log('Solution NOT found.');
}

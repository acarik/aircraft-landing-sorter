const Aircraft = require('./aircraft.js')
var moment = require('moment');

function loadScenario(){
    const scenarioRaw = [
        "1;SOUTH;MEDIUM;00:00:00;00:07:26;00:11:09;00:16:09;00:09:45;1000;1000",
        "2;SOUTH;HEAVY;00:01:15;00:07:51;00:12:24;00:17:24;00:11:00;3000;3000",
        "3;NORTH;MEDIUM;00:02:45;00:08:21;00:13:54;00:18:54;00:13:30;1000;1000",
        "4;SOUTH;HEAVY;00:04:45;00:09:01;00:15:54;00:20:54;00:14:30;3000;3000",
        "5;SOUTH;HEAVY;00:06:15;00:09:31;00:17:24;00:22:24;00:16:00;3000;3000",
        "6;SOUTH;HEAVY;00:07:30;00:09:56;00:18:39;00:23:39;00:18:15;3000;3000",
        "7;SOUTH;MEDIUM;00:09:15;00:10:31;00:20:24;00:25:24;00:21:00;1000;1000",
        "8;NORTH;HEAVY;00:09:15;00:10:31;00:20:24;00:25:24;00:22:24;3000;3000",
        "9;SOUTH;MEDIUM;00:10:15;00:10:51;00:21:24;00:26:24;00:25:00;1000;1000",
        "10;NORTH;HEAVY;00:10:15;00:10:51;00:21:24;00:26:24;00:26:24;3000;3000"
    ];
    
    var scenario = [];
    scenarioRaw.forEach(scenarioLineRaw => {
        scenario.push(new Aircraft(scenarioLineRaw))
    });
    
    return scenario;
}

function parseTimeStr(str){
    var fields = str.split(':');
    var time = moment({ hour:fields[0], minute:fields[1], second:fields[2]});
    return time;
}



exports.loadScenario = loadScenario;
exports.parseTimeStr = parseTimeStr;

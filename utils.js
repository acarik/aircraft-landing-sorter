const Aircraft = require('./aircraft.js')
const Scenario = require('./scenario.js')
const moment = require('moment');
const XLSX = require('xlsx');
const LOG_TO_TEXT_FILE = false;

function loadScenario(){

    // 1. Read aircraft info
    var workbook = XLSX.readFile('Senaryo.xlsx');// ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
    var sheet_name_list = workbook.SheetNames; // SheetNames is an ordered list of the sheets in the workbook
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);//, {raw: true, defval:null}); //if you have multiple sheets
    
    var scenarioRaw = [];
    let str = [];
    let curr;
    for (let i = 1; i<data.length; i++){
        str = i.toString();
        str += ';';

        curr = data[i];
        for (let j = 0; j<9; j++){
            if (j == 0)
                str += data[i]["__EMPTY"].toString();
            else
                str += data[i]["__EMPTY_"+j.toString()].toString();
            str += ';';
        }
        scenarioRaw.push(str);
    }
    /*
    scenarioRaw = [
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
    */

    console.log(scenarioRaw[0]);
    

    var scenario = new Scenario();
    scenarioRaw.forEach(scenarioLineRaw => {
        scenario.addAircraft(new Aircraft(scenarioLineRaw))
    });

    // 2. Read airfield times
    var workbook = XLSX.readFile('Senaryo.xlsx');// ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
    var sheet_name_list = workbook.SheetNames; // SheetNames is an ordered list of the sheets in the workbook
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);//, {raw: true, defval:null}); //if you have multiple sheets

    // number of columns is the number of wps
    scenario.numberOfWps = Object.keys(data[0]).length-1;
    scenario.numberOfTips = data.length;

    for (let i = 0; i<scenario.numberOfTips; i++){
        for (let j = 0; j<scenario.numberOfWps; j++){
            scenario.timeInfo.push({
                "TIP":i, 
                "WP":j, 
                "time":parseInt(data[i][j.toString()])
            });
        }
    }
    
    // 3. read separation data
    /*
    var workbook = XLSX.readFile('Senaryo.xlsx');// ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
    var sheet_name_list = workbook.SheetNames; // SheetNames is an ordered list of the sheets in the workbook
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]]);//, {raw: true, defval:null}); //if you have multiple sheets

    for (let i = 0; i<3; i++){
        scenario.separationData.push({
            data[0]["__EMPTY"]:{

            }
        })
    }
    let dummy = 0;
*/
    return scenario;
}

function parseTimeStr(str){
    var fields = str.split(':');
    var time = moment({ hour:fields[0], minute:fields[1], second:fields[2]});
    return time;
}

// file logger
if (LOG_TO_TEXT_FILE){
    var fs = require('fs');
    var util = require('util');
    var logFile = fs.createWriteStream('log.txt', { flags: 'w' });
    // Or 'w' to truncate the file every time the process starts.
    var logStdout = process.stdout;

    console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
    }
    console.error = console.log;
}

exports.loadScenario = loadScenario;
exports.parseTimeStr = parseTimeStr;
if (LOG_TO_TEXT_FILE)
    exports.console = console;


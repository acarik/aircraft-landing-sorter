const Aircraft = require('./aircraft.js')
const Scenario = require('./scenario.js')
const moment = require('moment');
const XLSX = require('xlsx');
const LOG_TO_TEXT_FILE = false;

function loadScenario(){

    var scenario = new Scenario();
    
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
    var workbook = XLSX.readFile('Senaryo.xlsx');// ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
    var sheet_name_list = workbook.SheetNames; // SheetNames is an ordered list of the sheets in the workbook
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]]);//, {raw: true, defval:null}); //if you have multiple sheets

    scenario.separationData.push({
        "after":"HEAVY",
        "before":"HEAVY",
        "time":parseInt(data[0]["heavy"])
    })

    scenario.separationData.push({
        "after":"HEAVY",
        "before":"MEDIUM",
        "time":parseInt(data[0]["medium"])
    })

    scenario.separationData.push({
        "after":"HEAVY",
        "before":"LIGHT",
        "time":parseInt(data[0]["light"])
    })

    scenario.separationData.push({
        "after":"MEDIUM",
        "before":"HEAVY",
        "time":parseInt(data[1]["heavy"])
    })

    scenario.separationData.push({
        "after":"MEDIUM",
        "before":"MEDIUM",
        "time":parseInt(data[1]["medium"])
    })

    scenario.separationData.push({
        "after":"MEDIUM",
        "before":"LIGHT",
        "time":parseInt(data[1]["light"])
    })

    scenario.separationData.push({
        "after":"LIGHT",
        "before":"HEAVY",
        "time":parseInt(data[2]["heavy"])
    })

    scenario.separationData.push({
        "after":"LIGHT",
        "before":"MEDIUM",
        "time":parseInt(data[2]["medium"])
    })
    
    scenario.separationData.push({
        "after":"LIGHT",
        "before":"HEAVY",
        "time":parseInt(data[2]["light"])
    })

    // 4. read wp-faf time
    var workbook = XLSX.readFile('Senaryo.xlsx');// ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
    var sheet_name_list = workbook.SheetNames; // SheetNames is an ordered list of the sheets in the workbook
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]]);//, {raw: true, defval:null}); //if you have multiple sheets
    scenario.wpFafTime = parseInt(data[0]["wp-faf"]);

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

    scenarioRaw.forEach(scenarioLineRaw => {
        scenario.addAircraft(new Aircraft(scenario, scenarioLineRaw))
    });

    return scenario;
}

function parseTimeStr(str){
    var fields = str.split(':');
    var h = parseInt(fields[0]);
    var m = parseInt(fields[1]);
    var s = parseInt(fields[2]);
    return (s+(m*60)+(h*3600));
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

